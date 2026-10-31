# Identidad visual — Carlos Orbegoso / TUSOCIO IA

Fuente de verdad en código: `src/styles/tokens.css`. Este documento explica los valores y sus reglas de uso; si algo difiere, manda el CSS.

## 1. Concepto

**"Ingeniería en reposo."** Superficies oscuras azul-grafito, tipografía geométrica precisa y una sola señal de luz azul: la estética de un tablero de control bien diseñado, no la de un videojuego. El 3D aporta profundidad y personalidad con objetos facetados de materiales satinados, cada uno marcado por una **línea de señal** luminosa (el rasgo común de la familia) en lugar de ojos o caras.

Principios:
- Un acento de marca (azul señal) y nada más compitiendo con él; los colores de producto son subordinados y pequeños.
- Contraste alto y jerarquía tipográfica antes que decoración.
- Movimiento lento, amortiguado y con propósito; nunca rebotes ni elasticidad.

## 2. Paleta

Modo oscuro = principal y por defecto. Modo claro = **opcional y solo por elección explícita** (`<html data-theme="light">`). No se activa con `prefers-color-scheme`: la imagen de fallback del hero (LCP, PLAN §3.4) se captura sobre el fondo oscuro y el presupuesto (≤ 600 KB) no admite un segundo juego; un modo claro automático mostraría una placa oscura sobre página clara. Si en el futuro se quiere automático, hay que capturar fallbacks claros y añadir el bloque `@media`.

Tailwind 4 genera utilidades a partir de cada token: `bg-bg`, `bg-surface`, `text-text`, `text-text-muted`, `border-border`, `border-border-strong`, `bg-accent`, `text-on-accent`, `ring-focus`, `bg-skymek-soft`, etc. La paleta por defecto de Tailwind está **anulada** (`--color-*: initial`): `bg-blue-500`, `text-white` o `bg-black` no existen, así se cumple "ningún color suelto" (PLAN §6.2). Siguen disponibles `transparent` y `current`.

### 2.1 Oscuro (por defecto)

| Token | Hex | Rol |
|---|---|---|
| `--color-bg` | `#0A0E14` | Fondo de página y del renderer 3D |
| `--color-surface` | `#111723` | Tarjetas, paneles, header |
| `--color-surface-raised` | `#18202E` | Hoja inferior, popovers, hover de tarjeta |
| `--color-border` | `#243042` | Divisores y bordes decorativos (no informativos) |
| `--color-border-strong` | `#6A7B94` | Bordes de controles (inputs, botón secundario, chips) |
| `--color-text` | `#E9EEF5` | Texto principal y títulos |
| `--color-text-muted` | `#9BA8BB` | Texto secundario, descripciones |
| `--color-text-subtle` | `#7D8BA0` | Metadatos (fechas, etiquetas pequeñas) — solo sobre superficies sólidas |
| `--color-accent` | `#5AA9FF` | Marca: CTA primario, enlaces, línea de señal |
| `--color-accent-hover` | `#86C0FF` | Hover/active del acento |
| `--color-accent-soft` | `#10233A` | Fondo tintado (chip activo, resaltado) |
| `--color-on-accent` | `#04101F` | Texto sobre `accent` |
| `--color-focus` | `#8CC8FF` | Anillo de foco |
| `--color-scrim` | `rgb(10 14 20 / 0.9)` | Panel detrás de texto que pisa el 3D |
| `--color-status-live` | `#4ADE9A` | "En producción" |
| `--color-status-building` | `#F5B94A` | "En construcción" |
| `--color-danger` | `#FF7A7A` | Error |

### 2.2 Claro (opt-in)

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `bg` | `#F5F7FA` | | `accent` | `#0A55BD` |
| `surface` | `#FFFFFF` | | `accent-hover` | `#084298` |
| `surface-raised` | `#FFFFFF` | | `accent-soft` | `#E6EFFC` |
| `border` | `#D9DFE8` | | `on-accent` | `#FFFFFF` |
| `border-strong` | `#7A8699` | | `focus` | `#0A55BD` |
| `text` | `#0D1320` | | `status-live` | `#0E7A45` |
| `text-muted` | `#4A5568` | | `status-building` | `#8F5A00` |
| `text-subtle` | `#5F6B7E` | | `danger` | `#C21F1F` |
| `scrim` | `rgb(245 247 250 / 0.9)` | | | |

