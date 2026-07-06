# Implementation Plan: Rediseño visual (tipografía propia)

**Branch**: `N/A` (trabajo directo sobre `main`) | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-rediseno-visual/spec.md`

## Summary

Reemplazar la fuente default del sistema por dos tipografías descargadas
de Google Fonts y auto-hospedadas: **Bebas Neue** (display, para marca y
títulos grandes, estilo marquesina de cine) y **Sora** (cuerpo, variable
font, para todo el resto del texto). Ya se descargaron los `.woff2` y se
declararon en `src/index.css` durante el trabajo del feature 002; este
feature es la aplicación consistente + verificación final.

## Technical Context

**Language/Version**: CSS (Tailwind v4 `@theme`) — sin cambios de stack.

**Primary Dependencies**: Ninguna nueva — los archivos `.woff2` ya están
en `src/assets/fonts/`.

**Storage**: N/A.

**Testing**: Inspección del CSS/HTML de build (`npm run build` + grep) y
revisión visual manual del usuario (sin herramienta de browser headless
disponible en este entorno).

**Target Platform**: Web, sin cambios.

**Project Type**: Ajuste de estilo sobre la app existente.

**Performance Goals**: Fuentes self-hosted evitan un round-trip a
`fonts.googleapis.com` en cada carga (más rápido que la alternativa CDN).

**Constraints**: Solo tipografía — no se toca la paleta de colores
existente (ámbar sobre fondo oscuro).

**Scale/Scope**: Toda la app (auth, cliente, admin).

## Constitution Check

Sin constitución ratificada — no hay gates formales que evaluar.

## Project Structure

### Documentation (this feature)

```text
specs/004-rediseno-visual/
├── plan.md
├── research.md
├── data-model.md         # N/A — no hay entidades de datos
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── index.css                  # @font-face + @theme (ya hecho en feature 002)
├── assets/fonts/               # bebas-neue-400.woff2, sora-variable.woff2 (ya descargados)
├── App.jsx                    # Marca "Gestión de Cine" → font-display
└── pages/**/*.jsx              # h1/h2 de cada pantalla → font-display
```

**Structure Decision**: No se crean archivos nuevos — es una pasada de
consistencia sobre los componentes ya existentes, aplicando la clase
`font-display` a los títulos que todavía no la tenían (Login, Usuarios).

## Complexity Tracking

*No aplica.*
