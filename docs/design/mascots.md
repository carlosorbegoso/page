# Mascotas 3D — dirección de arte

Colores y materiales exactos: `docs/design/identity.md` §7 y `src/styles/tokens.css` (`--color-alfa-*`, `--alfa-roughness`, …). Este documento define forma, carácter, versión procedural y prompts para Tripo.

## 1. Principios de la familia

- **Objetos de diseño industrial, no personajes de dibujos animados.** Piensa en un altavoz inteligente, un router premium o una pieza de mecanizado: facetas limpias, chaflanes suaves, proporciones calmadas.
- **Sin ojos, boca ni extremidades.** La "personalidad" viene de tres cosas: la postura (leve inclinación de 6–10°), el movimiento lento en reposo y la **línea de señal**: una ranura luminosa fina (emisiva) que cada mascota lleva en el color de su marca. Es el rasgo común que las hace una familia.
- **Materiales**: base mate o metálico satinado (rugosidad 0.3–0.65), sin brillo de plástico, sin purpurina, sin texturas fotográficas. Un solo material por mascota con atlas (cuerpo + señal), AO horneado.
- **Paleta**: cuerpo en tonos grafito/acero de la marca; el color del producto solo en el acento (cinta, banda, señal). Así juntas se leen como un sistema y no como cuatro juguetes.
- **Escala relativa** (1 u = 1 m, pivote en la base): Alfa 1.0 de alto (la mayor, marca madre); las tres de producto 0.55–0.65, de modo que juntas forman un triángulo alrededor de Alfa.

## 2. Fichas

### 2.1 Alfa — TUSOCIO IA (marca madre)

- **Silueta**: cristal/núcleo facetado, un icosaedro ligeramente alargado en vertical (escala Y 1.15) y con la mitad inferior más estrecha, como una gema tallada de baja poligonización. Un **anillo de visor** horizontal a 55 % de la altura: ranura fina que da la vuelta y emite luz azul. Flota sobre su sombra horneada.
- **Proporciones**: alto 1.0, ancho 0.8; visor de 0.04 de alto.
- **Material**: grafito azulado `#2B3A52` metálico satinado (rugosidad 0.38, metalness 0.6). Señal `#5AA9FF` emisiva.
- **Carácter**: sereno, atento; el visor "respira" (intensidad 1.4 ↔ 1.8 en 4 s) cuando hay movimiento permitido.
- **En la escena Ventures**: se abre en tres facetas que viajan y se transforman en las otras tres mascotas.

### 2.2 Burbu — Ventixs

- **Silueta**: burbuja de chat suavizada: cápsula achatada (ancho 1.3 × alto 1 × fondo 0.55) con una cola cónica corta abajo a la izquierda. Tres ranuras-punto horizontales en el frente (indicador "escribiendo") que son la línea de señal, en verde.
- **Proporciones**: alto 0.55; cola ≤ 18 % del ancho.
- **Material**: verde profundo `#1F6E52` mate cerámico (rugosidad 0.55, metalness 0.1). Señal `#3FCF8E`.
- **Carácter**: el más "vivo": los tres puntos se encienden en secuencia (0.4 s cada uno) cuando hay movimiento permitido.

### 2.3 Caja de regalo — Parati

- **Silueta**: cubo de cantos redondeados (radio 8 % del lado) con tapa ligeramente más ancha y separada por una ranura de luz; cinta en cruz plana (no lazo rizado: un lazo geométrico de dos lóbulos facetados, bajo).
- **Proporciones**: lado 0.6; tapa 0.12 de alto; cinta 0.08 de ancho.
- **Material**: cuerpo grafito `#2A3142` mate (rugosidad 0.62, metalness 0.05); cinta rosa coral `#F28BA0` metálico satinado (rugosidad 0.3, metalness 0.7). La ranura bajo la tapa emite el rosa a baja intensidad (señal).
- **Carácter**: discreto y elegante; en foco, la tapa se eleva 2–3 cm y la ranura brilla más.

### 2.4 Herramienta — SkyMek

