# FX: pipeline cinematográfico y fluido del cursor

Código: `src/three/fx/` (`index.ts`, `pipeline.ts`, `fluid.ts`, `shaders.ts`, `settings.ts`, `gpuTimer.ts`, `toneCompensation.ts`). Dirección de arte: `docs/design/desk.md` §7 y `docs/design/constellation.md` (lista de efectos prohibidos). Valores: tokens `--fx-*` de `src/styles/tokens.css`.

## Dependencias

Ninguna nueva. `postprocessing@6.39.5` (pmndrs) declara `three >= 0.168.0 < 0.187.0` y el proyecto usa three 0.187.0, así que el pipeline es propio: `WebGLRenderTarget` + `FullScreenQuad` de `three/addons/postprocessing/Pass.js`.

## Registro en el Stage

`src/three/fx/index.ts` crea el pipeline y lo registra al importarse (`registerFx(createFxPipeline())`). El Stage ya lo carga con `import.meta.glob('./fx/index.ts')` y en cada frame llama a `setFocus(world.focusPoint())` y a `render(...)`. También llama a `attachPointer`, `setTier` y `resize`. Los recursos de GPU se crean en el primer `render`, y los render targets se redimensionan solos según `renderer.getDrawingBufferSize()`, así que un cambio de DPR no depende de que llegue `resize`.

Lo que todavía le falta al Stage:

1. **`settling`**: `CinematicFx.settling` es `true` mientras el fluido se mueve o el foco del DoF está en transición. Hay que sumarlo al `settling` del loop (`settling ||= fx.settling`). Si no, el loop a demanda se duerme y el remolino se queda congelado a medias.
2. **Foco en el hover**: `setFocus` recibe ahora `world.focusPoint()`. Para enfocar el cuerpo bajo el puntero, ese punto debería devolver el objeto en hover cuando lo haya.

Mientras no exista la estación del escritorio, `hero` se trata como "cuarto" (viñeta 0.5, bokeh 2.5, rango 0.6 m): es intencional, y la constelación C recibe ese grading hasta que llegue el módulo `desk`.

Para depurar, `?debug` expone `window.__fx.stats()`: tier, ms por pase, efectos recortados, estado del fluido y del DoF.

## Efectos (un pase final fusionado)

Orden por frame: fluido (si está despierto) → escena a un RT HDR (HalfFloat, `DepthTexture`, MSAA ×4 en `high`) → DoF a resolución reducida → cadena de bloom → **composición única a pantalla**.

| Efecto | Implementación | Valor |
|---|---|---|
| Bloom selectivo | Umbral suave sobre la luminancia HDR lineal: solo pasan los emisivos (núcleo de Alfa 3.2, bandas 1.4–2.2, lámpara y monitor), con promedio de Karis contra fireflies. 13 taps de bajada (Jimenez 2014) y tienda 3×3 de subida | strength `--fx-bloom-strength` 0.32 (tope 0.6), radius 0.45, threshold 0.88, smoothing 0.1 |
| Profundidad de campo | Gather en disco de ángulo áureo. Las muestras del fondo se limitan al CoC del centro, así el fondo no sangra sobre el primer plano nítido. El CoC se recalcula a resolución completa en la composición para bordes limpios. El cielo (z > 30 u) se limita a CoC 0.3 para no convertir estrellas de 1–2 px en manchas | bokeh 2.5 en el cuarto y 1.2 en el espacio; focusRange 0.6 m en el cuarto y 2.5 m en el espacio; transición del foco con τ 0.15 s (~600 ms) |
| Refracción fluida | La UV de la escena se desplaza según la velocidad del fluido, con un tope | máximo 2.5 px CSS |
| Aberración cromática | Radial: canales R/B desplazados solo cerca de los bordes (smoothstep 0.35→1). En el centro, cero | `--fx-chromatic-offset` 0.0006 |
| Tone mapping | `#include <tonemapping_fragment>` + `<colorspace_fragment>`: aplica el ACES y la `toneMappingExposure` del renderer y la salida sRGB. Una sola fuente de verdad | — |
| Viñeta | Fórmula de Eskil (como en pmndrs), después del tone mapping | darkness 0.5 en el cuarto → 0.3 en el espacio, offset 0.32 |
| Grano | Ruido mono con mezcla overlay, más visible en las sombras, a 24 fps | `--fx-grain` 0.035 (tope 0.06) |

**Compensación de tone mapping** (`toneCompensation.ts`): sin pipeline, three no aplica tone mapping al color de limpieza ni a los fondos sRGB (y tampoco a los materiales `toneMapped: false`). En un RT todo queda lineal y pasa por ACES en la composición, y el cielo nocturno se hundía a negro. Durante el pase de escena, el pipeline cambia el clear color y `scene.background` (`Color` o textura sRGB legible: canvas o imagen) por equivalentes ACES-inversos, cacheados por textura, versión y exposición. Medido: fondo directo `10,13,20` / `4,6,11` frente a `10,14,19` / `4,6,11` con FX.
**Regla para el motor y el escenario**: con FX activo, `toneMapped: false` no tiene efecto (p. ej. `common.ts` nodeMaterial, la pantalla de `desk/DeskStation.ts`). Esos materiales pasan por ACES: un blanco 1.0 sale ≈ 0.8 y menos saturado. Si deben verse "planos", hay que subirles la intensidad (valores HDR > 1, que además activan el bloom) en lugar de depender de `toneMapped: false`.

La mezcla cuarto/espacio sale de los eventos `station:enter`/`station:progress`: `hero` = cuarto (peso 1), y el peso baja a 0 cuando la cámara deja `hero`.

Las placas CSS3D van en otra capa del DOM: nunca reciben bloom, grano, aberración, desenfoque ni fluido.

