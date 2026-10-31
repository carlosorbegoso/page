# Constelación — dirección de arte del mundo 3D

Complementa `identity.md` (paleta base, tipografía, contraste) y `mascots.md` (cuerpos celestes). Valores en código: `src/styles/tokens.css` (colores `--color-sky-*`, `--color-star-*`, `--color-orbit*`, `--color-plate*`; números `--sky-*`, `--alfa-core-*`, `--plate-*`). Estilo de placas: `src/styles/plates.css`.

## 1. Concepto

**"Un sistema propio en el cielo de otros."** La landing es un viaje por un sistema estelar silencioso. Alfa (TUSOCIO IA) es la estrella; los productos son cuerpos que la orbitan, cada uno con su acento; la carrera es una órbita con cuatro hitos; el visitante llega desde un campo de estrellas que, al mirarlo bien, dibuja la "C" del monograma, y se despide con un faro que Alfa emite hacia él.

Lo que lo hace peculiar (y no "fondo de estrellas genérico"):
- **La luz cuenta la historia.** El único color saturado del cielo sale de Alfa y de las bandas de los productos; todo lo demás es casi monocromo azul-grafito. El ojo sigue la luz.
- **Geometría de instrumento.** Órbitas como líneas de 1 px de plotter, marcas de graduación en los hitos, retícula de constelación con trazos discontinuos: parece una carta celeste técnica, no un videojuego espacial.
- **Calma.** Nada gira rápido, nada explota, nada rebota. Todo se mueve a velocidades orbitales: lentas e inevitables.

Prohibido: lens flares, warp/hiperespacio, partículas de chispa, glitch, neón saturado, planetas con texturas fotográficas, anillos de Saturno, bloom fuerte, motion blur.

## 2. Coordenadas, cámara y placas

- 1 u = 1 m. Cámara `PerspectiveCamera` FOV 30°, `near` 0.1, **`far` 60** (actual de `Stage.ts`).
- **Cielo**: esfera/`Points` de radio `--sky-radius` = 48 u **centrada en la cámara** (copiar `camera.position` cada frame, sin rotación), así nunca sale del `far` aunque la cámara viaje 28 u hacia −Z.
- Estaciones: se conservan los anclajes de `src/three/scenes/stations.ts` (hero `0,0,0` · about `5,0,−7` · company/products `0,0,−14` · experience `−5.5,0,−21` · contact `0,0,−28`). Alfa vive en `0, 0.6, −14` (centro del sistema).
- **Placas (CSS3DRenderer)**: cada `[data-plate]` es un `CSS3DObject` con la misma cámara. Para que el texto se vea nítido, a su distancia de reposo `d` la placa debe proyectarse **1:1**: `scale = 2·d·tan(fov/2) / innerHeight` (recalcular en `resize`). No poner `will-change` en la placa (Chrome la rasteriza a baja resolución y la escala borrosa).
- Las placas miran a la cámara de su estación (orientadas una vez, no billboard continuo) y se inclinan como máximo 8° respecto al plano de pantalla; más inclinación degrada la lectura.
- **Desktop (≥ 1024 px)**: placa en la mitad opuesta al sujeto (`desktopSide`), centrada verticalmente, ancho `--plate-width` (36rem). **Tablet/móvil**: sujeto en la franja superior (cy 0.19–0.3, ya en `screenFrame`), placa abajo, ancho `min(92vw, 26rem)`, sin inclinación.

## 3. Recorrido por estación

