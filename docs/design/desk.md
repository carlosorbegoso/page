# Escritorio de noche: dirección de arte

Dirección de arte del set 3D (concepto, paleta `--color-desk-*`, props, luz y plano por capítulo, texto sobre 3D, FX); léelo antes de tocar el aspecto de `src/three/desk/**` o `src/three/fx/**`.

Todo pasa en un solo cuarto, con planos casi quietos: no hay espacio, vuelo por la ventana ni órbitas. Qué archivo editar: `docs/codemap/desk.md` y `docs/codemap/fx.md`. Implementación: `docs/3d/desk.md`. Figuras de la peana: `mascots.md`.

## Concepto

**"Última hora de trabajo. En el monitor, el día (banca). Bajo la lámpara, la noche (productos). Al amanecer, la ventana."**

- Cuarto ordenado, adulto y caro sin ostentación: nogal, aluminio grafito, cerámica, latón y papel. Llueve sobre una ciudad que duerme.
- La cámara es un director de fotografía paciente: elige un plano, lo sostiene y solo se mueve entre capítulos. La acción la hacen la luz, los objetos y el texto.
- Tres luces con papel en la historia:
  - **Lámpara cálida (2700 K)**: la noche y lo propio (TUSOCIO IA, productos).
  - **Monitor frío (azul de marca)**: el día y la banca (hero, sobre mí, experiencia).
  - **Ciudad y lluvia tras la ventana** (frío plateado con puntos de sodio): el mundo de fuera; al final, el amanecer.
- Modo día (`data-time="day"`): la historia se invierte. Lámpara apagada, la ventana manda, y la lámpara se enciende en `outro` (`CHAPTER_LIGHT_DAY` en `src/three/desk/set/levels.ts`).

## Paleta del set (`--color-desk-*`, `--color-folder-*`, `--color-city-*`)

Valores en `src/styles/tokens/colors.css`.

| Token | Hex | Uso |
|---|---|---|
| `--color-desk-wall` | `#121722` | Paredes, azul pizarra mate |
| `--color-desk-floor` | `#17140F` | Suelo de roble ahumado |
| `--color-desk-wood` | `#5A3E2B` | Tablero de nogal, baldas, peana |
| `--color-desk-metal` | `#2B313C` | Aluminio anodizado grafito |
| `--color-desk-fabric` | `#232A3A` | Silla, alfombrilla |
| `--color-desk-ceramic` | `#E6E0D4` | Taza |
| `--color-desk-coffee` | `#2A1A10` | Café |
| `--color-desk-plant` / `-pot` | `#2F5A44` / `#8C5A44` | Hojas / terracota |
| `--color-desk-paper` | `#D8D2C4` | Papel, notas, etiquetas |
| `--color-desk-brass` | `#B08A4A` | Latón cepillado |
| `--color-folder-tcs` | `#33405A` | Carpeta TCS (pizarra azul) |
| `--color-folder-intercorp` | `#6B4A35` | Carpeta Intercorp (cuero coñac) |
| `--color-folder-baufest` | `#4A5847` | Carpeta Baufest (oliva) |
| `--color-folder-sysarp` | `#7E776A` | Carpeta SYSARP (piedra) |
| `--color-phone-body` / `-screen` | `#15181E` / `#05070B` | Teléfono / pantalla apagada |
| `--color-window-frame` / `-glass` | `#1A1F29` / `#0B1220` | Ventana |
| `--color-sky-zenith` / `-horizon` | `#04060B` / `#0A0E14` | Cielo nocturno |
| `--color-city-silhouette` | `#0D121B` | Edificios |
| `--color-city-sodium` | `#E8A25A` | Ventanas y farolas cálidas |
| `--color-city-led` | `#8FB4E8` | Pocas luces frías |
| `--color-rain` | `#9DB8E8` | Gotas y regueros (baja opacidad) |
| `--color-dawn-low` / `-high` | `#E9A47A` / `#6F86AE` | Amanecer |
| `--color-day-*` | `#A9B1B9` … `#7F858C` | Cielo, neblina y ciudad de día |
| `--color-telescope` / `-brass` | `#C9CED6` / `#B08A4A` | Telescopio |
| `--color-monitor-bezel` / `-glow` | `#0C0F14` / `#7FB8FF` | Monitor / luz de pantalla |
| `--color-screen-bg` | `#0B0F16` | Fondo de las pantallas HTML |
| `--color-lamp` / `-shade` | `#FFB566` / `#1D222B` | Luz / pantalla de la lámpara |
| `--color-moonlight` | `#9DB8E8` | Luz de la ventana |

