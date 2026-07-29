// Copia los assets que "next build" con output:"standalone" NO incluye
// automáticamente (public/ y .next/static), para que .next/standalone
// quede 100% autocontenido y listo para ejecutar con `node server.js`.
import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");

if (!existsSync(standaloneDir)) {
  console.error('No existe .next/standalone. ¿Corriste "next build"?');
  process.exit(1);
}

cpSync(join(root, "public"), join(standaloneDir, "public"), {
  recursive: true,
});

cpSync(join(root, ".next", "static"), join(standaloneDir, ".next", "static"), {
  recursive: true,
});

console.log("Assets copiados a .next/standalone");