- **Silueta**: llave combinada estilizada: perfil plano extruido (grosor 0.06) con cabeza abierta hexagonal a un lado y anillo al otro; mango con una **banda** de agarre ámbar en el centro. Se presenta inclinada 30° sobre su eje Z, apoyada en el anillo.
- **Proporciones**: largo 0.65, ancho de cabeza 0.18, bisel 0.01.
- **Material**: acero cepillado `#8C97A8` (rugosidad 0.32, metalness 0.85); banda `#F0A43C` (rugosidad 0.45, metalness 0.2). Una ranura fina ámbar a lo largo del mango = señal.
- **Carácter**: la más sólida y "seria" (producto en producción); gira sobre su eje largo muy despacio.

### 2.5 Juntas

Composición en triángulo: Alfa arriba al centro y algo más atrás; SkyMek a la izquierda, Parati a la derecha, Burbu abajo al centro (o en fila horizontal en móvil). Todas con la misma luz y el mismo entorno; sombras de contacto horneadas del mismo tono. Las líneas de señal son el único color saturado de la escena, así el ojo lee: marca azul → tres productos con su acento.

## 3. Versión procedural (placeholder actual)

Todo con `MeshStandardMaterial`, `flatShading: true` en Alfa y caja para el aspecto facetado. La señal es un segundo `MeshStandardMaterial` con `emissive` = color de señal y `emissiveIntensity` del token (en el GLB final será una zona del atlas emisivo: un solo material). Presupuesto procedural: < 3 k tris por mascota, 2 draw calls cada una (cuerpo + señal) → ≤ 8 en total; se pueden fusionar con `BufferGeometryUtils.mergeGeometries` + grupos.

| Mascota | Primitivas `three` | Notas |
|---|---|---|
| **Alfa** | `IcosahedronGeometry(0.45, 1)` escalada `(1, 1.15, 1)`, vértices con `y < 0` multiplicados por 0.85 en X/Z · visor: `TorusGeometry(0.43, 0.012, 6, 48)` rotado `x = π/2`, en `y = 0.1` | `flatShading`. Sombra: `PlaneGeometry` con textura radial horneada (canvas 128 px). |
| **Burbu** | `CapsuleGeometry(0.2, 0.25, 8, 16)` rotada `z = π/2`, escala `(1, 1, 0.55)` · cola: `ConeGeometry(0.07, 0.12, 12)` rotada ~`z = 2.4` abajo-izquierda · puntos: 3× `CapsuleGeometry(0.018, 0.04, 4, 8)` horizontales, separadas 0.09 | Cuerpo suave (sin `flatShading`). |
| **Caja** | `RoundedBoxGeometry(0.6, 0.48, 0.6, 3, 0.05)` (`three/addons/geometries/RoundedBoxGeometry.js`) · tapa: `RoundedBoxGeometry(0.64, 0.12, 0.64, 3, 0.04)` · cinta: 2× `BoxGeometry(0.08, 0.61, 0.62)` cruzadas · lazo: 2× `OctahedronGeometry(0.07, 0)` escaladas `(1.4, 0.6, 0.8)` · ranura: `BoxGeometry(0.61, 0.008, 0.61)` emisiva | Cinta con material metálico satinado (una de las dos señales visuales). |
| **Herramienta** | `Shape` 2D (mango rectangular redondeado + cabeza con boca hexagonal vía `Path` de agujero + anillo con `absarc` y agujero) → `ExtrudeGeometry({ depth: 0.06, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 })` · banda: `CylinderGeometry` achatado o `BoxGeometry(0.12, 0.05, 0.075)` en el centro | Centrar con `geometry.center()` y pivote en el anillo. |

Movimiento en reposo (solo `high`/`mid` sin reduced-motion): rotación Y 0.08 rad/s, flotación ±0.015 u en 6 s (`sin`), sin rebotes.

## 4. Prompts para Tripo (versión GLB final)

### 4.1 Imagen de referencia

