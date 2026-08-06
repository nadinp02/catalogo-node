import type { NextAuthConfig } from "next-auth";

// Config compatible con Edge Runtime: sin providers que dependan de Node
// (Prisma, bcryptjs). Los agrega "@/auth", que es el que se usa en Server
// Components/Actions y en el route handler (todos corren en Node runtime).
// Este archivo es el que consume "@/middleware", que sí corre en Edge.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/administracion");

      if (isProtected) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
