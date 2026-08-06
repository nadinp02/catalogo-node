import type { DefaultSession } from "next-auth";
import type { Role } from "@/types/role";

declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

// next-auth/jwt.d.ts re-exporta la interfaz JWT de @auth/core/jwt, pero
// @auth/core resuelve internamente sus propios tipos vía "./jwt.js" (no vía
// el barrel de next-auth). Sin esta ampliación también acá, el callback
// `session({ token })` de "@/auth" ve `token` como JWT sin los campos
// agregados (id/role quedan `unknown` por el índice `Record<string, unknown>`).
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
