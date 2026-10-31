# Una noche en el escritorio — dirección de arte v2

Dirección final aprobada (PLAN, "Dirección final"; `docs/REVIEW-direccion.md`). **Ya no hay espacio**: ni vuelo por la ventana, ni constelación, ni órbitas, ni faro. Todo pasa en un solo cuarto, con luz horneada y planos casi quietos. Lo leen el Artista de escenario (`src/three/desk/**`), FX (`src/three/fx/**`), Motor, Motion y UI.

Valores en `src/styles/tokens.css`: colores `--color-desk-*`, `--color-folder-*`, `--color-phone-*`, `--color-city-*`, `--color-rain`, `--color-dawn-*`, `--color-lamp*`, `--color-monitor-*`, `--color-moonlight`, `--color-window-*`, y números `--lamp-*`, `--monitor-intensity`, `--moonlight-intensity`, `--desk-ambient-intensity`, `--fx-*`. Las mascotas y los props que se generan con Tripo están en `mascots.md`.

## 1. Concepto

**"Última hora de trabajo. En el monitor, el día (banca). Bajo la lámpara, la noche (productos). Al amanecer, la ventana."**

Es un cuarto de trabajo ordenado, adulto y caro sin ostentación: nogal, aluminio grafito, cerámica, latón y papel. Llueve sobre una ciudad que duerme. La cámara se comporta como un director de fotografía paciente: elige un plano, lo sostiene y solo se mueve entre capítulos. La acción la hacen la luz, los objetos y el texto.

Hay tres luces, cada una con un papel en la historia:
- **Lámpara cálida (2700 K)**: la noche y lo propio (TUSOCIO IA, los productos).
- **Monitor frío (azul de marca)**: el día y la banca (hero, sobre mí).
- **Ciudad y lluvia tras la ventana (frío plateado, con puntos de sodio cálido)**: el mundo de fuera. Al final, el amanecer.

## 2. Paleta

| Token | Hex | Uso |
|---|---|---|
| `--color-desk-wall` | `#121722` | Paredes, azul pizarra mate |
| `--color-desk-floor` | `#17140F` | Suelo de roble ahumado |
| `--color-desk-wood` | `#5A3E2B` | Tablero de nogal, baldas, peana |
| `--color-desk-metal` | `#2B313C` | Aluminio anodizado grafito |
| `--color-desk-fabric` | `#232A3A` | Silla, alfombrilla |
| `--color-desk-ceramic` | `#E6E0D4` | Taza, cerámica |
| `--color-desk-coffee` | `#2A1A10` | Café |
| `--color-desk-plant` | `#2F5A44` | Hojas |
| `--color-desk-pot` | `#8C5A44` | Terracota |
| `--color-desk-paper` | `#D8D2C4` | Papel, libreta, etiquetas |
| `--color-desk-brass` | `#B08A4A` | Latón cepillado (anillo de Alfa, detalles) |
| `--color-folder-tcs` | `#33405A` | Carpeta TCS (pizarra azul) |
| `--color-folder-intercorp` | `#6B4A35` | Carpeta Intercorp (cuero coñac) |
| `--color-folder-baufest` | `#4A5847` | Carpeta Baufest (oliva) |
| `--color-folder-sysarp` | `#7E776A` | Carpeta SYSARP (piedra) |
| `--color-phone-body` | `#15181E` | Teléfono, aluminio negro mate |
| `--color-phone-screen` | `#05070B` | Pantalla apagada |
| `--color-window-frame` | `#1A1F29` | Marco de la ventana |
| `--color-window-glass` | `#0B1220` | Tinte del vidrio |
| `--color-sky-zenith` | `#04060B` | Cielo nocturno (arriba) |
| `--color-sky-horizon` | `#0A0E14` | Cielo nocturno (horizonte) |
| `--color-city-silhouette` | `#0D121B` | Edificios |
| `--color-city-sodium` | `#E8A25A` | Ventanas y farolas cálidas |
| `--color-city-led` | `#8FB4E8` | Pocas luces frías |
| `--color-rain` | `#9DB8E8` | Gotas y regueros (con baja opacidad) |
| `--color-dawn-low` | `#E9A47A` | Amanecer, franja baja |
| `--color-dawn-high` | `#6F86AE` | Amanecer, cielo alto |
| `--color-telescope` / `-brass` | `#C9CED6` / `#B08A4A` | Telescopio (se mantiene como prop junto a la ventana) |
| `--color-monitor-bezel` | `#0C0F14` | Monitor, teclado |
| `--color-monitor-glow` | `#7FB8FF` | Luz de la pantalla |
| `--color-lamp` | `#FFB566` | Luz de la lámpara |
| `--color-lamp-shade` | `#1D222B` | Pantalla de la lámpara |
| `--color-moonlight` | `#9DB8E8` | Luz que entra por la ventana |

