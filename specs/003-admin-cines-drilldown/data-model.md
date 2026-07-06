# Data Model: Admin — cines con drill-down + idioma/imagen

- **cines**, **salas**: sin cambios de forma.
- **funciones**: se agregan dos campos opcionales sobre el modelo
  existente (`cineId`, `salaId`, `pelicula`, `horario`):
  - `idioma?: 'espanol' | 'subtitulada'`
  - `imagen?: string` — nombre de archivo relativo a `public/imagenes/`
    (ej: `"matrix.jpg"`), no una URL completa.

Ambos campos son opcionales y retrocompatibles: las funciones creadas
antes de este feature simplemente no los tienen, y toda la UI ya está
preparada para ese caso (ver FR-005 del spec).
