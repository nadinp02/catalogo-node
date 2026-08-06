import { prisma } from "@/lib/prisma";
import type { Category } from "@/types/catalog";

export function listCategories(filters: { isActive?: boolean } = {}) {
  return prisma.category.findMany({ where: filters, orderBy: { name: "asc" } });
}

export function countCategories() {
  return prisma.category.count();
}

export function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

type CreateCategoryInput = Pick<Category, "name" | "slug"> &
  Partial<Pick<Category, "imageUrl" | "isActive">>;

export function createCategory(data: CreateCategoryInput) {
  return prisma.category.create({ data });
}

export function updateCategory(id: string, data: Partial<CreateCategoryInput>) {
  return prisma.category.update({ where: { id }, data });
}

export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
