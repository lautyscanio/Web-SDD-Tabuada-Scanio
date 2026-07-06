# Tasks: Autenticación + seed admin

1. [x] `src/context/AuthContext.jsx`: provider con `onAuthStateChanged`,
       expone `{ user, role, loading }`, lee `users/{uid}` de Firestore,
       desuscribe ambos listeners en cleanup.
2. [x] `src/lib/seedAdmin.js`: chequea `meta/adminSeeded` (no la colección
       `users`, para no requerir lectura anónima de datos con emails); si
       no existe, crea el usuario + doc de Firestore + marca el flag.
3. [x] `src/pages/Login.jsx`: form de login + registro (toggle), estados de
       loading/error, mapeo de códigos de error de Firebase a mensajes en
       español.
4. [x] `src/App.jsx`: envuelto con `AuthProvider`, muestra `Login` si no hay
       sesión, muestra estado "logueado como {email} ({role})" + logout si
       hay sesión.
5. [x] Firestore no estaba habilitado en el proyecto — se habilitó la API,
       se creó la base (`firebase firestore:databases:create`), y se
       desplegaron reglas interinas (`firestore.rules`: público solo
       `meta/*`, resto requiere auth) — a reemplazar por las reglas finales
       en el módulo de Firestore Rules.
6. [x] Password del admin ajustada de `123` a `123456` (mínimo técnico de
       Firebase Auth, confirmado con el usuario) — documentado en el spec.
7. [x] Probado funcionalmente contra el proyecto real (script Node
       descartable, no un mock): seed crea admin y cierra sesión, login
       admin OK, signup cliente OK con `role: "cliente"`, password
       incorrecta devuelve `auth/invalid-credential` (mapeado a mensaje en
       español). Build (`npm run build`) sin errores. No se pudo probar
       visualmente en un navegador real por falta de una herramienta de
       browser headless en este entorno (sin `chromium-cli`/`playwright`
       instalados) — pendiente de un vistazo visual del usuario.
8. [x] Commit + push.