Reglas: lo cálido solo vive dentro del cono de la lámpara y en las ventanas de la ciudad; todo lo demás es frío. Los únicos colores saturados son la marca (la pantalla y la señal de Alfa) y los acentos de los productos sobre las figuras. La luminancia media del cuadro ronda el 12 %.

## 3. Set y props

Escala real: 1 u = 1 m. La mesa mide 1.4 × 0.7 m y está a 0.74 m de altura. El origen queda en el centro del tablero, a ras del suelo. Presupuesto: ≤ 1.5 MB por capítulo; cuarto ≤ 60 k tris en `high` y ≤ 20 k en `mid`. Lightmap de 1024 px horneado por capítulo de luz, o uno base más los aportes de la lámpara y el monitor.

| Prop | Posición | Forma y material |
|---|---|---|
| Escritorio | Centro | Tablero de nogal de 3 cm con canto biselado (r 0.55); patas en trineo grafito (r 0.35, m 0.8) |
| Monitor | Centro-izquierda, a 0.35 m del borde trasero | 27", marco de 6 mm. **Superficie `surface-monitor`** para `hero` y `about` |
| Teclado y trackpad | Delante del monitor | Bajo perfil, grafito |
| Lámpara de arquitecto | Izquierda trasera | Brazos grafito; pantalla cónica con el interior emisivo `lamp` |
| **Peana** | Derecha, bajo el cono de la lámpara | Bloque de nogal de 24 × 10 × 3 cm con ranura de latón. Lleva Alfa y las tres figuras (ver `mascots.md`) |
| Taza | Derecha delantera | Cerámica mate. Vapor (FX) |
| Planta | Junto a la ventana | Se recorta a contraluz |
| **Estantería** | Pared izquierda, 3 baldas flotantes | Balda media: **4 carpetas archivadoras de lomo ancho**, en orden de izquierda a derecha SYSARP, Baufest, Intercorp y TCS, con etiqueta de papel y nombre grabado en el lomo. Balda superior: 5 libros y un objeto de latón. Balda inferior: vacía, con una caja |
| **Carpeta TCS abierta** | Sobre la mesa, a la izquierda del teclado | Se ve en `experience` como "la carpeta de hoy"; dentro, una hoja con el logotipo genérico (sin marca real legible) |
| **Teléfono** | Junto al teclado, a la derecha, boca arriba, girado 8° | Placa de aluminio negro mate de 147 × 71 × 8 mm con cristal frontal. **Superficie `surface-phone`** en `contact` |
| Libreta y lápiz | Junto al teclado | Papel y grafito |
| Ventana | Pared trasera, a la derecha del monitor | 1.6 × 1.1 m con un parteluz. Vidrio con lluvia (FX) |
| Telescopio | Junto a la ventana | Refractor blanco con latón, apuntando a la ciudad. Es puro atrezo: la cámara ya no sale por la ventana |
| Silla | Primer plano izquierdo | Respaldo de tela, siempre desenfocado |

Prohibido: RGB, pósters, latas, cables a la vista, marcas reales legibles, figuras de anime.

## 4. Tras la ventana: ciudad y lluvia

- **Cielo**: degradado de `--color-sky-zenith` a `--color-sky-horizon` en un plano a 30 m, sin estrellas (la ciudad ilumina el cielo). Como mucho, 3 o 4 puntos tenues.
- **Ciudad**: tres capas de siluetas en planos (`--color-city-silhouette`), a 200, 450 y 800 m, que ganan neblina hacia el fondo. Ventanas encendidas como textura emisiva con una ocupación del 8 %: 85 % `--color-city-sodium`, 15 % `--color-city-led`. Cada ~20 s se apaga o se enciende una ventana (como mucho una a la vez). Una luz roja de aviso en una antena parpadea cada 3 s. Sin coches ni tráfico animado.
- **Lluvia** (FX, ver §8):
  - En el vidrio: gotas estáticas (normal map) y de 6 a 10 regueros que bajan despacio.
  - Detrás del vidrio: líneas de lluvia muy tenues (`--color-rain`, opacidad ≤ 0.08) y un desenfoque leve de la ciudad.
  - La lluvia refracta un poco las luces de sodio. En el vidrio se refleja la lámpara de forma falsa (textura).

## 5. Capítulos: planos, luz y acción

