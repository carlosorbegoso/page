# Pruebas de humo (Playwright)

Qué cubre la suite `tests/smoke/` y cómo correrla; léelo antes de tocar `playwright.config.ts` o añadir una prueba.

## Correrla
- Con el servidor de desarrollo levantado en `http://localhost:4321/page/` (la config no arranca ninguno): `bun run test:smoke`.
- Chromium headless, un worker, sin reintentos; tarda entre 1 y 2 minutos. Una sola prueba: `bunx playwright test chapters -g experience`.
- La primera vez, o tras subir `@playwright/test`: `bunx playwright install chromium chromium-headless-shell`.
- Chromium se lanza con `--use-angle=metal --enable-gpu`: con SwiftShader `detectTier` da `none` y el 3D no arranca.
- Las capturas de los fallos quedan en `test-results/` (ignorado por git). No está en CI.

## Qué comprueba
| Archivo | Prueba |
| --- | --- |
| `tests/smoke/pages.spec.ts` | Inicio ES y EN y las páginas de lectura cargan con 200, `lang` correcto y sin errores de consola ni excepciones; una ruta desconocida da la página 404 con estado 404 |
| `tests/smoke/boot.spec.ts` | En el inicio, `html.is-3d` y `.boot[data-phase="done"]` en 25 s como máximo |
| `tests/smoke/chapters.spec.ts` | `?chapter=<id>` para hero, about, experience, company, products, contact y outro en vertical 390 × 740: una sola placa activa del capítulo, visible o sustituida por un objeto del 3D (impresa o recortada a 1 px), toda placa con `data-plate-printed` mide ~1 px y ninguna placa HTML visible se solapa con otra |

`tests/smoke/support.ts` junta los errores y espera el arranque; `tests/smoke/plates.ts` lee las cajas de las placas.

## Errores esperables
- Si otra sesión edita CSS mientras corre, Vite puede responder 500 o fallar el HMR y la prueba de errores de consola falla: vuelve a correrla.
