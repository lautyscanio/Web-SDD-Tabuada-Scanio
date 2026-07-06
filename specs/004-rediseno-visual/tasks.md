# Tasks: Rediseño visual

**Input**: Design documents from `specs/004-rediseno-visual/`

## Phase 1: Setup (ya hecho en feature 002)

- [x] T001 Descargar `bebas-neue-400.woff2` y `sora-variable.woff2` de
      Google Fonts a `src/assets/fonts/`.
- [x] T002 `@font-face` + `@theme` (`--font-sans`, `--font-display`) en
      `src/index.css`.

## Phase 2: User Story 1 - Identidad visual propia (P1) 🎯

- [x] T003 [US1] Marca "Gestión de Cine" en `App.jsx` ya usaba
      `font-display`.
- [x] T004 [US1] `h1` de `Login.jsx` → `font-display`.
- [x] T005 [US1] `h2` de `Usuarios.jsx` → `font-display`.
- [x] T006 [US1] Verificado: `CinesList` (cliente y admin),
      `FuncionesDeCine`, `Butacas`, `Perfil` y `CineDetalle` ya usan
      `font-display` (`grep -L` sobre todos los `.jsx` de cliente/admin
      no devolvió ningún archivo sin la clase).

## Phase 3: Polish

- [x] T007 `npm run build` + `grep`: 0 referencias a
      `fonts.googleapis`/`fonts.gstatic` en `dist/`; `bebas-neue-400-*.woff2`
      y `sora-variable-*.woff2` empaquetados correctamente.
- [x] T008 Commit + push.
