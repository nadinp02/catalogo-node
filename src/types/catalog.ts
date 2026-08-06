import type { Prisma } from "@prisma/client";

export type { Category, Brand, Product, ProductImage } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; brand: true; images: true };
}>;
