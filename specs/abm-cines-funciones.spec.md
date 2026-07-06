# Spec: ABM de cines, salas y funciones (solo admin)

## Modelo de datos (Firestore)

- `cines/{id}`: `{ nombre, ubicacion }`
- `salas/{id}`: `{ cineId, nombre, filas, columnas }` (grilla de butacas de
  la sala; default de prueba 8x10 según lo acordado)
- `funciones/{id}`: `{ cineId, salaId, pelicula, horario }` (horario:
  string ISO datetime)

Normalizado: `salas` referencia `cines` por `cineId`; `funciones`
referencia ambos. Coincide con lo pedido: admin gestiona cines, salas y
funciones como entidades separadas.

## Reglas de negocio

- Solo admin ABM. Cliente no ve esta pantalla (frontend) — reforzado en
  Firestore rules en el módulo 7.
- Al crear una sala hay que elegir a qué cine pertenece (select).
- Al crear una función hay que elegir cine y, dentro de ese cine, una sala
  (select dependiente).
- Borrar un cine no borra en cascada sus salas/funciones automáticamente
  en esta iteración (fuera de alcance por tiempo) — se documenta como
  limitación conocida.

## Excepciones a manejar

- Crear sala/función sin cines cargados todavía → deshabilitar el form y
  mostrar mensaje ("cargá un cine primero").
- Falla de red al guardar/borrar → mensaje de error, no dejar el form en
  estado inconsistente.
- Campos vacíos/inválidos (filas/columnas no numéricas, horario vacío) →
  validación antes de mandar a Firestore.

## Criterios de aceptación

- [ ] Admin puede crear/listar/borrar cines.
- [ ] Admin puede crear/listar/borrar salas asociadas a un cine.
- [ ] Admin puede crear/listar/borrar funciones asociadas a cine + sala.
- [ ] Cliente no ve esta pantalla.
