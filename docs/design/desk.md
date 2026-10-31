# Escritorio de noche — dirección de arte y FX

Inicio del recorrido antes de la constelación (`constellation.md`). Lo leen el Artista de escenario (`src/three/desk/**`) y el especialista FX (`src/three/fx/**`). Valores en `src/styles/tokens.css`: colores `--color-desk-*`, `--color-lamp*`, `--color-monitor-*`, `--color-moonlight`, `--color-window-*`, `--color-telescope*`; números `--lamp-*`, `--monitor-intensity`, `--moonlight-intensity`, `--desk-ambient-intensity`, `--fx-*`. Todos los colores son hex literales que se leen con `getComputedStyle`.

## 1. Concepto

**"La última hora de trabajo."** Es medianoche en el cuarto de Carlos. El monitor sigue encendido con su presentación (la placa del hero), la lámpara deja un círculo cálido sobre la madera y por la ventana se ve el cielo con la "C" y, muy lejos, Alfa. Es el mismo cielo al que vamos a volar: **el cuarto es el muelle de salida y la ventana es la puerta**.

Tono: íntimo, ordenado, adulto. Un estudio de diseño industrial de noche, no un "setup gamer". Sin RGB, sin pósters, sin desorden fotogénico.

Tres luces, tres temperaturas, una historia:
- **Lámpara (cálida, 2700 K)**: lo humano. Ilumina la mesa, la taza, la planta y las figuras.
- **Monitor (frío, azul de marca)**: el trabajo. Baña la cara frontal de la mesa y el teclado.
- **Luna/cielo por la ventana (frío plateado)**: lo que viene. Recorta siluetas (telescopio, planta, estantería) desde atrás.

## 2. Paleta nocturna

| Token | Hex | Uso |
|---|---|---|
| `--color-desk-wall` | `#121722` | Paredes: azul pizarra muy oscuro, mate (rugosidad 0.95) |
| `--color-desk-floor` | `#17140F` | Suelo: roble ahumado casi negro, rugosidad 0.7 |
| `--color-desk-wood` | `#5A3E2B` | Tablero de nogal, estantes |
| `--color-desk-metal` | `#2B313C` | Aluminio anodizado grafito: patas, brazo de la lámpara, soporte del monitor |
| `--color-desk-fabric` | `#232A3A` | Silla y alfombrilla (tela) |
| `--color-desk-ceramic` | `#E6E0D4` | Taza, maceta interior, figura de cerámica |
| `--color-desk-coffee` | `#2A1A10` | Café en la taza |
| `--color-desk-plant` | `#2F5A44` | Hojas (monstera/ficus pequeño), satinadas |
| `--color-desk-pot` | `#8C5A44` | Terracota apagada |
| `--color-desk-paper` | `#D8D2C4` | Libreta y lomos de libros claros |
| `--color-window-frame` | `#1A1F29` | Marco de ventana, metal mate |
| `--color-window-glass` | `#0B1220` | Tinte del vidrio (casi transparente) |
| `--color-telescope` | `#C9CED6` | Tubo del telescopio, blanco satinado |
| `--color-telescope-brass` | `#B08A4A` | Anillos y enfocador de latón cepillado |
| `--color-monitor-bezel` | `#0C0F14` | Marco del monitor y teclado |
| `--color-monitor-glow` | `#7FB8FF` | Color de la luz que emite la pantalla |
| `--color-lamp` | `#FFB566` | Luz de la lámpara (≈ 2700 K) |
| `--color-lamp-shade` | `#1D222B` | Pantalla de la lámpara, por fuera |
| `--color-moonlight` | `#9DB8E8` | Luz de luna/cielo que entra por la ventana |

Reglas de color:
- Cálido y frío se reparten por zonas: **cálido solo dentro del cono de la lámpara**, frío en todo lo demás. El cruce es en el teclado, donde se mezclan monitor y lámpara: es el punto de interés.
- Los únicos colores saturados son el acento de marca (pantalla, visor de Alfa en la figura) y las bandas de producto en las figuras. Todo lo demás está desaturado.
- Valor medio del cuadro muy bajo (≈ 12 % de luminancia); el contraste lo dan el círculo de la lámpara y la pantalla.

## 3. Props: forma, material y acabado

