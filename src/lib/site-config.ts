// Configuración centralizada del sitio, leída de variables de entorno.
// Server-only a propósito (sin prefijo NEXT_PUBLIC_): nunca importar este
// módulo desde un Client Component, los valores resolverían a `undefined`
// en el bundle del browser. Los Server Components arman los strings finales
// (mensajes, URLs) y se los pasan como props a los componentes de cliente.

function normalizePhoneNumber(raw: string | undefined): string {
  return (raw ?? "").replace(/\D/g, "");
}

export const siteConfig = {
  whatsappNumber: normalizePhoneNumber(process.env.WHATSAPP_NUMBER),
  companyName: process.env.COMPANY_NAME?.trim() || "Catálogo",
  // Reutiliza AUTH_URL (ya existe desde Fase 3) como URL canónica del sitio
  // para armar links absolutos de producto.
  url: (process.env.AUTH_URL || "http://localhost:3000").replace(/\/$/, ""),
  // Opcional: si no está configurado, el footer no muestra el link.
  instagramUrl: process.env.INSTAGRAM_URL?.trim() || null,
};

if (!siteConfig.whatsappNumber) {
  console.warn(
    "[site-config] WHATSAPP_NUMBER no está configurado o quedó vacío tras normalizar — los botones de WhatsApp van a generar links inválidos.",
  );
}
