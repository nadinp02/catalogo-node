import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Genera .next/standalone: un build autocontenido con solo las
  // dependencias necesarias en runtime. Reduce drásticamente lo que
  // hay que subir/ejecutar en hosting compartido (cPanel/Duplika).
  output: "standalone",
  // Fija explícitamente la raíz del proyecto para el tracing de archivos.
  // Sin esto, Next.js puede inferir mal la raíz si detecta otro
  // package-lock.json en un directorio superior (ej: carpetas compartidas
  // de hosting como htdocs/).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
