# Tasks: Catálogo público, perfil y compra multi-butaca

**Input**: Design documents from `specs/002-catalogo-publico-perfil/`

**Tests**: No se pidieron tests automatizados; validación funcional contra el proyecto real (ver `quickstart.md`).

## Phase 1: Setup

- [ ] T001 Actualizar `firestore.rules`: `read` público (`true`) para
      `cines`, `salas`, `funciones`, `boletos` — `write` sin cambios.
      Deploy (`firebase deploy --only firestore:rules`).

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T002 `src/lib/purchaseSeats.js` (reemplaza `purchaseSeat.js`):
      recibe un array de `{ fila, columna }`, hace `tx.get()` de todos
      los docs primero, aborta si alguno existe (informa cuál), si no
      hace `tx.set()` de todos en la misma transacción.
- [ ] T003 Reestructurar `App.jsx`: la navegación de cliente
      (`CinesList` → `FuncionesDeCine` → `Butacas`) vive **fuera** del
      bloque que exige `user` — solo las pantallas de admin y `Perfil`
      siguen dentro del gate.

**Checkpoint**: Con esto listo, recién tiene sentido implementar las user stories.

---

## Phase 3: User Story 1 - Explorar sin cuenta (Priority: P1) 🎯 MVP

**Goal**: Ver cines → funciones → mapa de butacas sin sesión.

- [ ] T004 [US1] `src/pages/cliente/CinesList.jsx`: listado público de
      cines (`onSnapshot`, sin depender de `useAuth`).
- [ ] T005 [US1] `src/pages/cliente/FuncionesDeCine.jsx`: funciones de un
      cine elegido (reemplaza el `FuncionesList` plano).
- [ ] T006 [US1] `Butacas.jsx`: quitar la dependencia de `useAuth` para
      **ver** el mapa (solo la necesita al confirmar, ver US2).

**Checkpoint**: Navegar sin sesión hasta el mapa de butacas funciona solo.

---

## Phase 4: User Story 2 - Login solo al reservar (Priority: P1)

**Goal**: Gate de login inline al confirmar, sin perder selección.

- [ ] T007 [US2] `Butacas.jsx`: si `!user` al tocar "Confirmar", renderizar
      `<Login />` inline (mismo lugar, mismo componente) en vez de
      procesar la compra; al volver a haber `user`, mostrar el mapa de
      nuevo con la selección intacta.

**Checkpoint**: Flujo completo sin cuenta hasta loguearse y confirmar.

---

## Phase 5: User Story 3 - Multi-butaca (Priority: P2)

**Goal**: Elegir 2+ butacas y confirmarlas juntas, todo o nada.

- [ ] T008 [US3] `Butacas.jsx`: cambiar `selected` de un objeto a un
      array/Set de butacas seleccionadas (toggle por click).
- [ ] T009 [US3] `Butacas.jsx`: usar `purchaseSeats` (T002) con el array
      completo; mostrar cuál butaca falló si la transacción aborta.

**Checkpoint**: Compra de varias butacas atómica funcionando.

---

## Phase 6: User Story 4 - Perfil (Priority: P2)

**Goal**: Historial de reservas del usuario logueado.

- [ ] T010 [US4] `src/pages/cliente/Perfil.jsx`: query a `boletos` por
      `userId`, cruzar con `funciones`/`cines`, estado vacío si no hay
      compras.
- [ ] T011 [US4] Agregar tab "Mi perfil" a la navegación de cliente en
      `App.jsx` (dentro del gate de auth, ya que requiere sesión).

**Checkpoint**: Las 4 user stories funcionan de forma independiente.

---

## Phase 7: Polish

- [ ] T012 [P] Borrar `src/pages/cliente/FuncionesList.jsx` y
      `src/lib/purchaseSeat.js` (reemplazados por T005/T002) si quedaron
      sin referencias.
- [ ] T013 Probar los 4 escenarios de `quickstart.md` contra el proyecto
      real.
- [ ] T014 Commit + push (uno por checkpoint de fase, no todo junto).

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
