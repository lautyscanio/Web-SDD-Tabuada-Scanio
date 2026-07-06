# Tasks: Setup del proyecto + Deploy manual

Orden secuencial. Un commit por tarea (o grupo chico de tareas relacionadas)
completada.

1. [ ] Scaffold Vite + React (JS) en la raíz del repo.
2. [ ] Instalar y configurar Tailwind CSS (postcss, tailwind.config, directivas
       en `index.css`).
3. [ ] Registrar la Web App en el proyecto Firebase (`firebase apps:create WEB`)
       y obtener su config (`firebase apps:sdkconfig WEB <appId>`).
4. [ ] Crear `.env.example` (placeholders) y `.env` (valores reales, gitignored)
       con las claves `VITE_FIREBASE_*`.
5. [ ] Crear `src/firebase.js` que inicializa `app`, `auth`, `db` desde
       `import.meta.env`.
6. [ ] Reemplazar `App.jsx` por pantalla placeholder (nombre del sistema,
       estado "conectado a Firebase" simple, estilada con Tailwind).
7. [ ] `firebase init hosting` (o crear `firebase.json`/`.firebaserc` a mano)
       apuntando a `dist/`, single-page-app rewrite activado, proyecto
       `gestioncine-scanio-tabuada`.
8. [ ] Build (`npm run build`) + deploy manual (`firebase deploy --only hosting`)
       y verificar la URL pública en el navegador.
9. [ ] Documentar en `README.md` el comando de deploy manual como backup.
