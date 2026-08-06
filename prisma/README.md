# prisma

Configuración de Prisma ORM.

- `schema.prisma`: datasource (PostgreSQL/Neon), generator del cliente y los
  modelos de datos.
- `migrations/`: historial de migraciones, generado por
  `npx prisma migrate dev`.

El cliente generado vive en `node_modules/@prisma/client` (se regenera con
`npx prisma generate`; ver el script `postinstall` en `package.json`, que
lo corre automáticamente después de `npm install`) y se consume a través
del singleton en `src/lib/prisma.ts`.