Para cada mascota, usar como imagen de entrada la **captura determinista del placeholder procedural** (modo `?capture=<escena>&progress=1` de PLAN §3.4) a 1024×1024, vista frontal-¾ (cámara 30° a la derecha y 15° arriba), fondo gris neutro `#808080`, sin bloom. Así Tripo hereda proporciones y la familia queda consistente. Si se quiere una referencia más rica, retocarla primero (p. ej. en Firefly o similar) manteniendo silueta, colores y fondo neutro, y guardarla en `assets-src/ref/<mascota>.png`.

### 4.2 Requisitos técnicos (añadir a todos)

> Single object, centered, neutral A-pose / resting pose, neutral grey studio background, soft even lighting, no text, no logos, no face, no eyes, no mouth. Clean low-poly hard-surface topology, under 25,000 triangles, one PBR material (base color, roughness, metallic, emissive) with a single UV atlas, no transparency, watertight mesh, pivot at the base, real-world scale.

Negativo (si la herramienta lo admite): `cartoon, cute, chibi, eyes, face, mouth, arms, legs, toy, plastic gloss, glitter, fur, text, logo, busy texture, photographic texture, multiple objects`.

Tras generar: limpieza en Blender según el checklist de intake (PLAN §6.3), reasignar el color exacto de los tokens en el material, hornear AO, y `bun run assets` para las variantes `high` (≤ 25 k tris, 1024 px) y `mid` (≤ 8 k tris, 512 px).

### 4.3 Prompts

