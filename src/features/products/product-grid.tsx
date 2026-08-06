import type { ProductWithRelations } from "@/types/catalog";
import { ProductCard } from "@/features/products/product-card";

export function ProductGrid({ products }: { products: ProductWithRelations[] }) {
  if (products.length === 0) {
    return <p className="text-muted-foreground">No se encontraron productos.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
