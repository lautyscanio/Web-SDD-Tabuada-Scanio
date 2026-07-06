# Tasks: Setup del proyecto + Deploy manual

Orden secuencial. Un commit por tarea (o grupo chico de tareas relacionadas)
completada.

1. [x] Scaffold Vite + React (JS) en la raíz del repo.
2. [x] Instalar y configurar Tailwind CSS (v4, vía `@tailwindcss/vite`).
3. [x] Registrar la Web App en el proyecto Firebase (`firebase apps:create WEB`)
       y obtener su config (`firebase apps:sdkconfig WEB <appId>`).
4. [x] Crear `.env.example` (placeholders) y `.env` (valores reales, gitignored)
       con las claves `VITE_FIREBASE_*`.
5. [x] Crear `src/firebase.js` que inicializa `app`, `auth`, `db` desde
       `import.meta.env`.
6. [x] Reemplazar `App.jsx` por pantalla placeholder (nombre del sistema,
       estado "conectado a Firebase" simple, estilada con Tailwind).
7. [x] Crear `firebase.json`/`.firebaserc` a mano apuntando a `dist/`,
       single-page-app rewrite activado, proyecto `gestioncine-scanio-tabuada`.
8. [x] Build (`npm run build`) + deploy manual (`firebase deploy --only hosting`)
       y verificar la URL pública en el navegador
       (https://gestioncine-scanio-tabuada.web.app).
9. [x] Documentar en `README.md` el comando de deploy manual como backup.
