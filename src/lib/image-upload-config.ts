// Constantes puras, sin dependencias de Node — se importan tanto desde
// Server Actions/lib como desde Client Components (ej: image-manager.tsx).
// El SDK de Cloudinary (src/lib/cloudinary.ts) usa APIs de Node ("fs") y
// no se puede importar desde código de cliente.

export const CLOUDINARY_FOLDER_PREFIX = "products";
export const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES_PER_PRODUCT = 8;