## Fluido del cursor

Stable fluids en GPU sobre una rejilla cuadrada: splat (segmento con caída gaussiana, redondo en pantalla) → curl + confinamiento de vorticidad (solo `high`) → divergencia → presión (Jacobi) → resta del gradiente → advección. La disipación es 0.965 por frame a 60 Hz. La velocidad se guarda en **UV/s** (RG de un RT HalfFloat).

- **Entrada**: `pointermove` (ratón/lápiz) y `touchstart/touchmove` (arrastre del dedo, sin giroscopio), con listeners pasivos propios de `fx/`. El punto del splat sigue al puntero con `--fx-pointer-damping` 0.06 por frame, y eso es lo que da la estela lenta y "líquida". La fuerza tiene un tope de 4 UV/s.
- **Reposo**: con energía < 0.01 UV/s no se simula y `uFluidActive = 0`, así que no cuesta nada.
- **Congelado**: con `prefers-reduced-motion`, `html[data-motion="paused"|"reduced"]` (vía `watchMotion`, que escucha `motion:toggle`) o `pointer.enabled === false`, el campo se pone a cero, no se simula y la refracción desaparece.

### Uniforms para los materiales del motor

`import { fluidUniforms, withFluidDisplacement, FLUID_VERTEX_PARS, FLUID_VERTEX_DISPLACE } from '../fx'` (o `../fx/fluid`).

| Uniform | Tipo | Significado |
|---|---|---|
| `uFluidVelocity` | `sampler2D` | Velocidad en UV/s, indexada en **UV de pantalla**. Apunta a la textura ping-pong vigente (el objeto uniform es estable) |
| `uFluidScale` | `float` | UV/s → desplazamiento en UV (0.006) |
| `uFluidMax` | `float` | Tope en UV: 6 px CSS / alto del viewport |
| `uFluidActive` | `float` | 0 o 1. Con 0 no se muestrea |

Formas de enchufarlo (solo nebulosas, campo estelar y vidrio de la ventana; nunca texto ni placas):

```ts
withFluidDisplacement(nebulaMaterial); // parchea con onBeforeCompile, sirve para built-in y ShaderMaterial
```

o, a mano en un `ShaderMaterial` propio:

```ts
material.uniforms = { ...material.uniforms, ...fluidUniforms }; // mismos objetos, no copias
// vertexShader: FLUID_VERTEX_PARS arriba; FLUID_VERTEX_DISPLACE después de escribir gl_Position
```

El bloque desplaza `gl_Position` en espacio de pantalla: `uv = gl_Position.xy / gl_Position.w * 0.5 + 0.5`.

## Tiers

| | `high` | `mid` (móvil) | `low` / `none` |
|---|---|---|---|
| MSAA del RT de escena | ×4 | — | pipeline desactivado (render directo) |
| Bloom | 5 niveles desde 1/2 | 4 niveles desde **1/4** (media resolución del bloom de high) | — |
| DoF | 24 taps a 1/2 | 12 taps a 1/4; se apaga si cuesta > 3 ms GPU | — |
| Fluido | 256², 10 Jacobi, vorticidad | 128², 6 Jacobi, sin vorticidad | — |
| Presupuesto | efectos ≤ 2.5 ms GPU; si se pasa dos veces seguidas, se recorta en orden fluido → DoF → aberración; el bloom se queda | solo la regla del DoF | — |

`setTier` libera los RT y el fluido y los recrea en el siguiente frame con el perfil nuevo.

**Temporizador de GPU**: `EXT_disjoint_timer_query_webgl2`. En ANGLE Metal (Chrome/Edge en macOS) devuelve tiempo de pared entre command buffers (3–4 ms para un pase que cuesta 0.2 ms), así que ahí las cifras se muestran pero **no** recortan efectos (`gpuTimerTrusted: false`). Safari no tiene temporizador: allí el recorte no actúa, y la red de seguridad es el `DprController` del Stage, que mide el frame completo.

## Costes medidos

Apple M4, Chrome headless-shell 1243 con ANGLE Metal (GPU real, compartida con otras sesiones: hay ruido). Método: cada pase aislado 60 veces con `readPixels` de sincronía, mínimo de 4 rondas, sin la sobrecarga del framebuffer por defecto. Los ms del temporizador en esta plataforma no sirven (ver arriba).

| Pase | high 1440×900 @1 | high 2880×1800 @2 | mid 390×844 @1 |
|---|---|---|---|
| Escena → RT (referencia, no es FX) | 0.30 | 0.5–0.9 | 0.30 |
| Bloom | 0.51 | 0.64 | 0.27 |
| DoF | 0.10 | 0.13–0.19 | 0.09 |
| Composición | 0.15–0.30 | 0.22–0.32 | 0.09 |
| Fluido activo (en reposo ≈ 0) | 0.45–0.50 | 0.45–0.50 | 0.38 |
| **Total de efectos** | **≈ 1.3** | **≈ 1.6** | **≈ 0.8** |

`high` cabe en el presupuesto de 2.5 ms. En un móvil de gama media, una GPU unas 10–15 veces más lenta que el M4, `mid` debería quedar en unos 8–12 ms para un frame de 30 fps (33 ms): es una estimación, falta medirlo en un dispositivo real (Android Chrome tiene temporizador fiable y aplica la regla del DoF solo).

## Reduced motion / pausa

- Fluido: a cero y sin simular (no hay refracción ni desplazamiento de nebulosas).
- Grano: estático (semilla fija).
- Transiciones del foco del DoF y de la mezcla cuarto/espacio: instantáneas.
- Bloom, viñeta, aberración y tone mapping se mantienen: son estáticos.
