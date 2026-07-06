# Implementation Plan: Catálogo público, perfil y compra multi-butaca

**Branch**: `N/A` (trabajo directo sobre `main`) | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-catalogo-publico-perfil/spec.md`

## Summary

Reestructurar la navegación del cliente para que sea pública hasta el
momento de confirmar una reserva (cine → funciones de ese cine → mapa de
butacas, todo sin sesión), agregar selección múltiple de butacas con
compra atómica todo-o-nada, agregar una pantalla de perfil con historial
de reservas, y mover el gate de login del nivel de "toda la app" al nivel
de "acción de confirmar compra".

## Technical Context

**Language/Version**: JavaScript (React 19, Vite) — sin cambios de stack.

**Primary Dependencies**: `firebase/firestore` (`runTransaction` extendido
a múltiples docs), `firebase/auth` (reutiliza `AuthContext` existente).

**Storage**: Firestore. `boletos/{funcionId}_{fila}_{columna}` sin cambios
de forma; se crean varios docs en la misma transacción para una compra
multi-butaca.

**Testing**: Scripts descartables contra el proyecto Firebase real (mismo
enfoque que los módulos anteriores) — sin framework de testing
automatizado en este proyecto.

**Target Platform**: Web (SPA), sin cambios.

**Project Type**: Extensión de la web app existente, sin proyectos nuevos.

**Performance Goals**: Confirmar una compra de varias butacas en una sola
transacción de red (no N llamadas secuenciales).

**Constraints**: No se implementa "hold" temporal de butacas durante el
login (ver Assumptions del spec) — el chequeo de disponibilidad es
atómico recién al confirmar.

**Scale/Scope**: Mismo volumen bajo del proyecto académico; sin cambios de
escala.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Sin constitución ratificada para el proyecto (igual que en el módulo de
CI/CD) — no hay gates formales que evaluar.

## Project Structure

### Documentation (this feature)

```text
specs/002-catalogo-publico-perfil/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md
└── tasks.md              # Phase 2 output
```

No se genera `contracts/`: no hay una interfaz externa nueva (API, CLI),
es una app cliente-Firestore directa como el resto del proyecto.

### Source Code (repository root)

```text
src/
├── App.jsx                        # Reestructurado: navegación pública fuera del gate de auth
├── context/AuthContext.jsx        # Sin cambios de forma (se sigue usando igual)
├── lib/
│   └── purchaseSeats.js           # Reemplaza purchaseSeat.js: acepta un array de butacas
├── pages/
│   ├── Login.jsx                  # Sin cambios de lógica; se renderiza inline como gate, no de página completa
│   ├── cliente/
│   │   ├── CinesList.jsx          # Nuevo: listado público de cines
│   │   ├── FuncionesDeCine.jsx    # Nuevo: funciones de un cine elegido (reemplaza FuncionesList plano)
│   │   ├── Butacas.jsx            # Multi-selección + gate de login inline al confirmar
│   │   └── Perfil.jsx             # Nuevo: historial de reservas del usuario logueado
│   └── admin/...                  # Sin cambios en este feature
```

**Structure Decision**: Se mantiene la estructura de carpetas existente
(`src/pages/cliente/`), solo se agregan/renombran archivos dentro de ella.
No hace falta una librería de routing — el estado de navegación sigue
siendo un `useState` a nivel `App.jsx`, ahora vive fuera del bloque que
antes exigía sesión.

## Complexity Tracking

*No aplica — no hay violaciones de Constitution Check que justificar.*