Escala real (1 u = 1 m). Mesa de 1.4 × 0.7 m a 0.74 m de alto, origen en el centro del tablero a ras del suelo. Presupuesto de toda la habitación: ≤ 60 k tris (`high`) y ≤ 20 k (`mid`), ≤ 12 draw calls con atlas, AO y luz de la lámpara **horneados** (lightmap 1024 px) para que en `mid` baste con una luz dinámica.

| Prop | Forma | Material (MeshStandard) |
|---|---|---|
| Habitación | Caja abierta: pared trasera con la ventana, pared izquierda con la estantería, suelo. Rodapié fino. Techo fuera de cuadro. | Pared `desk-wall` r 0.95 m 0 · suelo `desk-floor` r 0.7 m 0, normal de veta suave |
| Escritorio | Tablero de 3 cm con canto biselado; patas en trineo de aluminio. | Nogal `desk-wood` r 0.55 m 0 (veta en el albedo, 1024 px) · patas `desk-metal` r 0.35 m 0.8 |
| Monitor | 27", 16:9, marco de 6 mm, soporte de columna. **La pantalla es el anclaje de la placa `hero`** (CSS3D). | Marco `monitor-bezel` r 0.4 m 0.3 · pantalla: `MeshBasicMaterial` negro bajo la placa, con emisivo `monitor-glow` a 0.15 alrededor de la placa |
| Teclado y trackpad | Bajo perfil, teclas apenas sugeridas por normal map. | `monitor-bezel` r 0.5 m 0.2 |
| Lámpara | De arquitecto: base redonda, dos brazos y una pantalla cónica orientada hacia la mesa (izquierda del monitor). | `desk-metal` r 0.35 m 0.8 · interior de la pantalla emisivo `lamp` 2.0 · exterior `lamp-shade` r 0.6 |
| Taza | Cilíndrica con asa, café al 80 %. Vapor: 2 cintas de partículas muy tenues (solo `high`). | Cerámica `desk-ceramic` r 0.35 m 0 · café `desk-coffee` r 0.15 |
| Planta | Maceta de 14 cm con 7–9 hojas grandes. Se recorta contra la ventana. | Hojas `desk-plant` r 0.45, `transmission` no (coste); un toque de `sheen` solo en `high` · maceta `desk-pot` r 0.8 |
| Figuras | **Alfa** (12 cm), **Burbu** (7 cm) y **caja** (6 cm) como objetos de colección: las mismas formas de `mascots.md` §2 sobre una peana de nogal. Bajo la lámpara. | Los materiales de las mascotas; señales emisivas a la mitad de su intensidad del espacio (1.6 → 0.8) para que no compitan con el monitor |
| Estantería | 3 baldas flotantes en la pared izquierda: 6–8 libros, una caja, un objeto de latón, nada más. | Baldas `desk-wood` · libros `desk-paper`, `desk-fabric` y `desk-metal`, r 0.8 |
| Libreta y lápiz | Cerrada, junto al teclado. | `desk-paper` r 0.9 |
| Ventana | Grande, 1.6 × 1.1 m, detrás y a la derecha del monitor; marco fino de 4 cm con un parteluz vertical. **Sin vidrio con refracción**: plano con `window-glass` a opacidad 0.12 y un reflejo de la lámpara falso (textura). | Marco `window-frame` r 0.5 m 0.6 |
| Telescopio | Refractor blanco sobre trípode, junto a la ventana, apuntando al cielo hacia Alfa. Es el puente narrativo: la cámara pasa a su lado al salir. | Tubo `telescope` r 0.3 m 0.1 · anillos y enfocador `telescope-brass` r 0.35 m 1.0 · trípode `desk-metal` |
| Silla | Respaldo visible en primer plano, desenfocado (DoF). | `desk-fabric` r 0.9 |

Prohibido: luces LED de colores, figuras de anime, latas, cables desordenados, pósters, pantallas múltiples, marcas reales visibles.

## 4. Luz

