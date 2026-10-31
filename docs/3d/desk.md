# Escritorio de noche — estación `hero` (implementación)

Dirección de arte: `docs/design/desk.md`. Código: `src/three/desk/**`. Se registra solo: el Stage importa `src/three/desk/index.ts` y su `install()` llama a `registerStation('hero', new DeskStation())`.

## 1. Archivos

| Archivo | Qué hace |
|---|---|
| `index.ts` | `install()` (registro) y reexporta `DeskStation`, `DeskPick`, `DESK_PHASES`. |
| `DeskStation.ts` | `StationModule`: carga, luces, ancla de la placa, poses de cámara, hover, visibilidad por progreso. |
| `layout.ts` | Medidas y posiciones (espacio local del cuarto) y `deskWorldMatrix()` (cuarto → mundo). |
| `props.ts` | Geometría procedural de cada prop y la paleta leída de los tokens. |
| `builder.ts` | `PartBuilder`: fusiona primitivas con color, rugosidad, metalness, emisión, veta e id de objeto por vértice. |
| `materials.ts` | Material "atlas" (`onBeforeCompile`), env map nocturno horneado, texturas generadas (pantalla, vidrio, sombras de contacto). |
| `camera.ts` | Pose de lectura 1:1 y trayectoria Hermite hacia la ventana y `about`. |
| `preview.ts` | `mountDeskPreview(container)`: render aislado con cielo de prueba y marcadores en la "C" y Alfa (solo revisión; no lo importa la app). |

## 2. Coordenadas y orientación

- Espacio local: 1 u = 1 m, +Y arriba, origen en el suelo bajo el centro del tablero, −Z hacia la pared de la ventana.
- `deskWorldMatrix()` coloca el cuarto para que la línea ojo nominal (−0.3, 1.25, 1.95) → centro de la ventana apunte a la "C" (`0, 0.55, 0`) desde 13 m, desplazado hacia +X lo justo para que Alfa (`0, 0.6, −14`) caiga en la apertura de la C por paralaje (misma fórmula que `heroPose` del motor). Resultado: el cuarto queda hacia `x ≈ +3.5, z ≈ +11`, suelo en `y ≈ −1.7`, girado unos −20° en Y. Verificado en el preview y en la página en vivo.

## 3. Props y medidas (procedural, `high`)

| Prop | Medidas / posición local | Material (finish en `props.ts`) |
|---|---|---|
| Habitación | x −1.35…1.95, z −0.42…3.4, alto 2.7, muros de 14 cm, techo, rodapié de 7 cm; suelo de 18 tablas de 18 cm partidas a distinto largo | `desk-wall` ×3.5, `desk-floor` ×2 con veta (ver §6) |
| Ventana | 1.6 × 1.1 m, centro (0.5, 1.5), marco 4 cm, parteluz en x 0.5, alféizar 12 cm, tirador de latón; vidrio en z −0.49 | `window-frame`; vidrio `MeshBasicMaterial` con tinte `window-glass` 12 % y reflejo cálido falso |
| Escritorio | 1.4 × 0.7 m, tablero de 3 cm con canto redondeado a 0.74 m, patas en trineo 3 × 3 cm, travesaño trasero | `desk-wood` con veta procedural · `desk-metal` |
| Monitor | **32" 16:10** (pantalla 0.69 × 0.43 m), bisel 6 mm, centro (−0.12, 1.13, −0.13), yaw −0.08, inclinado 0.2 rad hacia atrás, columna y base | `monitor-bezel`, pantalla `MeshBasicMaterial` con textura de canvas |
| Teclado / trackpad | 37 × 12.5 cm con 64 teclas de bajo perfil · 13 × 10.5 cm | `monitor-bezel` · `desk-metal` |
| Lámpara | Base Ø15 cm en (−0.62, −0.24), dos brazos, codo (−0.72, 1.16, −0.3), cabeza (−0.5, 1.3, 0.1), pantalla cónica de 13 cm y difusor emisivo | `desk-metal`, `lamp-shade`, difusor `lamp` emisivo ×2 |
| Taza | Ø8 cm × 9.5 cm (torno con pared), café al 80 %, asa | `desk-ceramic`, `desk-coffee` |
| Planta | Maceta de terracota 14 cm en (0.57, −0.21), 8–9 hojas curvadas de doble cara con tallo | `desk-pot`, `desk-plant` |
| Libreta y lápiz | 15 × 21 cm con goma, lápiz hexagonal | `desk-paper`, `desk-fabric` |
| Figuras | Peana de nogal 32 × 10 cm en (−0.5, 0.13): **Alfa** 12 cm (icosaedro facetado sobre pin de latón, visor), **Burbu** 7 cm (cápsula + cola + 3 puntos), **caja** 6 cm (tapa, ranura, cinta, lazo). Señales a 0.8 (mitad de las del espacio) | Tokens de mascotas (`--color-alfa-*`, `--burbu-*`, `--gift-*`) |
| Estantería | 3 baldas flotantes de 22 × 90 cm en la pared izquierda (y 1.22 / 1.56 / 1.9): 7 libros, pila de 3, caja de tela, esfera de latón, 2 libros | `desk-wood`, `desk-paper`, `desk-fabric`, `desk-metal`, latón |
| Silla | Respaldo y asiento acolchados, pistón, base de 5 radios, en (−0.72, 1.05) | `desk-fabric`, `desk-metal` |
| Telescopio | Trípode en (1.18, 0.42), cabeza a 1.08 m, refractor de 70 cm con parasol, anillos y enfocador de latón, buscador; apunta a Alfa | `telescope`, `telescope-brass`, `desk-metal` |

