# Identidad visual: concepto, reglas de uso, monograma y OG

Punto de entrada del diseño: concepto, reglas de uso de la UI, tokens que lee el 3D, favicon y OG; léelo primero y salta desde aquí al archivo del tema.

Tokens en código: `src/styles/tokens/` (`fonts.css`, `colors.css`, `scale.css`, `stage.css`, `modes.css`). Si algo difiere, manda el CSS. Qué archivo editar: `docs/codemap/web.md`.

## Archivos de diseño

| Tema | Archivo |
|---|---|
| Colores, modos (claro, día) y contrastes | `docs/design/palette.md` |
| Fuentes Geist y escala de texto | `docs/design/type.md` |
| Espaciado, radios, capas, duraciones, pausa | `docs/design/spacing-motion.md` |
| Dirección de arte del escritorio 3D | `docs/design/desk.md` |
| Figuras de la peana y prompts de Tripo | `docs/design/mascots.md` |
| Voz y textos | `docs/copy/voice.md` |

## Concepto: "ingeniería en reposo"

- Superficies oscuras azul grafito, tipografía geométrica precisa y una sola señal de luz azul: un tablero de control bien diseñado, no un videojuego.
- Un acento de marca y nada compitiendo con él; los colores de producto son pequeños.
- Contraste alto y jerarquía tipográfica antes que decoración.
- Movimiento lento y amortiguado.

## Reglas de uso

1. **Texto sobre 3D**: suelto, sin cajas. Lo hacen legible un charco radial sin bordes (`--color-plate-pool`, 85 % de noche) y un halo por glifo (`--plate-text-halo`). Estilos en `src/styles/plates/` (`loose.css`, `anchored.css`, `surfaces.css`). `bg-scrim` (90 %) solo para UI fija (menús, hoja inferior). Sin `text-subtle` en texto suelto.
2. **Foco visible**: `shadow-focus` (anillo de dos tonos) u `outline: 2px solid var(--color-focus); outline-offset: 2px`, solo con `:focus-visible`. El anillo interior del color de fondo separa el foco de los botones `accent` (focus contra accent da 1.38:1) y del 3D.
3. **Objetivos táctiles**: ≥ 44 × 44 px (`min-h-tap`), ≥ 8 px entre contiguos.
4. **Botones**: primario `bg-accent text-on-accent` (hover `bg-accent-hover`); secundario `border border-border-strong text-text` sobre fondo sólido; terciario `text-accent` subrayado en hover. Un solo primario por vista.
5. **Estado de producto**: chip `text-xs` con punto `bg-status-live` / `bg-status-building` + la palabra ("En producción" / "En construcción") en `text-text`: el color nunca va solo.
6. **Colores de producto**: ver `palette.md`. Nunca en texto largo.
7. **Enlaces en texto**: `text-accent underline underline-offset-4 decoration-1`.
8. **`forced-colors: active`**: nada informativo en `background-image`; las tarjetas tienen `border` (transparente como mínimo) para que el sistema lo pinte.

## Tokens que lee el 3D (`--color-scene-bg`, `--scene-tone-exposure`, `--alfa-*`, `--fx-*`)

- El motor lee los tokens con `tokenNumber` / `getComputedStyle` (`src/three/tokens.ts`): colores hex de `colors.css` y números sin unidad de `stage.css` (intensidades, FX).
- Renderer: fondo `--color-scene-bg`, ACES, exposición base `--scene-tone-exposure` (1; 0.9 en claro) en `src/three/stage/renderer.ts`. La exposición y el color por capítulo los pone `src/three/fx/grading.ts`.
- Las intensidades de las luces del escritorio están en `src/three/desk/set/levels.ts`, no en tokens.
- Set, luces y FX: `desk.md`. Materiales de las figuras: `mascots.md`.

## Monograma y favicon (`public/favicon.svg`)

- Una "C" de trazo grueso abierta a la derecha y un nodo azul (`#5AA9FF`) en la apertura: Carlos + conexión/backend. Mismo rasgo que la línea de señal.
- Fondo `#0A0E14` con radio 14/64; legible a 16 px y dentro del 80 % central (el manifest lo declara `any maskable`).
- `theme-color` sale de `--color-bg` (`src/layouts/Base.astro` lo lee de `colors.css`).

## OG (`public/images/og-es.jpg`, `public/images/og-en.jpg`)

- 1200 × 630, ~58 KB cada una, JPEG mozjpeg q80. Las elige `meta.ogImage` en `src/i18n/<es|en>/meta.ts`; `meta.ogImageAlt` describe la tarjeta.
- Plantilla `docs/design/og/og.html` (Geist, barra de señal a la izquierda, nombre y rol sobre un degradado) con el plano del hero a la derecha.
- Se regeneran con `node docs/design/og/render.mjs` y el servidor de desarrollo levantado (`BASE_URL`, por defecto `http://localhost:4321/page/`): captura `[data-stage-canvas]` con `?capture=hero` a 1200 × 630 ×2 con la GPU real, lo pone en la plantilla y escribe las dos JPEG. `CHROMIUM_PATH` es opcional.
