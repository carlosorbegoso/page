# Paleta y contraste

Colores de la UI (oscuro, claro, día, productos) y sus contrastes WCAG; léelo antes de elegir un color o poner texto sobre un fondo nuevo.

Valores: `src/styles/tokens/colors.css` (oscuro y escena) y `src/styles/tokens/modes.css` (claro, día, pausa). Si algo difiere, manda el CSS. Colores del set 3D: `desk.md`.

## Reglas

- Un solo acento de marca (`--color-accent`, azul señal). Los colores de producto son subordinados y pequeños.
- Paleta de Tailwind anulada (`--color-*: initial`): `bg-blue-500`, `text-white` o `bg-black` no existen. Quedan `transparent` y `current`.
- Cada token genera utilidades: `bg-bg`, `bg-surface`, `text-text`, `text-text-muted`, `border-border-strong`, `bg-accent`, `text-on-accent`, `ring-focus`, `bg-skymek-soft`, etc.

## Modos (`data-theme`, `data-time`, `.is-3d`)

| Modo | Selector | Dónde |
|---|---|---|
| Oscuro | `:root` | Por defecto. La experiencia 3D es siempre oscura |
| Claro | `:root[data-theme='light']:not(.is-3d)` | Solo fuera del 3D. El modo lectura lo activa con `prefers-color-scheme: light` (`src/components/sections/reading/ReadingPage.astro`) |
| Día | `:root[data-time='day'].is-3d` | Botón de día/noche (`src/components/TimeToggle.astro`) |

Por qué el 3D no tiene modo claro: la imagen de fallback del hero (LCP) se captura sobre fondo oscuro y el presupuesto no admite un segundo juego; una página clara mostraría una placa oscura.

En día, sobre el 3D: `text-muted` `#B4BFCF`, `text-subtle` `#AAB6C8`, charco `--color-plate-pool` al 78 % y borde al 60 %. Son más claros que en noche, así que los contrastes de abajo siguen siendo el peor caso.

## Oscuro (por defecto)

| Token | Hex | Rol |
|---|---|---|
| `--color-bg` | `#0A0E14` | Fondo de página y del renderer |
| `--color-surface` | `#111723` | Tarjetas, paneles, header |
| `--color-surface-raised` | `#18202E` | Hoja inferior, popovers, hover de tarjeta |
| `--color-border` | `#243042` | Divisores decorativos (no informativos) |
| `--color-border-strong` | `#6A7B94` | Bordes de controles |
| `--color-text` | `#E9EEF5` | Texto principal |
| `--color-text-muted` | `#9BA8BB` | Texto secundario |
| `--color-text-subtle` | `#7D8BA0` | Metadatos, solo sobre superficie sólida |
| `--color-accent` | `#5AA9FF` | CTA primario, enlaces, línea de señal |
| `--color-accent-hover` | `#86C0FF` | Hover/active del acento |
| `--color-accent-soft` | `#10233A` | Fondo tintado (chip activo) |
| `--color-on-accent` | `#04101F` | Texto sobre `accent` |
| `--color-focus` | `#8CC8FF` | Anillo de foco |
| `--color-scrim` | `rgb(10 14 20 / 0.9)` | UI fija sobre el 3D |
| `--color-status-live` | `#4ADE9A` | "En producción" |
| `--color-status-building` | `#F5B94A` | "En construcción" |
| `--color-danger` | `#FF7A7A` | Error |
| `--color-plate-pool` / `-edge` | `rgb(4 6 11 / 0.85)` / `0.7` | Charco de oscuridad tras el texto suelto del 3D |

## Claro (fuera del 3D)

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

`surface` y `surface-raised` son iguales: en claro la elevación va con `shadow-*` y `border`.

## Acentos de producto (`--color-skymek`, `--color-parati`, `--color-ventixs`)

Solo en: punto de la tarjeta, chip con el nombre, borde superior de 2 px de la tarjeta y figura 3D. Nunca en CTAs, fondos grandes, el hero ni texto largo. TUSOCIO IA usa `--color-accent`.

| Producto | Oscuro | Soft oscuro | Claro | Soft claro | Por qué |
|---|---|---|---|---|---|
| SkyMek | `#F0A43C` ámbar | `#2A1E0E` | `#9A5A00` | `#FBF0E0` | Taller, señalética industrial |
| Parati | `#F28BA0` rosa coral | `#2C1820` | `#B4234A` | `#FCE8ED` | Celebración, regalo |
| Ventixs | `#3FCF8E` verde | `#0E2A1F` | `#0E7A45` | `#E3F4EA` | WhatsApp, venta cerrada |

## Contraste oscuro

"Scrim 90 %": peor caso teórico, scrim sobre blanco puro detrás.

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

Pares: `on-accent`/`accent` 7.78 · `on-accent`/`accent-hover` 10.01 · `accent`/`accent-soft` 6.46 · `text`/`accent-soft` 13.61 · `skymek`/`skymek-soft` 7.81 · `parati`/`parati-soft` 7.13 · `ventixs`/`ventixs-soft` 7.69. `border`/`bg` 1.45 (decorativo, exento).

## Contraste claro

"Scrim 90 %": scrim sobre negro puro detrás.

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

Pares: `on-accent`/`accent` 6.89 · `on-accent`/`accent-hover` 9.36 · `accent`/`accent-soft` 5.95 · `skymek`/`skymek-soft` 4.86 · `parati`/`parati-soft` 5.46 · `ventixs`/`ventixs-soft` 4.73.

## Regla derivada: qué va sobre el scrim

Sobre el scrim solo van `text`, `text-muted`, `accent`/`accent-hover` y el anillo de foco. Metadatos, estados, chips de producto y controles con borde van dentro de una tarjeta `bg-surface` sólida. En texto suelto del 3D no se usa `text-subtle`.

Contraste sobre pantallas del 3D (`--color-screen-bg` `#0B0F16`): `desk.md`, sección "Texto".
