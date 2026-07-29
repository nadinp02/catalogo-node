# Despliegue en Duplika (cPanel + Setup Node.js App / Passenger)

Duplika, como la mayoría de los hostings con soporte Node vía cPanel, corre
las apps Node usando **Phusion Passenger**. Passenger:

- Le asigna a tu app un puerto propio e inyecta esa info en la variable de
  entorno `PORT` (por eso el `server.js` que genera Next.js con
  `output: "standalone"` sirve tal cual: ya lee `process.env.PORT`).
- Espera un **"Application startup file"** (un `.js` que arranca un server
  HTTP) dentro de un **"Application root"** que vos elegís en el panel.
- Te da acceso a un entorno Node propio (virtualenv) con `npm`/`node`, que
  activás desde una terminal especial que provee el panel.

Hay dos formas de desplegar. **Se recomienda la Opción A** para hosting
compartido: evita correr el build (que consume bastante RAM/CPU) en el
servidor.

---

## Opción A (recomendada): build local, subís solo el resultado

### 1. Build local

```bash
npm install
npm run build
```

Esto genera `.next/standalone/` ya autocontenido: incluye su propio
`server.js`, un `node_modules` mínimo (solo dependencias de runtime), y
—gracias al script `postbuild`— también `public/` y `.next/static/` copiados
adentro. En otras palabras, **`.next/standalone` es toda la app**, lista
para correr con `node server.js`, sin necesidad de `npm install` en el
servidor.

### 2. Subir el proyecto

Subí el **contenido** de `.next/standalone/` (no la carpeta en sí) a un
directorio en tu cuenta de Duplika, por ejemplo `~/apps/ecommerce`. Podés
usar:

- **Administrador de archivos de cPanel** → subir un `.zip` con el contenido
  de `.next/standalone` y descomprimirlo ahí, o
- **FTP/SFTP** con FileZilla u otro cliente, o
- **Git** si Duplika ofrece "Git Version Control" en cPanel (cloná el repo
  y corré el build ahí mismo — pero eso te lleva a la Opción B).

### 3. Crear la aplicación Node.js en cPanel

1. En cPanel, entrá a **"Setup Node.js App"**.
2. Click en **"Create Application"**.
3. Configurá:
   - **Node.js version**: la más alta disponible ≥ 18.18 (idealmente 20 LTS).
     ⚠️ Si Duplika solo ofrece Node 16 o menor, **avisame antes de seguir**:
     Next.js 15 no arranca con esa versión.
   - **Application mode**: `Production`.
   - **Application root**: la carpeta donde subiste el contenido de
     `.next/standalone` (ej: `apps/ecommerce`).
   - **Application URL**: el dominio o subdominio donde se va a servir.
   - **Application startup file**: `server.js`.
4. Guardá ("Create"). cPanel crea el entorno Node y te muestra la ruta al
   `node`/`npm` de ese entorno virtual.

### 4. ¿Hace falta `npm install`?

No. `.next/standalone` ya trae su propio `node_modules` con lo mínimo
necesario. Podés saltear el botón "Run NPM Install" de cPanel.

### 5. Iniciar / reiniciar la aplicación

En la misma pantalla de "Setup Node.js App", tu aplicación creada aparece
listada. Ahí tenés el botón **"Restart"** (o "Start" la primera vez). Es el
único paso necesario para que Passenger levante (o relance) el proceso
`server.js`.

### 6. Revisar logs

- En la lista de aplicaciones de "Setup Node.js App", cada app tiene un
  enlace a sus logs (stdout/stderr del proceso Node).
- Alternativamente, cPanel suele guardar logs en
  `~/logs/<dominio>/passenger.log` o similar (varía según Duplika). Si no
  aparece nada ahí, revisá **"Errors"** dentro de cPanel (métricas generales
  del servidor web).

### 7. Actualizar el proyecto (nuevos cambios)

Cada vez que cambies código:

```bash
npm run build
```

y volvés a subir el contenido actualizado de `.next/standalone/` (reemplazando
los archivos en el servidor), y le das **"Restart"** a la app en cPanel. No
hace falta recrear la aplicación Node, solo reemplazar archivos y reiniciar.

---

## Opción B: build directo en el servidor

Si preferís no subir builds manualmente (por ejemplo, porque usás Git en
cPanel), podés compilar en el propio servidor:

1. Subí/cloná el **código fuente completo** del proyecto (no el build) a la
   `Application root`.
2. Creá la app Node.js en cPanel igual que en la Opción A, pero con
   **Application startup file**: `.next/standalone/server.js` (esta ruta
   solo va a existir después del primer build).
3. cPanel te da acceso a una terminal con el entorno virtual de Node
   activado (botón que aparece en la propia pantalla de la app, algo como
   `source /home/usuario/nodevenv/apps/ecommerce/20/bin/activate && cd /home/usuario/apps/ecommerce`).
   Ahí corré:
   ```bash
   npm install
   npm run build
   ```
   (`npm run build` ya ejecuta el `postbuild` que copia `public/` y
   `.next/static/` dentro de `.next/standalone/`).
4. Reiniciá la app desde "Setup Node.js App".

**Riesgo de esta opción**: el build de Next.js puede necesitar más
memoria/CPU de la que un plan de hosting compartido garantiza para procesos
en background, y podría fallar o ser matado a mitad de camino. Si eso pasa,
pasate a la Opción A.

---

## Checklist de compatibilidad a confirmar en Duplika

Antes de dar por validada esta fase, confirmá en cPanel:

- [ ] "Setup Node.js App" está disponible y ofrece **Node ≥ 18.18** (ideal 20 LTS).
- [ ] Se puede crear una app apuntando a un dominio/subdominio de prueba.
- [ ] El proceso queda corriendo de forma persistente (no se cae solo).
- [ ] Los logs son accesibles para diagnosticar errores.

Si algún punto falla, es señal de que Duplika no soporta bien Next.js (o
Node en general) y conviene saberlo ahora, antes de construir el catálogo.
