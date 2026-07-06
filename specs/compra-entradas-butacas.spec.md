# Spec: Compra de entradas + plano de butacas

## Modelo de datos

- `boletos/{funcionId}_{fila}_{columna}`: `{ funcionId, fila, columna,
  userId, createdAt }`. El ID del documento es determinístico
  (`funcionId_fila_columna`) para poder usar una transacción de Firestore
  que lea ese doc puntual y falle si ya existe — así se resuelve la
  condición de carrera de dos personas comprando la misma butaca a la vez
  sin necesitar locks manuales.

## Flujo

1. Cliente ve lista de funciones (película, cine, horario).
2. Elige una función → ve la grilla de butacas de la sala de esa función
   (filas x columnas).
3. Butacas ocupadas (con boleto existente para esa función) se muestran en
   rojo, no seleccionables. Libres se pueden seleccionar (una a la vez en
   esta iteración).
4. Confirmar compra → `runTransaction`: lee el doc de esa butaca+función,
   si ya existe lanza error (otra persona la compró justo antes), si no
   existe la crea.

## Excepciones a manejar

- Butaca tomada justo antes de confirmar (race real) → mensaje "justo la
  agarraron, elegí otra", no un error crudo de Firestore.
- Función sin sala válida (sala borrada) → mensaje claro, no crash.
- Sin conexión al confirmar → mensaje de red, la selección no se pierde.
- Grilla vacía de funciones → estado vacío legible.

## Criterios de aceptación

- [ ] Cliente ve funciones, elige una, ve el plano de butacas.
- [ ] Butaca ocupada no es clickeable y se ve en rojo.
- [ ] Comprar una butaca libre la marca ocupada para todos (tiempo real).
- [ ] Dos compras simultáneas de la misma butaca: solo una tiene éxito, la
      otra recibe el mensaje de "ya no está libre" (probado con
      transacciones concurrentes reales, no solo en teoría).
