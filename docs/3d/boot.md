# Pantalla de arranque: «Request → 200 OK → la oficina se enciende»

Qué hace la pantalla de carga (`src/components/three/boot/`), de dónde sale su progreso, sus tiempos y por qué; léelo antes de tocar el arranque, la intro del 3D o el HUD durante la carga.

## Piezas
| Qué | Dónde |
| --- | --- |
| Marcado (diagrama, paquete, respuesta, monograma, firma, `role="status"`) | `src/components/three/boot/BootScreen.astro` |
| Estilos, fases (`data-phase`), mobile vertical, reduced motion | `src/styles/boot/boot.css` |
| Progreso real → posición del paquete | `src/components/three/boot/progress.ts` |
| Tiempos de cada salida (normal, rápida, quieta, error) | `src/components/three/boot/timeline.ts` |
| Máquina de estados, salto, 503, visita en caliente | `src/components/three/boot/sequence.ts` |
| La intro del 3D espera a la pantalla | `src/three/stage/intro-gate.ts` |
| Clases iniciales, scroll arriba, puerta de interacción | script inline y de módulo de `src/components/three/StageCanvas.astro` |

## Cuándo aparece
- El script inline pone `html.booting` salvo con `?capture`, `?tier=none`, `saveData` o `forced-colors`: en esos casos la página carga normal, sin pantalla.
- Sin WebGL2 pone `html[data-webgl="none"]`: la pantalla pasa directo al 503.
- `history.scrollRestoration = 'manual'` y `scrollTo(0, 0)` si no hay hash: siempre se entra al Hero. Con hash (`#products`…) se hace la misma intro y la cámara viaja a esa sección.
- `html.booting [data-hud]` oculta el HUD; se quita 1,3 s después de abrir (`HUD_AFTER_OPEN_MS`), cuando la cámara ya llega al Hero.

## Progreso (nunca falso)
- El paquete solo avanza con eventos reales: `load` de la ventana, `stage:progress {value}` (0.3 al empezar el import del 3D; 0.55 / 0.7 / 0.78 / 0.88 / 0.96 en `Stage.start`) y `stage:assets {loaded, total}` de `DefaultLoadingManager` (`watchAssetLoads`).
- `RouteProgress` traduce el valor a la ruta: gateway → `quarkus-api` (renderer listo) → `kafka` (escena y assets) → `db` (shaders). Con más de un asset, la etiqueta muestra `GET /carlos · 3/7`.
- `stage:reveal {intro, lamp, monitor}` sale en el primer frame dibujado: ahí empieza la salida. `monitor` es el punto en pantalla del pie del vidrio del monitor (`surfaceFoot`), donde termina el monograma convertido en LED.

## La puerta de 3 s (no quitarla)
- En la primera visita el 3D espera a la primera interacción o 3 s después de `load`: es lo que mantiene TBT y Performance de Lighthouse (`docs/requirements.md`). Durante esa espera el paquete se queda en el gateway: es honesto.
- `sessionStorage['stage:warm']` se marca al abrir. En visitas siguientes de la sesión no hay puerta, y si del import al primer frame pasan menos de 600 ms (`FAST_LOAD_MS`) se usa la salida rápida.

## «200 OK · N ms»
`N` = tiempo desde que empieza el import del 3D (`stage:progress` 0.3) hasta el primer frame. No incluye la puerta de interacción.

## Salidas (`timeline.ts`)
| Salida | Cuándo | Secuencia |
| --- | --- | --- |
| Normal | carga ≥ 600 ms | el paquete vuelve rápido, `200 OK` con destello, el texto se contrae y se dibuja la «C», la «C» se encoge hasta el LED del monitor, se abre un círculo desde el monitor (`--boot-reveal`) y el 3D hace el dolly-in |
| Rápida | carga < 600 ms | un solo viaje veloz del paquete y la misma salida, más corta |
| Quieta | `prefers-reduced-motion` o `data-motion="paused"` | sin viajes ni morphing: `200 OK`, la «C» aparece con un fade y la pantalla se desvanece; el 3D empieza en el Hero sin intro |
| Error | sin WebGL2, render por software o `data-degraded="error"` | el paquete vuelve con `503 · Modo lectura` y a los 1,7 s `location.replace` al modo lectura |

- El 503 no redirige con `?tier=` (pruebas), `navigator.webdriver` ni user agents de bots o Lighthouse: así Google indexa la home y no el modo lectura.
- Esc o clic sobre la pantalla durante la salida la saltan (`stage:skip`).
- Seguridad: la pantalla se quita sola a los 15 s, y la intro del 3D se suelta a los 4 s aunque no llegue `stage:boot-open`.

## Intro del 3D
- `Stage.enterFirstShot` empieza en `intro` (el plano del Hero un 14 % más atrás, `INTRO_PULLBACK` en `src/three/stage/shots.ts`) si la página está arriba o hay un hash de capítulo.
- Con `html.booting`, la intro se retiene hasta `stage:boot-open`; después el director viaja al Hero (o al capítulo del hash). Sin la pantalla, la intro dura 2,4 s como antes.
- La luz del escritorio (`introLevels` en `src/three/desk/set/levels.ts`) arranca en el primer frame: el monitor ya está encendido (0,95–1,25 s) cuando el círculo se abre desde él a los 1,75 s.
- La pantalla está por encima del HUD y de las placas (`--z-sheet` + 5): no se ve ninguna placa sin colocar durante la carga.
