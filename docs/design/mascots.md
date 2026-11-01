# Figuras de la peana y prompts de Tripo

Las cuatro figuras de marca sobre la peana (Alfa, SkyMek, Parati, Ventixs): cómo son hoy en código y los prompts para generarlas en Tripo; léelo antes de tocar `src/three/desk/props/figures/` o de traer un GLB.

Código: `src/three/desk/props/figures/` (geometría), `src/three/desk/props/palette.ts` (acabados), `src/three/desk/layout.ts` (`PLINTH`, `FIGURES`, `FIGURE_HEIGHT`), `src/three/desk/life/` (reacciones). Cómo cargar un GLB: `docs/3d/assets.md`.

## Registro

- Objetos de colección sobre una peana de nogal: materiales nobles, cortes precisos, que se puedan vender en la tienda de un museo de diseño.
- Un contraste de materiales por pieza (cerámica con latón, acero con latón…).
- Personalidad por la **línea de señal** (ranura o punto emisivo fino en el color de su marca), por cómo atrapan la lámpara y por su gesto de foco.
- Señal tenue: la lámpara manda (`--alfa-signal-intensity` 1, `--burbu-signal-intensity` 0.8 en `src/styles/tokens/stage.css`).
- Escala real. La cámara las encuadra en macro (`company`, `products`), así que biseles y texturas se ven de cerca.
- Sin flotación: son objetos apoyados. Giro ≤ 0.05 rad/s (`MAX_TURN_SPEED`).

## Figuras actuales (procedurales, `PartBuilder`)

Se fusionan en un solo mesh por figura con id de objeto; no hay nodos con nombre.

| Figura | Producto | Archivo | Forma | Acabado |
|---|---|---|---|---|
| Alfa | TUSOCIO IA | `figures/alfa.ts` | Pequeño robot: cabeza esférica con visor oscuro, dos ojos de señal, orejas y antena de latón, brazos colgando. 13.3 cm | Cerámica blanca satinada; visor `--color-alfa-body`; señal `--color-alfa-signal` |
| SkyMek | SkyMek | `figures/skymek.ts` | Llave combinada inclinada sobre un soporte oscuro | Acero pulido (m 1); banda de latón; señal ámbar `--color-tool-band` |
| Burbu | Ventixs | `figures/burbu.ts` | Burbuja de diálogo con tres puntos, sobre un disco oscuro con línea de señal | Cerámica tintada de verde; puntos de papel; señal `--color-burbu-signal` |
| Caja | Parati | `figures/gift.ts` | Caja con tapa algo más ancha, cinta con lazo y etiqueta | Cerámica tintada de rosa; cinta crema; ranura rosa emisiva |

Alfa tiene ojos: es la excepción a "sin caras". Los tokens `--color-burbu-body`, `--color-gift-body`, `--color-tool-body` y `--alfa-roughness`/`--*-metalness` describen el registro de Tripo; las figuras procedurales no los leen.

## Disposición en la peana (`PLINTH`, `FIGURES`)

- Peana de nogal de 50 × 10 × 3 cm con filete de latón, bajo el cono de la lámpara.
- Alfa al centro y algo atrás (es la más alta). SkyMek a la izquierda, Parati a la derecha, Ventixs delante en el centro.
- Las cuatro reciben el mismo cono; Alfa capta el punto más brillante.

## Gestos de foco

| Figura | Gesto |
|---|---|
| Alfa | Gira 20° en `company` y su señal sube |
| Figura de producto activa | Sube 2 cm y gira despacio; las otras quedan desenfocadas. SkyMek, producto estrella, tiene el plano más largo |

## Tripo: cómo generar cada modelo

Antes de generar: los prompts siguen el registro "pisapapeles de obsidiana", no el robot de Alfa ni los acabados cerámicos actuales. Decide cuál manda y ajusta el prompt.

1. **Entrada**: Text to 3D con el prompt de abajo. Si da formas raras, Image to 3D con una referencia: una captura de la figura actual (`?capture=<capítulo>`, vista frontal ¾, fondo gris) o una foto de un objeto real parecido (columna "Referencia").
2. **Opciones** si tu versión las ofrece: texturas PBR en la mejor calidad; ≈ 20 000 caras (triángulos); sin estilo artístico ("realistic"/none); exportar en **GLB**.
3. Genera 3 o 4 variantes y elige la de **silueta más limpia**; el color se corrige después.
4. Guarda el GLB en `assets-src/models/<nombre>.glb`. Limpieza en Blender: escala real, pivote en la base, partes separadas con nombre (columna "Nodos"), colores de los tokens, AO horneado y `bun run assets`.
5. Anota en `docs/3d/assets.md` el plan de Tripo usado: tiene que permitir uso comercial.

**Añade siempre al final del prompt:**

> Single object, centered, resting on its base, studio product shot, neutral grey background, soft even lighting. Clean hard-surface modeling, crisp bevels, realistic PBR materials, no text, no logos, no face, no eyes, no mouth.

**Negativo** (si Tripo lo admite): `cartoon, cute, chibi, character, eyes, face, arms, legs, toy, plastic, glitter, fur, text, logo, busy texture, multiple objects, base plate, ground plane`.

## Tripo: prompts de las figuras

