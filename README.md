# Ecommerce — Base del proyecto

Catálogo de productos con contacto por WhatsApp (sin pagos online). Esta es la
**Fase 1**: base profesional de Next.js, sin funcionalidades de negocio todavía,
para validar que el hosting (Duplika, cPanel + Node.js vía Passenger) sea
compatible antes de invertir tiempo en el catálogo, Prisma y MySQL.

## Stack

- [Next.js 15](https://nextjs.org/docs) (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- ESLint

## Estructura de carpetas

```
src/
  app/          rutas (App Router): páginas, layouts, route handlers
  components/   componentes de UI reutilizables, sin lógica de negocio
  features/     módulos de dominio (ej: features/products más adelante)
  lib/          inicialización de librerías externas (ej: cliente Prisma)
  hooks/        custom React hooks reutilizables
  services/     acceso a datos / APIs externas
  types/        tipos TypeScript compartidos
  utils/        funciones puras sin dependencias de negocio
  actions/      Next.js Server Actions
```

Cada carpeta tiene un `README.md` corto explicando su responsabilidad.
Alias de importación configurado: `@/` apunta a `src/` (ver `tsconfig.json`).

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Build de producción

```bash
npm run build      # genera .next/standalone (+ postbuild copia public/ y .next/static)
npm run start:standalone   # corre el build standalone: node .next/standalone/server.js
```

`next.config.ts` usa `output: "standalone"`: el build resultante en
`.next/standalone` incluye su propio `server.js` y un `node_modules` mínimo
con solo las dependencias de runtime. Esto es clave para hosting compartido
(ver `DEPLOY.md`) porque permite desplegar sin correr `npm install` completo
en el servidor.

## Despliegue

Ver [`DEPLOY.md`](./DEPLOY.md) para la guía completa de despliegue en Duplika
(cPanel + Setup Node.js App / Passenger).

## Próximos pasos

Una vez validada la infraestructura en producción: integrar Prisma + MySQL,
y comenzar con el catálogo de productos.
