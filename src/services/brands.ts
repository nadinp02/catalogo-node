import { prisma } from "@/lib/prisma";
import type { Brand } from "@/types/catalog";

export function listBrands(filters: { isActive?: boolean } = {}) {
  return prisma.brand.findMany({ where: filters, orderBy: { name: "asc" } });
}

export function countBrands() {
  return prisma.brand.count();
}

export function getBrandById(id: string) {
  return prisma.brand.findUnique({ where: { id } });
}

export function getBrandBySlug(slug: string) {
  return prisma.brand.findUnique({ where: { slug } });
}

type CreateBrandInput = Pick<Brand, "name" | "slug"> &
  Partial<Pick<Brand, "imageUrl" | "isActive">>;

export function createBrand(data: CreateBrandInput) {
  return prisma.brand.create({ data });
}

export function updateBrand(id: string, data: Partial<CreateBrandInput>) {
  return prisma.brand.update({ where: { id }, data });
}

export function deleteBrand(id: string) {
  return prisma.brand.delete({ where: { id } });
}
