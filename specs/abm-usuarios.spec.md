# Spec: ABM de usuarios (solo admin)

## Objetivo

Pantalla donde el admin puede ver, editar rol/datos y dar de baja a
usuarios. Un usuario común no debe poder acceder a esta pantalla ni a estas
operaciones, ni manipulando el frontend a mano.

## Reglas de negocio

- Alta: los usuarios comunes se registran solos (ya implementado en el
  módulo de auth) — el admin NO da de alta usuarios nuevos a mano, pero
  puede editar/dar de baja los que ya existen.
- Listado: admin ve todos los `users` (email, rol, fecha de creación).
- Modificación: admin puede cambiar el `role` de un usuario (`cliente` ↔
  `admin`).
- Baja: admin puede "deshabilitar" un usuario (no se borra el registro de
  Firebase Auth desde el cliente — eso requiere Admin SDK/backend, fuera de
  alcance de un frontend puro — se marca `disabled: true` en su doc de
  Firestore y esa condición bloquea el login del lado de la app).
- El propio admin no puede des-adminizarse a sí mismo por error (evitar
  quedarse sin ningún admin) — validación en el frontend + en las reglas
  de Firestore del módulo 7.
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

## Criterios de aceptación

- [ ] Logueado como admin, se ve una tabla con todos los usuarios y su rol.
- [ ] Admin puede cambiar el rol de un usuario que no sea él mismo.
- [ ] Admin puede deshabilitar/habilitar un usuario.
- [ ] Un usuario deshabilitado no puede iniciar sesión (mensaje claro, no
      un error crudo de Firebase).
- [ ] Logueado como cliente, no se ve ningún link ni ruta a esta pantalla.
