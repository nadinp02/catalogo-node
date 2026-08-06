import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Product, ProductImage } from "@/types/catalog";

type ProductFilters = {
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
};

const PRODUCT_RELATIONS = {
  category: true,
  brand: true,
  images: { orderBy: { position: "asc" as const } },
};

export function listProducts(filters: ProductFilters = {}) {
  return prisma.product.findMany({
    where: filters,
    include: PRODUCT_RELATIONS,
    orderBy: { createdAt: "desc" },
  });
}

export function countProducts() {
  return prisma.product.count();
}

type PublicProductFilters = {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

/**
 * Listado para el catálogo público: solo productos activos, con paginación
 * y filtros por slug de categoría/marca + búsqueda por nombre.
 */
export async function listPublicProducts(filters: PublicProductFilters = {}) {
  const { categorySlug, brandSlug, search, page = 1, pageSize = 12 } = filters;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(brandSlug && { brand: { slug: brandSlug } }),
    ...(search && { name: { contains: search, mode: "insensitive" } }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: PRODUCT_RELATIONS,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: PRODUCT_RELATIONS,
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: PRODUCT_RELATIONS,
  });
}

type CreateProductInput = Pick<Product, "name" | "slug" | "categoryId"> & {
  price: number | string;
} & Partial<Pick<Product, "description" | "stock" | "sku" | "isActive" | "brandId">>;

export function createProduct(data: CreateProductInput) {
  return prisma.product.create({ data });
}

export function updateProduct(id: string, data: Partial<CreateProductInput>) {
  return prisma.product.update({ where: { id }, data });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export function deleteProducts(ids: string[]) {
  return prisma.product.deleteMany({ where: { id: { in: ids } } });
}

type BulkUpdateProductInput = Partial<Pick<Product, "categoryId" | "brandId" | "isActive">>;

export function bulkUpdateProducts(ids: string[], data: BulkUpdateProductInput) {
  return prisma.product.updateMany({ where: { id: { in: ids } }, data });
}

export function countProductImages(productId?: string) {
  return prisma.productImage.count({ where: productId ? { productId } : {} });
}

type AddProductImageInput = Pick<ProductImage, "publicId" | "url"> &
  Partial<Pick<ProductImage, "alt">>;

/**
 * Agrega una imagen al final del orden actual del producto (no depende del
 * @default(0) del schema, que colisionaría si dos imágenes no pasan
 * `position` explícito).
 */
export async function addProductImage(productId: string, data: AddProductImageInput) {
  const lastImage = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { position: "desc" },
  });
  const position = lastImage ? lastImage.position + 1 : 0;

  return prisma.productImage.create({ data: { ...data, productId, position } });
}

export function deleteProductImage(id: string) {
  return prisma.productImage.delete({ where: { id } });
}

/**
 * Persiste el orden final de las imágenes de un producto: `orderedIds[0]`
 * queda en `position` 0 (portada), etc. Se usa tanto para mover una imagen
 * como para marcarla como principal (llevándola al frente del arreglo).
 */
export function reorderProductImages(orderedIds: string[]) {
  return prisma.$transaction(
    orderedIds.map((id, position) =>
      prisma.productImage.update({ where: { id }, data: { position } }),
    ),
  );
}
