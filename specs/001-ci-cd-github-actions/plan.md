# Implementation Plan: Deploy automático a Firebase Hosting vía GitHub Actions

**Branch**: `N/A` (trabajo directo sobre `main`) | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-ci-cd-github-actions/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Cada push a `main` debe compilar el frontend (Vite) y publicarlo en Firebase
Hosting sin intervención manual, fallando de forma visible si el build o el
deploy fallan, sin afectar el deploy manual existente. Enfoque técnico:
workflow de GitHub Actions (`ubuntu-latest`) que instala dependencias,
corre `npm run build`, y publica `dist/` con la action oficial
`FirebaseExtended/action-hosting-deploy`, autenticando con un Service
Account JSON guardado como GitHub secret (decidido en Clarifications del
spec).

## Technical Context

**Language/Version**: Node.js 24 LTS (misma versión que el entorno de desarrollo local, ver `nvm`)

**Primary Dependencies**: GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`, `FirebaseExtended/action-hosting-deploy@v0`)

**Storage**: N/A (no hay persistencia propia de este feature; publica archivos estáticos en Firebase Hosting)

**Testing**: Validación manual vía `quickstart.md` (push de prueba + observar el run de Actions y el sitio publicado). No se agregan tests automatizados del workflow en esta iteración — no forma parte del alcance de este módulo.

**Target Platform**: GitHub-hosted runner `ubuntu-latest`

**Project Type**: Web app existente (Vite/React) + configuración de CI/CD agregada sobre el mismo repo, sin proyectos nuevos

**Performance Goals**: Deploy visible en el sitio público en menos de 5 minutos desde el push (SC-001 del spec)

**Constraints**: Solo push directo a `main` dispara el pipeline (sin preview por PR); un único sitio de Hosting; credenciales exclusivamente vía GitHub secret encriptado, nunca en el repo

**Scale/Scope**: Un repositorio, un sitio de Hosting, tráfico bajo (proyecto académico) — no hay requisitos de alta concurrencia de deploys

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` todavía es la plantilla sin completar (sin
principios ratificados para este proyecto) — no hay gates formales que
evaluar. No se detectan violaciones porque no hay constitución activa. Se
deja como nota para el futuro: si en algún momento se ratifica una
constitución para el proyecto, este plan debería re-chequearse contra ella.

## Project Structure

### Documentation (this feature)

```text
specs/001-ci-cd-github-actions/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command) — N/A, sin entidades
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── checklists/
│   └── requirements.md  # Spec quality checklist (/speckit-specify command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No se genera `contracts/`: este feature no expone ninguna interfaz externa
(API, CLI, UI) — es configuración de build/deploy puramente interna.

### Source Code (repository root)

```text
.github/
└── workflows/
    └── firebase-hosting-deploy.yml   # Nuevo: workflow que build + deploya en push a main

firebase.json        # Ya existe (módulo de setup) — sin cambios
.firebaserc           # Ya existe — sin cambios
package.json          # Ya existe — sin cambios (usa el mismo `npm run build`)
README.md             # Se actualiza: sección de CI/CD además del deploy manual
```

**Structure Decision**: Opción "single project" — no hay separación
frontend/backend en este repo, así que el workflow vive en
`.github/workflows/` en la raíz y reutiliza el `package.json` y
`firebase.json` existentes tal cual. No se crean carpetas nuevas de código
de aplicación.

## Complexity Tracking

*No aplica — no hay violaciones de Constitution Check que justificar (no hay
constitución ratificada todavía).*