| # | Estación | Qué se ve | Composición desktop | Móvil |
|---|---|---|---|---|
| 0 | **Hero** | Campo estelar denso. 9 estrellas más brillantes forman la **constelación "C"** (arco abierto a la derecha) con trazos discontinuos finos que se dibujan al cargar (1.6 s). En la apertura de la C, una estrella azul (el nodo del monograma) = Alfa vista de lejos. | C a la derecha (cx 0.75), ~50 % de alto; placa con nombre y rol a la izquierda. | C arriba, más pequeña (≈ 40 % del ancho); placa abajo. |
| 1 | **Sobre mí** | La cámara se acerca a un **cúmulo-nebulosa**: 6–8 nodos del stack (Java, Quarkus, Spring, PostgreSQL, Docker/K8s, AWS…) como estrellas medianas unidas por una red tenue, envueltos en una nebulosa azul-teal muy suave. | Cúmulo a la izquierda; placa (foto + resumen) a la derecha. | Cúmulo arriba; placa abajo. |
| 2 | **TUSOCIO IA** | Llegada al sistema: **Alfa** en primer plano, núcleo blanco-azulado con halo y su anillo-visor; tres órbitas finas a su alrededor, aún vacías o con los cuerpos lejos. | Alfa a la derecha; placa de la empresa a la izquierda. | Alfa arriba al centro. |
| 3 | **Productos** | La cámara rodea el sistema (~35°): las tres **lunas** en sus órbitas (SkyMek, Parati, Ventixs). La placa activa enfoca su cuerpo: su órbita pasa a `--color-orbit-active` y su banda sube de intensidad. | Sistema a la izquierda; placas (una por producto o carrusel) a la derecha. | Sistema arriba; una placa a la vez (scroll-snap). |
| 4 | **Experiencia** | Una **órbita elíptica grande** inclinada 18° con 4 hitos: SYSARP → Baufest → Intercorp → TCS. Hitos pasados = marcas de graduación + punto `--color-milestone`; **TCS actual** = punto `--color-milestone-current` con anillo que late y un arco de órbita encendido desde Intercorp. | Órbita a la derecha, vista de ¾; placa-timeline a la izquierda. | Órbita arriba en vista más cenital (menos ancho); placa abajo. |
| 5 | **Contacto** | Vuelta hacia Alfa desde lejos: Alfa emite un **faro**, un haz cónico tenue que barre lentamente hacia la cámara y un pulso de anillo que se expande. Mensaje: "señal enviada". | Alfa + haz a la izquierda; placa de contacto a la derecha. | Alfa arriba; placa abajo con botones al alcance del pulgar. |

Transiciones: la cámara viaja en arco (ya implementado con `blendPoses`), `ease-in-out` (`--ease-in-out`), duración ligada al scroll con `scrub: 0.8`. Durante el viaje el campo estelar tiene un **parallax de profundidad** natural (las estrellas están a 48 u, el sujeto a ~5 u); no añadir estelas.

## 4. Cielo

- **Fondo**: `--color-sky-zenith` `#04060B` arriba → `--color-sky-horizon` `#0A0E14` (= `--color-bg`) abajo. Implementación barata: `scene.background` = `CanvasTexture` vertical de 2×256 px, o el `clearColor` + un plano-gradiente lejano. El fallback CSS: `linear-gradient(180deg, var(--color-sky-zenith), var(--color-sky-horizon))`.
- **Nebulosas**: 3 sprites/planos grandes (radio 14–22 u) a 40–46 u con textura de ruido suave horneada (256 px, KTX2 o canvas), `AdditiveBlending`, `depthWrite: false`, opacidad `--sky-nebula-opacity` 0.14. Colores: `--color-sky-nebula-blue` `#1B3A6B` (detrás del hero, arriba-izquierda), `--color-sky-nebula-teal` `#0E3A40` (cúmulo de "Sobre mí"), `--color-sky-nebula-violet` `#2B2150` (detrás de Experiencia/Contacto). Nunca dos superpuestas en el mismo encuadre.
- **Estrellas** — un único `Points` con `ShaderMaterial` (tamaño y color por vértice, `sizeAttenuation` desactivado; tamaños en px de pantalla × DPR):

