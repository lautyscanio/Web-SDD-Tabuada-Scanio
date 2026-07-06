# Feature Specification: Catálogo público, perfil y compra multi-butaca

**Feature Branch**: `N/A` (se trabaja directo sobre `main`)

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Navegación pública de cines y funciones sin necesidad de iniciar sesión, con gate de login solo al momento de reservar butacas; perfil de usuario con historial de reservas; selección de múltiples butacas en una misma compra; flujo de cliente cine primero y luego funciones de ese cine."

## Clarifications

### Session 2026-07-06

- Q: ¿Hasta dónde puede navegar alguien sin iniciar sesión antes de que se
  le pida loguearse? → A: Puede ver todo, incluyendo qué butacas están
  ocupadas para una función — el gate de login aparece recién al confirmar
  la reserva, no antes. (Confirmado directamente por el usuario del
  proyecto.)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar sin cuenta (Priority: P1)

Como visitante sin cuenta, quiero poder elegir un cine, ver sus funciones,
y ver el mapa de butacas (libres/ocupadas) de una función, sin que se me
obligue a registrarme antes de poder mirar.

**Why this priority**: Es el cambio de fondo que pidió el usuario — bajar
la fricción de entrada es el objetivo principal de este feature.

**Independent Test**: Abrir la app en una ventana sin sesión iniciada,
navegar cine → función → mapa de butacas, sin ver ninguna pantalla de
login en el camino.

**Acceptance Scenarios**:

1. **Given** no hay sesión iniciada, **When** se abre la app, **Then** se
   ve el listado de cines, no una pantalla de login obligatoria.
2. **Given** se eligió un cine, **When** se ven sus funciones, **Then** se
   listan sin pedir login.
3. **Given** se eligió una función, **When** se ve el mapa de butacas,
   **Then** se ven las ocupadas en rojo y las libres seleccionables, sin
   pedir login.

---

### User Story 2 - Login solo al reservar (Priority: P1)

Como visitante sin cuenta que ya eligió butacas, quiero que recién al
confirmar la reserva se me pida iniciar sesión o registrarme, sin perder
la selección que ya hice.

**Why this priority**: Es la otra mitad del cambio central — sin esto, la
navegación pública no tendría ningún próximo paso coherente.

**Independent Test**: Sin sesión, seleccionar butacas y tocar "confirmar";
debe aparecer el login/registro; al loguearse, la compra se concreta con
las butacas que ya se habían elegido (no se pierden).

**Acceptance Scenarios**:

1. **Given** no hay sesión y hay butacas seleccionadas, **When** se toca
   "confirmar reserva", **Then** se muestra login/registro en vez de
   procesar la compra.
2. **Given** se acaba de iniciar sesión durante ese flujo, **When** se
   completa el login, **Then** la compra de las butacas ya seleccionadas
   se concreta automáticamente (o se vuelve al mismo punto para
   confirmar), sin tener que re-seleccionar nada.

---

### User Story 3 - Elegir varias butacas en una compra (Priority: P2)

Como cliente (con sesión), quiero poder elegir más de una butaca para la
misma función y confirmarlas juntas en una sola operación.

**Why this priority**: Mejora directa de usabilidad pedida explícitamente
— comprar de a una butaca por vez no refleja un uso real (familias,
grupos).

**Independent Test**: Elegir 3 butacas libres de la misma función,
confirmar, y verificar que las 3 quedan ocupadas y asociadas a la compra
del mismo usuario.

**Acceptance Scenarios**:

1. **Given** varias butacas libres, **When** se seleccionan 2 o más y se
   confirma, **Then** todas quedan reservadas para ese usuario o ninguna
   (si alguna fue tomada justo antes por otra persona).
2. **Given** una de las butacas seleccionadas fue tomada por otra persona
   justo antes de confirmar, **When** se intenta confirmar, **Then** se
   informa cuál butaca ya no está disponible y no se cobra/reserva
   ninguna de las otras a medias.