| Luz | Tipo three | Color | Intensidad (unidades físicas) | Notas |
|---|---|---|---|---|
| Lámpara | `SpotLight` desde la pantalla de la lámpara hacia la mesa | `--color-lamp` | `--lamp-intensity` 28 cd, `angle` `--lamp-angle` 0.62 rad, `penumbra` `--lamp-penumbra` 0.75, `decay` 2 | Única luz con sombra en `high` (mapa de 1024, `radius` 4, `bias` −0.0005). En `mid`, horneada en el lightmap y la luz sin sombra. |
| Monitor | `RectAreaLight` del tamaño de la pantalla, mirando hacia el usuario | `--color-monitor-glow` | `--monitor-intensity` 5 nits | Solo `high` (requiere `RectAreaLightUniformsLib`); en `mid`, un `PointLight` de 0.6 cd delante de la pantalla. |
| Luna / cielo | `DirectionalLight` desde la ventana (arriba-derecha-atrás) | `--color-moonlight` | `--moonlight-intensity` 0.45 lux | Contraluz: recorta el telescopio, la planta y el respaldo. Sin sombra. |
| Relleno | `HemisphereLight` cielo `#1B2436` / suelo `#0A0806` | — | `--desk-ambient-intensity` 0.08 | Para que nada sea negro absoluto. |

Exposición en el cuarto: `toneMappingExposure` 1.1 (ACES); al salir por la ventana baja a 1.0 en el viaje. El cuarto se lee bien aunque esté oscuro porque las tres zonas de luz no se pisan.

## 5. Composición y encuadres

**Desktop (≥ 1024 px), plano de apertura**: cámara a 1.25 m de altura, 1.6 m detrás del borde de la mesa y un poco a la izquierda; FOV 30; mira al monitor. Monitor en el tercio central-izquierdo, con la placa del hero legible 1:1 (ver la fórmula de escala en `constellation.md` §2). La ventana ocupa el tercio derecho con la "C" visible a través. Lámpara a la izquierda, dentro de cuadro; respaldo de la silla en la esquina inferior izquierda, desenfocado. Horizonte de la mesa en el tercio inferior.

**Móvil (< 768 px), plano vertical**: cámara más alta (1.45 m) y más cerca, inclinada 12° hacia abajo; el monitor ocupa el ancho (la placa del hero es la pantalla, `min(92vw, 26rem)`). La ventana queda arriba, recortada, con la "C" asomando en la franja superior; la lámpara entra por el borde izquierdo. Sin silla ni estantería en cuadro (menos coste y menos ruido).

**Tablet**: el encuadre de desktop con FOV 34.

**Interacción con el cursor** (`pointer: fine`): la cámara se desplaza ±1.5° en yaw y ±0.8° en pitch hacia el puntero, amortiguado con `--fx-pointer-damping` 0.06 por frame (lerp), como si Carlos girara la cabeza. La lámpara no se mueve. En táctil: arrastre horizontal limitado a ±4° con retorno elástico suave (sin rebote).

## 6. Transición del cuarto al espacio

Cuatro tiempos ligados al scroll (`scrub: 0.8`):

1. **Despegue** (0–25 %): la cámara retrocede 0.5 m y gira hacia la ventana; la placa del hero pasa a `data-dormant`; el foco (DoF) salta del monitor a la ventana.
2. **La ventana** (25–55 %): avance hacia la ventana pasando junto al telescopio (que apunta en la misma dirección que la cámara: rima visual). El cuarto se oscurece (lámpara de 28 → 6 cd, exposición 1.1 → 1.0) y la "C" crece en el cristal.
3. **El umbral** (55–75 %): el marco de la ventana llena el cuadro y lo atraviesa. El vidrio no se rompe ni se distorsiona: simplemente se cruza. El último reflejo cálido de la lámpara en el marco se desvanece; desde aquí solo hay luz fría y la de Alfa.
4. **Espacio** (75–100 %): el cuarto se oculta (`visible = false`, liberar si hace falta) y la cámara entra en la pose de la estación `about` de la constelación.

Continuidad visual:
- **El cielo de la ventana es el cielo real**, no una textura: el `Points` estelar (centrado en la cámara) ya se ve a través del vidrio, así que no hay corte.
- La "C" y Alfa están en la misma posición de mundo que en `constellation.md`; el cuarto se construye **orientado** para que la ventana los encuadre.
- La pared (`#121722`) es del mismo tono azul pizarra que `--color-sky-horizon` (`#0A0E14`), solo un paso más clara: al oscurecerse el cuarto en el tiempo 2, el fundido al cielo no tiene saltos de tono.

## 7. Dirección de FX (nivel estudio, no "gamer")

