# Motor 3D — arquitectura, assets y mediciones

Estado: 2026-10-31. Concepto vigente: **"Constelación"** (`docs/design/constellation.md`) con texto en 3D (CSS3D) y escritorio del hero como módulo externo (`src/three/desk/**`).

## 1. Arquitectura

| Pieza | Archivo | Papel |
|---|---|---|
| Arranque (JS inicial, sin three) | `src/components/three/StageCanvas.astro` | Contenedor fijo `100lvh` `aria-hidden` + `<picture>` de fallback (LCP, `fetchpriority="high"`). Tras `load` espera la primera interacción/scroll o 3 s, luego `requestIdleCallback` (polyfill) → `detectTier()` → `import('src/three/index.ts')`. |
| Tiers y FPS | `src/three/tier.ts` | `none` (sin WebGL2, render por software, `saveData`, `forced-colors`), `mid` (`pointer: coarse` o < 1024 px), `high`; `low` = degradación posterior. Calibración del refresco (500 ms), muestreo p75, escalera de DPR (`high` ≤ 2, `mid` 1 → 1.5) y fallo solo si p75 > 50 ms (< 20 fps) a DPR mínimo. |
| Stage | `src/three/Stage.ts` | Un `WebGLRenderer` (`alpha:false`, AA solo `high`, `stencil:false`, ACES, sRGB). Loop con `setAnimationLoop` solo con pestaña visible; render a demanda; movimiento en reposo durante 8 s tras la última interacción; `mid` a 30 fps en reposo; resize solo si cambia el ancho o la altura > 150 px; `webglcontextlost` → fallback; `?debug`; `?capture`. |
| Mundo | `src/three/scenes/WorldScene.ts` (+ `Sky`, `Monogram`, `Nebula`, `OrbitMilestones`, `Beacon`, `stations.ts`) | Seis estaciones; la cámara recorre poses por estación con easing quíntico, arco, respiración de FOV y roll. Alrededor de Alfa la cámara gira en esfera (nunca la atraviesa). |
| Placas CSS3D | `src/three/plates.ts` | Mueve las `[data-plate]` a un `CSS3DObject` por estación (orden DOM intacto), 1 px CSS = 1 px de pantalla en la estación, vida (flotación, balanceo 1–3°, inclinación hacia el puntero, respiración), llegada/salida coreografiada, `data-active` / `data-dormant`. |
| Scroll | `src/three/scroll.ts` | GSAP + ScrollTrigger (import dinámico dentro del chunk 3D), `ignoreMobileResize`, `scrub: 0.8`, sin `pin` ni `normalizeScroll`. Sin scrub con reduced-motion o `data-motion="paused"|"reduced"`: saltos con fundido. |
| Navegación | `src/three/interaction.ts` | Raycast: hover (solo `pointer: fine`) → cursor + `scene:hover`; clic/tap → scroll a la placa o sección + `product:focus` / `experience:focus` con `source: 'scene'`. |
| Assets | `src/three/assets.ts` | Caché por URL con refcount y 5 s de gracia; `GLTFLoader` + `KTX2Loader` + Meshopt solo se descargan con el primer GLB. |
| Contratos | `src/three/contracts.ts` | `StationModule`, `registerStation()`, `FxPipeline`, `registerFx()`, `PointerField`, eventos `station:enter` / `station:progress`. El Stage importa `src/three/desk/index.ts` y `src/three/fx/index.ts` si existen. |

### Estaciones (desktop ≥ 1024 / móvil)

| Estación | Objeto en desktop | Placas desktop | Móvil/tablet |
|---|---|---|---|
| hero | derecha (constelación "C", Alfa en la apertura) | izquierda | objeto en el tercio superior, placa abajo |
| about | izquierda (nebulosa del stack) | derecha | ídem |
| company | derecha (Alfa + órbitas) | izquierda | ídem |
| products | izquierda (lunas; la cámara sigue a la enfocada) | derecha | ídem |
| experience | derecha (órbita 3.2 × 2.0, 18°) | izquierda | ídem |
| contact | izquierda (Alfa + faro) | derecha | ídem |

`data-plate-anchor` en la primera placa de una estación cambia el lado. Un `StationModule` con `getPlateAnchor()` coloca la placa donde diga (p. ej. la pantalla del monitor del escritorio).

### Alturas de sección (modo 3D)

No son fijas: `Plates` pone `min-height` en línea a cada `section[data-station]` = `100lvh + recorrido`, donde recorrido = `max(alto de la columna de placas − ventana visible, 0.35 × viewport)`. La ventana visible es 84 % del alto en desktop y 55 % (franja inferior) en móvil. Así el scroll recorre el texto 1:1; experiencia y productos salen más largas porque tienen más placas. Se recalcula con `ResizeObserver` (acordeones, fuentes) y en `resize`.

### Clases y atributos que añade el motor

- `html.is-3d` (modo 3D activo; se quita si se degrada).
- `.stage-plates` / `[data-stage-plates]`: raíz del `CSS3DRenderer` (fija, `z-index: var(--z-content)`), insertada en `<main>` antes de la primera sección.
- `.stage-plates__station[data-station-plates="<id>"]` (contenedor por estación) y `.stage-plates__column`.
- `section[data-station-spacer]`: secciones vaciadas que solo dan recorrido.
- En cada placa: `data-active` (la centrada en la estación actual) y `data-dormant` (estación a más de 1.5 de distancia, o fuera de la ventana en la estación activa). Las vecinas (±1) quedan enfocables: `focusin` lleva el scroll a su estación (instantáneo con reduced-motion/pausa).
- `[data-stage][data-ready="true"]` (canvas visible), `[data-tier]`, `[data-degraded="low|context-lost|error"]`.

