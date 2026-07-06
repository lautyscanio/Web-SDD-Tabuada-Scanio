# Data Model: Catálogo público, perfil y compra multi-butaca

Sin entidades nuevas. Se reutilizan las existentes:

- **cines**, **salas**, **funciones**: sin cambios de forma (solo cambia
  quién puede leerlas — ver `research.md`).
- **boletos/{funcionId}_{fila}_{columna}**: sin cambios de forma. Una
  compra multi-butaca simplemente crea varios documentos de este tipo en
  la misma transacción, uno por butaca — no se modela una entidad
  "compra" separada que agrupe N butacas (se infiere agrupándolas por
  `userId` + `funcionId` + timestamps cercanos si hiciera falta mostrarlas
  juntas en el perfil, ver Perfil más abajo).
- **Perfil (vista derivada, no colección nueva)**: se arma en el cliente
  cruzando `boletos` (`where userId == auth.uid`) con `funciones` y
  `cines` para mostrar título/cine/horario/butaca — no requiere
  desnormalizar ni guardar datos redundantes en `boletos`.