Reglas:
- Lo cálido solo vive en el cono de la lámpara y en las ventanas de la ciudad; todo lo demás es frío.
- Saturados solo la marca (pantallas, señal de Alfa) y los acentos de producto en las figuras.
- Luminancia media del cuadro ≈ 12 %.

## Set y props (`src/three/desk/layout.ts`)

Escala real: 1 u = 1 m. Mesa 1.4 × 0.7 m a 0.74 m. Origen en el suelo bajo el centro del tablero; −Z hacia la ventana. Presupuesto de peso: `docs/3d/budget.md`.

| Prop | Dónde | Forma y material |
|---|---|---|
| Escritorio | Centro | Nogal de 3 cm; patas grafito |
| Monitor | Centro-izquierda | 27", marco de 6 mm, girado hacia la cámara de `hero`. Superficie `surface-monitor` |
| Teclado y trackpad | Delante del monitor | Bajo perfil, grafito |
| Laptop | Izquierda de la mesa, girada | Tapa abierta con escritorio propio en pantalla |
| Lámpara de arquitecto | Derecha trasera, apunta a la peana | Brazos grafito, pantalla cónica, interior emisivo `lamp`, interruptor |
| **Peana** | Derecha, bajo el cono | Nogal de 50 × 10 × 3 cm con filete de latón. Lleva Alfa y las tres figuras (`mascots.md`) |
| Pikachu y Charizard | Junto al monitor | Figuras de colección (`props/pikachu.ts`, `props/charizard.ts`) |
| Suculenta | Junto al teclado | Maceta pequeña |
| Taza | Derecha delantera | Cerámica mate, vapor (FX) |
| **Teléfono** | Derecha delantera, apoyado e inclinado hacia la cámara | 147 × 71 × 8 mm, aluminio negro mate. Superficie `surface-phone` en `contact` |
| **Carpeta abierta (TCS)** | Izquierda delantera de la mesa | "La carpeta de hoy"; hoja sin marca real legible |
| **Estantería** | Pared izquierda, 3 baldas | Balda media: 4 archivadores de lomo ancho, de izquierda a derecha SYSARP, Baufest, Intercorp y TCS, con etiqueta de papel |
| Retrato | Pared, junto al monitor | Foto enmarcada con vidrio; comparte plano con el monitor en `about` |
| Corcho con notas | Fondo de la mesa, apoyado contra la pared | Notas de papel impresas |
| Reloj despertador | Fondo derecho de la mesa | glTF en `public/models/alarm-clock` |
| Ventana | Pared trasera, a la derecha del monitor | 1.6 × 1.1 m con parteluz y persiana; vidrio con lluvia (FX) |
| Planta | Bajo la ventana | Se recorta a contraluz |
| Telescopio | Junto a la ventana | Refractor blanco con latón, atrezo |
| Silla | Primer plano izquierdo | Tela, siempre desenfocada |

Prohibido: RGB, pósters, latas, cables a la vista, marcas reales legibles. Pikachu y Charizard son una excepción decidida en código a la antigua regla de "sin figuras de anime".

## Tras la ventana: cielo, ciudad y lluvia

