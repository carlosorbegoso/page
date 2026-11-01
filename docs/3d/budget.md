# Presupuesto del 3D: chunks antes del primer frame

Cuánto pesa el 3D, qué se descarga antes del primer frame y qué llega después; léelo antes de añadir algo al escritorio, a FX o al chunk de arranque.

## Regla de los 260 KB

- 260 KB gzip cubren lo que se descarga **antes del primer frame del 3D**. Lo demás llega después y no lo retrasa.
- Margen medido: ~2 KB tras pasar la vida de Pikachu y Charizard a `deferred` (−1.7 KB al arranque, 2026-11-01). Lo próximo que se añada al escritorio debe llegar después del primer frame (patrón de `src/three/desk/set/deferred.ts`).
- JS de arranque sin three (script de `StageCanvas` + `sections` + `preload-helper`): unos 3.5 KB.

## Chunks (`bun run build`, gzip -9 de `dist/_astro/*.js`, 2026-11-01)

| Chunk | KB | Cuándo se pide |
|---|---|---|
| `motion` (three.module + three.core; Rollup puede nombrarlo por otro módulo que lleve dentro, p. ej. `tokens`) | 148.8 | arranque |
| `three` (Stage, director, placas, CSS3D) | 25.9 | arranque |
| `desk` | 70.3 | arranque |
| `fx` | 10.3 | arranque |
| `BufferGeometryUtils` + `contracts` (la capa tardía ya va dentro de `fx`) | 1.8 | arranque |
| **Antes del primer frame** | **257.0** | |
| `gsap` 26.5 + `ScrollTrigger` 17.0 + `ScrollToPlugin` 1.6 | 45.1 | después del primer frame (`Stage.start` dibuja antes de `startScroll`) |
| `deferred` (carpeta para leer, escritorio de la laptop, persiana, impresos del teléfono vertical: corcho, tarjetas de producto con `product-shorts.json`, hoja de TCS, vida y batalla de Pikachu y Charizard) | 26.7 | evento `stage:reveal` |
| `field` (simulación del fluido) | 1.9 | primer movimiento del puntero con el fluido activo |
| `GLTFLoader` + `KTX2Loader` + `meshopt_decoder` | sin medir | primer glTF (`acquireGltf`; hoy, el reloj) |

## Gotchas

- Hasta que llega `deferred`, la laptop muestra la pantalla de bloqueo y las carpetas no se pueden sacar: un clic queda en cola 5 s, y la apertura automática de experiencia funciona igual cuando llega. En `?capture` todo se carga antes del primer frame.
- En teléfono vertical, el corcho y las tarjetas de producto se reimprimen con letra grande cuando llega `deferred` (antes muestran el impreso de escritorio; nadie está en esos planos todavía).
- La persiana (tela, barra, cadena) llega con `deferred`; el cajón es geometría del cuarto y la luz ya sale con la persiana guardada desde el primer frame. Con la persiana bajada en `sessionStorage`, la tela aparece al llegar el chunk.
- En `deferred` no uses `IcosahedronGeometry` u otras clases de three que el primer frame no usa: Rollup las mete en el chunk `motion` (+0.9 KB al arranque). `SphereGeometry`, `InstancedMesh` y `DataTexture` ya están.
- `gsap/gsap-core` sin CSSPlugin no sirve: ScrollTrigger llama a `gsap.utils.checkPrefix`, que viene de CSSPlugin.
- Lo que más pesa en `desk` y se ve en el hero (no se puede diferir sin cambiar el primer frame): props (figuras, Pikachu, Charizard, cuarto) ≈ 66 KB sin comprimir, `life/**` ≈ 34 (de `life/pokemon` solo queda `parts.ts`; la vida y la batalla llegan con `deferred`), `notes/**` ≈ 24 (corcho y tarjetas), `portrait/**` ≈ 15.
- `RectAreaLight` pesaba unos 100 KB: por eso el monitor ilumina con una `PointLight`.

## Pantalla de arranque

JS inicial de `src/components/three/boot/` ≈ 3.3 KB gzip (secuencia 2.2 + scripts de los componentes 1.1); CSS inline. No importa three ni GSAP.

## Draw calls

Se miden con `?debug` (`renderer.info` sin auto-reset: suma todas las pasadas de FX). Objetivo: < 50 por plano.

## Caché del navegador (`public/sw.js`)

GitHub Pages sirve todo con `max-age=600` y no deja cambiar cabeceras, así que la caché larga la da un service worker:

| Qué | Estrategia | Por qué |
| --- | --- | --- |
| `_astro/*` | cache-first (`immutable-v1`) | llevan hash en el nombre: nunca cambian |
| `models/`, `audio/`, `fonts/`, `images/`, `cv/`, favicon, manifest | stale-while-revalidate (`runtime-v1`) | nombres fijos: se sirven al instante y se actualizan en segundo plano |
| Navegación (HTML) | network-first, con la copia en caché si no hay red | el HTML siempre llega fresco tras un deploy; sin red, la página abre igual |

- Se registra 4 s después de `load` (`src/scripts/offline/register.ts`), solo en producción y nunca con `?capture`: la primera visita y Lighthouse no lo notan. A partir de la segunda visita el 3D sale de la caché.
- No cachea peticiones con `Range` (streaming de audio) ni de otros orígenes.
- `immutable-v1` guarda como mucho 160 archivos (`IMMUTABLE_MAX_ENTRIES`): al pasarse, borra los más antiguos, así los `_astro/*` de deploys viejos no se acumulan. Cambia `VERSION` solo para vaciar las dos cachés a la fuerza.
- El HTML se guarda por ruta sin query: `?tier=`, `?debug` o un utm no crean copias, y sin red cualquier variante abre la copia guardada.
- Un deploy nuevo no necesita tocar `public/sw.js`: los `_astro/*` cambian de nombre, el HTML es network-first y lo demás se revalida en segundo plano (llega en la visita siguiente). El navegador revisa `sw.js` sin la caché HTTP, así que un cambio en él se nota en la próxima navegación.
- Preloads del `<head>`: solo las dos fuentes (Geist y Geist Mono: la pantalla de arranque y el HUD usan la mono). Nada del 3D: lo frena a propósito la puerta de 3 s (`docs/3d/boot.md`).
