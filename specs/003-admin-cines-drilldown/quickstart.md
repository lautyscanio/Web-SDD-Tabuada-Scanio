# Quickstart: Admin — cines con drill-down + idioma/imagen

## Escenario 1: drill-down por cine

1. Logueado como admin, ir a la pestaña "Cines".
2. Confirmar que se ve solo la lista de cines (sin salas/funciones).
3. Entrar a un cine → agregar una sala y una función.
4. Volver a la lista, entrar a OTRO cine → confirmar que no aparece la
   sala/función recién creada (pertenece solo al primer cine).

## Escenario 2: idioma y poster de una función

1. Dentro de un cine, crear una función eligiendo "Subtitulada" y
   escribiendo `matrix.jpg` como imagen.
2. Ir a la vista pública de cliente (sin sesión), entrar a ese mismo cine
   → confirmar que la función muestra el poster y la etiqueta
   "Subtitulada".
3. Crear otra función sin tocar idioma/imagen → confirmar que se ve bien
   igual, sin etiqueta ni poster roto (placeholder "Sin poster").