En claro, `surface` y `surface-raised` son iguales: la elevación se expresa con `shadow-*` y `border`.

### 2.3 Acentos de producto (subordinados a la marca)

Se usan **solo** en: punto/indicador de la tarjeta, chip con el nombre del producto, borde superior de 2 px de la tarjeta y material de su mascota. Nunca en CTAs, nunca como fondo grande, nunca en el hero.

| Producto | Oscuro | Soft (oscuro) | Claro | Soft (claro) | Razón |
|---|---|---|---|---|---|
| SkyMek (`--color-skymek`) | `#F0A43C` ámbar | `#2A1E0E` | `#9A5A00` | `#FBF0E0` | Taller, metal, señalética industrial |
| Parati (`--color-parati`) | `#F28BA0` rosa coral | `#2C1820` | `#B4234A` | `#FCE8ED` | Celebración, regalo, cálido |
| Ventixs (`--color-ventixs`) | `#3FCF8E` verde | `#0E2A1F` | `#0E7A45` | `#E3F4EA` | Conversación, WhatsApp, venta cerrada |

TUSOCIO IA (marca madre) usa el acento de marca `--color-accent`.

### 2.4 Contrastes (WCAG 2.x, calculados)

Columna "scrim 90 %": peor caso teórico, scrim compuesto sobre **blanco puro** (oscuro) o **negro puro** (claro) detrás. En la práctica la escena es más oscura/clara que eso, así que los valores reales son mayores.

**Oscuro**

| Texto / UI | bg | surface | surface-raised | scrim 90 % |
|---|---|---|---|---|
| `text` | 16.59 | 15.39 | 14.02 | 13.05 |
| `text-muted` | 8.02 | 7.44 | 6.78 | 6.31 |
| `text-subtle` | 5.59 | 5.19 | 4.73 | 4.40 ✗ |
| `accent` | 7.88 | 7.31 | 6.66 | 6.20 |
| `accent-hover` | 10.13 | 9.39 | 8.56 | 7.97 |
| `status-live` | 11.24 | 10.43 | 9.50 | 8.84 |
| `status-building` | 10.98 | 10.18 | 9.28 | 8.64 |
| `danger` | 7.66 | 7.10 | 6.47 | 6.03 |
| `skymek` | 9.28 | 8.61 | 7.85 | 7.30 |
| `parati` | 8.27 | 7.67 | 6.99 | 6.50 |
| `ventixs` | 9.70 | 8.99 | 8.19 | 7.63 |
| `border-strong` (UI ≥ 3) | 4.49 | 4.16 | 3.79 | 3.53 |
| `focus` (UI ≥ 3) | 10.89 | 10.10 | 9.20 | 8.56 |

Otros pares: `on-accent`/`accent` 7.78 · `on-accent`/`accent-hover` 10.01 · `accent`/`accent-soft` 6.46 · `text`/`accent-soft` 13.61 · `skymek`/`skymek-soft` 7.81 · `parati`/`parati-soft` 7.13 · `ventixs`/`ventixs-soft` 7.69. `border`/`bg` 1.45 (decorativo, no informativo: exento).

**Claro**

| Texto / UI | bg | surface | scrim 90 % |
|---|---|---|---|
| `text` | 17.30 | 18.57 | 13.80 |
| `text-muted` | 7.01 | 7.53 | 5.59 |
| `text-subtle` | 5.03 | 5.40 | 4.01 ✗ |
| `accent` | 6.42 | 6.89 | 5.12 |
| `accent-hover` | 8.72 | 9.36 | 6.96 |
| `status-live` | 5.03 | 5.40 | 4.01 ✗ |
| `status-building` | 5.39 | 5.78 | 4.30 ✗ |
| `danger` | 5.58 | 5.98 | 4.45 ✗ |
| `skymek` | 5.10 | 5.47 | 4.07 ✗ |
| `parati` | 5.97 | 6.40 | 4.76 |
| `ventixs` | 5.03 | 5.40 | 4.01 ✗ |
| `border-strong` (UI ≥ 3) | 3.43 | 3.69 | 2.74 ✗ |
| `focus` (UI ≥ 3) | 6.42 | 6.89 | 5.12 |

