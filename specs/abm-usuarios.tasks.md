# Tasks: ABM de usuarios

1. [x] `src/pages/admin/Usuarios.jsx`: tabla de usuarios (`onSnapshot` sobre
       `users`, listener limpio en cleanup), toggle de rol, toggle de
       disabled, estados de loading/error.
2. [x] `AuthContext`/`Login`: bloquear login si `disabled === true` (mensaje
       claro + signOut inmediato vía `authError`).
3. [x] `App.jsx`: admin ve `Usuarios`, cliente ve placeholder de "comprar
       entradas" (módulo siguiente) — sin librería de routing, alcanza con
       un condicional por rol.
4. [x] Probado contra el proyecto real (script descartable): admin lista
       usuarios, deshabilita/rehabilita un cliente sin error.
5. [x] Commit + push.
