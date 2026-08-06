import { listCategories } from "@/services/categories";
import { listBrands } from "@/services/brands";
import { ProductForm } from "@/features/products/product-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function NuevoProductoPage() {
  const [categories, brands] = await Promise.all([listCategories(), listBrands()]);

  return (
    <div className="space-y-4">
      <SectionHeading>Nuevo producto</SectionHeading>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
