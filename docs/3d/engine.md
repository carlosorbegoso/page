# Motor 3D: arranque, tiers, bucle y modos de prueba

Qué hace el Stage desde que carga la página hasta el primer frame, cómo degrada y qué parámetros de URL acepta; léelo antes de tocar `src/three/Stage.ts`, `src/three/stage/*`, `src/three/tier.ts` o `src/components/three/StageCanvas.astro`. Qué archivo edita cada cosa: `docs/codemap/stage.md`.

## Arranque (`StageCanvas.astro`)

- `[data-stage]` es fijo, `aria-hidden`, con un `<picture data-stage-fallback="hero">` (AVIF/WebP a 375, 768 y 1440, `fetchpriority="high"`): es el LCP y lo que queda si no hay 3D.
- Script inline: si hay WebGL2 y no hay `?tier=none`, `?capture` ni `saveData`, pone `html.stage-pending` (se quita a los 12 s o al degradar).
- Script del módulo: espera `load` y luego la primera interacción (`pointerdown`, `keydown`, `wheel`, `touchstart`, `scroll`) o 3 s; después `onIdle` → `detectTier()` → import dinámico de `src/three/index.ts` → `boot()`. Con `?capture` no espera y fuerza `high`.
- Mientras tanto corre el cargador 2D (`src/components/three/stage-loader/`), que emite y escucha `stage:progress {value}`.
- `chapter:enter` pone `[data-stage][data-moving]`; `chapter:settled` lo quita.

## Tiers (`detectTier`)

| Tier | Cuándo |
|---|---|
| `none` | `forced-colors`, `saveData`, sin WebGL2 (`failIfMajorPerformanceCaveat`) o render por software (SwiftShader, llvmpipe…) |
| `mid` | `pointer: coarse` o `innerWidth < 1024` |
| `high` | el resto |
| `low` | no se detecta: es la degradación en marcha |

- `?tier=` no salta `forced-colors` ni `saveData`: esas dos se comprueban antes del override.
- DPR: `high` empieza en `min(dpr, 2)` con escalones 1 / 1.25 / 1.5 / tope; `mid` empieza en 1 y sube hasta 1.5, y en reposo va a 30 fps (`frameDivisor 2`).
- `DprController`: baja un escalón si p75 > 1.5 × el intervalo de refresco; sube tras 3 s holgados; si ya está en el mínimo y p75 > 50 ms (`UNACCEPTABLE_FRAME_MS`) → `degrade('low')`.
- El intervalo de refresco se calibra 500 ms al arrancar (`calibrateRefreshInterval`, mediana acotada a 20–240 Hz).

## `Stage.start()`

1. `bootRenderer`: un `WebGLRenderer` (`alpha:false`, AA solo en `high` o captura, `stencil:false`, ACES, sRGB, `info.autoReset = false`, `preserveDrawingBuffer` solo en captura). El canvas lleva `data-stage-canvas`.
2. `bootScene`: `loadExtensions()` importa `src/three/desk/index.ts` y `src/three/fx/index.ts` por `import.meta.glob` (si fallan, se registra el error y sigue); `World` con cielo mínimo y luces de reserva que se apagan cuando hay escritorio.
3. `enterFirstShot`: lee `scrollY` **antes** de mover las placas (después forzaría un re-layout síncrono). Si la página está arriba y hay movimiento, empieza en `intro`; si no, en `hero`. Precompila shaders.
4. Primer frame **sin esperar a GSAP**; luego `chapters.startScroll()` (no corre con `?capture` ni `?chapter`).
- `stage:reveal {intro, lamp}` sale en el primer frame dibujado y pone `[data-ready="true"]`. La intro dura 2.4 s desde ese momento, no desde el boot: un arranque lento se comería el encendido.

## Bucle (`StageLoop`)

- Render a demanda (`invalidate()`); `setAnimationLoop` solo con la pestaña visible.
- Movimiento en reposo durante 8 s tras la última interacción (`IDLE_WINDOW_MS`), solo `high`/`mid`, sin reduced-motion ni captura.
- Resize solo si cambia el ancho o el alto más de 150 px (la barra de URL del móvil no re-mide).
- `webglcontextlost` → `degrade('context-lost')`; cambio de `data-theme` → relee tokens.
- Degradar quita placas y scroll, pone `[data-degraded="low|context-lost"]` y deja el fallback y el flujo normal de la página. Error de import → `[data-degraded="error"]`.

## Layout

| `layoutKind` | Ancho | FOV |
|---|---|---|
| `desktop` | ≥ 1024 | 30 |
| `tablet` | 768–1023 | 40 |
| `phone` | < 768 | 40; 52 si está apilado |

`stackedLayout` = `phone` y vertical. Al cambiar entre apilado y no apilado se remontan las placas.

## Clases y atributos que pone el motor

- `html.is-3d` (placas montadas), `html.stage-pending`, `html[data-story-nav="ready"]`.
- `[data-stage][data-tier]`, `[data-ready="true"]`, `[data-degraded]`, `[data-moving]`.
- Placas: ver `docs/3d/director.md` § Placas.

## Parámetros de URL

| Parámetro | Efecto |
|---|---|
| `?debug` | Overlay (FPS p75, DPR, draw calls, tris, memoria, caché de assets). `localStorage['stage:debug'] = '1'` lo deja fijo; métricas máximas en `localStorage['stage:metrics']`. |
| `?tier=none\|low\|mid\|high` | Fuerza el tier (salvo `forced-colors`/`saveData`). |
| `?chapter=<id>&sub=<n>` | Fija un capítulo y sub-plano; no monta el scroll. |
| `?capture=<id>&sub=<n>` | Frame determinista: tier `high`, AA, `preserveDrawingBuffer`, sin intro ni placas, lo diferido se carga antes del primer frame y `window.__captureReady` pasa a `true` un rAF después del revelado. |

`window.__stage` expone el Stage en consola.

## Fallbacks (`bun run capture`)

- `scripts/capture-fallbacks.ts`, con el servidor de desarrollo levantado (`--base`, por defecto `http://localhost:4321/page/`; `--station hero`).
- Playwright + `chrome-headless-shell` con la GPU real (ANGLE/Metal); `--swiftshader` de reserva. `CHROME_PATH` cambia el binario.
- Lee `[data-stage-canvas]` y escribe con `sharp` AVIF q50 / WebP q72 a 375×667, 768×1024 y 1440×900 con DPR 2 en `public/fallback/`. Tamaños y presupuesto: `docs/3d/budget.md`.
- Pide `&progress=1&w=<ancho>`, pero `boot()` ya no lee esos dos parámetros: no hacen nada.
- La pantalla del monitor sale vacía en el fallback: el texto es DOM, no WebGL.

## Medir FPS

`?debug` en el Android y el iPhone de Carlos. El emulador móvil del M4 no representa un teléfono real.