**Alfa**
> A sleek faceted crystal core, an elongated low-poly icosahedron gem slightly narrower at the bottom, premium industrial design object. Dark blue-graphite satin metal body (#2B3A52), subtle chamfered edges. A thin horizontal glowing visor slit wraps around it at 55% height, emitting soft electric blue light (#5AA9FF). Calm, intelligent, minimal, enterprise technology aesthetic, like a high-end smart device. Floating above the ground.

**Burbu**
> A minimal speech bubble object, a flattened rounded capsule with a short conical tail at the lower left, premium industrial design. Deep green matte ceramic body (#1F6E52). Three small horizontal glowing slots on the front, like a typing indicator, emitting mint green light (#3FCF8E). Soft rounded forms, sober, modern tech product aesthetic, not cartoon.

**Caja de regalo (Parati)**
> A minimal geometric gift box with softly rounded edges, slightly wider lid separated by a thin glowing seam. Dark graphite matte body (#2A3142). Flat cross ribbon and a low faceted two-lobe bow in satin rose metallic (#F28BA0); the seam under the lid glows faint rose. Elegant, refined, premium packaging design, sober, not cartoon.

**Herramienta (SkyMek)**
> A stylized combination wrench, flat extruded profile with an open hexagonal jaw on one end and a ring on the other, small bevels. Brushed steel satin metal (#8C97A8). An amber grip band (#F0A43C) in the middle of the handle and a thin amber glowing groove along the handle. Precise, industrial, premium tool design, clean hard-surface modeling, sober.

## 5. Criterios de aceptación visual (revisión de Carlos)

- [ ] Ninguna lee como juguete o personaje infantil; sin rasgos faciales.
- [ ] Silueta reconocible a 64 px de alto (prueba en miniatura).
- [ ] Color de producto solo en el acento; cuerpo en grafito/acero.
- [ ] Las cuatro juntas, con la misma luz, parecen de la misma colección.
- [ ] Línea de señal presente y legible en cada una.

## 6. Versión "cuerpo celeste" (concepto Constelación)

En el mundo "Constelación" (`constellation.md`) las mascotas dejan de ser objetos sueltos y se vuelven **cuerpos del sistema de Alfa**. La forma de producto se conserva, pero **leída como astro**: volumen principal casi esférico y el rasgo del producto como relieve, banda o satélite. Se mantienen la línea de señal, la regla "sin ojos" y un material por cuerpo. Las luce la `PointLight` de Alfa, que marca un terminador día/noche: es lo que las vuelve "lunas" y no iconos.

| Cuerpo | Forma celeste | Rasgo de producto | Banda de acento (emisiva) | Material |
|---|---|---|---|---|
| **Alfa** (estrella) | Núcleo facetado (icosaedro alargado) + halo doble + anillo-visor | Es la marca madre | Visor `#5AA9FF`; núcleo `#EAF4FF` emisivo 3.2 | Ver `constellation.md` §5 |
| **SkyMek** | Esfera r 0.30 con **6 facetas planas mecanizadas** en el ecuador (sección de tuerca hexagonal) | Una llave diminuta (0.18 u) orbita la luna como satélite, a 0.5 u, periodo 20 s | Anillo ecuatorial fino `#F0A43C` | Acero satinado `#8C97A8`, rugosidad 0.45, metalness 0.7 |
| **Parati** | Cubo de cantos muy redondeados (radio 35 % del lado), un "planeta-caja" de lado 0.48 | Cinta en cruz en relieve (0.006 u) que envuelve el cuerpo, con un lazo facetado bajo como "polo" | La cinta `#F28BA0` (metálico satinado, rugosidad 0.3, metalness 0.7) emite a 1.4 | Grafito `#2A3142` mate, rugosidad 0.6, metalness 0.1 |
| **Ventixs** | Esfera achatada (1.2 × 1 × 0.9), r 0.25, con una **cola cónica suave** a 40° bajo el ecuador: la burbuja de chat leída como cometa breve | Tres puntos-ranura en línea sobre la cara iluminada, que se encienden en secuencia (indicador "escribiendo") | Puntos `#3FCF8E` | Verde profundo `#1F6E52` cerámico, rugosidad 0.55, metalness 0.1 |

Primitivas procedurales:
- **SkyMek**: `IcosahedronGeometry(0.3, 3)` con los vértices de `|y| < 0.08` proyectados a un prisma hexagonal (o `CylinderGeometry(0.3, 0.3, 0.16, 6)` fusionado con dos casquetes `SphereGeometry` recortados) · anillo `TorusGeometry(0.305, 0.006, 4, 96)` · llave satélite: la `ExtrudeGeometry` de §3 escalada a 0.28.
- **Parati**: `RoundedBoxGeometry(0.48, 0.48, 0.48, 6, 0.17)` · cinta: 2× `TorusGeometry` aplastados o `BoxGeometry(0.06, 0.49, 0.49)` cruzados · lazo `OctahedronGeometry(0.05, 0)` ×2.
- **Ventixs**: `SphereGeometry(0.25, 32, 24)` escalada `(1.2, 1, 0.9)` · cola `ConeGeometry(0.06, 0.14, 16)` · puntos 3× `SphereGeometry(0.014, 8, 6)` emisivos.

Presupuesto por cuerpo: < 4 k tris procedural; GLB `high` ≤ 25 k, `mid` ≤ 8 k. Escalas y órbitas en `constellation.md` §6.

### Prompts Tripo (variante celeste)

Se añaden los requisitos técnicos de §4.2; la imagen de referencia es la captura `?capture=products` del placeholder.

**SkyMek (luna)**
> A small moon-like sphere with six flat machined facets around its equator like a hexagonal nut, brushed satin steel (#8C97A8), a thin amber glowing ring (#F0A43C) along the equator. Precise industrial hard-surface design, minimal, sober, no texture noise, no craters.

**Parati (luna)**
> A small planet shaped like a gift box with very rounded edges, dark graphite matte surface (#2A3142), wrapped by a flat cross ribbon in raised satin rose metallic (#F28BA0) with a small low faceted bow at the top pole. Elegant, minimal, premium, sober.

**Ventixs (luna)**
> A small slightly flattened sphere with a short soft conical tail below its equator, like a chat bubble read as a tiny comet, deep green ceramic matte surface (#1F6E52), three small glowing mint dots (#3FCF8E) in a row on its face. Minimal, modern technology product, sober, not cartoon.

**Alfa (estrella)**: el GLB de §4.3 sirve tal cual; el brillo de estrella (emisión fuerte, halo, bloom) se resuelve en el motor, no en el modelo.
