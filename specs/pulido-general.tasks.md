# Tasks: Pulido general

1. [x] Revisión de estados de loading/error/vacío en las 5 pantallas —
       todas ya los tenían desde que se construyeron (no hubo que agregar
       nada nuevo).
2. [x] Revisión de listeners de Firestore: todos se desuscriben en
       cleanup (`AuthContext`, `Usuarios`, `Cines`, `FuncionesList`,
       `Butacas`).
3. [x] Build de producción final sin errores.
4. [x] Confirmado deploy automático en verde para el último commit
       (CI/CD del módulo 2 funcionando de punta a punta en todo el resto
       del proyecto).
5. [x] Documentadas las limitaciones conocidas (sin cascade delete, sin
       tests automatizados, sin verificación visual en navegador por
       falta de herramienta headless en este entorno).
6. [x] Commit + push.