- **Cielo**: degradado `--color-sky-zenith` → `--color-sky-horizon`, sin estrellas (la ciudad ilumina el cielo); como mucho 3 o 4 puntos tenues.
- **Ciudad**: siluetas en capas que ganan neblina hacia el fondo. Ventanas encendidas: ~85 % sodio, ~15 % LED. De vez en cuando una ventana se apaga o enciende (una a la vez). Sin tráfico animado.
- **Lluvia** (FX): gotas estáticas y pocos regueros lentos en el vidrio; detrás, líneas muy tenues (`--color-rain`, opacidad ≤ 0.08) y la ciudad algo desenfocada.

## Cámara (`CAMERA_LIMITS`, `src/three/director.ts`)

- Roll 0°. FOV fijo: 30 desktop, 40 táctil, 52 en teléfono vertical apilado.
- Transiciones de 0.9 a 1.4 s, con techo de 20°/s y 1 m/s.
- Parallax de puntero ±1.5° yaw / ±0.8° pitch con `--fx-pointer-damping` 0.06, apagado durante las transiciones (una sola fuente de movimiento a la vez).
- Respiración en reposo: 6 mm y 0.12° en 11 s.
- En táctil no hay arrastre.

## Capítulos: luz, plano y acción (`src/three/desk/set/levels.ts`)

Orden: `intro`, `hero`, `about`, `experience`, `company`, `products`, `contact`, `outro` (`CHAPTERS` en `src/three/contracts.ts`). Luz de noche en cd (lámpara), nits (monitor) y lux (luna). Exposición = multiplicador de `src/three/fx/grading.ts`.

| Capítulo | Luz (lámpara · monitor · luna) | Exposición | Plano y acción | Texto |
|---|---|---|---|---|
| `intro` | 0 → 28 · 0 → 5 · 0.7 | 0.55 | Negro. La lámpara da dos destellos de 60 ms y sube en 0.5 s; luego el monitor en 0.3 s | — |
| `hero` | 28 · 5 · 0.7 | 1 | Plano general frontal: monitor en el tercio izquierdo-central, ventana a la derecha, lámpara en cuadro. Vapor y lluvia | Titular tecleado en `surface-monitor` + rol + cifras + CTAs |
| `about` | 18 · 6 · 0.6 | 1 | Retrato de la pared y monitor juntos; cambia el slide de la pantalla (2 subplanos) | Foto, bio, formación y stack en la pantalla |
| `experience` | 5 · 6 · 1.1 · estantería 1.25 | 0.96 | Plano de la estantería, luego cada carpeta en orden cronológico: SYSARP, Baufest, Intercorp en la balda y TCS en la carpeta abierta de la mesa (5 subplanos). La carpeta leída se ilumina | Un panel `anchored` por empresa |
| `company` | 30 · 1.5 · 0.6 | 1.04 | Macro de la peana, algo picado; la lámpara se enciende al 30 % del capítulo. Alfa gira 20° | Panel `anchored` en el lado opuesto, o debajo en móvil |
| `products` | 26 · 1.5 · 0.55 | 1 | Macro de cada figura (3 subplanos). La activa sube 2 cm y gira ≤ 0.05 rad/s; las otras quedan desenfocadas | Un panel por producto. **SkyMek primero y con más peso**; Parati y Ventixs "en construcción" |
| `contact` | 20 · 1 · 0.5 | 1 | El teléfono llena el cuadro; llega una notificación con chime y se enciende | Correo, LinkedIn, GitHub, X y CV en `surface-phone` |
| `outro` | 0 · 0.6 · 1.2 | 1.3 | Plano general. La lámpara se apaga, el cielo pasa a `--color-dawn-*`, la ciudad se apaga en cascada | Créditos (`anchored`) + "Hecho con Astro + Three.js" |

## Foco y DoF (`getFocus`)

- Transición ≤ 600 ms y **nunca sobre texto** (el HTML queda fuera del composer).
- `hero`, `about`: la pantalla · `experience`: la carpeta activa · `company`: Alfa · `products`: la figura activa · `contact`: el teléfono · `outro`: sin DoF.

