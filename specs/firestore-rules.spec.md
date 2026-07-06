# Spec: Firestore Security Rules (finales)

## Objetivo

Reemplazar las reglas interinas (cualquier autenticado puede todo) por
reglas reales que hagan cumplir del lado del servidor lo que hasta ahora
solo ocultaba el frontend: un `cliente` NO puede hacer ABM de usuarios,
cines, salas o funciones, ni auto-promoverse a admin, ni comprar a nombre
de otro usuario — ni manipulando el frontend a mano.

## Reglas por colección

- **`users/{userId}`**
  - `read`: dueño del doc o admin.
  - `create`: solo el propio usuario (`auth.uid == userId`), y solo con
    `role: "cliente"` — excepto el caso de bootstrap del admin seed, donde
    se permite `role: "admin"` únicamente si `meta/adminSeeded` todavía no
    existe (coincide exactamente con la lógica del seed del módulo 3).
  - `update`: solo admin, y ni siquiera el admin puede cambiar su **propio**
    rol de `admin` a otra cosa (evita quedarse sin ningún admin).
  - `delete`: nadie (la baja es "deshabilitar", no borrar).
- **`cines`, `salas`, `funciones`**: `read` para cualquier autenticado
  (cliente necesita verlas para comprar), `write` (create/update/delete)
  solo admin.
- **`boletos/{funcionId_fila_columna}`**: `read` para cualquier
  autenticado (el plano de butacas necesita ver ocupadas de todos).
  `create` solo si `userId == auth.uid` (no se puede comprar a nombre de
  otro). `update`/`delete` solo admin — esto además refuerza la
  condición de carrera a nivel reglas: si el doc ya existe, un segundo
  intento de "crear" cae en `update` y se rechaza, sin importar si la
  transacción del cliente falla o no.
- **`meta/{doc}`**: `read` público (necesario para el chequeo de seed
  pre-login), `write` solo admin.

## Excepciones a manejar

- Cliente intenta escribir `cines`/`salas`/`funciones`/`users` directo
  contra Firestore (bypaseando la UI) → `permission-denied`.
- Cliente intenta crear un boleto con `userId` de otra persona →
  `permission-denied`.
- Admin intenta quitarse su propio rol de admin → `permission-denied` (ya
  bloqueado también en la UI del módulo 4, esto es la capa de verdad).

## Criterios de aceptación

- [ ] Deploy de `firestore.rules` final reemplaza las reglas interinas.
- [ ] Probado contra el proyecto real (no simulador): cliente no puede
      escribir `cines`; cliente no puede crear boleto con `userId` ajeno;
      admin no puede auto-desadminizarse; todo lo demás sigue funcionando
      igual que antes (regresión de los módulos 3-6).
