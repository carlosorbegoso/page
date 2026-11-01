# FX: postproceso cinematográfico y fluido

Qué hace cada pase del postproceso (`src/three/fx/`), sus valores, tiers, eventos y trampas; léelo antes de tocar bloom, DoF, grading, streak, fluido o emisivos del escritorio. Qué archivo editar: `docs/codemap/fx.md`.

## Dependencias y registro

- Sin `postprocessing` (pmndrs): declara `three < 0.187.0` y el proyecto usa 0.187.0. Pipeline propio: `WebGLRenderTarget` + `FullScreenQuad` de `three/addons/postprocessing/Pass.js`.
- `src/three/fx/index.ts` hace `registerFx(createFxPipeline())` al importarse; `src/three/stage/extensions.ts` lo carga con `import.meta.glob`.
- `src/three/stage/modules.ts`: `attachPointer`, `setTier`, `resize`, `precompile`, y por frame `render(...)`; devuelve `fx.settling` (fluido despierto, rack, grading en marcha o `dofAmount` sin llegar) para que el Stage siga pintando.
- `src/three/Stage.ts` llama `setFocus(world.focus(id, subIndex))` en `chapter:enter` y `chapter:settled`.
- Los RT se crean en el primer `render` y siguen a `renderer.getDrawingBufferSize()`.
- `precompile`: la clave del programa depende del RT enlazado (tone mapping, espacio de color). La escena se compila contra `targets.scene` y cada pase contra el RT donde dibuja, con la misma geometría de `FullScreenQuad` (position + uv, sin normal: los atributos entran en la clave). Compilar contra el canvas obliga a relinkar todo en el primer frame.
- `?debug` → `window.__fx.stats()`: tier, `gpuTimerTrusted`, ms por pase, `effectsMs`, recortes, `fluidAwake`, `dofAmount`, capítulo, buffer.

## Eventos (`window`)

| Evento | Efecto |
|---|---|
| `chapter:enter {id, duration}` | Grading al capítulo y **retiene la distancia de foco** `duration − 0.6 s` (tope 2 s, `HOLD_TIMEOUT_SECONDS`); el rack cae al final del viaje de cámara |
| `chapter:settled {id}` | Si sigue retenido, suelta y hace el rack (0.6 s, ease in-out) |
| `station:enter {id}` | Respaldo de grading mientras no llegue ningún `chapter:*` |
| `time:toggle` | Recalcula el grade del capítulo actual (día/noche) en 1.2 s |
| `motion:toggle`, `prefers-reduced-motion` | Vía `watchMotion` de `src/three/motion.ts`; ver "Reduced motion" |

## Orden de pases

fluido (si corre) → escena a RT HDR (HalfFloat, `DepthTexture`, MSAA según tier) → DoF a resolución reducida → bloom → streak → **composición única a pantalla** → capa tardía (`LATE_LAYER`).

## Valores (`settings.ts`, tokens `--fx-*` en `src/styles/tokens/stage.css`)

| Efecto | Implementación | Valor |
|---|---|---|
| Bloom | Umbral suave sobre luminancia HDR lineal + promedio Karis (contra fireflies) en el primer nivel; bajada de 13 taps (Jimenez 2014), subida en tienda | `--fx-bloom-strength` 0.32 (tope 0.6), radius 0.45, threshold 0.88, smoothing 0.1 |
| Streak anamórfico | Dos pasadas horizontales sobre `down[0]` a 1/(2·bloomDivisor): taps contiguos con re-umbral duro `uKeep` = 10 (solo filamento, antena, LEDs), luego stride 2.5 | strength 0.14, tinte frío |
| Rack focus (DoF) | Gather en disco áureo; las muestras de fondo se limitan al CoC del centro, así el fondo no sangra sobre el primer plano. Sin eventos de capítulo, un salto > medio rango dispara el mismo rack. z > 30 u (ciudad, estrellas) → CoC ≤ 0.3: son puntos de 1–2 px y un bokeh completo los vuelve manchas | radio = `--fx-dof-bokeh-scale` 2.5 × `grade.bokeh` × 3 × alto/1080 / dofDivisor |
| Aberración | Franja radial solo en esquinas (texto y sujeto limpios); 0 en modo día | 0.005 fijo (`--fx-chromatic-offset` existe pero no se lee) |
| Grading | Exposición × balance (`balanceGains`, preserva luma) × split toning sobre luma Reinhard (las altas HDR no saturan el peso), en lineal antes de ACES | tabla abajo |
| Tone mapping | `tonemapping_fragment` + `colorspace_fragment`: ACES y `toneMappingExposure` del renderer mandan; el grade multiplica encima | — |
| Contraste | Curva S después del tone mapping, `grade.contrast`; suelo de negro azulado | — |
| Viñeta | Después del tone mapping; `grade.vignette × --fx-vignette-darkness / 0.5` | offset 0.32 |
| Grano | Overlay mono, pesa más en sombras, semilla a 24 fps | `--fx-grain` 0.035 (tope 0.06) |