---

### User Story 4 - Perfil con historial de reservas (Priority: P2)

Como cliente logueado, quiero ver una pantalla de "Mi perfil" con todas
las entradas que compré, para poder consultar mis reservas pasadas.

**Why this priority**: Cierra el ciclo de la experiencia del cliente —
sin esto, comprar una entrada no deja "rastro" visible para el usuario.

**Independent Test**: Comprar una entrada, ir a "Mi perfil", verificar que
aparece listada con película, cine y horario.

**Acceptance Scenarios**:

1. **Given** el cliente compró entradas antes, **When** entra a su perfil,
   **Then** ve la lista de sus reservas con función, cine y butaca.
2. **Given** el cliente nunca compró nada, **When** entra a su perfil,
   **Then** ve un estado vacío claro, no un error ni una tabla en blanco
   sin explicación.

---

### Edge Cases

- Alguien sin sesión selecciona butacas, se le pide login, pero **cancela**
  el login (vuelve atrás) → debe quedar en la pantalla de butacas con su
  selección intacta, no perderla ni forzarlo a loguearse.
- Alguien sin sesión selecciona butacas, y mientras tanto (antes de
  loguearse) otra persona compra una de esas butacas → al confirmar
  después de loguearse, debe detectarse igual que esa butaca ya no está
  libre (no hay "reserva temporal" que la bloquee para otros mientras
  tanto).
- Cine sin funciones cargadas → estado vacío, no error.
- Perfil de un usuario recién registrado (sin compras) → estado vacío.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir ver el listado de cines sin sesión
  iniciada.
- **FR-002**: El sistema DEBE permitir, al elegir un cine, ver únicamente
  las funciones de ESE cine (no todas las funciones de todos los cines
  mezcladas).
- **FR-003**: El sistema DEBE permitir ver el mapa de butacas (libres y
  ocupadas) de cualquier función sin sesión iniciada.
- **FR-004**: El sistema DEBE pedir iniciar sesión o registrarse recién al
  intentar confirmar una reserva, no antes.
- **FR-005**: El sistema DEBE preservar la selección de butacas hecha
  antes de loguearse, y permitir retomar la confirmación después del
  login sin tener que re-seleccionar.
- **FR-006**: El sistema DEBE permitir seleccionar más de una butaca libre
  para la misma función antes de confirmar.
- **FR-007**: Al confirmar una compra multi-butaca, el sistema DEBE
  reservar todas las butacas seleccionadas o ninguna (si alguna ya fue
  tomada, se informa cuál y no se reserva ninguna de esa confirmación).
- **FR-008**: El sistema DEBE mostrar una pantalla de perfil con el
  historial de reservas del usuario logueado (película, cine, horario,
  butaca(s)).
- **FR-009**: El sistema DEBE seguir exigiendo sesión iniciada para las
  pantallas de administración (sin cambios respecto a los módulos
  anteriores).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante sin cuenta puede llegar hasta ver el mapa de
  butacas de una función en 3 clics o menos desde la portada, sin ver
  ninguna pantalla de login en el camino.
- **SC-002**: 100% de los intentos de confirmar una reserva sin sesión
  muestran el login/registro en vez de procesar la compra.
- **SC-003**: Una compra de N butacas (N ≥ 2) resulta en exactamente N
  butacas ocupadas o 0 (nunca un estado intermedio con solo algunas
  reservadas por error de una compra que debía ser atómica).

## Assumptions

- El login/registro que aparece al confirmar es el mismo formulario ya
  construido en el módulo de auth, no uno nuevo.
- No se implementa "reserva temporal" (hold) de butacas mientras alguien
  está en el proceso de login — el chequeo de disponibilidad se vuelve a
  hacer recién al confirmar, después de loguearse.
- El historial de perfil muestra todas las compras históricas sin
  paginación (volumen bajo, proyecto académico).
