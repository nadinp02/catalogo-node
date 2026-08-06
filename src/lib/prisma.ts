import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Prisma 7 no trae motor de consultas propio para Postgres: siempre requiere
// un driver adapter. Usamos el de Neon (WebSockets) en vez de @prisma/adapter-pg
// porque es el recomendado para Neon + serverless (Vercel).
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

// Reutiliza la misma instancia entre recargas de módulo en dev (hot-reload
// crearía una nueva conexión por cada cambio si no se cachea acá).
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