Otros pares: `on-accent`/`accent` 6.89 · `on-accent`/`accent-hover` 9.36 · `accent`/`accent-soft` 5.95 · `skymek`/`skymek-soft` 4.86 · `parati`/`parati-soft` 5.46 · `ventixs`/`ventixs-soft` 4.73.

**Regla derivada**: sobre el scrim solo van `text`, `text-muted`, `accent`/`accent-hover` y el anillo de foco. Metadatos, estados, chips de producto y controles con borde van dentro de una tarjeta `bg-surface` sólida.

## 3. Tipografía

| Rol | Familia | Archivo | Peso de archivo | Ejes |
|---|---|---|---|---|
| Display (h1–h3, nombre, números) — `font-display` | **Sora** variable (OFL 1.1) | `public/fonts/sora-latin-wght.woff2` | 33 KB | wght 100–800 |
| Texto e interfaz — `font-sans` | **Inter** variable (OFL 1.1) | `public/fonts/inter-latin-wght.woff2` | 48 KB | wght 100–900 |
| Código — `font-mono` | Pila del sistema (`ui-monospace`, SF Mono, Menlo…) | — | 0 KB | — |

Por qué: **Sora** es geométrica, de aperturas amplias y formas técnicas pero cálidas; le da al nombre y a los títulos un carácter de producto tecnológico sin caer en lo futurista. **Inter** es la referencia de legibilidad en interfaces a tamaños pequeños, con cifras tabulares (`tabular-nums` para fechas del timeline). Las dos son variables: un archivo por familia cubre todos los pesos. Subset latin (U+0000–00FF + puntuación general): incluye á é í ó ú ü ñ ¿ ¡ « » “ ” — € ·. Licencias junto a las fuentes (`OFL-Sora.txt`, `OFL-Inter.txt`).

Pesos de uso: Sora 600 en títulos (700 solo en el nombre del hero si se quiere más masa); Inter 400 texto, 500 botones/labels/navegación, 600 énfasis.

Carga: `font-display: swap` + `@font-face` de fallback métrico (`Sora Fallback`, `Inter Fallback` sobre Arial/Helvetica/Roboto con `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` calculados de las tablas `hhea` y el ancho medio frente a Arial). **Preload solo de Sora** (fuente del título, PLAN §3.5).

### 3.1 Escala fluida (360 → 1440 px)

Todas las `clamp()` combinan `rem + vw`, así que respetan el zoom del navegador (WCAG 1.4.4).

| Token / clase | Mín (360 px) | Máx (1440 px) | Interlineado | Uso |
|---|---|---|---|---|
| `text-xs` | 12 px | 13 px | 1.5 | Metadatos, legal |
| `text-sm` | 14 px | 15 px | 1.55 | Chips, labels, nav |
| `text-base` | 16 px | 17 px | 1.65 | Párrafos |
| `text-lg` | 18 px | 20 px | 1.6 | Entradilla / subtítulo hero |
| `text-xl` | 20 px | 24 px | 1.4 | Títulos de tarjeta |
| `text-2xl` | 24 px | 32 px | 1.25 | h3 |
| `text-3xl` | 30 px | 44 px | 1.15 | h2 de sección |
| `text-4xl` | 36 px | 56 px | 1.08 | Títulos grandes |
| `text-5xl` | 40 px | 72 px | 1.04 | Nombre en el hero (h1) |

Tracking: `tracking-display` (−0.025em) para `text-3xl`+ en Sora; `tracking-tight` (−0.012em) para `text-xl`/`2xl`; `tracking-caps` (0.08em) para etiquetas en mayúsculas `text-xs`. Medida de línea: `max-w-reading` (40rem ≈ 65–70 caracteres).