| Clase | Color | % del total | Tamaño (px CSS) | Brillo |
|---|---|---|---|---|
| Caliente | `--color-star-hot` `#BFD6FF` | 30 % | 0.8–1.6 | 0.7–1.0 |
| Blanca | `--color-star-white` `#F3F6FF` | 45 % | 0.6–1.4 | 0.5–0.9 |
| Templada | `--color-star-warm` `#FFE2BD` | 20 % | 0.8–1.8 | 0.5–0.8 |
| Ascua | `--color-star-ember` `#FFB98F` | 5 % | 1.2–2.4 | 0.4–0.6 |

  Distribución de tamaños sesgada (potencia 3): la gran mayoría casi en el mínimo, muy pocas grandes. Concentración ligera (×1.6) en una banda diagonal tipo "vía láctea" que cruza el hero de abajo-izquierda a arriba-derecha. Forma del punto: núcleo gaussiano + borde suave (sin cruces/spikes).

| Tier | Estrellas (`--sky-stars-*`) | Nebulosas | Parpadeo |
|---|---|---|---|
| `high` | 6000 | 3 | sí |
| `mid` | 2200 | 2 (la del encuadre actual y la siguiente) | sí, a 30 fps |
| `low` / `none` | 0 (fallback de imagen) | — | — |

- **Parpadeo**: solo el ~15 % de las estrellas, brillo × (1 ± `--sky-twinkle-amplitude` 0.18) con periodo `--sky-twinkle-period` 7 s y fase aleatoria (en el shader, uniform `time`). Nada de destellos.

## 5. Alfa (estrella)

- **Núcleo**: la forma facetada de `mascots.md` con `MeshStandardMaterial` `color` `--color-alfa-core` `#EAF4FF`, `emissive` mismo color, `emissiveIntensity` `--alfa-core-intensity` 3.2, rugosidad 0.4, metalness 0. Visor/anillo emisivo `--color-alfa-corona` `#5AA9FF`.
- **Halo**: `Sprite` con textura radial (gradiente `#5AA9FF` α 1 → 0 en curva exponencial), escala `--alfa-halo-scale` 4.5 × el radio del núcleo, `AdditiveBlending`, opacidad `--alfa-halo-opacity` 0.55. Segundo halo blanco más pequeño (1.6×, opacidad 0.35) para el "core glow". Respira 0.5 ↔ 0.6 en 8 s.
- **Luz**: una `PointLight` `#CFE4FF` en Alfa, intensidad 18 cd, `distance` 0, `decay` 2: es la que ilumina las lunas (lado iluminado hacia Alfa, terminador visible). Más la `RoomEnvironment` a `environmentIntensity` 0.25 para que el lado oscuro no sea negro puro. Ninguna otra luz de color.
- **Bloom** (solo `high` desktop, opcional): `UnrealBloomPass` strength 0.35, radius 0.4, threshold 0.85, para que solo brillen núcleo y bandas.

## 6. Lunas (productos)

PBR mate/satinado, iluminadas por Alfa; cada una con su **banda de acento** emisiva (ver `mascots.md` §6).

| Cuerpo | Radio | Órbita (radio, inclinación, periodo) | Material | Banda |
|---|---|---|---|---|
| SkyMek | 0.30 u | 1.6 u, 6°, 90 s | `--color-tool-body` `#8C97A8`, rugosidad 0.45, metalness 0.7 | `--color-skymek` `#F0A43C`, `emissiveIntensity` 1.4 |
| Parati | 0.27 u | 2.2 u, −4°, 120 s | `--color-gift-body` `#2A3142`, rugosidad 0.6, metalness 0.1 | `--color-parati` `#F28BA0`, 1.4 |
| Ventixs | 0.25 u | 2.8 u, 9°, 150 s | `--color-burbu-body` `#1F6E52`, rugosidad 0.55, metalness 0.1 | `--color-ventixs` `#3FCF8E`, 1.4 |

Fases iniciales separadas 120°. En foco: la banda pasa a 2.2 y la luna se acerca a la cámara 0.15 u; las otras bajan su banda a 0.8.

## 7. Órbitas e hitos