## 4. Presupuesto medido (preview, `renderer.info`)

| | `high` | `mid` |
|---|---|---|
| Triángulos del cuarto | 16 160 | 11 641 |
| Draw calls del cuarto | **5** (estático, cabeza del monitor, pantalla, vidrio, sombras de contacto) | 5 |
| Luces | Spot (sombra horneada 1 vez) + Point fría del monitor + direccional + hemisférica | Spot sin sombra + Point + direccional + hemisférica |

La página entera en vivo: 26 draw calls / 16 k tris en `high` 1440×900 y 20 / 11.7 k en `mid` 390×844 con el cuarto en cuadro.

## 5. API

```ts
import install, { DeskStation, DESK_PHASES, type DeskPick } from './desk';
```

- `getPlateAnchor('hero')` → centro de la pantalla en mundo (+1.5 mm hacia fuera), cuaternión del monitor (sin el giro del modo vertical: la placa siempre queda derecha) y `scale` = m por px CSS para que la placa medida (`[data-plate-id="hero"]`, `offsetWidth/offsetHeight`, re-medida con `ResizeObserver` y `resize`) quepa en la pantalla con margen (94 % ancho / 92 % alto).
- `getCameraPose(p)`:
  - `p = 0`: ojo sobre la normal de la pantalla a la distancia de lectura `d = scale·alto / (2·tan(fov/2)) / proyección`. Desktop: pantalla en sx ≥ 0.38 (y lo que pida que la placa quepa y su inclinación ≤ 8°), sy 0.42. Tablet: centrado, FOV 34. Móvil: el monitor **gira a vertical** sobre su pivote, la placa va 1:1 y el monitor ocupa el ancho, sy 0.57.
  - `proyección` (`plateProjection`): 1 en móvil; en desktop/tablet hasta 0.8 si la placa a 1:1 pasaría del 56 % del alto (con la placa actual de ~600 px a 900 px de alto queda en 0.84). Así el cuarto sigue en cuadro; el texto no se emborrona porque CSS3D solo pierde nitidez al ampliar.
  - Trayectoria (`DESK_PHASES`): 0.25 retrocede 0.5 m y gira hacia la ventana · 0.5 a 0.9 m del vidrio, junto al telescopio, mirando a la C · 0.75 **pose de salida** (`exitPose()`, 36 cm más allá del vidrio, mirando a la C) · 1 = `context.readingPose('about')`. Hermite con tangentes Catmull-Rom no uniformes y velocidad 0 en los extremos.
  - Parallax del puntero (±1.5° yaw, ±0.8° pitch, amortiguado 0.06/frame) solo en `pointer: fine`, con movimiento permitido y p < 0.25. La placa está anclada a la pantalla, no a la cámara, así que no se despega.