## Texto sobre el 3D (`anchored`, `surface-monitor`, `surface-phone`)

Escala y tokens: `type.md`. Un solo margen izquierdo por panel; la línea de señal va encima del eyebrow y no desplaza el texto.

- **`anchored`** (`data-plate-mode="anchored"`): HTML 2D anclado a un punto 3D proyectado. Solo se traslada, nunca rota ni escala. Suelto y sin caja: charco `--color-plate-pool` + `--plate-text-halo`. En `experience`, `company`, `products` y `outro`.
- **`surface-monitor`**, **`surface-phone`**: contenido de pantalla en CSS3D, frontal y a 1:1. Parece una UI real: fondo `--color-screen-bg`, márgenes de pantalla, texto nítido sin halo (la pantalla es opaca). En el monitor el titular usa `--text-display`; en el teléfono, `--text-2xl` y cuerpo de 15 px.

## Contraste sobre 3D

- Sobre `--color-screen-bg` `#0B0F16`: text 16.5 · text-muted 8.0 · text-subtle 5.6 · accent 7.8 · status-live 11.2 · SkyMek 9.2 · Parati 8.2 · Ventixs 9.6. Bordes de controles con `border-strong` (4.45, UI ≥ 3).
- Paneles `anchored`: peor fondo realista = pantalla encendida o cono de la lámpara sobre nogal (`#5A3E2B` iluminado); con el charco al 85 %, text-muted ≥ 5.9. Sin `text-subtle`.

## Composición

- **Desktop**: sujeto en una mitad y panel en la otra, con el margen del panel en una columna fija (`TEXT_LEFT` en `src/three/desk/shots/context.ts`). Los paneles nunca tapan la figura enfocada.
- **Móvil**: sujeto en el tercio superior, panel abajo con `--spacing-gutter` y botones al alcance del pulgar.
- Nada cruza el centro del cuadro durante una transición.

## FX (`--fx-*`, `src/three/fx/settings.ts`)

Principio: el post-procesado solo debe notarse si se quita. Un único composer; en `low` no hay nada.

| Efecto | Valor | Nota |
|---|---|---|
| Bloom selectivo | `--fx-bloom-strength` 0.32 · radius 0.45 · threshold 0.88 | Solo emisivos: pantallas, lámpara, señal de Alfa, ciudad |
| Streak | fuerza 0.14, umbral 10 | Solo emisivos sobre el umbral; en `high` y `mid` |
| DoF | `--fx-dof-bokeh-scale` 2.5 × bokeh del capítulo (1–1.4) | `full` en `high`, `lite` en `mid` |
| Grano | `--fx-grain` 0.035 | Estático en pausa |
| Viñeta | `--fx-vignette-darkness` 0.5 · offset 0.32; por capítulo en `grading.ts` (0.35 en `outro`) | |
| Aberración cromática | 0.005 de noche, 0 de día | Casi invisible |
| Fluido | Lluvia del vidrio y vapor de la taza; 256 en `high`, 128 en `mid` | Nunca en texto ni en la cámara |
| Tone mapping | ACES, exposición por capítulo (tabla de capítulos) | |

## Pausa (`data-motion="paused"`)

- Cortes con disolvencia entre capítulos, sin parallax, sin vapor, lluvia congelada (solo gotas estáticas), sin parpadeo de la ciudad.
- La lámpara se enciende sin parpadeo; el amanecer es una disolvencia.

## Lista de revisión

- [ ] Cada capítulo es un plano que se sostiene (quieto:movimiento ≥ 70:30).
- [ ] Se leen las tres luces; el cambio de luz cuenta el capítulo.
- [ ] Ningún texto rota ni escala; todo arranca en un mismo margen izquierdo.
- [ ] La lluvia y la ciudad dan vida sin distraer.
- [ ] El amanecer cierra con calma y los créditos se leen.
