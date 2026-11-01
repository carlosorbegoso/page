# Tipografía y escala

Fuentes (Bricolage Grotesque, Geist, Geist Mono, Caveat), carga, pesos y escala de texto (`--text-*`, `--tracking-*`); léelo antes de cambiar una fuente, un tamaño o el texto de los paneles 3D.

Valores: `src/styles/tokens/fonts.css` y `src/styles/tokens/scale.css`. Si algo difiere, manda el CSS.

## Familias (`--font-display`, `--font-sans`, `--font-mono`, `--font-hand`)

| Token | Familia | Archivo | Peso | Ejes |
|---|---|---|---|---|
| `--font-display` (h1–h4, cifras, tarjetas impresas) | Bricolage Grotesque variable | `public/fonts/bricolage-grotesque-latin-opsz-wght.woff2` | 71 KB | opsz 12–96, wght 400–700 |
| `--font-sans` (texto, UI) | Geist variable | `public/fonts/geist-latin-wght.woff2` | 29 KB | wght 100–900 |
| `--font-mono` (código) | Geist Mono variable | `public/fonts/geist-mono-latin-wght.woff2` | 23 KB | wght 100–900 |
| `--font-hand` (corcho, post-its) | Caveat 700 | `public/fonts/caveat-latin-700.woff2` | 27 KB | estática 700 |

- Licencias (OFL 1.1): `public/fonts/OFL-Geist.txt`, `OFL-BricolageGrotesque.txt`, `OFL-Caveat.txt`.
- Por qué Bricolage: grotesca con trazos de tinta y aperturas amplias; con el eje `opsz` el navegador elige el corte por tamaño (`font-optical-sizing: auto`), así el titular del monitor gana contraste y tensión y las cifras pequeñas siguen abiertas. Geist sigue en el texto porque es la más legible en el teléfono.
- Por qué Caveat: letra de mano autoalojada, igual en todos los dispositivos (antes caía en Bradley Hand, Marker Felt o Comic Sans según el sistema).
- Origen: paquetes `@fontsource-variable/*` 5.3.0 (`npm pack` en una carpeta temporal, sin dependencia en `package.json`). Bricolage se recortó con `fonttools varLib.instancer` a wght 400–700; Caveat se fijó en 700 y se le quitó `calt` (las alternativas contextuales costaban 23 KB y no se notan en textos de una o dos palabras). Ambas con `pyftsubset` al mismo `unicode-range` latin.
- Subset latin (`unicode-range` U+0000–00FF + puntuación general, €, ™, flechas ↑ ↓): cubre á é í ó ú ü ñ ¿ ¡ « » “ ” — ·. La → (U+2192) no está en el rango y sale de la fuente del sistema.

### Mano (`--font-hand`)

- Solo existe el 700: un `400` pedido en canvas resuelve al 700.
- `printFonts()` (`src/three/desk/notes/paper.ts`) lee el token; el primer dibujo del canvas pide la fuente y `whenFontsReady` redibuja cuando `document.fonts.ready` resuelve.
- Sin fallback métrico: solo se usa en canvas, que se redibuja; no hay layout que mover.

### Canvas y `opsz`

`context.font` no fija el eje `opsz`, así que el texto de las tarjetas, carpetas y la ficha del retrato usa el corte por defecto del archivo (opsz 96, el de titular). A los tamaños de canvas (32–84 px) se lee bien.

## Carga y fallback

- `font-display: swap`.
- Fallback métrico: `Bricolage Fallback` sobre Arial / Helvetica Neue / Roboto (`size-adjust` 101.7 %, `ascent-override` 91.5 %, `descent-override` 26.6 %); `Geist Fallback` sobre las mismas (101.8 %, 98.7 %, 29 %); `Geist Mono Fallback` sobre Menlo / Consolas / Courier New. Calculados con anchos medios de una frase real frente a Arial (fonttools).
- Preload de `bricolage-grotesque-latin-opsz-wght.woff2`, `geist-latin-wght.woff2` y `geist-mono-latin-wght.woff2` (en `src/layouts/Base.astro`): las tres aparecen en el hero. Caveat no se precarga.

## Pesos (`--font-weight-*`)

- 400 texto · 500 botones, labels, navegación · 600 títulos y énfasis · 700 solo si hace falta más masa en un titular.

## Texto en los paneles 3D (`--text-display`, `--text-body`, `--container-measure`)

Estilos en `src/styles/plates/loose.css`. Una sola escala en pantalla y un solo margen izquierdo por panel.

| Rol | Token | Valor |
|---|---|---|
| Titular (h1, h2, `.plate-display`) | `--text-display` | Bricolage 600, `clamp(40px, min(1.5rem + 4.69vw, 8.5vh), 96px)`: 72 px a 1024, 96 px a 1536; el `vh` lo frena en pantallas bajas. `--tracking-display` −0.02em, interlineado 1 |
| h3 | `--text-2xl` | Bricolage 600, `--tracking-tight` |
| Cuerpo | `--text-body` | 17 px, interlineado 1.6 |
| Eyebrow (el `p` antes de un título) | `--text-sm` | 600, `text-muted`, interlineado `--text-meta--line-height` |
| Medida | `--container-measure` | 60ch |

`--text-meta` (13 px, 1.4) queda para metadatos. Pantallas del monitor y del teléfono: `desk.md`, sección "Texto".

## Escala fluida (`--text-xs` … `--text-6xl`)

Para la UI fija (HUD, menús), el modo lectura y el 404. Las `clamp()` combinan `rem + vw`, así que respetan el zoom del navegador (WCAG 1.4.4).

| Token | 360 px | 1440 px | Interlineado | Uso |
|---|---|---|---|---|
| `text-xs` | 12 | 13 | 1.5 | Metadatos, legal |
| `text-sm` | 14 | 15 | 1.55 | Chips, labels, nav |
| `text-base` | 16 | 17 | 1.65 | Párrafos |
| `text-lg` | 18 | 20 | 1.6 | Entradilla |
| `text-xl` | 20 | 24 | 1.4 | Títulos de tarjeta |
| `text-2xl` | 24 | 32 | 1.25 | h3 |
| `text-3xl` | 30 | 44 | 1.15 | h2 de sección |
| `text-4xl` | 36 | 56 | 1.08 | Títulos grandes |
| `text-5xl` | 40 | 72 | 1.04 | Nombre (h1) del modo lectura |
| `text-6xl` | 48 | 92 | 1 | Sin uso hoy |

## Tracking y leading (`--tracking-*`, `--leading-*`)

- `tracking-display` −0.02em: `text-3xl` en adelante. Bajó de −0.035em con Bricolage: el corte opsz 96 ya viene apretado y a −0.035em la b y la a se tocan.
- `tracking-tight` −0.012em: `text-xl`, `text-2xl`.
- `tracking-caps` 0.1em: etiquetas en mayúsculas `text-xs`.
- `--leading-tight` 1.15 · `--leading-snug` 1.35 · `--leading-normal` 1.65.
- Medida de lectura: `max-w-reading` (40rem ≈ 65–70 caracteres).
