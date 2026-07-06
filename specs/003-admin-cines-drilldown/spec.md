# Feature Specification: Admin — cines con drill-down + idioma/imagen en funciones

**Feature Branch**: `N/A` (se trabaja directo sobre `main`)

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Reestructurar la sección de administración de cines para que el admin primero vea la lista de cines existentes, y al elegir uno pueda agregar salas y funciones específicas de ese cine. Las funciones además deben tener un campo de idioma (doblada al español o subtitulada) y una imagen de poster."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrar un cine específico (Priority: P1)

Como admin, quiero ver primero la lista de todos los cines, y al elegir
uno, entrar a una vista dedicada donde agrego/edito/borro sus salas y sus
funciones — sin ver mezcladas las salas/funciones de otros cines.

**Why this priority**: Es el cambio estructural pedido — la pantalla
anterior mezclaba las 3 entidades en secciones planas sin agrupar por
cine, lo cual no escala si hay más de 2-3 cines.

**Independent Test**: Con 2+ cines cargados, entrar a uno, agregar una
sala y una función, y confirmar que no aparecen al entrar al otro cine.

**Acceptance Scenarios**:

1. **Given** hay varios cines, **When** el admin entra a la sección de
   cines, **Then** ve la lista de todos, sin salas/funciones todavía.
2. **Given** el admin eligió un cine, **When** ve la vista de ese cine,
   **Then** ve y puede agregar/borrar únicamente las salas y funciones de
   ESE cine.

---

### User Story 2 - Función con idioma (Priority: P2)

Como admin, al crear una función quiero indicar si es dolada al español o
subtitulada, para que el cliente lo vea antes de comprar.

**Why this priority**: Información que el cliente necesita para decidir,
pedida explícitamente.

**Independent Test**: Crear una función eligiendo "Subtitulada", y
confirmar que se guarda y se puede distinguir de una "Doblada al español".

**Acceptance Scenarios**:

1. **Given** el form de nueva función, **When** el admin elige un idioma,
   **Then** la función queda guardada con ese valor.
2. **Given** una función ya creada sin idioma (dato viejo, de antes de
   este feature), **When** se muestra en cualquier pantalla, **Then** no
   rompe nada — simplemente no muestra la etiqueta de idioma.

---

### User Story 3 - Función con imagen de poster (Priority: P2)

Como admin, quiero asociar una imagen de poster a cada función, para que
el cliente la vea al elegir qué ver.

**Why this priority**: Mejora visual pedida explícitamente, y ya hay
imágenes de prueba disponibles (`public/imagenes/`).

**Independent Test**: Crear una función indicando el nombre de un archivo
de imagen existente en `public/imagenes/`, y confirmar que se ve como
poster en el listado de funciones del cliente.

**Acceptance Scenarios**:

1. **Given** el form de nueva función, **When** el admin escribe el
   nombre de un archivo de imagen, **Then** la función queda guardada con
   esa referencia.
2. **Given** una función sin imagen o con un nombre de archivo que no
   existe, **When** se muestra al cliente, **Then** se ve un placeholder
   ("Sin poster"), nunca un ícono de imagen rota ni un error.

---

### Edge Cases

- Borrar un cine que todavía tiene salas/funciones asociadas → se
  mantiene la limitación ya documentada en el módulo anterior (quedan
  huérfanas, no se rompe la UI).
- Admin escribe el nombre de una imagen con mayúsculas/extensión distinta
  a la real (case-sensitive, `.jpg` vs `.jpeg`) → no se encuentra, se
  muestra el placeholder (mismo comportamiento que "sin imagen").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE mostrarle al admin, en la sección de cines,
  primero la lista de cines (crear/borrar), sin salas ni funciones
  visibles todavía.
- **FR-002**: El sistema DEBE permitir entrar a un cine específico y ahí
  agregar/listar/borrar sus salas y sus funciones, filtradas por ese cine.
- **FR-003**: El formulario de nueva función DEBE incluir un campo de
  idioma con exactamente dos opciones: "Doblada al español" o
  "Subtitulada".
- **FR-004**: El formulario de nueva función DEBE incluir un campo de
  imagen (nombre de archivo esperado en `public/imagenes/`).
- **FR-005**: El sistema DEBE seguir funcionando normalmente con
  funciones creadas antes de este feature (sin idioma ni imagen) —
  campos opcionales, nunca un valor obligatorio retroactivo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con 2 cines cargados, la vista de administración de uno
  nunca muestra datos del otro.
- **SC-002**: Una función creada con idioma y/o imagen se ve
  correctamente reflejada en la pantalla de cliente (`FuncionesDeCine`)
  sin recargar la página (tiempo real).

## Assumptions

- El nombre del archivo de imagen se escribe a mano (no hay un selector
  visual de archivos disponibles) — el admin sabe qué imágenes existen en
  `public/imagenes/` porque las sube él mismo al repo.
- No se valida en el momento de guardar que el archivo de imagen
  realmente exista — se descubre recién al mostrarse (placeholder si
  falta), igual que cualquier link roto.
