# Despliegue en Duplika (cPanel + Setup Node.js App / Passenger)

> ✅ **Verificado en producción** el 2026-07-29 en `ecommerce.segurmaxsolutions.com`.
> Node.js 24.18.0, Next.js 15.5.22. El flujo de abajo es el que realmente
> funcionó, no una guía teórica.

Duplika corre las apps Node usando **Phusion Passenger**, vía la pantalla
**"Setup Node.js App"** de cPanel. Passenger:

- Le asigna a la app un puerto propio e inyecta esa info en la variable de
  entorno `PORT` (por eso el `server.js` que genera Next.js con
  `output: "standalone"` sirve tal cual: ya lee `process.env.PORT`).
- Espera un **"Archivo de inicio de la aplicación"** dentro de una
  **"Raíz de aplicación"** que vos elegís en el panel. No tiene que
  llamarse `app.js`: puede ser cualquier ruta relativa dentro de la raíz.
- Da acceso a una terminal con el entorno virtual de Node activado.

---

## Configuración verificada en cPanel

En **Setup Node.js App**:

| Campo | Valor usado |
|---|---|
| Versión de Node.js | `24.18.0` (recomendado por Duplika) |
| Modo de aplicación | `Production` |
| Raíz de aplicación | `next-catalogo` (carpeta bajo el home del usuario) |
| URL de la aplicación | `ecommerce.segurmaxsolutions.com` |
| Archivo de inicio de la aplicación | `.next/standalone/server.js` |

⚠️ El primer intento usando `app.js` (con un wrapper `require("./.next/standalone/server.js")`)
dio **503 Service Unavailable**: Passenger no encontraba el archivo. Apuntar
el "Archivo de inicio" directo a `.next/standalone/server.js` lo resolvió,
sin necesidad de ningún wrapper.

## Estructura de carpetas necesaria en el servidor

Con "Raíz de aplicación" = `next-catalogo` y "Archivo de inicio" =
`.next/standalone/server.js`, el servidor necesita, dentro de esa raíz:

```
next-catalogo/
  .next/
    standalone/
      server.js        ← el archivo de inicio
      node_modules/     ← generado por next build, dependencias mínimas de runtime
      public/           ← copiado ahí (no alcanza con dejarlo solo en la raíz)
      .next/
        static/         ← copiado ahí (ídem)
```

`public/` y `.next/static/` **tienen que estar copiados dentro de
`.next/standalone/`**, no solo en la raíz del proyecto. Sin esto la app
levanta pero sirve una página sin estilos ni JS (404 en los assets). El
script `postbuild` del proyecto (`scripts/copy-standalone-assets.mjs`) hace
esa copia automáticamente cada vez que corrés `npm run build` local:

```bash
npm install
npm run build
```

Después de esto, `.next/standalone/` en tu máquina ya tiene todo lo de la
tabla de arriba. Subilo tal cual a `next-catalogo/.next/standalone/` en el
servidor (Administrador de archivos de cPanel, FTP/SFTP, o Git).

## ¿Hace falta "Ejecutar NPM Install" en cPanel?

No. `.next/standalone/node_modules` ya viene con las dependencias mínimas
de runtime generadas por el build. Ese botón está para cuando se sube el
código fuente completo y se buildea en el servidor (más abajo).

## Iniciar / reiniciar la aplicación

En la pantalla de la app, botón **"Reiniciar"** (o el botón de start/stop de
arriba). Es lo único necesario para que Passenger relance el proceso
`server.js` después de subir cambios.

## Revisar logs

En la misma pantalla de "Setup Node.js App" cada aplicación tiene acceso a
sus logs (stdout/stderr del proceso Node). Si no aparece nada ahí, revisar
**"Errors"** en cPanel (logs generales del servidor web).

## Actualizar el proyecto (nuevos cambios)

Cada vez que cambies código:

```bash
npm run build
```

y volvés a subir el contenido actualizado de `.next/standalone/` a
`next-catalogo/.next/standalone/` en el servidor, reemplazando lo que
había. Después, **"Reiniciar"** la app desde cPanel. No hace falta
recrearla ni tocar la configuración de Node.js App.

---

## Alternativa: build directo en el servidor

Si en algún momento se prefiere no subir el build a mano (por ejemplo,
usando "Git Version Control" de cPanel para clonar el repo), se puede
compilar ahí mismo:

1. Cloná/subí el **código fuente completo** a `next-catalogo`.
2. Dejá la misma config de arriba (Archivo de inicio: `.next/standalone/server.js`,
   que va a existir recién después del primer build).
3. Entrá a la terminal con el entorno virtual activado (comando que muestra
   la propia pantalla de la app, algo como
   `source /home/usuario/nodevenv/next-catalogo/24/bin/activate && cd /home/usuario/next-catalogo`)
   y corré:
   ```bash
   npm install
   npm run build
   ```
4. Reiniciá la app desde "Setup Node.js App".

**Riesgo**: el build de Next.js puede necesitar más memoria/CPU de la que
un plan compartido garantiza para procesos en background. Si el build
falla o se corta, volvé al flujo de arriba (build local + subida manual).

---

## Checklist de compatibilidad (ya confirmado en Duplika)

- [x] "Setup Node.js App" disponible, con Node 24.18.0.
- [x] Se puede crear una app apuntando a un subdominio real.
- [x] El build `output: "standalone"` corre y sirve la página con estilos.
- [x] Reinicio y logs accesibles desde el panel.
