# FX: pipeline cinematográfico de "Una noche en el escritorio"

Código: `src/three/fx/` (`index.ts`, `pipeline.ts`, `grading.ts`, `fluid.ts`, `shaders.ts`, `settings.ts`, `gpuTimer.ts`, `toneCompensation.ts`). Dirección: sección final de `docs/PLAN.md`, `docs/REVIEW-direccion.md`, `docs/design/desk.md` §7. Valores: tokens `--fx-*` de `src/styles/tokens.css`.

## Dependencias

Ninguna nueva. `postprocessing@6.39.5` (pmndrs) declara `three >= 0.168.0 < 0.187.0` y el proyecto usa 0.187.0. El pipeline es propio: `WebGLRenderTarget` + `FullScreenQuad` de `three/addons/postprocessing/Pass.js`.

## Registro en el Stage

`src/three/fx/index.ts` crea el pipeline y lo registra al importarse (`registerFx(createFxPipeline())`). El Stage lo carga con `import.meta.glob('./fx/index.ts')` y en cada frame hace:

- `setFocus(world.focusPoint())`
- `render(...)`
- `settling ||= fx.settling`

También llama a `attachPointer`, `setTier` y `resize`. Los recursos de GPU se crean en el primer `render`, y los RT siguen solos a `renderer.getDrawingBufferSize()`.

### Eventos que escucha (en `window`, `detail: { id }`)

| Evento | Efecto |
|---|---|
| `chapter:enter` | Arranca la transición de grading al capítulo y **congela la distancia de foco** mientras viaja la cámara |
| `chapter:settled` | Rack focus (≤ 600 ms, ease in-out) desde la distancia retenida hasta el sujeto de `setFocus` |
| `station:enter` | Respaldo para el grading mientras el motor no emita eventos `chapter:*` |
| `motion:toggle` y `prefers-reduced-motion` | Ver "Reduced motion" |

Para depurar, `?debug` expone `window.__fx.stats()`: tier, capítulo, ms por pase, recortes, estado del fluido y del DoF.

## Efectos (un pase final fusionado)

Orden: fluido (solo si algún material lo consume y está despierto) → escena a un RT HDR (HalfFloat, `DepthTexture`, MSAA ×4 en `high`) → DoF a resolución reducida → bloom → **composición única a pantalla**.

| Efecto | Implementación | Valor |
|---|---|---|
| Bloom | Umbral suave sobre la luminancia HDR lineal, con Karis. 13 taps de bajada y tienda de subida. **Solo deben pasar el umbral la pantalla, la lámpara y las señales** (ver "Regla de emisivos") | strength 0.32 (tope 0.6), radius 0.45, threshold 0.88, smoothing 0.1 |
| Rack focus (DoF) | Gather en disco áureo. El fondo no sangra sobre el primer plano nítido. El foco se retiene durante la transición de cámara y se tira en ≤ 600 ms al asentarse. Sin eventos de capítulo, un salto de foco mayor que medio rango dispara el mismo rack. Los puntos lejanos (z > 30 u: ciudad o estrellas tras el vidrio) se limitan a CoC 0.3 | bokeh `--fx-dof-bokeh-scale` 2.5, rango 0.6 m |
| Grading por capítulo | Exposición × balance de blancos (temperatura) × split toning (sombras frías de la ventana, altas cálidas de la lámpara), en lineal antes del ACES | tabla abajo |
| Tone mapping | `tonemapping_fragment` + `colorspace_fragment`: el ACES y la exposición del renderer siguen siendo la fuente de verdad, y el grading multiplica encima | — |
| Viñeta | Eskil, después del tone mapping. La intensidad la da el capítulo, escalada por `--fx-vignette-darkness` / 0.5 | offset 0.32 |
| Grano | Ruido mono overlay, más visible en sombras, a 24 fps | 0.035 (tope 0.06) |

Quitados en esta dirección: la refracción del fluido en pantalla y la aberración cromática.

El texto (CSS3D en monitor y teléfono, y paneles 2D anclados) vive en el DOM, encima del canvas: no recibe ningún efecto, el DoF incluido.

### Grading por capítulo (`grading.ts`)

| Capítulo | Exposición × | Temperatura | Split | Viñeta | Transición |
|---|---|---|---|---|---|
| `intro` (encendido) | 0.55 | −0.30 (monitor frío, antes de la lámpara) | 0.10 | 0.60 | corte |
| `hero` | 1.00 | 0 | 0.20 | 0.50 | 0.8 s desde `intro` |
| `about` | 1.00 | −0.08 (el monitor llena el plano) | 0.15 | 0.45 | 1.2 s |
| `company` | 1.00 | +0.12 (bajo la lámpara) | 0.25 | 0.55 | 1.2 s |
| `products` | 1.00 | +0.14 | 0.25 | 0.55 | 1.2 s |
| `experience` | 0.98 | +0.04 | 0.20 | 0.50 | 1.2 s |
| `contact` | 1.00 | −0.06 (pantalla del teléfono) | 0.20 | 0.50 | 1.2 s |
| `outro` (amanecer) | 1.30 | +0.35 | 0.10 | 0.30 | **2.5 s** |

Sin eventos de capítulo, el grade es el de `hero`, así que el arranque nunca queda negro por culpa del FX. El parpadeo de la lámpara del `intro` es del escenario: el FX solo pone la base fría y oscura y la abre al entrar en `hero`.

### Regla de emisivos (para el escenario)

