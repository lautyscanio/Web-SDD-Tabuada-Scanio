# Tasks: Admin — cines con drill-down + idioma/imagen

**Input**: Design documents from `specs/003-admin-cines-drilldown/`

**Tests**: Sin tests automatizados; validación funcional contra el proyecto real.

## Phase 1: Setup

- [ ] T001 Borrar `src/pages/admin/Cines.jsx` (reemplazado por T002/T003).

## Phase 2: Foundational

- [ ] T002 `src/pages/admin/CinesList.jsx`: lista de cines (crear/borrar),
      sin salas/funciones — reusa el patrón de `ListRow`/`Section` del
      `Cines.jsx` anterior para no reinventar estilos.
- [ ] T003 `App.jsx`: el tab "Cines" del admin ahora maneja un estado de
      cine elegido, igual patrón que `CatalogoPublico` del cliente.

**Checkpoint**: navegación de dos niveles lista, aunque sin salas/funciones todavía.

## Phase 3: User Story 1 - Administrar un cine específico (P1) 🎯 MVP

- [ ] T004 [US1] `src/pages/admin/CineDetalle.jsx`: secciones de Salas y
      Funciones filtradas por `cineId` (adaptadas del `Cines.jsx`
      anterior, quitando la sección de Cines que ya está en T002).

**Checkpoint**: drill-down completo, probado con 2 cines reales.

## Phase 4: User Story 2 - Idioma en función (P2)

- [ ] T005 [US2] Agregar `<select>` de idioma (espanol/subtitulada,
      opcional) al form de nueva función en `CineDetalle.jsx`.

## Phase 5: User Story 3 - Imagen en función (P2)

- [ ] T006 [US3] Agregar input de texto "imagen" (nombre de archivo,
      opcional) al mismo form.

**Checkpoint**: crear una función con idioma+imagen y verla reflejada en
el catálogo público del cliente sin recargar.

## Phase 6: Polish

- [ ] T007 Probar los 2 escenarios de `quickstart.md` contra el proyecto real.
- [ ] T008 Commit + push.

## Dependencies

Setup → Foundational → US1 (bloqueante para poder ver algo) → US2/US3
(agregan campos al mismo form, en secuencia por tocar el mismo archivo).
