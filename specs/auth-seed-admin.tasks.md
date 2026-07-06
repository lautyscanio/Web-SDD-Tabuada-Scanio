# Tasks: Autenticación + seed admin

1. [ ] `src/context/AuthContext.jsx`: provider con `onAuthStateChanged`,
       expone `{ user, role, loading }`, lee `users/{uid}` de Firestore.
2. [ ] `src/lib/seedAdmin.js`: función que corre una vez al montar la app,
       chequea si existe algún `role == "admin"` en `users`, si no crea el
       usuario + doc de Firestore.
3. [ ] `src/pages/Login.jsx`: form de login + registro (toggle), estados de
       loading/error, mapeo de códigos de error de Firebase a mensajes en
       español.
4. [ ] `src/App.jsx`: envolver con `AuthProvider`, mostrar `Login` si no hay
       sesión, mostrar placeholder de "logueado como {email} ({role})" +
       botón de logout si hay sesión (pantalla real de cada rol viene en
       los próximos módulos).
5. [ ] Probar en el navegador: primera carga crea admin, login admin OK,
       registro de usuario nuevo OK, logout OK, error de password
       incorrecta muestra mensaje claro.
6. [ ] Commit + push.