- Luces por progreso: lámpara 28 → 6 cd entre 0.25 y 0.5 y a 0 en 0.85; monitor, luna y relleno a 0 entre 0.5 y 0.85. Las luces nunca se ocultan (`visible`) para no cambiar el número de luces y recompilar todos los shaders; a partir de 0.85 se oculta solo el grupo de mallas.
- `picks: DeskPick[]` (`{ object3D, key, label: {es, en}, target, product? }`): Alfa → `#company`; Burbu → `#products` (`ventixs`); caja → `#products` (`parati`); telescopio → `#about`. `object3D` son cajas invisibles (material `visible: false`: no dibujan pero el raycaster las toca). `resolvePick(obj)` sube por los padres. `setHover(obj | null)` enciende un borde emisivo en el color de la marca (Alfa azul, Burbu verde, caja rosa, telescopio luz de luna), con fundido de 100 ms.
- `stats()` → triángulos y mallas visibles (para el overlay de debug).

## 6. Decisiones que se apartan de `docs/design/desk.md`

1. **Monitor 32" 16:10 en vez de 27" 16:9.** La placa del hero mide ~576 × 600 px; a 1:1 un panel 16:9 obligaba a que el monitor ocupara casi todo el cuadro. La pantalla más alta y grande deja la lámpara, la planta, la taza y la ventana en cuadro.
2. **Placa a ≥ 0.8 de 1:1 en desktop** cuando es muy alta (ver `plateProjection`). En móvil siempre 1:1.
3. **Calibración de luces** (`LIGHT_CALIBRATION` en `DeskStation.ts`): lámpara ×0.4, luna ×3, relleno ×5 sobre los tokens. Los tokens son físicos y la exposición ACES 1.1 está pensada para el espacio; sin esto la lámpara quema y las paredes son negro puro.
4. **Albedo de pared y suelo ×3.5 / ×2** (`PERCEIVED_TO_ALBEDO` en `props.ts`): los tokens describen cómo deben *verse* de noche; usados como albedo son pintura casi negra (< 1 % de reflectancia).
5. **Sin `RectAreaLight`** para el monitor: sus tablas LTC (`RectAreaLightUniformsLib`) triplicaban el chunk 3D. El brillo frío es una `PointLight` suave a 30 cm de la pantalla (`--monitor-intensity` × 0.16) más la propia pantalla, que va con ganancia HDR 2.4 para seguir luminosa tras ACES (con o sin FX). El vidrio es `MeshBasicMaterial` (sin iluminación) para evitar reflejos punteados.
6. **AO analítico** en el shader (distancia al suelo, a las paredes y al tablero, y sombra bajo la mesa) en vez de un lightmap de 1024 px: mismo efecto sin segundo juego de UV. La sombra de la lámpara en `high` es un shadow map real renderizado **una vez** (`shadowMap.autoUpdate = false`, `needsUpdate = true` al cargar y al girar el monitor). En `mid` no hay sombra dinámica: quedan el AO y las sombras de contacto.
7. Sin vapor de la taza ni silla desenfocada todavía (el DoF es del FX).

## 7. Sustituir por GLB (Blender / Tripo)

La interfaz (`DeskStation`, anclas, poses, picks) no cambia; solo `load()` deja de llamar a los `build*` de `props.ts` y carga `desk-room.glb` con el cargador del motor (`assets.ts`, variantes `high`/`mid` de `bun run assets`). Escala real, +Y arriba, −Z hacia la ventana, origen en el suelo bajo el centro del tablero (§2). Nodos esperados:

| Nodo | Contenido | Notas |
|---|---|---|
| `room_static` | Todo lo que no se mueve (cuarto, escritorio, lámpara, taza, planta, libreta, estantería, silla, soporte del monitor) | Un material con atlas (base color, ORM, emisivo para el difusor) y **lightmap horneado en Blender** en `uv1`: lámpara cálida, luna y monitor. Sustituye a AO analítico y sombra en tiempo real. |
| `monitor_head` | Bisel y carcasa | Pivote en el centro de la pantalla, mirando +Z. Gira 90° en Z en móvil. |
| `screen_glass` | Plano 0.69 × 0.43 m hijo de `monitor_head` | Se reemplaza por la pantalla de canvas del módulo; solo da posición y tamaño. |
| `window_glass` | Plano del vidrio | Se le aplica el material del módulo. |
| `figure_alfa`, `figure_burbu`, `figure_gift` | Figuras con su peana compartida en `room_static` | Señales en el emisivo del atlas a 0.8. Mallas propias para el hover. |
| `telescope` | Trípode + tubo | Se orienta en Blender hacia Alfa: dirección local `toLocal(WORLD_ALFA)` desde la cabeza (≈ −Z y ~5° a la izquierda). |
| `lamp_light`, `lamp_target`, `monitor_light` | Empties | Posición de la `SpotLight` y su objetivo, y de la `PointLight` del monitor. |
| `pick_alfa`, `pick_burbu`, `pick_gift`, `pick_telescope` | Cajas simples | Proxies de raycast (material invisible). |

