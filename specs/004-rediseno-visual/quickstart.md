# Quickstart: Rediseño visual

1. `npm run build` y confirmar en la salida que se generan los archivos
   `bebas-neue-400-*.woff2` y `sora-variable-*.woff2` dentro de
   `dist/assets/` (fuentes empaquetadas, no referenciadas por URL
   externa).
2. `grep -r "fonts.googleapis\|fonts.gstatic" dist/` → no debe encontrar
   nada (SC-001).
3. Abrir la app (login, catálogo de cliente, admin) y confirmar
   visualmente que la marca "Gestión de Cine" y los títulos de cada
   pantalla se ven en la tipografía condensada (Bebas Neue), y el resto
   del texto en Sora — no en la fuente default del sistema operativo.
