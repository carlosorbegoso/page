# Presupuesto del 3D: chunks antes del primer frame y fallbacks

Cuánto pesa el 3D, qué se descarga antes del primer frame y qué llega después; léelo antes de añadir algo al escritorio, a FX o al chunk de arranque.

## Regla de los 260 KB

- 260 KB gzip cubren lo que se descarga **antes del primer frame del 3D**. Lo demás llega después y no lo retrasa.
- Margen medido: ~0.6 KB. Lo próximo que se añada al escritorio debe llegar después del primer frame (patrón de `src/three/desk/set/deferred.ts`).
- JS de arranque sin three (script de `StageCanvas` + `sections` + `preload-helper`): unos 3.5 KB.

## Chunks (`bun run build`, gzip -9 de `dist/_astro/*.js`, 2026-11-01)

| Chunk | KB | Cuándo se pide |
|---|---|---|
| `motion` (three.module + three.core) | 149.3 | arranque |
| `three` (Stage, director, placas, CSS3D) | 25.5 | arranque |
| `desk` | 71.6 | arranque |
| `fx` | 10.3 | arranque |
| `late` (capa tardía y parche del fluido) + `BufferGeometryUtils` + `contracts` | 2.7 | arranque |
| **Antes del primer frame** | **259.4** | |
| `gsap` 26.5 + `ScrollTrigger` 17.0 + `ScrollToPlugin` 1.6 | 45.1 | después del primer frame (`Stage.start` dibuja antes de `startScroll`) |
| `deferred` (carpeta para leer, escritorio de la laptop) | 7.5 | evento `stage:reveal` |
| `field` (simulación del fluido) | 1.9 | primer movimiento del puntero con el fluido activo |
| `GLTFLoader` + `KTX2Loader` + `meshopt_decoder` | sin medir | primer glTF (`acquireGltf`; hoy, el reloj) |

## Gotchas

- Hasta que llega `deferred`, la laptop muestra la pantalla de bloqueo y las carpetas no se pueden sacar: un clic queda en cola 5 s, y la apertura automática de experiencia funciona igual cuando llega. En `?capture` todo se carga antes del primer frame.
- `gsap/gsap-core` sin CSSPlugin no sirve: ScrollTrigger llama a `gsap.utils.checkPrefix`, que viene de CSSPlugin.
- Lo que más pesa en `desk` y se ve en el hero (no se puede diferir sin cambiar el primer frame): props (figuras, Pikachu, Charizard, cuarto) ≈ 66 KB sin comprimir, `life/**` ≈ 49 (incluye `life/pokemon` ≈ 15), `notes/**` ≈ 24 (corcho y tarjetas), `portrait/**` ≈ 15.
- `RectAreaLight` pesaba unos 100 KB: por eso el monitor ilumina con una `PointLight`.

## Fallbacks (`public/fallback/`)

Presupuesto de `scripts/capture-fallbacks.ts`: AVIF ≤ 60 / 100 / 150 KB a 375 / 768 / 1440 y ≤ 600 KB en total.

| Ancho | AVIF KB | WebP KB |
|---|---|---|
| 375 | 12.6 | 14.5 |
| 768 | 24.0 | 29.8 |
| 1440 | 48.6 | 60.7 |
| **Total** | | **≈ 190** |

## Draw calls

Se miden con `?debug` (`renderer.info` sin auto-reset: suma todas las pasadas de FX). Objetivo: < 50 por plano.