El texto DOM (CSS3D de monitor y teléfono, placas 2D) está encima del canvas: ningún efecto lo toca.

## Grading por capítulo (`grading.ts`, noche)

| Capítulo | Expos. | Temp. | Split | Contraste | Viñeta | Rango foco | Bokeh × | Transición |
|---|---|---|---|---|---|---|---|---|
| `intro` | 0.55 | −0.30 | 0.15 | 0.20 | 0.60 | 0.6 m | 1 | corte |
| `hero` | 1.00 | 0 | 0.38 | 0.22 | 0.55 | 0.6 m | 1 | 0.8 s |
| `about` | 1.00 | −0.08 | 0.25 | 0.15 | 0.45 | 0.6 m | 1 | 1.2 s |
| `company` | 1.04 | +0.18 | 0.50 | 0.30 | 0.60 | 0.3 m | 1.2 | 1.4 s tras 1.6 s de espera |
| `products` | 1.00 | +0.14 | 0.48 | 0.30 | 0.60 | 0.3 m | 1.2 | 1.2 s |
| `experience` | 0.96 | −0.22 | 0.20 | 0.20 | 0.60 | 0.25 m | 1.4 | 1.2 s |
| `contact` | 1.00 | −0.06 | 0.32 | 0.20 | 0.55 | 0.2 m | 1.2 | 1.2 s |
| `outro` | 1.30 | +0.35 | 0.20 | 0.15 | 0.35 | 0.8 m | 1 | 2.5 s |

- `delay` de `company` mantiene el grade viejo mientras viaja la cámara: el calor llega con el encendido de la lámpara.
- `GRADES_DAY` (con `html[data-time="day"]`) pisa exposición, temperatura, split, contraste y viñeta: nublado, más plano, claro y con menos viñeta; el calor vuelve hacia el anochecer.
- Sin eventos el grade es `hero`: el arranque nunca queda negro por el FX. El parpadeo de la lámpara del `intro` es del escenario.
- Id desconocido: conserva el grade actual.

## Regla de emisivos (escritorio)

- Bloom por luminancia: solo pantalla, lámpara y señales deben pasar 0.88 en HDR lineal. Las pantallas usan `SCREEN_HDR` 1.8 (`src/three/desk/set/screens.ts`, `src/three/desk/screens/monitorGlass.ts`).
- Todo lo demás (luz horneada, la taza bajo la lámpara) por debajo de 0.88.
- `toneMapped: false` no sirve con FX activo: todo pasa por ACES y un blanco 1.0 sale ≈ 0.8.
- `toneCompensation.ts`: durante el pase de escena cambia clear color y `scene.background` (`Color` o textura sRGB legible) por su inverso ACES (bisección por canal, hasta 0.95), para que el fondo caiga en su token. Sin esto el cielo nocturno se va a negro.

## Trampa NaN en GLSL

- `pow(x, y)` con `x < 0` da NaN; un NaN en el RT HDR se propaga por bloom y DoF y pinta un rectángulo negro.
- Base de `pow` siempre con `max(…, 0.0)` en materiales del escritorio.
- Bloom, streak y DoF filtran cada muestra con `finite()` (`isnan`/`isinf` → 0). No quitarlo.

## Capa tardía (`late.ts`)

- `LATE_LAYER` = 1: translúcidos que se dibujan después de DoF y bloom para que el lente no los embarre (vapor de la taza, `src/three/desk/atmosphere/steam.ts`).
- El canvas no tiene profundidad: los materiales tardíos prueban a mano contra `tSceneDepth` con `LATE_DEPTH_CHUNK` + `lateUniforms` (`lateOccluded()`).
- Tiers sin post: render directo con la capa tardía habilitada.

## Fluido (`fluid/`)

Stable fluids en GPU: splat en segmento → vorticidad (solo `high`) → divergencia → Jacobi sobre presión decaída → gradiente → advección, disipación 0.965 por frame a 60 Hz. Velocidad en UV/s indexada en **UV de pantalla**. No deforma la imagen final; solo la consumen lluvia en el vidrio, vapor de la taza y vidrio de la ventana (nunca texto ni placas).

- **Coste cero sin consumidores**: corre solo si hay al menos uno (`withFluidDisplacement`, `withFluidFragment` o `registerFluidConsumer()`); se da de baja con `dispose` del material o la función devuelta.
- `FluidField` llega en su propio chunk (`import('./field')` en `driver.ts`), fuera del primer frame.
- **Entrada** (`pointer.ts`): `pointermove` de ratón/lápiz y arrastre táctil (`touchmove`), sin giroscopio. El splat sigue al puntero con `--fx-pointer-damping` 0.06 por frame de 60 Hz.
- **Reposo**: energía < 0.01 UV/s → no simula, `uFluidActive = 0`. Congelado (ver abajo) → campo a cero.