## 4. Espaciado, layout, radios, elevación

- **Base**: `--spacing: 0.25rem` (escala Tailwind: `p-4` = 16 px). Ritmo preferido: 4, 8, 12, 16, 24, 32, 48, 64.
- **Fluidos**: `px-gutter` (16 → 40 px, margen lateral), `gap-stack` (24 → 40 px, entre bloques de una sección), `py-section` (64 → 128 px, entre secciones).
- **Objetivo táctil**: `--spacing-tap` = 44 px → `min-h-tap min-w-tap` en todo control interactivo.
- **Contenedores**: `max-w-reading` 40rem · `max-w-content` 72rem · `max-w-wide` 80rem.
- **Radios**: `rounded-xs` 4 px (chips de código) · `rounded-sm` 6 px (inputs, chips) · `rounded-md` 10 px (botones) · `rounded-lg` 16 px (tarjetas) · `rounded-xl` 24 px (hoja inferior, paneles scrim) · `rounded-pill` / `rounded-full`.
- **Elevación**: en oscuro la elevación se comunica sobre todo con el **paso de superficie** (`bg` → `surface` → `surface-raised`) + `border-border`; las sombras son un refuerzo. `shadow-sm` (controles), `shadow-md` (tarjeta en hover), `shadow-lg` (hoja inferior, menú). El color de sombra cambia por modo vía `--shadow-color` (por eso las sombras funcionan también en claro).
- **Capas** (`z-(--z-…)`): canvas 0 · contenido 10 · header 40 · hoja/menú 50 · skip link 60.

## 5. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--duration-instant` | 80 ms | Color de hover, presión |
| `--duration-fast` | 150 ms | Botones, foco, chips |
| `--duration-base` | 240 ms | Tarjetas, menú, tooltips |
| `--duration-slow` | 400 ms | Hoja inferior, reveals de sección |
| `--duration-scene` | 900 ms | Transiciones de cámara/escena 3D (GSAP) |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Por defecto |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas (reveal, hoja que sube) |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Salidas |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Cámara 3D, desplazamientos largos |

Uso en Tailwind: `transition-colors duration-(--duration-fast) ease-standard`. En GSAP: leer `--duration-scene` con `getComputedStyle` y equivalentes `power3.out` / `power2.inOut`.

Reveals: desplazamiento máximo 12–16 px + opacidad; nada de escalas > 1.02 ni rotaciones en la UI. Giro en reposo del 3D: ≤ 0.1 rad/s.

`prefers-reduced-motion: reduce` **o** `<html data-motion="reduced">` (botón "Pausar animación", WCAG 2.2.2):
- todas las `--duration-*` pasan a `0.01ms` (no `0`, para que `transitionend` siga disparando);
- `animation-duration`/`transition-duration` globales a `0.01ms`, `animation-iteration-count: 1`, `scroll-behavior: auto`;
- en 3D: sin giro continuo, sin parallax de puntero, sin `scrub` (fundidos con `toggleActions`), según PLAN §3.3.

## 6. Reglas de uso

1. **Texto sobre 3D**: siempre dentro de un panel `bg-scrim` (90 % de opacidad; el PLAN fija ≥ 60 % como **mínimo**, pero con 60 % `text-muted` cae a 2.1:1 en el peor caso, así que el valor de diseño es 90 %). Se permite `backdrop-blur-md` como refuerzo, nunca como sustituto. Ver regla derivada en §2.4.
2. **Foco visible**: anillo de dos tonos `shadow-focus` = `0 0 0 2px bg, 0 0 0 4px focus` (o `outline: 2px solid var(--color-focus); outline-offset: 2px`). El anillo interior del color de fondo separa el foco de botones `accent` (focus vs accent solo da 1.38:1) y del 3D. Solo con `:focus-visible`.
3. **Objetivos táctiles** ≥ 44×44 px (`min-h-tap`), separación ≥ 8 px entre objetivos contiguos.
4. **Botones**: primario `bg-accent text-on-accent` (hover `bg-accent-hover`); secundario `border border-border-strong text-text` sobre fondo sólido; terciario/enlace `text-accent` subrayado en hover. Un solo primario por vista.
5. **Estado de producto**: chip `text-xs` con punto `bg-status-live`/`bg-status-building` + texto en `text-text` (el color no es el único portador: siempre hay palabra "En producción"/"En construcción").
6. **Colores de producto**: ver §2.3. Nunca para texto largo.
7. **Enlaces** en texto: `text-accent underline underline-offset-4 decoration-1`, sin depender solo del color.
8. **`forced-colors: active`**: no usar `background-image` para información; los bordes de tarjeta deben existir (`border` transparente como mínimo) para que el sistema los pinte.

