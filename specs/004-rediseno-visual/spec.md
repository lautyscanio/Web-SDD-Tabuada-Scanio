# Feature Specification: Rediseño visual (tipografía propia)

**Feature Branch**: `N/A` (se trabaja directo sobre `main`)

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Reemplazar la tipografía genérica del sistema por una tipografía distintiva descargada de Google Fonts (self-hosted), aplicada de forma consistente en toda la app (marca, títulos, cuerpo) para que no se vea como un template genérico."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identidad visual propia (Priority: P1)

Como usuario del sistema (cualquier rol), quiero que la app se vea con una
identidad propia — no como un template default de Tailwind/IA — para que
transmita que fue diseñada a propósito para un cine.

**Why this priority**: Pedido explícito y directo ("el estilo de la
página es horrible, cambiale la letra") — es una queja concreta sobre
calidad percibida.

**Independent Test**: Abrir cualquier pantalla de la app y confirmar que
el texto no usa las tipografías default del sistema operativo/navegador
(system-ui), sino la tipografía descargada.

**Acceptance Scenarios**:

1. **Given** cualquier pantalla de la app, **When** se inspecciona la
   fuente aplicada, **Then** es una de las dos tipografías descargadas
   (marca/títulos vs. cuerpo), nunca la fuente default del sistema.
2. **Given** la app sin conexión a internet (o con Google Fonts
   bloqueado), **When** se carga, **Then** la tipografía se ve igual
   (está self-hosted, no depende de un CDN externo en tiempo de carga).

---

### Edge Cases

- Navegador sin soporte de variable fonts (muy poco probable en 2026) →
  debe seguir siendo legible con el peso que el navegador resuelva por
  default, no romper el layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE usar una tipografía descargada (no
  enlazada a un CDN externo en runtime) para todo el texto de la app.
- **FR-002**: El sistema DEBE distinguir visualmente marca/títulos
  grandes de texto de cuerpo mediante dos tipografías (una "display" y
  una de lectura), no una sola tipografía para todo.
- **FR-003**: El cambio de tipografía DEBE aplicarse de forma consistente
  en las pantallas de cliente, admin y auth — no solo en una pantalla
  suelta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 referencias a CDNs externos de fuentes (`fonts.googleapis.com`,
  `fonts.gstatic.com`) en el HTML/CSS final construido (`npm run build`).
- **SC-002**: Todos los títulos principales (`h1`/`h2` de cada pantalla y
  la marca "Gestión de Cine") usan la tipografía display; el resto del
  texto usa la tipografía de cuerpo.

## Assumptions

- No se pidió un cambio de paleta de colores (el ámbar sobre fondo oscuro
  ya estaba definido desde el módulo de auth) — este feature es
  específicamente sobre tipografía, no un rediseño completo de color.
