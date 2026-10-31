# Mascotas y props: piezas de escritorio ejecutivo

Dirección final: "Una noche en el escritorio" (`desk.md`). Las mascotas ya no son personajes ni cuerpos celestes. Son **objetos de colección sobre la peana de nogal**, en el registro de un pisapapeles de diseño o una miniatura de arquitectura: materiales nobles, cortes precisos, sin caras. Colores y materiales en `src/styles/tokens.css` (`--color-alfa-*`, `--alfa-roughness`, …, `--color-desk-brass`).

---

## Para Carlos: generar en Tripo

### Cómo generar cada modelo

1. **Entrada**: usa **Text to 3D** con el prompt de abajo. Si Tripo da formas raras, usa **Image to 3D** con una referencia: la captura del placeholder procedural (modo `?capture`, vista frontal-¾, fondo gris) o una foto de un objeto real parecido (la columna "Referencia").
2. **Opciones**, si tu versión de Tripo las ofrece:
   - texturas PBR activadas, en la mejor calidad disponible;
   - límite de caras ≈ 20 000 (triángulos, no quads);
   - sin estilo artístico ("realistic"/none);
   - exportar en **GLB**.
3. Genera de 3 a 4 variantes y elige la que tenga la **silueta más limpia**; el color se corrige después.
4. Guarda el GLB elegido en `assets-src/models/<nombre>.glb` y pásaselo al experto 3D. Él lo limpia en Blender: escala real, pivote en la base, separar las partes con nombre (tabla de nodos), reasignar los colores exactos de los tokens, hornear AO y pasar por `bun run assets`.
5. Anota en `docs/3d/assets.md` el plan de Tripo usado, que tiene que permitir uso comercial.

**Añade siempre al final del prompt:**

> Single object, centered, resting on its base, studio product shot, neutral grey background, soft even lighting. Clean hard-surface modeling, crisp bevels, realistic PBR materials, no text, no logos, no face, no eyes, no mouth.

**Negativo** (si Tripo lo admite): `cartoon, cute, chibi, character, eyes, face, arms, legs, toy, plastic, glitter, fur, text, logo, busy texture, multiple objects, base plate, ground plane`.

### Mascotas (sobre la peana)

| Modelo | Medidas reales | Prompt | Referencia de imagen | Nodos que hay que separar en Blender |
|---|---|---|---|---|
| **Alfa** (`alfa.glb`) | 12 cm de alto × 8 cm | *A faceted obsidian desk sculpture, an elongated geometric gem cut like a monolith, polished black volcanic glass with sharp clean facets, encircled at 55% of its height by a thin brushed brass ring. A very thin groove on the inner face of the ring. Executive desk object, luxury paperweight, minimal and architectural.* | Foto de un pisapapeles de obsidiana facetado + captura del placeholder de Alfa | `body` (obsidiana), `ring` (latón), `signal` (ranura del anillo, emisiva azul) |
| **Burbu** (`burbu.glb`) | 7 cm de alto × 9 cm | *A matte ceramic desk object shaped like a softened speech bubble, a flattened rounded capsule with a short conical tail at the lower left, unglazed bisque ceramic in deep green, three small round recessed dots on the front. Minimal Scandinavian ceramic design, calm and premium.* | Foto de cerámica mate escandinava (jarrón bajo o pisapapeles) | `body` (cerámica), `dot-1`, `dot-2`, `dot-3` (puntos, emisivos verdes) |
| **Caja de regalo** (`gift.glb`) | 6 × 6 × 6 cm | *A small lacquered gift box with softly rounded edges, deep graphite satin lacquer, a slightly wider separate lid, wrapped with a flat satin ribbon cross in muted rose and a small neat flat bow. Luxury packaging miniature, jewellery box quality, minimal.* | Foto de un estuche de joyería lacado con cinta de raso | `body`, `lid` (tapa, se levanta), `ribbon` (cinta), `signal` (ranura de luz bajo la tapa) |
| **SkyMek** (`tool.glb`) | 11 cm de largo, sobre un bloque de nogal de 4 × 2 × 1.5 cm | *A premium combination wrench miniature resting diagonally on a small walnut block, bead-blasted titanium finish, open hexagonal jaw on one end and ring on the other, an amber anodized aluminium grip band in the middle, a thin engraved groove along the handle. High-end workshop tool, precise machining, museum display object.* | Foto de una llave de titanio de gama alta | `body` (titanio), `band` (banda ámbar), `stand` (nogal), `signal` (ranura del mango, emisiva ámbar) |

