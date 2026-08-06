# Ecommerce — Catálogo con contacto por WhatsApp

Catálogo de productos (categorías, marcas, búsqueda) con panel administrativo
para gestión de productos e imágenes. Las consultas y pedidos se hacen por
WhatsApp: no hay pasarela de pagos.

Configurado actualmente como **RETROID** (consolas retro importadas), pero el
branding es de configuración: nombre, número de WhatsApp e Instagram salen de
variables de entorno (`src/lib/site-config.ts`), y la paleta de colores es un
único bloque de tokens CSS en `src/app/globals.css` — pensado para poder
reusarse en otro catálogo cambiando esos dos lugares, no el código de las
páginas.

## Stack

- [Next.js 15](https://nextjs.org/docs) (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- [shadcn/ui](https://ui.shadcn.com/) (variante Base UI) + [lucide-react](https://lucide.dev/) para íconos
- [Prisma ORM](https://www.prisma.io/docs) + PostgreSQL
- [Auth.js (NextAuth)](https://authjs.dev/) para el login del panel administrativo
- [Cloudinary](https://cloudinary.com/) para las imágenes de productos (upload firmado directo desde el navegador)
- Hosting: [Vercel](https://vercel.com/)
- Base de datos: [Neon](https://neon.tech/) (Postgres serverless)

## Estado actual

- Login y roles (Auth.js, Credentials) con panel protegido por middleware.
- CRUD completo de categorías, marcas y productos, con gestión de imágenes
  (subida, reorden, imagen principal) vía Cloudinary.
- Catálogo público: home, listado con filtros/búsqueda/paginación y detalle
  de producto, todo en `src/app/(public)/`.
- Contacto comercial por WhatsApp (botones en cards, detalle y header/footer)
  con mensajes armados server-side en `src/lib/whatsapp.ts`.
- Identidad visual dark-first (sin selector claro/oscuro) con paleta propia
  y tipografía Geist.

## Estructura de carpetas

```
prisma/
  schema.prisma   modelos de datos y configuración de Prisma
  migrations/     historial de migraciones (generado por Prisma)

src/
  app/
    (public)/     catálogo público: home, /productos, /productos/[slug]
    administracion/ panel admin (protegido): dashboard, CRUD, usuarios
    login/        login del panel
    api/auth/     route handler de Auth.js
  components/   UI genérica reutilizable (Button, Table, etc. de shadcn +
                 wrappers propios como SubmitButton/DeleteButton/FieldError)
  features/     módulos de dominio: categories/, brands/, products/ (forms,
                 tablas, cards, galería), admin/ (sidebar)
  lib/          inicialización de librerías externas y config centralizada
                 (Prisma, Cloudinary, Auth.js, WhatsApp, site-config)
  hooks/        custom React hooks reutilizables (reservado, aún sin uso)
  services/     acceso a datos vía Prisma — únicas funciones que hacen
                 queries; actions/ y componentes las consumen, no al revés
  types/        tipos TypeScript compartidos
  utils/        funciones puras sin dependencias de negocio (precio, slug)
  actions/      Next.js Server Actions, una carpeta por entidad
  auth.ts / auth.config.ts   configuración de Auth.js (split Edge-safe,
                 ver comentarios en el código para el porqué)
  middleware.ts protección de rutas del panel admin
```

Cada carpeta de `src/` tiene un `README.md` corto explicando su
responsabilidad. Alias de importación configurado: `@/` apunta a `src/` (ver
`tsconfig.json`).

### Identidad visual

La app es **dark-first sin selector de tema** (`<html class="dark">` fijo en
`src/app/layout.tsx`). Todos los colores viven como variables CSS en un único
bloque `.dark { ... }` de `src/app/globals.css`, consumidas por componentes
vía clases de Tailwind (`bg-background`, `text-primary`, etc.) — para
re-themear el sitio alcanza con cambiar esos valores ahí, no hace falta tocar
componentes.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Variables de entorno: copiar `.env.example` a `.env.local` y completar
`DATABASE_URL` (Neon), las de Auth.js, las de Cloudinary y las de WhatsApp
(`WHATSAPP_NUMBER`, `COMPANY_NAME`, `INSTAGRAM_URL` opcional). Ver
`.env.example` para el formato esperado de cada una.

Usuario admin de prueba (creado por `prisma/seed.ts`): `admin@admin.com` /
`123456`. Cambiar esa contraseña antes de ir a producción.

## Despliegue

Ver [`DEPLOY.md`](./DEPLOY.md). En resumen: deploy automático en Vercel al
hacer `git push`, con la base de datos en Neon y las variables de entorno
gestionadas desde el dashboard de Vercel.

## Próximos pasos

No implementado todavía, a propósito: carrito/checkout, pagos online, Google
Analytics / Meta Pixel, SEO avanzado (más allá del `generateMetadata()` ya
presente en home/catálogo/detalle), gestión CRUD de usuarios (por ahora
`/administracion/usuarios` es solo lectura).
