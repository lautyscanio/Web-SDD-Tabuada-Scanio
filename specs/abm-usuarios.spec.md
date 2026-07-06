# Spec: ABM de usuarios (solo admin)

## Objetivo

Pantalla donde el admin puede ver, editar rol/datos y dar de baja a
usuarios. Un usuario común no debe poder acceder a esta pantalla ni a estas
operaciones, ni manipulando el frontend a mano.

## Reglas de negocio

- Alta de clientes: se registran solos (módulo de auth).
- Alta de admins: **amendment 2026-07-06** — un admin logueado SÍ puede
  dar de alta directamente a otro admin (email, contraseña, nombre,
  apellido, DNI) desde esta pantalla, sin que esa persona tenga que
  autoregistrarse primero. Implementación: una instancia secundaria de
  Firebase Auth (`src/lib/createUserAsAdmin.js`) crea la cuenta nueva sin
  cerrar la sesión del admin que la está creando (si se usara la
  instancia principal, el SDK autologuearía al admin actual como el
  usuario recién creado). Firestore rules ajustadas: `isAdmin()` puede
  crear el doc de perfil de cualquier `userId`, no solo el propio.
- Listado: admin ve todos los `users` (nombre, email, DNI, rol, estado).
- Modificación: admin puede cambiar el `role` de un usuario (`cliente` ↔
  `admin`).
- Baja: admin puede "deshabilitar" un usuario, y **(amendment 2026-07-06)**
  también **borrar** su perfil directamente (con confirmación). Importante:
  esto borra el documento de Firestore (`users/{uid}`), NO la cuenta de
  Firebase Auth subyacente — eso requiere Admin SDK/backend, fuera de
  alcance de un frontend puro. Si esa persona intentara loguearse de
  nuevo, su cuenta de Auth seguiría existiendo pero sin perfil (`role`
  null) — queda documentado como limitación conocida, no se implementó un
  bloqueo especial para ese caso límite por tiempo.
- El propio admin no puede des-adminizarse a sí mismo por error (evitar
  quedarse sin ningún admin) — validación en el frontend + en las reglas
  de Firestore del módulo 7.
- **Jerarquía de admins (amendment 2026-07-06)**: SOLO el admin seed
  (`admin@gestioncine-scanio-tabuada.local`, identificado por email fijo
  tanto en el frontend como en Firestore Rules vía
  `request.auth.token.email`) puede quitarle el rol de admin a OTRO admin,
  o borrar la cuenta de otro admin. Un admin "regular" (promovido o dado
  de alta por otro admin) puede hacer todo el resto de las operaciones
  normales — ABM de cines/salas/funciones, promover un cliente a admin,
  deshabilitar/borrar clientes — pero no puede tocar el estatus de otro
  admin. Esto evita que un admin cualquiera se quede como único
  "superadmin" desplazando al original, o que admins se desadministren
  entre sí.
- Acceso: la ruta/pantalla de ABM de usuarios solo se muestra si
  `role === 'admin'`; la protección real (que un `cliente` no pueda escribir
  el rol de nadie ni el propio) vive en Firestore Rules (módulo 7), esto es
  solo la UI.

## Excepciones a manejar

- Un cliente intenta acceder a la URL/pantalla de ABM directamente → redirigir
  o mostrar "no tenés permiso", nunca la tabla de usuarios.
- Admin intenta quitarse su propio rol de admin siendo el único admin →
  bloquear con mensaje claro.
- Falla de red al guardar un cambio de rol → mostrar error, no dejar la UI
  en estado inconsistente (revertir el toggle visual si falla).
- Lista vacía o con un solo usuario (el admin seed) → estado vacío legible,
  no un error.
- Admin regular intenta quitarle el admin o borrar a otro admin (vía UI
  bloqueada, o manipulando el frontend a mano contra Firestore
  directamente) → rechazado en ambas capas (botón deshabilitado en la UI,
  `permission-denied` real en las reglas).
- DNI con caracteres no numéricos → se filtran automáticamente al tipear,
  nunca llega a guardarse un DNI con letras.

## Criterios de aceptación

- [ ] Logueado como admin, se ve una tabla con todos los usuarios, su DNI
      y su rol.
- [ ] Admin puede cambiar el rol de un usuario que no sea él mismo (con la
      restricción de jerarquía sobre otros admins).
- [ ] Admin puede deshabilitar/habilitar y borrar un usuario.
- [ ] Un usuario deshabilitado no puede iniciar sesión (mensaje claro, no
      un error crudo de Firebase).
- [ ] Logueado como cliente, no se ve ningún link ni ruta a esta pantalla.
- [ ] Solo el admin seed puede desadminizar/borrar a otro admin — probado
      contra el proyecto real, no solo en la UI.
