// Acepta number/string, pero también cualquier objeto tipo Decimal (ej: el
// Prisma.Decimal de precios) sin acoplar este util a @prisma/client — solo
// le pedimos que tenga un toString() que devuelva un numérico válido.
type PriceLike = number | string | { toString(): string };

export function formatPrice(price: PriceLike): string {
  return `$${new Intl.NumberFormat("es-AR").format(Number(price.toString()))}`;
}