Principio: **el post-procesado tiene que notarse solo si se quita.** Si alguien lo ve, sobra. Todo en un solo `EffectComposer` (pmndrs `postprocessing`, efectos fusionados en un pase) y **solo en `high`**; `mid` tiene únicamente viñeta y grano dentro del shader de tone mapping, y `low`/`none` nada.

| Efecto | Elegante | Valor | No hacer |
|---|---|---|---|
| **Bloom** selectivo | Solo brillan los emisivos: pantalla, interior de la lámpara, señales de mascotas, núcleo de Alfa | strength `--fx-bloom-strength` 0.32 · radius `--fx-bloom-radius` 0.45 · luminanceThreshold `--fx-bloom-threshold` 0.88 · smoothing 0.1 · mipmapBlur | Halo en superficies difusas, bloom > 0.6, todo "glow" |
| **Profundidad de campo** | Foco en la placa activa o el cuerpo en foco (`FxPipeline.setFocus`); en el cuarto el monitor, con la silla y la estantería suaves | bokehScale `--fx-dof-bokeh-scale` 2.5 (cuarto), 1.2 (espacio) · focusRange 0.6 m (cuarto) / 2.5 m (espacio) · transición del foco 600 ms `ease-in-out` | Desenfocar la placa que se lee, bokeh hexagonal llamativo, DoF en móvil |
| **Grano** | Película fina, animado a 24 fps, más visible en sombras | opacidad `--fx-grain` 0.035, blend `OVERLAY` | Grano > 0.06, ruido de colores, scanlines |
| **Aberración cromática** | Solo en los bordes del cuadro (radial), imperceptible en el centro | offset `--fx-chromatic-offset` 0.0006 · radialModulation true · modulationOffset 0.35 | Aberración en el centro, en el texto, o que aumente con la velocidad |
| **Viñeta** | Encierra la escena en el cuarto; en el espacio casi nada | darkness `--fx-vignette-darkness` 0.5 · offset `--fx-vignette-offset` 0.32 (cuarto) → darkness 0.3 (espacio) | Viñeta negra dura |
| **Tone mapping** | ACES (plan §3.2), exposición según §4 | — | Cambiar a mitad del recorrido |
| **SMAA** | Si el composer está activo (MSAA se pierde) | preset MEDIUM | FXAA (emborrona el texto del monitor) |

**Reacción fluida al cursor (a lo lusion)**, en orden de coste:
1. Parallax amortiguado de cámara (§5), siempre en `pointer: fine`.
2. Halo de Alfa y bandas de las lunas: +10 % de intensidad cuando el puntero está cerca de su proyección en pantalla (radio 120 px, lerp 0.08).
3. Solo `high` desktop: un campo de desplazamiento tipo fluido (simulación de 128×128 px) aplicado **solo a las nebulosas y al reflejo del vidrio de la ventana**, amplitud máxima 6 px, disipación 0.96. Nunca sobre las placas ni sobre el texto.

El CSS3D (placas) queda fuera del composer: el texto nunca recibe bloom, grano, aberración ni desenfoque. El DoF solo puede suavizar placas `data-dormant`.

**Reduced motion / pausa** (`prefers-reduced-motion` o `data-motion="paused"`): sin grano animado (estático), sin parallax de cursor, sin campo fluido, sin vapor de la taza ni respiración de luces; las transiciones de foco del DoF son instantáneas; el viaje cuarto → espacio se sustituye por un fundido cruzado de 400 ms (`--duration-slow`) entre el plano del escritorio y la estación `about`.

**Presupuesto**: composer ≤ 2.5 ms por frame en un M1 a 1440p con DPR 2. Si se pasa, se quita en este orden: campo fluido → DoF → aberración. El bloom es lo último que se quita.

## 8. Lista de revisión (Carlos)

- [ ] El cuarto se lee como "estudio sobrio de noche", no como setup gamer.
- [ ] La placa del hero en el monitor es nítida y legible (1:1, sin efectos encima).
- [ ] Se distinguen las tres temperaturas de luz y no se pisan.
- [ ] La ventana enseña la "C" y Alfa desde el primer frame.
- [ ] El paso por la ventana se siente continuo: sin cortes, destellos ni distorsiones.
- [ ] Si se apaga el post-procesado, la escena empeora un poco pero sigue siendo bonita.
