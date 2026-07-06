# Tasks: Deploy automático a Firebase Hosting vía GitHub Actions

**Input**: Design documents from `specs/001-ci-cd-github-actions/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md (N/A), quickstart.md

**Tests**: No se pidieron tests automatizados para este feature (infraestructura de CI/CD); la validación es manual vía `quickstart.md`.

**Organization**: Tareas agrupadas por user story (US1/US2/US3 del spec).

## Phase 1: Setup

- [x] T001 Crear la carpeta `.github/workflows/` en la raíz del repo (generada por `firebase init hosting:github` en T002)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Credenciales y estructura base del workflow — nada de las user stories puede probarse sin esto.

⚠️ **Bloqueante**: T002 requiere una terminal interactiva (login de `gh`/`firebase` + prompts) — es una tarea manual del usuario, no automatizable desde este agente.

- [x] T002 (MANUAL, requiere terminal del usuario) Correr `firebase init hosting:github` en la raíz del repo: crea el Service Account con rol Hosting Admin, el GitHub secret correspondiente, y el/los workflow(s) base en `.github/workflows/` (secret `FIREBASE_SERVICE_ACCOUNT_GESTIONCINE_SCANIO_TABUADA` creado)
- [x] T003 Revisar el/los workflow(s) generados por T002; se generó `firebase-hosting-pull-request.yml` (preview por PR) — eliminado por estar fuera de alcance según spec.md. `firebase-hosting-merge.yml` quedó (push a main, npm ci && npm run build, channelId live) y coincide con lo planeado en plan.md
- [x] T004 [P] Confirmar que el secret quedó creado: `gh secret list` lo muestra

**Checkpoint**: Credenciales listas — recién acá tiene sentido probar las user stories.

---

## Phase 3: User Story 1 - Deploy automático al pushear a main (Priority: P1) 🎯 MVP

**Goal**: Un push a `main` compila y publica solo, sin comandos manuales.

**Independent Test**: Pushear un cambio trivial a `main` y ver el sitio actualizado sin correr nada localmente.

### Implementation for User Story 1

- [x] T005 [US1] `.github/workflows/firebase-hosting-merge.yml` ya generado por T002 con exactamente lo planeado: trigger único `push` a `main`, `npm ci && npm run build`, deploy `live` sin canal de preview — no hizo falta ajustar nada
- [x] T006 [US1] El push del commit que agregó el workflow (T005) ya disparó el pipeline en `main` — sirvió como prueba real, no hizo falta un cambio adicional en `src/App.jsx`
- [x] T007 [US1] Run `28791646597` verde en ~38s (`gh run watch`); `https://gestioncine-scanio-tabuada.web.app` responde 200 y sirve el build actual

**Checkpoint**: User Story 1 funcional de punta a punta.

---

## Phase 4: User Story 2 - Falla visible sin romper lo publicado (Priority: P2)

**Goal**: Un build roto en `main` no llega a publicarse y queda visiblemente marcado como fallido.

**Independent Test**: Pushear un error de sintaxis y confirmar que Actions falla y el sitio no cambia.

### Implementation for User Story 2

- [x] T008 [US2] Error de sintaxis deliberado introducido en `src/App.jsx` y pusheado a `main` (commit `05bd8d9`)
- [x] T009 [US2] Run `28791722944`: step "Run npm ci && npm run build" falló (X), step de deploy quedó "skipped" (`-`) — nunca se ejecutó
- [x] T010 [US2] `https://gestioncine-scanio-tabuada.web.app` siguió respondiendo HTTP 200 con el build anterior, sin degradación
- [x] T011 [US2] Error revertido en `src/App.jsx`, listo para commitear y dejar `main` sano de nuevo

**Checkpoint**: User Stories 1 y 2 funcionan juntas — deploy automático + falla segura.

---

## Phase 5: User Story 3 - Deploy manual sigue funcionando (Priority: P3)

**Goal**: El comando de deploy manual documentado sigue funcionando igual que antes de agregar CI/CD.

**Independent Test**: Correr el deploy manual local sin tocar nada del workflow.

### Implementation for User Story 3

- [x] T012 [US3] `npm run build && firebase deploy --only hosting` corrido localmente — deploy exitoso, igual que antes de agregar CI/CD

**Checkpoint**: Las 3 user stories funcionan de forma independiente.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T013 [P] `README.md` actualizado con sección de CI/CD + deploy manual como backup
- [x] T014 Tareas marcadas en este archivo; commits incrementales por checkpoint de fase (Foundational, US1, US2, US3)
- [x] T015 Los 3 escenarios de `quickstart.md` se corrieron en vivo durante T006-T012 (no hizo falta repetirlos aparte)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias.
- **Foundational (Phase 2)**: Depende de Setup. BLOQUEA las 3 user stories (sin secret/credenciales no hay nada que probar).
- **User Stories (Phase 3-5)**: Dependen de Foundational. US1 y US3 son independientes entre sí; US2 reutiliza el mismo workflow que deja armado US1 (no puede probarse "falla" antes de que el deploy exitoso ya exista).
- **Polish (Phase 6)**: Depende de que al menos US1 esté validada.

### User Story Dependencies

- **US1 (P1)**: Puede arrancar apenas termina Foundational. Sin dependencias de otras stories.
- **US2 (P2)**: Reutiliza el workflow creado en US1 (T005) — en la práctica conviene hacerla después de US1, aunque conceptualmente es una prueba independiente del mismo pipeline.
- **US3 (P3)**: Totalmente independiente — no toca el workflow para nada, es la prueba de que el camino manual sigue intacto.

### Parallel Opportunities

- T004 puede correr en paralelo con T003 (archivos/comandos distintos).
- T013 (README) puede hacerse en paralelo con cualquier fase de user stories, ya que no depende de que el workflow esté probado.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup) y Phase 2 (Foundational — incluye el paso manual T002).
2. Completar Phase 3 (US1).
3. **Parar y validar**: confirmar que el deploy automático funciona de punta a punta.
4. Con eso ya hay valor entregado (el objetivo central del módulo).

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → deploy automático probado → esto ya es el "must have" del módulo.
3. US2 → probar el caso de falla segura.
4. US3 → confirmar que no se rompió el backup manual.
5. Polish → documentación y cierre.

## Notes

- No hay tareas [P] entre fases distintas (todo dentro de Foundational y Polish, por archivos/comandos independientes).
- T002 es la única tarea que requiere intervención manual directa del usuario en su propia terminal (login/consentimiento interactivo) — el resto puede ejecutarse vía agente.
- Commitear después de cada checkpoint de fase, no todo junto al final.
