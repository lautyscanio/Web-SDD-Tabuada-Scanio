# Research: Admin — cines con drill-down + idioma/imagen

## Decisión: drill-down vs. secciones planas

- **Decision**: Reestructurar en dos pantallas (lista de cines → detalle
  de un cine con sus salas/funciones), en vez de las 3 secciones
  simultáneas de `Cines.jsx`.
- **Rationale**: Pedido explícito del usuario; además escala mejor con
  más cines (la versión plana mezclaba visualmente salas/funciones de
  todos los cines juntos).
- **Alternatives considered**: Mantener las 3 secciones pero con filtro
  por cine seleccionado en un dropdown compartido — rechazado, menos
  claro que una navegación real de "entrar al cine".

## Decisión: cómo representar el idioma

- **Decision**: Campo `idioma` en `funciones` con dos valores fijos:
  `'espanol'` | `'subtitulada'`, mostrado como `<select>` (no radio/texto
  libre).
- **Rationale**: Son exactamente 2 opciones fijas según lo pedido — un
  select cerrado evita datos inconsistentes (typos, mayúsculas distintas).

## Decisión: cómo representar la imagen

- **Decision**: Campo `imagen` en `funciones` como string (nombre de
  archivo), input de texto libre en el form, sin selector visual de
  archivos ni upload.
- **Rationale**: Las imágenes ya se suben directo al repo
  (`public/imagenes/`) por el propio usuario — no hay Storage de Firebase
  configurado en este proyecto y agregarlo sería alcance nuevo no pedido.
  Un input de texto es la forma más simple de conectar ambas cosas ahora.
- **Alternatives considered**: Subir imágenes a Firebase Storage desde la
  UI — más completo pero fuera de alcance por tiempo y no pedido
  explícitamente (el usuario dijo que él sube las imágenes al repo).
