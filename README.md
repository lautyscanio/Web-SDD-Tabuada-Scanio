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

## Deploy manual a Firebase Hosting

Requiere tener la Firebase CLI autenticada (`firebase login`) y ser
colaborador del proyecto `gestioncine-scanio-tabuada`.

```bash
npm run build
firebase deploy --only hosting
```

El deploy automático vía GitHub Actions (push a `main`) se documenta en
`specs/deploy-cicd.spec.md` (pendiente de implementar).

## Estructura de documentación (SDD)

Ver carpeta `specs/`: cada módulo tiene un `.spec.md` (qué hace, reglas de
negocio, criterios de aceptación) y un `.tasks.md` (tareas técnicas
ordenadas).
