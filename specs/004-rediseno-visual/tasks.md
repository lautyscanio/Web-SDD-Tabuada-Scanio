# Tasks: Rediseño visual

**Input**: Design documents from `specs/004-rediseno-visual/`

## Phase 1: Setup (ya hecho en feature 002)

- [x] T001 Descargar `bebas-neue-400.woff2` y `sora-variable.woff2` de
      Google Fonts a `src/assets/fonts/`.
- [x] T002 `@font-face` + `@theme` (`--font-sans`, `--font-display`) en
      `src/index.css`.

## Phase 2: User Story 1 - Identidad visual propia (P1) 🎯

- [ ] T003 [US1] Aplicar `font-display` a la marca "Gestión de Cine" en
      `App.jsx` (Header).
- [ ] T004 [US1] Aplicar `font-display` al `h1` de `Login.jsx`.
- [ ] T005 [US1] Aplicar `font-display` al `h2` de `Usuarios.jsx`.
- [ ] T006 [US1] Confirmar que `CinesList` (cliente y admin),
      `FuncionesDeCine`, `Butacas`, `Perfil` y `CineDetalle` ya usan
      `font-display` en sus títulos (hecho durante 002/003 — solo
      verificar, no repetir trabajo).

## Phase 3: Polish

- [ ] T007 `npm run build` + `grep` confirmando 0 referencias a
      `fonts.googleapis`/`fonts.gstatic` en `dist/`.
- [ ] T008 Commit + push.