| Modelo | Medidas | Prompt | Referencia | Nodos |
|---|---|---|---|---|
| **Alfa** (`alfa.glb`) | 12 cm × 8 cm | *A faceted obsidian desk sculpture, an elongated geometric gem cut like a monolith, polished black volcanic glass with sharp clean facets, encircled at 55% of its height by a thin brushed brass ring. A very thin groove on the inner face of the ring. Executive desk object, luxury paperweight, minimal and architectural.* | Pisapapeles de obsidiana facetado | `body` (obsidiana), `ring` (latón), `signal` (ranura del anillo, emisiva azul) |
| **Burbu** (`burbu.glb`) | 7 cm × 9 cm | *A matte ceramic desk object shaped like a softened speech bubble, a flattened rounded capsule with a short conical tail at the lower left, unglazed bisque ceramic in deep green, three small round recessed dots on the front. Minimal Scandinavian ceramic design, calm and premium.* | Cerámica mate escandinava | `body`, `dot-1`, `dot-2`, `dot-3` (emisivos verdes) |
| **Caja** (`gift.glb`) | 6 × 6 × 6 cm | *A small lacquered gift box with softly rounded edges, deep graphite satin lacquer, a slightly wider separate lid, wrapped with a flat satin ribbon cross in muted rose and a small neat flat bow. Luxury packaging miniature, jewellery box quality, minimal.* | Estuche de joyería lacado con cinta de raso | `body`, `lid` (se levanta), `ribbon`, `signal` (ranura bajo la tapa) |
| **SkyMek** (`tool.glb`) | 11 cm, sobre bloque de nogal de 4 × 2 × 1.5 cm | *A premium combination wrench miniature resting diagonally on a small walnut block, bead-blasted titanium finish, open hexagonal jaw on one end and ring on the other, an amber anodized aluminium grip band in the middle, a thin engraved groove along the handle. High-end workshop tool, precise machining, museum display object.* | Llave de titanio de gama alta | `body`, `band` (ámbar), `stand` (nogal), `signal` (ranura ámbar) |

Acabados objetivo: Alfa obsidiana `#10131A` (r 0.15, m 0) con anillo de latón `#B08A4A` (r 0.3, m 1) · Burbu cerámica `#1F6E52` (r 0.75) · Caja laca `#2A3142` (r 0.4) con cinta `#F28BA0` (r 0.35, m 0.05) · SkyMek titanio `#8C97A8` (r 0.38, m 1) con banda `#F0A43C` (r 0.4, m 0.6).

## Tripo: prompts de props

| Modelo | Medidas | Prompt | Referencia | Nodos |
|---|---|---|---|---|
| **Peana** (`plinth.glb`) | 50 × 10 × 3 cm | *A low rectangular walnut display plinth with softly eased edges and a thin inlaid brushed brass strip along the front face. Fine furniture craftsmanship, oiled walnut grain.* | Peana de nogal para relojes | `body`, `inlay` |
| **Teléfono** (`phone.glb`) | 147 × 71 × 8 mm | *A modern smartphone lying flat, face up, matte black aluminium frame, flat black glass front with thin even bezels, small camera bump on the back, no brand, no buttons details beyond the side keys.* | Smartphone genérico cenital | `body`, `screen` (plano exacto de la pantalla, sin textura: ahí va el HTML) |
| **Carpeta archivadora** (`folder.glb`) | 32 × 28 × 8 cm | *A wide-spine archival box file standing upright, linen-covered hardboard in a neutral color, a rectangular paper label holder on the spine, a metal finger ring pull on the spine. Office stationery, premium archival quality.* | Archivador de lomo ancho | `body`, `label`. Se genera una; se duplica 4 veces con `--color-folder-*` |
| **Carpeta abierta** (`folder-open.glb`) | 32 × 56 cm abierta | *An open archival folder lying flat on a desk with a few loose paper sheets inside, linen hardboard cover, neutral color.* | — | `body`, `sheet` |
| **Taza** (`mug.glb`) | Ø 8.5 × 9.5 cm | *A cylindrical matte stoneware coffee mug with a simple loop handle, warm off-white speckled glaze, filled with black coffee.* | Taza de gres mate | `body`, `coffee` |
| **Lámpara** (`lamp.glb`) | 55 cm con brazos | *A minimalist architect desk lamp, two straight arms with a hinge, round weighted base, conical shade, graphite anodized aluminium, warm light bulb visible inside the shade.* | Lámpara de arquitecto | `base`, `arm-1`, `arm-2`, `shade`, `bulb` (emisivo) |

Opcionales: telescopio refractor blanco con latón, planta en maceta de terracota, monitor de 27" de marco fino.

## Presupuesto por GLB

- Figuras: `high` ≤ 25 k tris con texturas de 1024 px; `mid` ≤ 8 k con 512 px. Props ≤ 15 k (`high`).
- Un material por objeto con atlas; las partes emisivas pueden ir aparte y se nombran `signal` o `dot-N`.
- Presupuesto global: `docs/3d/budget.md`.

## Aceptación visual (Carlos)

- [ ] Cada pieza parece un objeto real que se podría comprar, no un juguete.
- [ ] En el macro se aprecian los materiales.
- [ ] Juntas sobre la peana parecen una colección.
- [ ] La señal se ve, pero no compite con la lámpara.