- **Órbitas**: `Line` (o `Line2` solo en `high` para 1.5 px reales) de 256 segmentos, `--color-orbit` `#2A3B57` a `--orbit-opacity` 0.45; la órbita en foco a `--color-orbit-active` `#5AA9FF` y 0.9. Cada órbita lleva 24 marcas de graduación diminutas (0.04 u) en el plano: el toque de "carta celeste".
- **Órbita de experiencia**: elipse 3.2 × 2.0 u, inclinada 18°. Hitos a 200°, 250°, 300° y 350° (en orden cronológico, sentido antihorario). Hito pasado: esfera 0.05 u `--color-milestone` `#6A7B94` + marca radial de 0.18 u. **Hito actual (TCS)**: esfera 0.08 u `--color-milestone-current` `#4ADE9A` emisiva 1.8 + anillo que se expande de 0.08 a 0.3 u y se desvanece cada 3.2 s; el arco Intercorp → TCS se dibuja en `--color-orbit-active`.

## 8. Constelación "C" (hero)

- 9 estrellas en un arco de 280° abierto a la derecha (mismo hueco que el monograma), radio 2.2 u, centro `0, 0.55, 0` (sujeto del hero), en un plano que mira a la cámara del hero. Tamaños 3–5 px, color `--color-star-white`; la décima, en la apertura, es el nodo: 6 px, `--color-alfa-corona` con mini-halo.
- Trazos: `LineDashedMaterial` `--color-constellation-line` a `--constellation-line-opacity` 0.35, `dashSize` 0.12, `gapSize` 0.08. Se "dibujan" una vez al cargar animando `drawRange` en 1.6 s con `--ease-out`.
- Ligera rotación de la C entera (±3°) siguiendo el puntero (`pointer: fine`), sin giroscopio.

## 9. Faro de contacto

- Cono abierto (`ConeGeometry` sin tapa, radio 0.9, alto 6, 32 segmentos) desde Alfa hacia la cámara, `MeshBasicMaterial` `--color-beacon` `#8CC8FF`, opacidad 0.06 con gradiente longitudinal (shader o textura alpha), `AdditiveBlending`, `depthWrite: false`.
- Pulso: anillo plano (`RingGeometry` 0.95–1.0) que nace en Alfa y se expande hasta 3 u desvaneciéndose, periodo `--beacon-period` 6 s.
- El haz barre ±6° en 12 s. Al enfocar el botón de email, un pulso extra.

## 10. Movimiento

| Elemento | Cadencia |
|---|---|
| Giro propio de Alfa | 0.05 rad/s |
| Lunas | periodos de 90–150 s (§6) |
| Parpadeo de estrellas | 7 s, ±18 %, 15 % de las estrellas |
| Respiración del halo | 8 s |
| Pulso del hito actual | 3.2 s |
| Faro | pulso 6 s, barrido 12 s |
| Viajes de cámara | ligados al scroll, `scrub: 0.8`, `power2.inOut` |

**Con `prefers-reduced-motion: reduce` o `data-motion="paused"`**: se congelan órbitas, giro, parpadeo, respiración, pulsos y barrido (se renderiza un frame estático con las lunas en su fase inicial y el hito actual con el anillo a mitad de expansión, visible sin movimiento); la C aparece ya dibujada; sin parallax de puntero; la cámara no hace `scrub`, salta de estación con un fundido cruzado de 240 ms (`--duration-base`). Las placas cambian de estado sin transición.

## 11. Texto suelto (placas invisibles)

Regla: **en 3D no hay cajas.** El texto flota suelto en el espacio; la jerarquía la dan la escala tipográfica y la luz, no los rectángulos. Ver `src/styles/plates.css`.

- **`.is-3d .plate`** es un contenedor invisible: sin fondo, borde, radio ni sombra. Lleva `transform-style: preserve-3d` (los hijos pueden tener profundidad con `translateZ`, que gestiona motion) y `backface-visibility: hidden`. **Nunca `transform` en `.plate`** (lo usa CSS3DRenderer). No se le aplican `opacity < 1`, `filter`, `isolation`, `overflow` ni `contain: paint`, porque cualquiera de ellos aplana el 3D de los hijos. Por eso el estado dormido desvanece a los **hijos** y oculta la placa con `visibility`.
- **Legibilidad sin caja**, en dos capas:
  1. **Charco de oscuridad**: `::before` con gradiente radial `closest-side` de `--color-plate-pool` (`rgb(4 6 11 / .85)`) al 60 %, `--color-plate-pool-edge` (`/.7`) al 85 % y transparente al 100 %. Ocupa un área un 60–70 % mayor que el bloque (`--plate-pool-inset: -35% -30%`): no tiene bordes y se lee como "cielo más profundo", no como rectángulo.
  2. **Halo por glifo**: `text-shadow: var(--plate-text-halo)` (tres capas de `--color-sky-zenith` a 1, 6 y 18 px). Tapa las estrellas que caen justo bajo una letra, que son más pequeñas que el halo (≤ 2.4 px).
