# Spec: Setup del proyecto + Deploy manual a Firebase Hosting

## Objetivo

Dejar el esqueleto del frontend (React + Vite + Tailwind) conectado a Firebase
(proyecto `gestioncine-scanio-tabuada`) y publicado en Firebase Hosting con una
pantalla placeholder, para asegurar que algo esté online desde el día 1.

## Alcance

- Scaffold de React con Vite (JavaScript, sin TypeScript — proyecto académico,
  se prioriza simplicidad).
- Tailwind CSS configurado y funcionando.
- Módulo central de inicialización de Firebase (`src/firebase.js`) que expone
  `app`, `auth` y `db` (Firestore), leyendo la config desde variables de
  entorno (Vite `import.meta.env`), nunca hardcodeada en el repo.
- Pantalla placeholder que confirme visualmente que la app levantó y que la
  config de Firebase se cargó (sin necesitar login todavía).
- `firebase.json` + `.firebaserc` apuntando al proyecto `gestioncine-scanio-tabuada`,
  hosting apuntando a la carpeta `dist/` (build de Vite) con rewrite a `index.html`
  (necesario para el router de una SPA).
- Deploy manual funcionando: `npm run build && firebase deploy --only hosting`.

## Fuera de alcance (se resuelve en specs posteriores)

- Autenticación real, seed de admin → `auth-seed-admin`.
- GitHub Actions (CI/CD automático) → `deploy-cicd`.
- ABM de usuarios, cines, funciones, compra de entradas.
- Firestore Security Rules.

## Reglas / decisiones técnicas

1. **Vite en vez de Create React App**: CRA está deprecado por el propio equipo
   de React; Vite es el estándar actual, build más rápido, y tiene soporte
   nativo de variables de entorno (`VITE_*`) que Firebase Hosting no necesita
   pero que el proyecto sí usa para no hardcodear credenciales.
2. **Config de Firebase vía variables de entorno**: los valores del SDK web
   (`apiKey`, `authDomain`, etc.) no son secretos en el sentido estricto (son
   públicos por diseño, ver docs de Firebase), pero se mantienen fuera del
   código fuente en un archivo `.env` (gitignored) + `.env.example` (committeado,
   sin valores reales) para que el repo no dependa de un proyecto específico
   hardcodeado y sea fácil de rotar/reconfigurar.
3. **`.firebaserc`** sí se commitea (no es secreto, solo indica qué proyecto
   de Firebase usar por default).

## Criterios de aceptación

- [ ] `npm run dev` levanta la app localmente sin errores.
- [ ] `npm run build` genera `dist/` sin errores ni warnings de Tailwind mal
      configurado.
- [ ] La pantalla placeholder se ve con estilos de Tailwind aplicados (prueba
      de que el pipeline de CSS funciona).
- [ ] `firebase deploy --only hosting` deploya exitosamente y devuelve una URL
      pública tipo `https://gestioncine-scanio-tabuada.web.app`.
- [ ] Visitar esa URL en el navegador muestra la pantalla placeholder.
- [ ] `.env` está en `.gitignore` y no aparece en ningún commit.
