import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/utils/price";

/**
 * Arma la URL final de wa.me a partir de un mensaje ya redactado. Es el
 * único lugar que conoce el número y el formato del link — toda la lógica
 * de encoding vive acá, no se duplica en los componentes.
 */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(product: {
  name: string;
  price: number | string | { toString(): string };
  url: string;
}): string {
  return [
    "Hola, quiero comprar este producto:",
    "",
    `Nombre: ${product.name}`,
    `Precio: ${formatPrice(product.price)}`,
    "",
    "Link:",
    product.url,
    "",
    "¿Cómo coordinamos?",
  ].join("\n");
}

export function buildGeneralWhatsAppMessage(): string {
  return "Hola, quisiera realizar una consulta.";
}
