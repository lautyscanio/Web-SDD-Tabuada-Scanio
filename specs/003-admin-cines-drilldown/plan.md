# Implementation Plan: Admin — cines con drill-down + idioma/imagen en funciones

**Branch**: `N/A` (trabajo directo sobre `main`) | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-admin-cines-drilldown/spec.md`

## Summary

Reemplazar la pantalla plana de admin (`Cines.jsx` con 3 secciones
mezcladas) por un flujo de dos niveles: lista de cines → vista de detalle
de un cine con sus salas y funciones. Agregar `idioma` (enum) e `imagen`
(nombre de archivo) al formulario de función.

## Technical Context

**Language/Version**: JavaScript (React 19, Vite) — sin cambios de stack.

**Primary Dependencies**: `firebase/firestore` (mismas colecciones
`cines`/`salas`/`funciones`, sin colecciones nuevas).

**Storage**: `funciones/{id}` gana dos campos opcionales: `idioma:
'espanol' | 'subtitulada'` e `imagen: string` (nombre de archivo relativo
a `public/imagenes/`).

**Testing**: Scripts descartables contra el proyecto real.

**Target Platform**: Web (SPA), sin cambios.

**Project Type**: Extensión de la web app existente.

**Performance Goals**: Sin cambios — mismas queries `onSnapshot` filtradas
por `cineId`.

**Constraints**: No se agrega upload de imágenes (fuera de alcance,
confirmado en Assumptions del spec) — solo referencia por nombre de
archivo a `public/imagenes/`.

**Scale/Scope**: Mismo volumen bajo del proyecto académico.

## Constitution Check

Sin constitución ratificada — no hay gates formales que evaluar.

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-cines-drilldown/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/pages/admin/
├── CinesList.jsx        # Nuevo: lista de cines (crear/borrar), sin salas/funciones
└── CineDetalle.jsx       # Nuevo: salas + funciones de UN cine (con idioma/imagen)
                          # Reemplaza Cines.jsx (que mezclaba las 3 secciones)
```

**Structure Decision**: Se elimina `src/pages/admin/Cines.jsx` (queda
reemplazado por dos componentes separados que reflejan el drill-down).
`App.jsx` mantiene el tab "Cines" pero ahora renderiza
`CinesList`/`CineDetalle` según haya o no un cine elegido, igual patrón
que ya se usa en `CatalogoPublico` del cliente.

## Complexity Tracking

*No aplica.*
