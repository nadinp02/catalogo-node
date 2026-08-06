import Link from "next/link";
import { Plus } from "lucide-react";
import { listBrands } from "@/services/brands";
import { BrandTable } from "@/features/brands/brand-table";
import { Button } from "@/components/ui/button";
import { WindowPanel } from "@/components/ui/window-panel";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function MarcasPage() {
  const brands = await listBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <SectionHeading>Marcas</SectionHeading>
          <p className="text-sm text-muted-foreground">
            {brands.length} marca{brands.length === 1 ? "" : "s"} en total
          </p>
        </div>
        <Button
          className="gap-1.5"
          render={
            <Link href="/administracion/marcas/nueva">
              <Plus className="size-4" />
              Nueva marca
            </Link>
          }
        />
      </div>
      <WindowPanel title="MARCAS" bodyClassName="p-4">
        <BrandTable brands={brands} />
      </WindowPanel>
    </div>
  );
}