## 2. Mascotas y GLB

Hoy son **procedurales** (`src/three/mascots/*`), según `docs/design/mascots.md`. Interfaz común `Mascot` (`types.ts`): `root` con pivote en la base, 1 u = 1 m, mirando a +Z; `setSignal()`, `setFocus()`, `update()`, `applyTokens()`, `dispose()`.

### Cómo reemplazar por GLB de Tripo

1. Limpiar en Blender y pasar el checklist de intake (abajo). Exportar `assets-src/models/<id>.glb` con `<id>` ∈ `alfa`, `burbu`, `gift`, `tool`.
2. Convención de nodos: la zona emisiva (línea de señal) usa un material con `emissive`; `lid` = tapa de la caja (se eleva al enfocar); `dot-0..2` = puntos de Burbu (se encienden en secuencia); `shadow` = plano de sombra horneada (si no existe se añade uno procedural; en el espacio no se usa).
3. `brew install ktx` (KTX-Software) y `bun run assets`. Genera `public/models/<id>.high.<hash>.glb` (≤ 25 k tris, 1024 px) y `<id>.mid.<hash>.glb` (≤ 8 k tris, 512 px), copia el transcoder Basis a `public/decoders/basis/` y reescribe `src/three/models.generated.ts`.
4. Nada más: `createMascot()` elige la variante por tier **antes del fetch** y usa el GLB si está en el manifiesto. Las escenas no cambian.

Pipeline verificado con un GLB sintético (esfera de 28.8 k tris): `high` ≤ 25 k tris (≈ 100 KB), `mid` 8 k tris / 30 KB, carga correcta en runtime (28 843 tris en `renderer.info`). Sin `ktx` instalado las texturas conservan su formato (aviso en consola).

### Checklist de intake por modelo

- [ ] Tris dentro del presupuesto (high ≤ 25 k, mid ≤ 8 k).
- [ ] 1 material + atlas (cuerpo + señal emisiva); texturas potencia de 2.
- [ ] UV sin solapes; AO horneado.
- [ ] Escala 1 u = 1 m, pivote en la base, mirando a +Z.
- [ ] Colores exactos de los tokens en el material.
- [ ] Licencia comercial de la herramienta IA anotada abajo.

| Modelo | Origen | Licencia | Tris high / mid | KB high / mid | Texturas |
|---|---|---|---|---|---|
| alfa | procedural | propia | 80 + 576 | — | ninguna |
| burbu | procedural | propia | ≈ 1.2 k | — | ninguna |
| gift | procedural | propia | ≈ 1.1 k | — | ninguna |
| tool | procedural | propia | ≈ 1.6 k | — | ninguna |

## 3. Fallbacks

`bun run capture` (con el servidor de desarrollo levantado) usa Playwright + `chrome-headless-shell` con la GPU real (ANGLE/Metal; `--swiftshader` de reserva), modo `?capture=hero&progress=1&w=<ancho>` (frame determinista, `preserveDrawingBuffer`, `window.__captureReady`), y `sharp` → AVIF q50 / WebP q72 a 375×667, 768×1024 y 1440×900 con DPR 2.

| Archivo | KB |
|---|---|
| hero-375.avif / .webp | 3.5 / 4.4 |
| hero-768.avif / .webp | 5.5 / 11.1 |
| hero-1440.avif / .webp | 7.5 / 16.5 |
| **Total** `public/fallback/` | **≈ 49** (presupuesto 600) |

## 4. Mediciones (2026-10-31)

`bun run build` (gzip -9):

| Chunk | gzip |
|---|---|
| JS inicial del 3D (`StageCanvas` script + `sections` + `preload-helper`) | 2.1 + 0.5 + 0.9 = **3.5 KB** |
| Chunk 3D de arranque: `three` (motor + escenas + CSS3D) 107.9 + `three.core` 69.1 + `gsap` 27.1 + `ScrollTrigger` 17.4 | **≈ 221 KB** (presupuesto 260) |
| Solo con GLB: `GLTFLoader` 13.3 + `KTX2Loader` 24.2 + `meshopt_decoder` 7.2 + `GlbMascot` 0.9 | +45.6 KB |

`?debug` contra `astro dev` en Chromium headless con GPU (Apple M4), máximo por estación (`renderer.info.render`), sin FX registrado:

| Estación | Draw calls | Triángulos |
|---|---|---|
| hero | 24 | 2.8 k |
| about | 19 | 2.8 k |
| company | 29 | 6.1 k |
| products | 17–19 | 3.5–4.5 k |
| experience | 16–19 | 3.2–4.2 k |
| contact | 24–29 | 3.6–4.8 k |

FPS: p75 16.7 ms (60 fps) en desktop `high` y 30 fps en reposo / 60 en scroll con `mid` (375×667, DPR 2 del emulador) en el M4. **No representa un móvil real**: QA debe medir en el Android y el iPhone de Carlos con `?debug` (métricas en `localStorage['stage:metrics']`).

## 5. Modos de prueba

- `?debug` — overlay (FPS p75, DPR, draw calls, tris, memoria, caché); `localStorage['stage:debug'] = '1'` lo deja activo.
- `?station=<id>` — fija una estación (sin scroll).
- `?tier=none|mid|high` — fuerza el tier.
- `?capture=<id>&progress=1&w=<ancho>` — frame determinista para el fallback.