### API (`src/three/fx/fluid`)

```ts
import { withFluidDisplacement, withFluidFragment, fluidUniforms, FLUID_PARS, FLUID_FRAGMENT_OFFSET, FLUID_VERTEX_DISPLACE, registerFluidConsumer } from '../fx/fluid';

withFluidDisplacement(steamMaterial); // vértices: se mece con el cursor (máx. 6 px)
withFluidFragment(glassMaterial);     // fragment: vec2 uv = vUv + fluidOffset();
```

- `withFluid*` parchea `onBeforeCompile` y añade `|fluid-vertex`/`|fluid-fragment` a `customProgramCacheKey`.
- `ShaderMaterial` a mano: `Object.assign(material.uniforms, fluidUniforms)` (mismos objetos, no copias: siguen la textura ping-pong sin re-enlazar), `FLUID_PARS` arriba, `FLUID_VERTEX_DISPLACE` tras escribir `gl_Position` o `FLUID_FRAGMENT_OFFSET` para `fluidOffset()`, y `registerFluidConsumer()`.
- `FLUID_VERTEX_PARS` es alias obsoleto de `FLUID_PARS`.

| Uniform | Tipo | Significado |
|---|---|---|
| `uFluidVelocity` | `sampler2D` | Velocidad UV/s (textura vigente; 1×1 neutra en reposo) |
| `uFluidScale` | `float` | UV/s → UV (`FLUID_DISPLACEMENT_SCALE` 0.006) |
| `uFluidMax` | `float` | Tope en UV: `FLUID_MAX_PX` 6 px CSS / alto del viewport |
| `uFluidActive` | `float` | 0 o 1 |
| `uFluidViewport` | `vec2` | Drawing buffer (para `gl_FragCoord`) |

## Tiers (`settings.ts`)

| | `high` | `mid` (móvil) | `low` / `none` |
|---|---|---|---|
| MSAA escena | ×4 | — | sin pipeline (render directo) |
| Bloom | 5 niveles desde 1/2 | 4 niveles desde 1/4 | — |
| Streak | sí | sí | — |
| DoF | 32 taps a 1/2 | 12 taps a 1/4; se apaga si pasa 3 ms GPU | — |
| Fluido | 256², 10 Jacobi, vorticidad | 128², 6 Jacobi | — |
| Presupuesto (`effectsMs`, sin `scene`) | 2.5 ms | 4 ms | — |

`guessTier()` (antes del `setTier` del Stage): `pointer: coarse` o ancho < 1024 → `mid`.

## Presupuesto GPU (`adapt.ts`, `gpuTimer.ts`)

- Evalúa cada 1 s con ≥ 20 muestras; dos evaluaciones seguidas sobre presupuesto recortan en orden **fluido → DoF**. Bloom nunca se recorta.
- `EXT_disjoint_timer_query_webgl2`. En ANGLE Metal (Chrome/Edge en macOS) mide tiempo de pared entre command buffers (3–4 ms para un pase de 0.2 ms): `gpuTimerTrusted: false`, se muestran pero no recortan. Safari no tiene temporizador.
- Donde no hay temporizador fiable, la red es el `DprController` del Stage.

## Costes medidos

Apple M4, Chrome headless-shell con ANGLE Metal, cada pase aislado con sincronía (mínimo de 4 rondas), ms. Medido antes de añadir streak, aberración y contraste; no remedido.

| Pase | high 1440×900 @1 | high 2880×1800 @2 | mid 390×844 @1 |
|---|---|---|---|
| Bloom | 0.51 | 0.64 | 0.27 |
| DoF | 0.10 | 0.13–0.19 | 0.09 |
| Composición | 0.15–0.30 | 0.22–0.32 | 0.09 |
| Fluido activo (reposo o sin consumidores: 0) | 0.45–0.50 | 0.45–0.50 | 0.38 |
| **Total** | **≈ 1.3** | **≈ 1.6** | **≈ 0.8** |

Móvil de gama media (GPU 10–15× más lenta): estimado 8–12 ms en `mid`, sin medir en dispositivo.

## Reduced motion, pausa y captura

Congelado = `prefers-reduced-motion`, `html[data-motion="paused"]`, puntero deshabilitado o `?capture=`:

- Fluido a cero y sin simular.
- Grano estático (semilla 0).
- Rack focus y transiciones de grading (amanecer incluido) instantáneos. La disolvencia de 300 ms de los cortes es del motor.
- Bloom, streak, viñeta y tone mapping siguen: son estáticos.
- `?capture=` así da frames deterministas.
