# Feature Specification: Deploy automático a Firebase Hosting vía GitHub Actions

**Feature Branch**: `N/A` (se trabaja directo sobre `main`, sin branch dedicado por feature en este proyecto)

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Deploy automatico a Firebase Hosting via GitHub Actions en cada push a main. El deploy debe compilar el frontend (React/Vite) y publicar el resultado en el proyecto Firebase gestioncine-scanio-tabuada. Si el build o el deploy fallan, el workflow debe marcar el check como fallido y no debe romper ni afectar el deploy manual existente (firebase deploy --only hosting). Solo se dispara en push directo a main."

## Clarifications

### Session 2026-07-06

- Q: ¿Qué mecanismo de credenciales usa GitHub Actions para autenticarse contra Firebase y publicar el deploy? → A: Service Account JSON (rol Firebase Hosting Admin) guardado como GitHub secret, usado por la action oficial `FirebaseExtended/action-hosting-deploy` (Opción A — recomendada porque el token personal de `firebase login:ci` está deprecado por la propia Firebase CLI y no permite scope mínimo de permisos).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Deploy automático al pushear a main (Priority: P1)

Como responsable del proyecto, cuando pusheo un cambio a `main`, quiero que
el sitio publicado se actualice solo, sin tener que acordarme de correr un
comando de deploy a mano.

**Why this priority**: Es el valor central de este módulo — sin esto, no hay
diferencia respecto al deploy manual que ya funciona desde el módulo de
setup.

**Independent Test**: Pushear un cambio trivial (ej. un texto en la pantalla
placeholder) a `main` y, sin correr ningún comando local, verificar en unos
minutos que `https://gestioncine-scanio-tabuada.web.app` refleja el cambio.

**Acceptance Scenarios**:

1. **Given** un cambio commiteado localmente en una rama, **When** se mergea/pushea a `main`, **Then** se dispara automáticamente un proceso que compila y publica el frontend actualizado en Firebase Hosting.
2. **Given** que el deploy automático terminó exitosamente, **When** se visita la URL pública, **Then** se ve el contenido correspondiente al último commit de `main`.

---

### User Story 2 - Falla visible sin romper lo publicado (Priority: P2)

Como responsable del proyecto, si el build o el deploy automático fallan
(por ejemplo, un error de compilación), quiero enterarme claramente en
GitHub y quiero que el sitio publicado siga siendo la última versión buena
conocida, no una versión rota a medio publicar.

**Why this priority**: Evita que un error humano tumbe el sitio en
producción sin que nadie se entere.

**Independent Test**: Pushear un cambio que rompe el build (ej. un error de
sintaxis) a `main` y confirmar que: (a) el check/run de GitHub Actions queda
marcado como fallido, y (b) la URL pública sigue sirviendo la versión
anterior, no una rota ni un error 404/500.

**Acceptance Scenarios**:

1. **Given** un cambio en `main` que rompe el build, **When** se ejecuta el workflow, **Then** el paso de build falla y el workflow se marca como fallido sin intentar publicar nada.
2. **Given** un workflow fallido, **When** se revisa el sitio público, **Then** sigue mostrando la última versión publicada exitosamente antes de la falla.

---

### User Story 3 - Deploy manual sigue funcionando como backup (Priority: P3)

Como responsable del proyecto, quiero poder seguir deployando a mano desde
mi máquina en cualquier momento, independientemente de si GitHub Actions
está funcionando o no.

**Why this priority**: Es la red de contingencia explícitamente pedida — si
GitHub Actions falla por un motivo externo (ej. secret vencido), el proyecto
no debe quedar sin forma de publicar cambios.

**Independent Test**: Correr `npm run build && firebase deploy --only hosting`
localmente y confirmar que el sitio se actualiza igual, sin depender de
ningún archivo ni configuración del workflow de GitHub Actions.

**Acceptance Scenarios**:

1. **Given** el workflow automático configurado, **When** se ejecuta el comando de deploy manual documentado, **Then** el deploy manual funciona igual que antes de agregar CI/CD.

---

### Edge Cases

- Si se pushean dos commits a `main` muy seguidos, ¿qué queda publicado? → Debe quedar publicada la versión correspondiente al último commit; versiones intermedias pueden pisarse (comportamiento nativo de versionado de Firebase Hosting, no hace falta lógica de cola).
- Si un push a `main` no toca ningún archivo del frontend (por ejemplo, solo cambia un archivo en `specs/`), el pipeline igual se ejecuta (no se optimiza con "skip" condicional en esta iteración — simplicidad antes que velocidad de CI).
- Si las credenciales que usa el workflow para autenticarse contra Firebase vencen o se revocan, el workflow debe fallar de forma visible (no silenciosa), cubierto por el requisito de falla visible de la User Story 2.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE iniciar automáticamente un proceso de build + deploy cada vez que se pushean commits nuevos a la rama `main`.
- **FR-002**: El sistema DEBE compilar el frontend usando el mismo comando de build que se usa para el deploy manual (una sola fuente de verdad del proceso de build).
- **FR-003**: El sistema DEBE publicar el resultado del build en el mismo sitio de Firebase Hosting (`gestioncine-scanio-tabuada`) que usa el deploy manual — no un sitio/target separado "solo para CI".
- **FR-004**: Si el paso de build falla, el sistema NO DEBE intentar publicar nada, y DEBE marcar la ejecución como fallida.
- **FR-005**: Si el paso de publicación falla, el sistema DEBE marcar la ejecución como fallida y la versión previamente publicada DEBE seguir activa (sin intervención manual).
- **FR-006**: El deploy automático NO DEBE requerir que una persona esté presente ni apruebe nada manualmente para completarse con éxito.
- **FR-007**: El deploy manual documentado (`firebase deploy --only hosting`) DEBE seguir funcionando de forma independiente a la salud del pipeline automático.
- **FR-008**: Las credenciales usadas por el pipeline automático para autenticarse contra Firebase NO DEBEN quedar committeadas en texto plano en el repositorio; DEBEN guardarse como un Service Account JSON (rol Firebase Hosting Admin) en un GitHub secret encriptado.
- **FR-009**: El pipeline automático se dispara únicamente por push directo a `main` — no se implementa en esta iteración un ambiente de preview por Pull Request.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un commit pusheado a `main` queda visible en el sitio público en menos de 5 minutos, sin ninguna acción manual.
- **SC-002**: El 100% de los builds rotos son detenidos antes de publicarse — ningún build fallido llega nunca a la URL pública de forma automática.
- **SC-003**: El comando de deploy manual de backup sigue completándose con éxito bajo demanda, en menos de 2 minutos, sin depender del estado del pipeline de CI.

## Assumptions

- Solo el push directo a `main` dispara el pipeline; no hay ambientes de preview por PR en esta iteración (confirmado por el usuario).
- Existe un único sitio de Firebase Hosting (el default del proyecto `gestioncine-scanio-tabuada`); no hay separación staging/producción todavía.
- El runner de GitHub Actions tiene acceso de red saliente a los endpoints de deploy de Firebase, sin proxy/firewall corporativo de por medio.
- Las credenciales para autenticar el deploy automático son un Service Account JSON con rol Firebase Hosting Admin, guardado como secret encriptado del repositorio de GitHub (ver Clarifications), no un token de CI personal.
