import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fija explícitamente la raíz del proyecto para el tracing de archivos.
  // Sin esto, Next.js infiere mal la raíz porque detecta otro
  // package-lock.json en un directorio superior (carpetas compartidas de
  // hosting como htdocs/).
  outputFileTracingRoot: path.join(__dirname),
  // "ws" (usado por el adapter de Neon) intenta requerir opcionalmente
  // "bufferutil"/"utf-8-validate". Si webpack lo empaqueta, ese require
  // opcional se resuelve a un stub vacío en vez de fallar limpio, y "ws"
  // rompe en runtime ("bufferUtil.mask is not a function"). Excluirlo del
  // bundle hace que se resuelva con el require nativo de Node, que sí cae
  // bien al fallback en JS puro cuando esos paquetes no están instalados.
  serverExternalPackages: ["ws"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
