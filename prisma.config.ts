import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js lee .env.local automáticamente, pero el CLI de Prisma corre en un
// proceso aparte que no pasa por el loader de Next: hay que apuntarlo acá
// explícitamente. En Vercel esto no hace nada (el archivo no existe ahí), las
// env vars ya vienen inyectadas en process.env.
// quiet: silencia los "tips" promocionales que dotenv imprime en stdout
// desde la v17 (no son errores ni afectan la carga de variables).
config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