### Props del escritorio

| Modelo | Medidas | Prompt | Referencia | Nodos |
|---|---|---|---|---|
| **Peana** (`plinth.glb`) | 24 × 10 × 3 cm | *A low rectangular walnut display plinth with softly eased edges and a thin inlaid brushed brass strip along the front face. Fine furniture craftsmanship, oiled walnut grain.* | Foto de una peana de nogal para relojes | `body`, `inlay` |
| **Teléfono** (`phone.glb`) | 147 × 71 × 8 mm | *A modern smartphone lying flat, face up, matte black aluminium frame, flat black glass front with thin even bezels, small camera bump on the back, no brand, no buttons details beyond the side keys.* | Foto cenital de un smartphone genérico | `body`, `screen` (plano exacto de la pantalla, sin textura: ahí va el HTML) |
| **Carpeta archivadora** (`folder.glb`) | 32 × 28 × 8 cm (lomo de 8 cm) | *A wide-spine archival box file standing upright, linen-covered hardboard in a neutral color, a rectangular paper label holder on the spine, a metal finger ring pull on the spine. Office stationery, premium archival quality.* | Foto de un archivador de lomo ancho con portaetiquetas | `body`, `label` (etiqueta del lomo, recibe la textura con el nombre). Se genera **una** carpeta: el experto 3D la duplica 4 veces y le cambia el color (`--color-folder-*`) |
| **Carpeta abierta** (`folder-open.glb`) | 32 × 56 cm abierta | *An open archival folder lying flat on a desk with a few loose paper sheets inside, linen hardboard cover, neutral color.* | — | `body`, `sheet` (hoja superior, recibe textura) |
| **Taza** (`mug.glb`) | Ø 8.5 × 9.5 cm | *A cylindrical matte stoneware coffee mug with a simple loop handle, warm off-white speckled glaze, filled with black coffee.* | Foto de una taza de gres mate | `body`, `coffee` |
| **Lámpara** (`lamp.glb`) | 55 cm de alto con los brazos | *A minimalist architect desk lamp, two straight arms with a hinge, round weighted base, conical shade, graphite anodized aluminium, warm light bulb visible inside the shade.* | Foto de una lámpara de arquitecto de diseño | `base`, `arm-1`, `arm-2`, `shade`, `bulb` (emisivo) |

Opcionales, si sobra tiempo: telescopio refractor blanco con latón, planta pequeña (ficus o monstera) en maceta de terracota y monitor de 27" de marco fino.

Presupuesto por GLB tras limpieza: mascotas `high` ≤ 25 k tris con texturas de 1024 px y `mid` ≤ 8 k con 512 px; props ≤ 15 k (`high`). Un material por objeto con atlas. Las partes emisivas pueden ir como material aparte: el código las detecta por `emissive` y por los nombres `signal` y `dot-N`.

---

## 1. Registro

- **Pieza de escritorio ejecutivo / miniatura de arquitectura.** Cada mascota debe poder venderse en la tienda de un museo de diseño.
- **Materiales nobles con un contraste por pieza**: obsidiana con latón, cerámica mate con luz, laca con raso, titanio con aluminio anodizado.
- **Sin caras.** La personalidad viene de la línea de señal (ranura emisiva fina en el color de su marca), de cómo atrapan la luz de la lámpara y de su gesto de foco.
- **Señal tenue en el escritorio**: emisión a media intensidad (la lámpara manda), con `--alfa-signal-intensity` 1.0 y `--burbu-signal-intensity` 0.8.
- **Escala**: es la escala real de los objetos. La cámara las encuadra en macro (`company`, `products`), así que los biseles y las texturas se ven de cerca: 1024 px por pieza.

## 2. Fichas