Las reglas anti-mareo del PLAN mandan: roll 0°, FOV fijo (30 en desktop, 40 en móvil), transiciones de 0.9 a 1.4 s con `power2.inOut`, y como mucho 45° de yaw y 1.5 m por transición.

Medidas: cámara = posición (x, y, z) y punto mirado; lámpara en cd; monitor en nits; luna en lux.

| Capítulo | Plano (desktop) | Móvil | Luz | Acción | Texto |
|---|---|---|---|---|---|
| `intro` | Negro → plano de `hero` | Igual | Todo apagado. La lámpara parpadea (2 destellos de 60 ms) y enciende de 0 a 28 cd en 0.5 s; luego el monitor de 0 a 5 nits en 0.3 s | Encendido | — |
| `hero` | Plano general frontal. Cámara `(−0.15, 1.22, 1.55)` → `(−0.1, 0.95, −0.1)`. Monitor en el tercio izquierdo-central, ventana a la derecha, lámpara en cuadro | Cámara `(−0.12, 1.15, 0.95)`; el monitor ocupa el ancho | Lámpara 28 · monitor 5 · luna 0.45 · exposición 1.1 | Parallax ±1.5°, vapor, lluvia | Titular tecleado en la pantalla (`surface-monitor`) + rol + 3 cifras + CTAs |
| `about` | Push-in: el monitor llena ~70 % del ancho. Cámara `(−0.12, 1.08, 0.72)` | El monitor arriba, a todo el ancho | Lámpara 18 (baja para que mande la pantalla) · monitor 6 · exposición 1.05 | Cambia el "slide" de la pantalla | Foto, bio, formación y stack en la pantalla |
| `company` | Deslizamiento lateral hacia la lámpara. Macro de la peana a 0.55 m, ligeramente picado (−12°), con Alfa en el centro y las 3 figuras detrás | Peana en el tercio superior | Lámpara 32 (la peana es el escenario) · monitor 2 · exposición 1.0 | Alfa gira 20° y su anillo de latón capta la luz | Panel `anchored` en el lado opuesto, o debajo en móvil |
| `products` | Macro de cada figura, una por vez, a 0.35 m. Dolly de 15–20 cm entre figuras | Una figura por pantalla | Lámpara 32; un rebote cálido sobre la figura enfocada (+10 %) | La figura sube 2 cm y gira despacio (≤ 0.05 rad/s); las otras quedan desenfocadas | Un panel `anchored` por producto. **SkyMek primero y con más peso** (incluye captura real); Parati y Ventixs "en construcción" |
| `experience` | Tilt hacia la estantería (pitch +18°, yaw −35°), con la carpeta TCS abierta en la mesa en primer término | Estantería arriba, carpeta abajo | Lámpara 22 · la luna recorta los lomos · cada lomo leído recibe +15 % de luz (emisivo de la etiqueta) | Las carpetas se iluminan al leerse | **Orden inverso**: TCS, Intercorp y Baufest en paneles `anchored`; SYSARP en una línea |
| `contact` | Tilt hacia el teléfono, cenital a 45°, a 0.45 m | El teléfono llena el ancho | Lámpara 20 · pantalla del teléfono emisiva 3 nits `#E9EEF5` · el monitor se apaga a 1 | Llega una notificación con chime y el teléfono se enciende | Correo, LinkedIn, GitHub, X y CV en la pantalla (`surface-phone`) |
| `outro` | Plano general (el de `hero`, 0.3 m más atrás) | Igual | La lámpara se apaga en 1.2 s; el cielo pasa de noche a `--color-dawn-high`/`--color-dawn-low` en 2.5 s; las ventanas de la ciudad se apagan en cascada; la luz de la ventana sube a 1.2 lux, cálida | Luz | Créditos en la pared (panel `anchored`) + "Hecho con Astro + Three.js" |

DoF por capítulo (`FxPipeline.setFocus`), en ≤ 600 ms y **nunca sobre texto**:
- `hero` y `about`: la pantalla, con apertura moderada.
- `company`: Alfa.
- `products`: la figura activa.
- `experience`: el lomo activo.
- `contact`: el teléfono.
- `outro`: sin DoF.

## 6. Texto: dos modos y una sola escala

Una sola escala tipográfica en pantalla (tokens en `tokens.css`):

| Rol | Token | Valor |
|---|---|---|
| Titular | `--text-display` | Sora 600, 72 px en 1024 → 96 px en 1536 (44 px como mínimo en móvil), `--tracking-display` −0.03em, interlineado 1.0 |
| Cuerpo | `--text-body` | Inter 400, 17 px, interlineado 1.6 |
| Eyebrow / meta | `--text-meta` | Inter 600, 13 px, `--tracking-caps`, mayúsculas |
| Medida | `--measure` | ≤ 60 caracteres por línea (`max-w-measure`) |

