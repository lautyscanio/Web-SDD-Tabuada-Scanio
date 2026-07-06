# Spec: Autenticación + seed automático de admin

## Objetivo

Login/registro con Firebase Authentication (email/password) y creación
automática de un usuario admin la primera vez que se inicia el sistema.

## Reglas de negocio

- Roles: `admin` y `cliente`, guardados en Firestore (`users/{uid}.role`),
  no solo en Firebase Auth (que no tiene roles nativos).
- Un usuario común se registra solo (sign up estándar) → queda creado con
  `role: "cliente"`.
- Seed de admin: al iniciar la app, si no existe ningún documento en
  `users` con `role == "admin"`, se crea automáticamente un usuario admin.
  - **Email**: `admin@gestioncine-scanio-tabuada.local` (Firebase Auth exige
    formato de email válido; se documenta acá porque "admin" solo no es un
    email válido — ver Assumptions).
  - **Password**: `123` (según lo pedido).
  - **Enfoque elegido**: chequeo client-side al iniciar la app (no Cloud
    Function, no script aparte). Trade-off de seguridad: la lógica y la
    contraseña quedan visibles en el bundle del frontend — aceptable acá
    porque (a) la contraseña "123" ya es un requisito explícito y hardcodeado
    sin importar dónde corra el chequeo, y (b) es una app académica de
    demo, no un sistema en producción real. El chequeo es idempotente: si
    dos pestañas lo disparan a la vez, `createUserWithEmailAndPassword`
    falla con `auth/email-already-in-use` en la segunda, y se ignora ese
    error puntual.
- Login: pantalla única con email + password, tabs o link para
  "crear cuenta" vs "iniciar sesión".
- Sesión: `onAuthStateChanged` + contexto de React (`AuthContext`) expone
  `{ user, role, loading }` a toda la app; se desuscribe en el cleanup del
  `useEffect`.

## Excepciones a manejar (no pasar nada por alto)

- Email ya registrado (`auth/email-already-in-use`) al crear cuenta.
- Password débil (`auth/weak-password`, Firebase exige mínimo 6 caracteres).
- Email con formato inválido (`auth/invalid-email`).
- Credenciales incorrectas al iniciar sesión (`auth/invalid-credential` /
  `auth/wrong-password` / `auth/user-not-found`).
- Demasiados intentos fallidos (`auth/too-many-requests`).
- Sin conexión (`auth/network-request-failed`).
- Estado de carga mientras se resuelve `onAuthStateChanged` (evitar
  parpadeo mostrando login antes de saber si ya hay sesión).
- El doc de Firestore `users/{uid}` no existe todavía (race entre
  `createUserWithEmailAndPassword` y el `setDoc` del perfil) — manejar con
  loading state hasta que el doc exista.

## Criterios de aceptación

- [ ] Al abrir la app por primera vez (sin usuarios), se crea el admin
      seed automáticamente, sin acción del usuario.
- [ ] `admin@gestioncine-scanio-tabuada.local` / `123` loguea como admin.
- [ ] Un usuario nuevo puede registrarse y queda como `cliente`.
- [ ] Mensajes de error claros y en español para cada excepción de la
      lista de arriba (no mostrar el código crudo de Firebase).
- [ ] Cerrar sesión funciona y vuelve a la pantalla de login.
