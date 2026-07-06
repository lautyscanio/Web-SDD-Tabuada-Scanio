# Research: Deploy automático a Firebase Hosting vía GitHub Actions

No quedaron marcadores `NEEDS CLARIFICATION` en el spec ni en el Technical
Context del plan (la única ambigüedad real — mecanismo de credenciales — se
resolvió en `/speckit-clarify`). Este documento registra las decisiones
técnicas de "cómo" implementarlo.

## Decisión: Action de deploy

- **Decision**: Usar la action oficial `FirebaseExtended/action-hosting-deploy@v0`.
- **Rationale**: Es mantenida por el propio equipo de Firebase, maneja
  autenticación vía Service Account, sube el build y crea una release de
  Hosting sin necesitar instalar/loguear la Firebase CLI manualmente en el
  runner. Soporta out-of-the-box el caso "solo push a main, sin preview de
  PR" con la opción `channelId: live`.
- **Alternatives considered**: Instalar `firebase-tools` a mano en el
  runner y correr `firebase deploy --token`/`--service-account` con un
  step de shell. Rechazado: reinventa lo que la action oficial ya resuelve,
  y el token de `login:ci` está deprecado (ver Clarifications del spec).

## Decisión: Autenticación

- **Decision**: Service Account de GCP con rol `Firebase Hosting Admin`
  (o `roles/firebasehosting.admin`), su JSON de clave guardado como el
  GitHub secret `FIREBASE_SERVICE_ACCOUNT_GESTIONCINE_SCANIO_TABUADA`.
- **Rationale**: Scope mínimo (solo Hosting, no todo el proyecto), no
  depende de la cuenta Google personal de ningún colaborador, se puede
  rotar/revocar sin afectar a nadie más.
- **Alternatives considered**: Token personal de `firebase login:ci`
  (deprecado, atado a una cuenta personal, sin scope granular).

## Decisión: Versión de Node en el runner

- **Decision**: Node.js 24 (misma major que el entorno de desarrollo local).
- **Rationale**: Evita divergencias entre "funciona en mi máquina" y "falla
  en CI" por diferencias de versión de Node/Vite.
- **Alternatives considered**: Node 20 LTS "clásico" — descartado para
  mantener paridad exacta con el entorno de desarrollo ya establecido en
  este proyecto.

## Decisión: Trigger del workflow

- **Decision**: `on: push: branches: [main]` únicamente.
- **Rationale**: Coincide exactamente con el alcance confirmado en el spec
  (sin preview por PR en esta iteración).
- **Alternatives considered**: Agregar también `pull_request` con un canal
  de preview de Hosting — queda fuera de alcance, se puede agregar después
  como una iteración separada si se pide.