Hay **un solo margen izquierdo**: dentro de un panel, todo arranca en el mismo borde (sin sangrías, sin la línea de señal desplazando el texto). La línea de señal va encima del eyebrow.

- **`anchored`** (`data-plate-mode="anchored"`): paneles HTML 2D anclados a un punto 3D proyectado. Solo se trasladan en pantalla, nunca rotan ni escalan. Van sueltos y sin caja: un halo difuso detrás (`--color-plate-pool`) y un halo por glifo (`--plate-text-halo`). Se usan en `company`, `products`, `experience` y `outro`.
- **`surface-monitor`** y **`surface-phone`**: contenido **de pantalla** en CSS3D, frontal y a 1:1. Se ve como una UI real en la pantalla: fondo de pantalla (`--color-screen-bg`), márgenes de pantalla, y texto nítido sin halo (no le hace falta: la pantalla es opaca). Escala relativa al dispositivo:
  - En el monitor, el titular usa `--text-display` (la pantalla es grande y está cerca).
  - En el teléfono, el titular es `--text-2xl` y el cuerpo 15 px.

Contraste:
- Sobre `--color-screen-bg` (`#0B0F16`): text 16.5 · text-muted 8.0 · text-subtle 5.6 · accent 7.8 · status-live 11.2 · SkyMek 9.2 · Parati 8.2 · Ventixs 9.6. Los bordes de controles usan `border-strong` (4.45, UI ≥ 3).
- Paneles `anchored`: valores de `constellation.md` §11 (halo difuso al 85 %; peor caso realista ≥ 5.9 para text-muted). Ahí el "peor fondo" es la pantalla encendida o el cono de la lámpara sobre el nogal (`#5A3E2B` iluminado), que es más oscuro que el halo de Alfa calculado entonces. En texto suelto no se usa `text-subtle`.

## 7. Composición

- **Desktop**: el sujeto ocupa una mitad y el panel `anchored` la opuesta, con el margen izquierdo del panel alineado a una columna fija: 8 % del ancho si el panel va a la izquierda, 54 % si va a la derecha. Los paneles nunca tapan la figura enfocada.
- **Móvil**: el sujeto en el tercio superior y el panel abajo, con margen lateral `--spacing-gutter` y botones al alcance del pulgar.
- Nada cruza el centro del cuadro durante una transición.

## 8. FX: lo elegante y lo que sobra

Principio: el post-procesado solo debe notarse si se quita. Todo va en un único `EffectComposer` y solo en `high`. En `mid` quedan viñeta y grano dentro del tone mapping. En `low` no hay nada.

| Efecto | Valor | Nota |
|---|---|---|
| Bloom selectivo | strength `--fx-bloom-strength` 0.32 · radius 0.45 · threshold 0.88 | Solo emisivos: pantalla, interior de la lámpara, señal de Alfa, luces de la ciudad |
| DoF | bokehScale 2.5 en planos generales, 3.5 en macros · transición ≤ 600 ms | Nunca sobre texto (el CSS3D y los paneles 2D quedan fuera del composer) |
| Grano | `--fx-grain` 0.035, overlay, 24 fps | Estático si hay reduced-motion |
| Viñeta | darkness 0.5 · offset 0.32; 0.3 en `outro` | |
| Aberración cromática | **No se usa** (`--fx-chromatic-offset` 0) | Decisión final |
| Fluido | Solo en la lluvia del vidrio y el vapor de la taza, en `high` | Nunca en texto ni en la cámara |
| Tone mapping | ACES, exposición por capítulo (§5) | |

Cursor: parallax de cámara de ±1.5° / ±0.8° con amortiguación `--fx-pointer-damping` 0.06, **apagado durante las transiciones** (una sola fuente de movimiento a la vez). En táctil no hay arrastre: la transición se dispara al 50 % de visibilidad.

Reduced-motion o pausa: cortes con disolvencia de 300 ms entre capítulos, sin parallax, sin vapor, lluvia congelada (solo las gotas estáticas), sin parpadeo de la ciudad. La lámpara se enciende sin parpadeo y el amanecer es una disolvencia.

## 9. Lista de revisión

- [ ] Cada capítulo es un plano que se sostiene (quieto:movimiento ≥ 70:30).
- [ ] Se leen las tres luces; el cambio de luz cuenta el capítulo.
- [ ] Ningún texto rota ni escala; todo arranca en un mismo margen izquierdo.
- [ ] La lluvia y la ciudad dan vida sin distraer.
- [ ] El amanecer cierra con calma y los créditos se leen.
