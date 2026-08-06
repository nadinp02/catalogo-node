import { BrandForm } from "@/features/brands/brand-form";
import { SectionHeading } from "@/components/ui/section-heading";

export default function NuevaMarcaPage() {
  return (
    <div className="space-y-4">
      <SectionHeading>Nueva marca</SectionHeading>
      <BrandForm />
    </div>
  );
}