Presupuesto: ≤ 60 k tris `high`, ≤ 20 k `mid`, ≤ 12 draw calls con atlas. Revisar con `mountDeskPreview` que la línea ojo → ventana sigue encuadrando la C.

## 8. Prompts para Tripo

Añadir a todos los requisitos técnicos de `docs/design/mascots.md` §4.2 (objeto único, sin texto ni logos, PBR con un atlas, < 25 k tris, pivote en la base, escala real) y usar como referencia la captura del preview (`renderLocal`) del prop a 1024 × 1024, fondo gris neutro. Estilo común: *calm premium industrial design, soft bevels, satin and matte finishes, no clutter, no brand marks, night-studio mood*.

- **Escritorio**: *A minimal walnut desk, 140 × 70 cm, 3 cm thick top with softly rounded edges, graphite anodized aluminium sled legs made of 3 cm square tubes, subtle walnut grain, satin finish, Scandinavian-industrial, no drawers.*
- **Monitor**: *A 32-inch 16:10 computer monitor with an ultra-thin 6 mm black bezel, slim column stand and flat rectangular base in graphite aluminium, screen off (black glass), no logo, premium minimal design.*
- **Teclado y trackpad**: *A low-profile compact wireless keyboard with flat dark keys and a matching aluminium trackpad, matte black and graphite, minimal, no legends or logos.*
- **Lámpara**: *An architect desk lamp with a round weighted base, two thin graphite aluminium arms and a small conical shade, matte dark exterior and warm white diffuser inside, refined Scandinavian design.*
- **Taza**: *A plain cylindrical ceramic mug with a simple loop handle, warm off-white satin glaze, filled with black coffee at 80 %, no print.*
- **Planta**: *A small houseplant in a 14 cm muted terracotta pot, 8 large glossy dark green leaves on thin stems, calm and sparse, slightly asymmetric.*
- **Libreta y lápiz**: *A closed A5 notebook with a dark navy fabric cover and a thin elastic band, a hexagonal brass-coloured pencil beside it.*
- **Estantería**: *Three floating walnut wall shelves, 90 cm long, holding a few hardcover books in muted navy, grey and cream, a small fabric storage box and a polished brass sphere ornament, sparse and tidy.*
- **Silla**: *A modern task chair with a padded backrest and seat in dark slate-blue fabric, graphite five-star base with small casters, minimal, no logos.*
- **Telescopio**: *A white satin refractor telescope on a graphite aluminium tripod with an accessory tray, brushed brass tube rings and focuser, small finder scope, elegant hobby-astronomy instrument, clean hard-surface modelling.*
- **Figuras**: usar los prompts de `mascots.md` §4.3 (Alfa, Burbu, caja de regalo) añadiendo *desk collectible figurine scale, on a small walnut plinth*.
- **Ventana**: *A large two-pane window, 1.6 × 1.1 m, thin 4 cm matte graphite metal frame with a vertical mullion and a small brass handle, glass panes omitted, inner sill.*

## 9. Revisión

```js
// En http://localhost:4321/page/?tier=none (para que el Stage no compita), desde la consola o Playwright:
const host = Object.assign(document.createElement('div'), { style: 'position:fixed;inset:0;z-index:99999' });
document.body.append(host);
const { mountDeskPreview } = await import('/page/src/three/desk/preview.ts');
const preview = await mountDeskPreview(host, { tier: 'high' });
preview.setProgress(0);            // → { calls, triangles }
preview.renderLocal([0.9, 1.6, 3.2], [-0.1, 0.9, 0], 50); // plano general
```
