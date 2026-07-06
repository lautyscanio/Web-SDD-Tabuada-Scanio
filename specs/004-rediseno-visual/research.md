# Research: Rediseño visual

## Decisión: qué tipografías elegir

- **Decision**: **Bebas Neue** (display) + **Sora** (cuerpo, variable).
- **Rationale**: Bebas Neue tiene una identidad fuerte de "marquesina de
  cine" (condensada, mayúsculas, alto contraste) que refuerza el dominio
  del proyecto sin caer en clichés genéricos de IA (gradientes, Inter por
  default). Sora es geométrica, moderna y muy legible en textos largos
  (tablas de admin, formularios), y menos asociada a "la fuente default
  de cualquier producto con IA" que Inter/Roboto.
- **Alternatives considered**: Inter (rechazada — es exactamente la
  fuente que el usuario probablemente asocia con "se ve hecho con IA"),
  Playfair Display (más editorial/elegante pero menos "cine" que Bebas
  Neue).

## Decisión: self-host en vez de CDN de Google Fonts

- **Decision**: Descargar los `.woff2` reales y servirlos desde
  `src/assets/fonts/`, declarados con `@font-face` en `src/index.css`.
- **Rationale**: Pedido explícito del usuario ("descargala"). Además evita
  una dependencia de red externa en cada carga y un posible parpadeo de
  fuente (FOUT) más largo que con fuentes empaquetadas por Vite.
- **Alternatives considered**: `<link>` a `fonts.googleapis.com` — más
  simple pero exactamente lo que el usuario pidió evitar.

## Decisión: una sola variable font para todos los pesos de Sora

- **Decision**: Un único archivo `sora-variable.woff2` con
  `font-weight: 100 800` en el `@font-face`, en vez de un archivo por
  peso.
- **Rationale**: Google Fonts devolvió el mismo archivo variable para los
  pesos 400/500/600/700/800 solicitados (confirmado inspeccionando la
  respuesta de la API `fonts.googleapis.com/css2` — todos los bloques
  `@font-face` de esos pesos apuntaban al mismo binario). Descargar un
  solo archivo con rango de peso es más liviano y funciona igual.
