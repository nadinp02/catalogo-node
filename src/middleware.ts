import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Instancia separada de "@/auth": esta corre en Edge Runtime, así que no
// puede tocar el Credentials provider (Prisma + bcryptjs son Node-only). El
// callback `authorized` de authConfig decide qué rutas requieren sesión.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/administracion/:path*"],
};