| Pieza | Forma | Material base | Acento | Señal | Gesto de foco |
|---|---|---|---|---|---|
| **Alfa** (TUSOCIO IA) | Monolito facetado, de 12 × 8 cm, con la mitad inferior más estrecha | Obsidiana pulida `--color-alfa-body` `#10131A`, r 0.15, m 0 | Anillo de latón `--color-alfa-ring` `#B08A4A`, r 0.3, m 1, a 55 % de la altura | Ranura interior del anillo `#5AA9FF` | Gira 20° y el anillo capta un destello de la lámpara |
| **Burbu** (Ventixs) | Cápsula achatada con cola, de 9 × 7 cm | Cerámica bizcocho mate `--color-burbu-body` `#1F6E52`, r 0.75, m 0 | — | Tres puntos `#3FCF8E` que se encienden en secuencia | Los puntos "escriben" (0.4 s cada uno) |
| **Caja** (Parati) | Cubo de 6 cm con cantos suaves y tapa algo más ancha | Laca grafito satinada `--color-gift-body` `#2A3142`, r 0.4, m 0 | Cinta de raso `--color-gift-ribbon` `#F28BA0`, r 0.35, m 0.05 | Ranura bajo la tapa, rosa tenue | La tapa sube 2.5 cm (nodo `lid`) |
| **SkyMek** | Llave combinada de 11 cm en diagonal sobre un bloque de nogal | Titanio granallado `--color-tool-body` `#8C97A8`, r 0.38, m 1 | Banda de aluminio anodizado `--color-tool-band` `#F0A43C`, r 0.4, m 0.6; bloque de nogal `--color-desk-wood` | Ranura del mango, ámbar | Sube 2 cm y gira despacio; al ser el producto estrella, tiene el plano más largo |

**Juntas sobre la peana**: Alfa en el centro y algo más atrás (es la más alta). SkyMek a la izquierda, en diagonal, con el bloque paralelo al borde de la peana. La caja a la derecha. Burbu delante a la derecha, un poco girada (15°) hacia la cámara. Separación de 3 a 4 cm entre piezas. Las cuatro reciben el mismo cono de la lámpara; Alfa capta el punto más brillante.

## 3. Versión procedural (placeholder)

Misma interfaz (`Mascot`) y **mismos nombres de nodo** que los GLB, para poder cambiarlos sin tocar código.

| Pieza | Primitivas `three` |
|---|---|
| Alfa | `body`: `OctahedronGeometry(0.045, 0)` escalada `(0.9, 1.35, 0.75)` y facetada (`flatShading`), base recortada en y = 0 · `ring`: `TorusGeometry(0.043, 0.0025, 8, 64)` en y = 0.066 · `signal`: `TorusGeometry(0.0405, 0.0006, 4, 64)` |
| Burbu | `body`: `CapsuleGeometry(0.025, 0.03, 8, 16)` rotada `z = π/2` y escalada `(1, 1, 0.6)` + cola `ConeGeometry(0.008, 0.016, 12)` · `dot-1..3`: `SphereGeometry(0.003, 8, 6)` |
| Caja | `body`: `RoundedBoxGeometry(0.06, 0.048, 0.06, 3, 0.004)` · `lid`: `RoundedBoxGeometry(0.063, 0.012, 0.063, 3, 0.003)` · `ribbon`: 2× `BoxGeometry(0.008, 0.061, 0.0605)` · lazo: 2× `OctahedronGeometry(0.006, 0)` aplastados · `signal`: `BoxGeometry(0.0605, 0.001, 0.0605)` |
| SkyMek | `body`: `Shape` de llave (boca hexagonal y anillo) → `ExtrudeGeometry({ depth: 0.005, bevelSize: 0.0008, bevelThickness: 0.0008, bevelSegments: 2 })`, largo 0.11 · `band`: `BoxGeometry(0.014, 0.0065, 0.009)` · `stand`: `RoundedBoxGeometry(0.04, 0.015, 0.02, 2, 0.002)` · `signal`: `BoxGeometry(0.05, 0.0006, 0.001)` |

Movimiento en reposo, solo si está permitido: giro ≤ 0.05 rad/s y respiración de la señal ≤ ±5 % en 6–8 s (reglas anti-mareo del PLAN). Sin flotación: son objetos apoyados.

## 4. Criterios de aceptación visual (Carlos)

- [ ] Cada pieza parece un objeto real que se podría comprar, no un juguete.
- [ ] En el macro se aprecian los materiales: el brillo de la obsidiana, el poro de la cerámica, el satinado del raso, el granallado del titanio.
- [ ] Ninguna tiene rasgos faciales.
- [ ] Juntas sobre la peana parecen una colección.
- [ ] La señal se ve, pero no compite con la lámpara.