- **Contraste calculado** con el charco al 85 % sobre el peor fondo realista de cada caso:

| Fondo detrás | `text` | `text-muted` | `text-subtle` | `accent` | `accent-hover` | `status-live` | `skymek` | `parati` | `ventixs` |
|---|---|---|---|---|---|---|---|---|---|
| Cielo (`#0A0E14`) | 17.28 | 8.36 | 5.83 | 8.21 | 10.55 | 11.71 | 9.67 | 8.61 | 10.10 |
| Nebulosa al 14 % | 17.17 | 8.30 | 5.79 | 8.15 | 10.48 | 11.63 | 9.61 | 8.55 | 10.03 |
| Pantalla del monitor (glow 0.15) | 17.09 | 8.27 | 5.76 | 8.12 | 10.44 | 11.58 | 9.57 | 8.52 | 9.99 |
| **Pico del halo de Alfa** (`#3C6BA0`) | 15.73 | 7.61 | 5.30 | 7.47 | 9.61 | 10.66 | 8.80 | 7.84 | 9.20 |
| Estrella blanca (`#F3F6FF`) bajo el texto | 12.30 | 5.95 | 4.15 ✗ | 5.84 | 7.51 | 8.34 | 6.89 | 6.13 | 7.19 |
| Borde del charco (70 %) sobre el halo de Alfa | 13.43 | 6.50 | 4.53 | 6.38 | 8.20 | 9.10 | 7.52 | 6.69 | 7.85 |

  Sin charco, sobre el pico del halo de Alfa, `text-muted` cae a 2.29: **el charco es obligatorio**. Reglas derivadas: en texto suelto no se usa `text-subtle` (usar `text-muted`); el núcleo de Alfa (intensidad > 50 % del halo) nunca debe quedar detrás de una placa, cosa que la composición ya garantiza (sujeto y placa en mitades opuestas).
- **Tipografía protagonista**: en 3D los `h2` de placa suben a `text-4xl` y la frase principal del hero usa `.plate-display` (`--text-6xl`: 48 → 92 px). Sora semibold con `tracking-display`. Cuerpo en `text-lg` y `text-muted`.
- **Línea de señal suelta**: trazo de luz de 2 px (`--plate-signal-width`, 3rem) delante del eyebrow (el `p` que precede a un `h1`/`h2`/`h3`, o cualquier elemento con `[data-signal]`), del color `--plate-accent` (`--product-accent` → `data-plate-accent` → `--color-accent`). En `[data-active]` se alarga a 6rem y gana un glow de 12 px.
- **Botones flotantes** (`ui/Button.astro`): píldoras sin relleno sólido. El primario lleva un borde de acento al 55 %, un tinte del 10 % y un glow suave del acento que crece en hover. El secundario lleva un borde de texto al 15 % que se ilumina al 45 % en hover. El ghost es texto con subrayado de luz. El texto hereda el halo. El foco es siempre el anillo `shadow-focus`.
- **Tags** (`ui/Tag.astro`): solo texto y un punto de color de 6 px; el punto "live" tiene un glow mínimo. Sin fondos ni bordes.
- **Movimiento**: el estilo es estático (color, luz, estados). La profundidad (`translateZ`) y las reacciones al hover las pone el especialista de motion en los hijos.
- **Fallback** (`html` sin `.is-3d`): las placas vuelven a ser tarjetas discretas (fondo `--color-plate-solid`, borde fino, `shadow-md`). El modo claro solo aplica aquí.
