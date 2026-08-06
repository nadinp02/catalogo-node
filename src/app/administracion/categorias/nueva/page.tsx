import { CategoryForm } from "@/features/categories/category-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function NuevaCategoriaPage() {
  return (
    <div className="space-y-4">
      <SectionHeading>Nueva categoría</SectionHeading>
      <CategoryForm />
    </div>
  );
}
