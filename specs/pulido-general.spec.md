# Spec: Pulido general

## Enfoque

A diferencia del roadmap original (que dejaba el pulido para el final), en
esta implementación las validaciones, estados de carga y mensajes de error
se construyeron módulo a módulo (auth, ABM usuarios, ABM cines, compra de
entradas) en vez de postergarlos — cada pantalla ya tiene sus propios
estados de `loading`/`error`/vacío. Este módulo es una pasada final de
revisión + los ajustes puntuales que quedaron pendientes, no una
reconstrucción.

## Revisión hecha

- Todas las pantallas (`Login`, `Usuarios`, `Cines`, `FuncionesList`,
  `Butacas`) tienen estado de carga explícito, no un parpadeo en blanco.
- Todos los `onSnapshot`/`getDocs` tienen manejo de error con mensaje en
  español, no un throw sin capturar.
- Todos los listeners de Firestore se desuscriben en el cleanup de su
  `useEffect` (`AuthContext`, `Usuarios`, `Cines`, `FuncionesList`,
  `Butacas`).
- Estética consistente en toda la app: fondo oscuro, acento ámbar, motivo
  de film-strip en el login — no un template genérico de Tailwind.

## Limitaciones conocidas (documentadas, no bugs escondidos)

- Borrar un cine no borra en cascada sus salas/funciones/boletos
  asociados (quedan huérfanos, se muestran con "cine eliminado" en vez de
  romper la UI). Fuera de alcance por tiempo.
- No hay tests automatizados (unit/integration) — toda la validación
  funcional de este proyecto se hizo contra el proyecto real de Firebase
  con scripts descartables en cada módulo, documentado en cada
  `.tasks.md`.
- El bundle de producción pesa ~230kb gzip (principalmente el SDK de
  Firebase) — Vite avisa por chunk size, no es un error, pero
  `dynamic import()` lo reduciría; no se aplicó por tiempo.
- No se probó visualmente en un navegador real (sin `chromium-cli`/
  `playwright` disponibles en este entorno) — toda la verificación fue
  funcional contra Firebase real + revisión manual de código/build.

## Criterios de aceptación

- [ ] Build de producción sin errores.
- [ ] Deploy automático (CI/CD) en verde para el último commit.
- [ ] Repaso final: ningún `console.error` no manejado en los flujos
      principales (seed, login, ABM, compra).