## 7. Valores para el 3D

Todos los colores que lee el motor son **hex literales** (Three.js `Color.setStyle` no interpreta `color-mix()` ni `var()` sin resolver). Se leen con `getComputedStyle(document.documentElement).getPropertyValue('--color-…').trim()`; si el usuario cambia `data-theme`, releerlos. Los números (rugosidad, metalness, intensidad) están como custom properties sin unidad: `parseFloat(...)`.

Renderer: `setClearColor(--color-scene-bg)` (= `--color-bg`, `alpha: false`), `ACESFilmicToneMapping`, `toneMappingExposure = --scene-tone-exposure` (1.0 oscuro / 0.9 claro), `SRGBColorSpace`.

| Elemento | Color base | Rugosidad | Metalness | Acento / emisivo |
|---|---|---|---|---|
| Red de nodos (líneas) | `--color-scene-line` `#24344D` | — | — | `LineBasicMaterial`, opacidad 0.6 |
| Nodos | `--color-scene-node` `#5AA9FF` | — | — | `MeshBasicMaterial`, 2–4 px en pantalla |
| **Alfa** (cuerpo) | `--color-alfa-body` `#2B3A52` | 0.38 | 0.60 | Línea de señal `--color-alfa-signal` `#5AA9FF`, `emissiveIntensity` 1.6 |
| **Burbu** (cuerpo) | `--color-burbu-body` `#1F6E52` | 0.55 | 0.10 | Señal `--color-burbu-signal` `#3FCF8E`, intensidad 1.2 |
| **Caja de regalo** (cuerpo) | `--color-gift-body` `#2A3142` | 0.62 | 0.05 | Cinta `--color-gift-ribbon` `#F28BA0`, rugosidad 0.30, metalness 0.70 |
| **Herramienta SkyMek** (cuerpo) | `--color-tool-body` `#8C97A8` | 0.32 | 0.85 | Banda `--color-tool-band` `#F0A43C`, rugosidad 0.45, metalness 0.20 |

Variables de material: `--alfa-roughness`, `--alfa-metalness`, `--alfa-signal-intensity`, `--burbu-*`, `--gift-*`, `--gift-ribbon-*`, `--tool-*`, `--tool-band-*`. En claro cambian los colores (ver `tokens.css`, bloque `[data-theme='light']`); los números se mantienen.

Iluminación sugerida coherente con la paleta: `RoomEnvironment` (high) con `environmentIntensity` 0.6–0.8, una direccional cálida-neutra `#FFF4E8` a ~2.5 lux desde arriba-izquierda, sin luces de color (el color lo ponen las señales emisivas). Bloom opcional (desktop high) con umbral alto para que solo brillen las líneas de señal.

## 8. Monograma, favicon y OG

- **Monograma**: una "C" de trazo grueso abierta hacia la derecha y un **nodo azul** en la apertura: Carlos + conexión/backend. Mismo rasgo que la línea de señal. `public/favicon.svg` (legible a 16 px, dentro del 80 % central para `maskable`).
- **OG**: `public/images/og-es.jpg`, `public/images/og-en.jpg` (1200×630, ~50 KB). Plantilla: `docs/design/og/og.html`; se regeneran con `CHROMIUM_PATH=<chrome-headless-shell> node docs/design/og/render.mjs` (Playwright + sharp, del `node_modules` del repo).