El bloom es por luminancia. Para que solo brillen la pantalla, la lámpara y las señales:
- Esos tres deben estar en HDR por encima de 0.88. La pantalla del monitor hoy es `MeshBasicMaterial` con `toneMapped: false` y valores ≤ 1, así que **no brilla**: hay que multiplicar su color por 1.5–2 (o pasar a emisivo con intensidad > 1).
- Todo lo demás (superficies con luz horneada, la taza bajo la lámpara) debe quedar por debajo de 0.88 en lineal.
- `toneMapped: false` no tiene efecto con FX activo: todo pasa por ACES, y un blanco 1.0 sale ≈ 0.8.

**Compensación de tone mapping** (`toneCompensation.ts`): el clear color y `scene.background` (`Color` o textura sRGB legible) se sustituyen durante el pase de escena por equivalentes ACES-inversos, para que el fondo caiga exactamente en su token.

## Fluido (solo lluvia en el vidrio, vapor de la taza y vidrio de la ventana)

Stable fluids en GPU (splat en segmento → vorticidad solo en `high` → divergencia → Jacobi → gradiente → advección, disipación 0.965 por frame). La velocidad se guarda en UV/s, indexada en **UV de pantalla**. Ya no deforma la imagen final.

- **Coste cero si nadie lo usa**: la simulación solo corre si hay al menos un material consumidor registrado (`withFluidDisplacement`, `withFluidFragment` o `registerFluidConsumer()`). La baja es automática al disparar `dispose` del material, o con la función devuelta.
- **Entrada**: ratón/lápiz (`pointermove`) y arrastre del dedo (`touchmove`, sin giroscopio). El splat sigue al puntero con `--fx-pointer-damping` 0.06.
- **Reposo**: con energía < 0.01 UV/s no simula y `uFluidActive = 0`.

### API para `src/three/desk/`

```ts
import { withFluidDisplacement, withFluidFragment, fluidUniforms, FLUID_PARS, FLUID_FRAGMENT_OFFSET, FLUID_VERTEX_DISPLACE, registerFluidConsumer } from '../fx/fluid';

withFluidDisplacement(steamMaterial); // vértices: el vapor se mece con el cursor (máx. 6 px)
withFluidFragment(rainGlassMaterial); // fragment: fluidOffset() disponible en el shader
// en el fragment del vidrio: vec2 uv = vUv + fluidOffset(); texture2D(rainNormal, uv) ...
```

`ShaderMaterial` a mano: `Object.assign(material.uniforms, fluidUniforms)` (mismos objetos, no copias). Después, `FLUID_PARS` arriba, y `FLUID_VERTEX_DISPLACE` tras escribir `gl_Position` o `FLUID_FRAGMENT_OFFSET` para usar `fluidOffset()`. Hay que llamar a `registerFluidConsumer()`.

| Uniform | Tipo | Significado |
|---|---|---|
| `uFluidVelocity` | `sampler2D` | Velocidad en UV/s por UV de pantalla (textura ping-pong vigente) |
| `uFluidScale` | `float` | UV/s → UV (0.006) |
| `uFluidMax` | `float` | Tope en UV: 6 px CSS / alto del viewport |
| `uFluidActive` | `float` | 0 o 1 |
| `uFluidViewport` | `vec2` | Tamaño del drawing buffer (para `gl_FragCoord`) |

## Tiers

| | `high` | `mid` (móvil) | `low` / `none` |
|---|---|---|---|
| MSAA del RT de escena | ×4 | — | pipeline desactivado (render directo) |
| Bloom | 5 niveles desde 1/2 | 4 niveles desde 1/4 | — |
| DoF | 24 taps a 1/2 | 12 taps a 1/4; se apaga si cuesta > 3 ms GPU | — |
| Fluido | 256², 10 Jacobi, vorticidad | 128², 6 Jacobi ("si cabe") | — |
| Grading, viñeta, grano | sí | sí | — |
| Presupuesto de efectos | 2.5 ms → recorta fluido → DoF | 4 ms → recorta fluido → DoF | — |

**Temporizador de GPU** (`EXT_disjoint_timer_query_webgl2`): en ANGLE Metal (Chrome/Edge en macOS) infla los tiempos 10–20 veces, así que ahí no recorta (`gpuTimerTrusted: false`). Safari no tiene temporizador. Los recortes solo actúan donde el temporizador es fiable (Chrome en Android, Windows); en el resto, la red es el `DprController` del Stage.

## Costes medidos

Apple M4, Chrome headless-shell con ANGLE Metal, cada pase aislado con sincronía (mínimo de 4 rondas). Medido antes del cambio de dirección; la composición actual hace menos (sin aberración ni refracción), y el grading añade unas pocas operaciones ALU.

| Pase | high 1440×900 @1 | high 2880×1800 @2 | mid 390×844 @1 |
|---|---|---|---|
| Bloom | 0.51 | 0.64 | 0.27 |
| DoF | 0.10 | 0.13–0.19 | 0.09 |
| Composición | 0.15–0.30 | 0.22–0.32 | 0.09 |
| Fluido activo (en reposo o sin consumidores: 0) | 0.45–0.50 | 0.45–0.50 | 0.38 |
| **Total** | **≈ 1.3** | **≈ 1.6** | **≈ 0.8** |

En un móvil de gama media (GPU unas 10–15 veces más lenta) calculo 8–12 ms para `mid`, sin medir en dispositivo.

## Reduced motion / pausa

- Fluido: a cero y sin simular.
- Grano: estático.
- Rack focus y transiciones de grading (amanecer incluido): instantáneos. La disolvencia de 300 ms de los cortes es del motor.
- Bloom, viñeta y tone mapping se mantienen: son estáticos.
