# Tasks: Compra de entradas

1. [x] `src/lib/purchaseSeat.js`: `runTransaction` que crea `boletos/{id}`
       determinístico, lanza `SEAT_TAKEN` si ya existe.
2. [x] `src/pages/cliente/FuncionesList.jsx`: lista de funciones con
       `onSnapshot`.
3. [x] `src/pages/cliente/Butacas.jsx`: grilla de butacas, libres/ocupadas
       en tiempo real, confirmar compra.
4. [x] Wire en `App.jsx` (rama cliente): lista → butacas → volver.
5. [x] Probado con 5 transacciones concurrentes reales sobre la misma
       butaca (script descartable): exactamente 1 ganó, 4 recibieron
       `SEAT_TAKEN`.
6. [x] Commit + push.
