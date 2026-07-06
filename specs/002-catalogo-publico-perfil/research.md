# Research: Catálogo público, perfil y compra multi-butaca

## Decisión: cómo hacer pública la lectura sin exponer escritura

- **Decision**: Cambiar en `firestore.rules` el `read` de `cines`,
  `salas`, `funciones` y `boletos` de `isSignedIn()` a `true` (público).
  El `write` de esas colecciones NO cambia (sigue exigiendo `isAdmin()`
  para cines/salas/funciones, y `userId == auth.uid` para crear un
  boleto propio).
- **Rationale**: Es exactamente lo que pidió el usuario (navegar todo sin
  cuenta) y lo que confirmó en la clarificación (ver butacas ocupadas
  también sin login). Mantener el `write` intacto preserva todas las
  garantías de seguridad del módulo 007 (rules).
- **Alternatives considered**: Mantener todo privado y solo mostrar un
  "resumen" sin datos reales sin login — rechazado, contradice
  directamente lo pedido.

## Decisión: compra multi-butaca atómica

- **Decision**: Una única `runTransaction` que, dentro de la misma
  transacción, hace `tx.get()` de **todos** los docs de butaca
  seleccionados primero, y si **alguno** ya existe, aborta sin escribir
  ninguno; si todos están libres, hace `tx.set()` de todos.
- **Rationale**: Firestore garantiza atomicidad dentro de una
  transacción — es la única forma de cumplir FR-007 (todo o nada) sin
  necesitar un backend/Cloud Function propio.
- **Alternatives considered**: Comprar butaca por butaca en transacciones
  separadas — rechazado, generaría el estado intermedio prohibido por
  FR-007 (algunas reservadas, otras no, por un fallo a mitad de camino).

## Decisión: gate de login inline, no navegación a otra pantalla

- **Decision**: `Butacas.jsx` mantiene su propio estado de selección; si
  `!user` al confirmar, renderiza el `<Login />` existente en el mismo
  lugar (no navega a otra ruta), y al detectar que `user` pasó a existir
  vuelve a mostrar el mapa de butacas con la selección intacta para que
  el usuario confirme con un clic más.
- **Rationale**: Cumple FR-005 (no perder la selección) de la forma más
  simple posible — no hace falta persistir la selección en
  localStorage/query params ni auto-disparar la compra tras el login
  (evita dobles envíos accidentales).
- **Alternatives considered**: Guardar la selección en la URL o
  localStorage y redirigir a una pantalla de login separada — más
  complejo, innecesario dado que el estado de React ya sobrevive mientras
  el componente no se desmonta.

## Decisión: perfil — de dónde salen los datos

- **Decision**: `Perfil.jsx` hace una query a `boletos` con
  `where('userId', '==', auth.uid)`, y resuelve cine/función con lecturas
  puntuales (o un mapa en memoria si ya están cacheados) para mostrar
  título/cine/horario en vez de solo IDs.
- **Rationale**: Reusa el modelo de datos existente sin agregar una
  colección nueva de "historial" redundante.
