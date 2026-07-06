# Tasks: Admin — cines con drill-down + idioma/imagen

**Input**: Design documents from `specs/003-admin-cines-drilldown/`

**Tests**: Sin tests automatizados; validación funcional contra el proyecto real.

## Phase 1: Setup

- [x] T001 `src/pages/admin/Cines.jsx` borrado.

## Phase 2: Foundational

- [x] T002 `src/pages/admin/CinesList.jsx`: lista de cines (crear/borrar).
- [x] T003 `App.jsx`: tab "Cines" del admin con estado de cine elegido
      (`AdminCines` wrapper), mismo patrón que `CatalogoPublico`.

**Checkpoint**: hecho.

## Phase 3: User Story 1 - Administrar un cine específico (P1) 🎯 MVP

- [x] T004 [US1] `src/pages/admin/CineDetalle.jsx`: Salas y Funciones
      filtradas por `cineId`.

**Checkpoint**: probado — función creada en un cine no aparece al filtrar
por otro cine (3/3 checks reales).

## Phase 4: User Story 2 - Idioma en función (P2)

- [x] T005 [US2] `<select>` de idioma (espanol/subtitulada, opcional).

## Phase 5: User Story 3 - Imagen en función (P2)

- [x] T006 [US3] Input de texto "imagen" (nombre de archivo, opcional).

**Checkpoint**: probado — función con idioma "subtitulada" e imagen
"toystory.jpeg" se guardó y se puede leer correctamente.

## Phase 6: Polish

- [x] T007 Escenarios de `quickstart.md` validados con script real.
- [x] T008 Commit + push.

## Dependencies

Setup → Foundational → US1 (bloqueante para poder ver algo) → US2/US3
(agregan campos al mismo form, en secuencia por tocar el mismo archivo).
