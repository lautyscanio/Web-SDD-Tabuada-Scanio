# Sistema de Gestión de Cine

React (Vite) + Tailwind CSS + Firebase (Auth, Firestore, Hosting).

Proyecto Firebase: `gestioncine-scanio-tabuada`
URL: https://gestioncine-scanio-tabuada.web.app

## Desarrollo local

```bash
npm install
cp .env.example .env   # completar con la config del proyecto Firebase
npm run dev
```

## Build

```bash
npm run build
```

## Autenticación

Email/password vía Firebase Auth. Al iniciar la app por primera vez se
crea automáticamente un usuario admin (`admin@gestioncine-scanio-tabuada.local`
/ `123456`) si todavía no existe ninguno — ver `specs/auth-seed-admin.spec.md`.
Un usuario nuevo que se registra queda como `cliente`.

Reglas de Firestore: `firestore.rules` ya tiene las reglas **finales**
granulares por rol (admin vs cliente) — ver `specs/firestore-rules.spec.md`.
Un cliente no puede escribir `cines`/`salas`/`funciones`/`users`, no puede
comprar a nombre de otro `userId`, y ni el propio admin puede quitarse su
rol de admin. Todo verificado contra el proyecto real, no solo en teoría.

## Deploy automático (CI/CD)

Cada push a `main` dispara `.github/workflows/firebase-hosting-merge.yml`:
instala dependencias, corre `npm run build` y publica `dist/` en Firebase
Hosting usando un Service Account guardado como GitHub secret
(`FIREBASE_SERVICE_ACCOUNT_GESTIONCINE_SCANIO_TABUADA`). Si el build falla,
el deploy no se ejecuta y el run queda marcado como fallido en la pestaña
"Actions" del repo — el sitio publicado nunca queda con una versión rota.
Detalle completo en `specs/001-ci-cd-github-actions/`.

## Deploy manual a Firebase Hosting (backup)

Sigue funcionando en paralelo al automático, sin depender de él. Requiere
tener la Firebase CLI autenticada (`firebase login`) y ser colaborador del
proyecto `gestioncine-scanio-tabuada`.

```bash
npm run build
firebase deploy --only hosting
```

## Estructura de documentación (SDD)

Ver carpeta `specs/`: cada módulo tiene su documentación de diseño antes del
código. Los módulos simples usan un par `<módulo>.spec.md` + `.tasks.md`
plano; los módulos con spec-kit completo (`specs/NNN-nombre/`) además
incluyen `plan.md`, `research.md`, `data-model.md`, `quickstart.md` y
`checklists/`.
