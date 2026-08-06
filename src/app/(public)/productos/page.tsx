import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listPublicProducts } from "@/services/products";
import { listCategories } from "@/services/categories";
import { listBrands } from "@/services/brands";
import { ProductGrid } from "@/features/products/product-grid";
import { ProductFilters } from "@/features/products/product-filters";
import { Pagination } from "@/components/pagination";
import { SectionHeading } from "@/components/ui/section-heading";

type ProductosSearchParams = {
  categoria?: string;
  marca?: string;
  q?: string;
  page?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ProductosSearchParams>;
}): Promise<Metadata> {
  const { categoria, marca, q } = await searchParams;

  const parts: string[] = [];
  if (categoria) parts.push(`categoría: ${categoria}`);
  if (marca) parts.push(`marca: ${marca}`);
  if (q) parts.push(`búsqueda: "${q}"`);

  return {
    title: parts.length > 0 ? `Productos (${parts.join(", ")})` : "Productos",
    description: "Catálogo completo de productos disponibles.",
  };
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<ProductosSearchParams>;
}) {
  const { categoria, marca, q, page: pageParam } = await searchParams;
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;

  const [{ products, totalPages }, categories, brands] = await Promise.all([
    listPublicProducts({ categorySlug: categoria, brandSlug: marca, search: q, page }),
    listCategories({ isActive: true }),
    listBrands({ isActive: true }),
  ]);

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (categoria) params.set("categoria", categoria);
    if (marca) params.set("marca", marca);
    if (q) params.set("q", q);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/productos${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          Volver
        </Link>
        <SectionHeading size="lg" glitch>
          Catalogo.exe
        </SectionHeading>
        <p className="text-sm text-muted-foreground">
          {products.length > 0
            ? `${products.length} producto${products.length === 1 ? "" : "s"} en esta página`
            : "Sin resultados para estos filtros."}
        </p>
      </div>
      <ProductFilters
        categories={categories}
        brands={brands}
        selectedCategory={categoria}
        selectedBrand={marca}
        search={q}
      />
      <ProductGrid products={products} />
      <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
