# Despliegue

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

El deploy es automático vía la integración GitHub ↔ Vercel: cada
`git push` a `main` dispara un build y deploy en Vercel. No hay pasos
manuales de build ni subida de archivos.

```bash
git push
```

Vercel también genera un deploy de preview para cada Pull Request.

## Variables de entorno

Se gestionan desde el dashboard de Vercel (Project Settings → Environment
Variables), no desde archivos locales en producción. Variables esperadas:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de Neon (Postgres) |
| `AUTH_SECRET` | Secreto usado por Auth.js para firmar sesiones/tokens |
| `AUTH_URL` | URL pública del sitio (ej: `https://tu-dominio.vercel.app`) |

Para desarrollo local, copiar `.env.example` a `.env.local` y completar los
mismos valores apuntando a una base de Neon de desarrollo (o una rama de
Neon dedicada).
