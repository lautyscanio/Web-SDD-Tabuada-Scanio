# Quickstart: Deploy automático a Firebase Hosting vía GitHub Actions

## Prerrequisitos (una sola vez)

1. Crear el Service Account en el proyecto `gestioncine-scanio-tabuada` con
   rol Firebase Hosting Admin y descargar su clave JSON.
2. Cargar esa clave como GitHub secret del repositorio:
   `FIREBASE_SERVICE_ACCOUNT_GESTIONCINE_SCANIO_TABUADA`.
3. Tener el workflow `.github/workflows/firebase-hosting-deploy.yml`
   commiteado en `main`.

## Escenario de validación: deploy automático exitoso

1. Hacer un cambio trivial y visible en `src/App.jsx` (ej. cambiar un texto).
2. `git add`, `git commit`, `git push origin main`.
3. En GitHub → pestaña "Actions", confirmar que se disparó el workflow
   "Deploy to Firebase Hosting" (o el nombre elegido) para ese push.
4. Esperar a que el run termine (verde) — debería tardar bien menos de 5
   minutos (SC-001 del spec).
5. Visitar `https://gestioncine-scanio-tabuada.web.app` y confirmar que se
   ve el cambio del paso 1, sin haber corrido ningún comando local.

## Escenario de validación: build roto no rompe lo publicado

1. Introducir un error de sintaxis deliberado en `src/App.jsx`.
2. Pushear a `main`.
3. Confirmar en la pestaña "Actions" que el run queda marcado como fallido
   (rojo) en el paso de build, y que **no** llega a ejecutar el paso de
   deploy.
4. Visitar el sitio público y confirmar que sigue mostrando la versión
   anterior (buena), no un error ni contenido roto.
5. Revertir el error de sintaxis y pushear de nuevo para dejar el repo en
   estado sano.

## Escenario de validación: el deploy manual sigue funcionando

1. Sin tocar nada del workflow, correr localmente:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
2. Confirmar que el deploy manual termina exitosamente igual que antes de
   agregar CI/CD (SC-003 del spec).
