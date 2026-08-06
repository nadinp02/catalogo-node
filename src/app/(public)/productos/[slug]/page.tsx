import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getProductBySlug } from "@/services/products";
import { buildWhatsAppUrl, buildProductWhatsAppMessage } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/utils/price";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Badge } from "@/components/ui/badge";
import { WindowPanel } from "@/components/ui/window-panel";
import { ProductGallery } from "@/features/products/product-gallery";

// cache(): dedupea el fetch entre generateMetadata y el componente de
// página, que corren por separado pero para el mismo request.
const getProduct = cache(async (slug: string) => {
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) {
    return null;
  }
  return product;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.name,
    description: product.description ?? `${product.name} — ${product.category.name}`,
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0].url }] }
      : undefined,
  };
}

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const inStock = product.stock > 0;
  const whatsappUrl = buildWhatsAppUrl(
    buildProductWhatsAppMessage({
      name: product.name,
      price: product.price,
      url: `${siteConfig.url}/productos/${product.slug}`,
    }),
  );

  const specs = [
    { label: "Categoría", value: product.category.name },
    { label: "Marca", value: product.brand?.name ?? "Sin marca" },
    { label: "Estado", value: inStock ? "Disponible" : "Sin stock" },
    { label: "Stock", value: `${product.stock} unidad${product.stock === 1 ? "" : "es"}` },
  ];

  return (
    <WindowPanel title="RETROID.EXE" bodyClassName="grid gap-8 p-6 lg:grid-cols-2 lg:gap-12">
      <ProductGallery images={product.images} productName={product.name} />

      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {product.category.name}
            {product.brand ? ` · ${product.brand.name}` : ""}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
          <Badge variant={inStock ? "success" : "secondary"}>
            {inStock ? "Disponible" : "Sin stock"}
          </Badge>
        </div>

        <p className="font-mono text-4xl font-bold text-primary">{formatPrice(product.price)}</p>

        <WhatsAppButton
          url={whatsappUrl}
          label={
            <>
              <MessageCircle className="size-5" />
              Comprar por WhatsApp
            </>
          }
          event={{ name: "whatsapp_click_detail", productId: product.id, productSlug: product.slug }}
          size="lg"
          className="w-full text-base sm:w-auto sm:px-10"
        />

        {product.description && (
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="border border-border">
          <p className="border-b border-border bg-muted px-3 py-2 font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Información adicional
          </p>
          <dl className="divide-y divide-border">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between px-3 py-2.5 font-mono text-sm"
              >
                <dt className="text-muted-foreground uppercase">{spec.label}</dt>
                <dd className="font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </WindowPanel>
  );
}
