# Tipografía y escala

Fuentes Geist, carga, pesos y escala de texto (`--text-*`, `--tracking-*`); léelo antes de cambiar una fuente, un tamaño o el texto de los paneles 3D.

Valores: `src/styles/tokens/fonts.css` y `src/styles/tokens/scale.css`. Si algo difiere, manda el CSS.

## Familias (`--font-display`, `--font-sans`, `--font-mono`)

| Token | Familia | Archivo | Peso | Ejes |
|---|---|---|---|---|
| `--font-display` (h1–h4, cifras) | Geist variable | `public/fonts/geist-latin-wght.woff2` | 29 KB | wght 100–900 |
| `--font-sans` (texto, UI) | Geist variable (mismo archivo) | — | — | — |
| `--font-mono` (código) | Geist Mono variable | `public/fonts/geist-mono-latin-wght.woff2` | 23 KB | wght 100–900 |

- Licencia: `public/fonts/OFL-Geist.txt` (OFL 1.1).
- Por qué una sola familia: Geist es geométrica, técnica y muy legible en tamaños pequeños; display y texto comparten archivo, así el primer frame carga una sola fuente.
- Subset latin (`unicode-range` U+0000–00FF + puntuación general, €, ™, flechas): cubre á é í ó ú ü ñ ¿ ¡ « » “ ” — ·.

## Carga y fallback

- `font-display: swap`.
- Fallback métrico: `Geist Fallback` sobre Arial / Helvetica Neue / Roboto (`size-adjust` 101.8 %, `ascent-override` 98.7 %, `descent-override` 29 %); `Geist Mono Fallback` sobre Menlo / Consolas / Courier New.
- Preload solo de `geist-latin-wght.woff2` (en `src/layouts/Base.astro`).

## Pesos (`--font-weight-*`)

- 400 texto · 500 botones, labels, navegación · 600 títulos y énfasis · 700 solo si hace falta más masa en un titular.

## Texto en los paneles 3D (`--text-display`, `--text-body`, `--container-measure`)

Estilos en `src/styles/plates/loose.css`. Una sola escala en pantalla y un solo margen izquierdo por panel.

| Rol | Token | Valor |
|---|---|---|
| Titular (h1, h2, `.plate-display`) | `--text-display` | Geist 600, `clamp(40px, min(1.5rem + 4.69vw, 8.5vh), 96px)`: 72 px a 1024, 96 px a 1536; el `vh` lo frena en pantallas bajas. `--tracking-display` −0.035em, interlineado 1 |
| h3 | `--text-2xl` | Geist 600, `--tracking-tight` |
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

- `tracking-display` −0.035em: `text-3xl` en adelante.
- `tracking-tight` −0.012em: `text-xl`, `text-2xl`.
- `tracking-caps` 0.1em: etiquetas en mayúsculas `text-xs`.
- `--leading-tight` 1.15 · `--leading-snug` 1.35 · `--leading-normal` 1.65.
- Medida de lectura: `max-w-reading` (40rem ≈ 65–70 caracteres).
