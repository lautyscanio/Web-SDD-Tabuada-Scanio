# Quickstart: Catálogo público, perfil y compra multi-butaca

## Escenario 1: navegar todo sin cuenta

1. Abrir la app en una ventana nueva/incógnito (sin sesión).
2. Confirmar que se ve el listado de cines, no un login.
3. Elegir un cine → confirmar que se ven solo sus funciones.
4. Elegir una función → confirmar que se ve el mapa de butacas con
   libres/ocupadas, sin pedir login en ningún paso anterior.

## Escenario 2: login solo al confirmar, sin perder la selección

1. Sin sesión, en el mapa de butacas, seleccionar 2 butacas libres.
2. Tocar "Confirmar reserva" → debe aparecer el formulario de
   login/registro en el mismo lugar (no una navegación a otra pantalla).
3. Iniciar sesión (o registrarse) → debe volver a verse el mapa de
   butacas con las mismas 2 butacas todavía seleccionadas.
4. Tocar "Confirmar reserva" de nuevo → ahora sí se procesa la compra.

## Escenario 3: compra multi-butaca atómica

1. Logueado, seleccionar 3 butacas libres de la misma función.
2. Confirmar → las 3 deben quedar ocupadas (rojas) para cualquier otra
   sesión que mire esa función.
3. Repetir pero con una tercera persona (u otra pestaña) ocupando una de
   esas 3 butacas justo antes de confirmar → la confirmación debe
   fallar por completo (ninguna de las 3 queda reservada), con un
   mensaje que indique cuál butaca ya no está libre.

## Escenario 4: perfil con historial

1. Logueado como el cliente que compró en el escenario 3, ir a "Mi
   perfil".
2. Confirmar que aparece la reserva con película, cine, horario y
   butaca(s).
3. Con un usuario nuevo sin compras, ir a "Mi perfil" → confirmar estado
   vacío legible, no error.
