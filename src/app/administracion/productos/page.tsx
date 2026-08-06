import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { listProducts } from "@/services/products";
import { listCategories } from "@/services/categories";
import { listBrands } from "@/services/brands";
import { ProductTable } from "@/features/products/product-table";
import { Button } from "@/components/ui/button";
import { WindowPanel } from "@/components/ui/window-panel";
import { SectionHeading } from "@/components/ui/section-heading";

type AdminProductsSearchParams = {
  categoria?: string;
  marca?: string;
  estado?: string;
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<AdminProductsSearchParams>;
}) {
  const { categoria, marca, estado } = await searchParams;

  const [categories, brands] = await Promise.all([listCategories(), listBrands()]);
  const categoryId = categoria ? categories.find((c) => c.slug === categoria)?.id : undefined;
  const brandId = marca ? brands.find((b) => b.slug === marca)?.id : undefined;
  const isActive = estado === "activo" ? true : estado === "inactivo" ? false : undefined;

  const products = await listProducts({ categoryId, brandId, isActive });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <SectionHeading>Productos</SectionHeading>
          <p className="text-sm text-muted-foreground">
            {products.length} producto{products.length === 1 ? "" : "s"} en total
          </p>
        </div>
        <Button
          className="gap-1.5"
          render={
            <Link href="/administracion/productos/nuevo">
              <Plus className="size-4" />
              Nuevo producto
            </Link>
          }
        />
      </div>

      <WindowPanel title="PRODUCTOS" bodyClassName="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Buscador solo estético: no está conectado a los resultados. */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="h-8 w-full border border-input bg-background pl-8 pr-2.5 font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-accent"
            />
          </div>

          <form
            method="get"
            action="/administracion/productos"
            className="flex flex-wrap items-center gap-2"
          >
            <AdminSelect name="categoria" defaultValue={categoria} label="Categoría">
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </AdminSelect>
            <AdminSelect name="marca" defaultValue={marca} label="Marca">
              <option value="">Todas</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </AdminSelect>
            <AdminSelect name="estado" defaultValue={estado} label="Estado">
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </AdminSelect>
            <Button type="submit" variant="outline" size="sm">
              Filtrar
            </Button>
          </form>
        </div>

        <ProductTable
          products={products.map((product) => ({ ...product, price: product.price.toString() }))}
          categories={categories}
          brands={brands}
        />
      </WindowPanel>
    </div>
  );
}

function AdminSelect({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
      {label}
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-8 border border-input bg-background px-2 font-mono text-xs text-foreground normal-case outline-none focus-visible:border-accent"
      >
        {children}
      </select>
    </label>
  );
}
