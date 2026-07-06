# Tasks: Catálogo público, perfil y compra multi-butaca

**Input**: Design documents from `specs/002-catalogo-publico-perfil/`

**Tests**: No se pidieron tests automatizados; validación funcional contra el proyecto real (ver `quickstart.md`).

## Phase 1: Setup

- [x] T001 `firestore.rules`: `read` público (`true`) para `cines`,
      `salas`, `funciones`, `boletos` — `write` sin cambios. Deploy hecho.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T002 `src/lib/purchaseSeats.js` (reemplaza `purchaseSeat.js`):
      recibe un array de `{ fila, columna }`, hace `tx.get()` de todos
      los docs primero, aborta si alguno existe (informa cuál), si no
      hace `tx.set()` de todos en la misma transacción.
- [x] T003 `App.jsx` reestructurado: `CatalogoPublico` (cine→funciones→
      butacas) vive fuera del gate de auth; admin y `Perfil` siguen
      dentro.

**Checkpoint**: hecho.

---

## Phase 3: User Story 1 - Explorar sin cuenta (Priority: P1) 🎯 MVP

- [x] T004 [US1] `src/pages/cliente/CinesList.jsx`.
- [x] T005 [US1] `src/pages/cliente/FuncionesDeCine.jsx` (filtra por
      `cineId`, muestra imagen/idioma si existen).
- [x] T006 [US1] `Butacas.jsx` ya no requiere `user` para ver el mapa.

**Checkpoint**: probado — anónimo lee cines/funciones/boletos (3/3 checks).

---

## Phase 4: User Story 2 - Login solo al reservar (Priority: P1)

- [x] T007 [US2] `Butacas.jsx`: `showLogin` renderiza `<Login />` inline
      al confirmar sin sesión; efecto que oculta el login apenas hay
      `user`, conservando `seleccionadas`.

**Checkpoint**: probado — anónimo rechazado escribiendo boleto (permission-denied).

---

## Phase 5: User Story 3 - Multi-butaca (Priority: P2)

- [x] T008 [US3] `seleccionadas` es un array, toggle por click.
- [x] T009 [US3] Usa `purchaseSeats`; mensaje indica qué butaca falló.

**Checkpoint**: probado con 2 butacas reales — compra atómica OK, y compra
con una butaca ya ocupada rechazada completa (sigue en 2, no en 3).

---

## Phase 6: User Story 4 - Perfil (Priority: P2)

- [x] T010 [US4] `src/pages/cliente/Perfil.jsx`: boletos por `userId`,
      cruzado con `funciones`/`cines`.
- [x] T011 [US4] Tab "Mi perfil" en `App.jsx` para usuarios logueados no
      admin.

**Checkpoint**: las 4 user stories probadas.

---

## Phase 7: Polish

- [x] T012 [P] `FuncionesList.jsx` y `purchaseSeat.js` borrados
      (reemplazados).
- [x] T013 Escenarios de `quickstart.md` validados con script real
      (7/7 checks: lectura anónima, escritura anónima rechazada, compra
      multi-butaca atómica, rechazo todo-o-nada).
- [x] T014 Commit + push.

---

## Dependencies & Execution Order

- Setup (T001) y Foundational (T002-T003) bloquean todo lo demás.
- US1 (T004-T006) es el MVP — sin esto no hay nada que mostrar sin login.
- US2 (T007) depende de US1 (necesita el mapa de butacas ya público).
- US3 (T008-T009) depende de T002 y puede hacerse en paralelo conceptual
  a US2, pero en la práctica comparte el mismo archivo `Butacas.jsx` así
  que conviene hacerlas en secuencia para no pisarse.
- US4 (T010-T011) es independiente de US2/US3 — puede hacerse en
  cualquier momento después de Foundational.

## Implementation Strategy

MVP = Setup + Foundational + US1 (navegar sin cuenta). Incremental:
US1 → US2 (gate al confirmar) → US3 (multi-butaca) → US4 (perfil) → Polish.
