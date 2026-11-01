# Escritorio de noche (`DeskSet`, `ShotProvider`)

Qué entrega el escritorio al director (planos, superficies, anclas, foco, picks), qué hace en cada capítulo y qué decisiones se apartan de la dirección de arte; léelo antes de tocar `src/three/desk/**`. Qué archivo edita cada cosa: `docs/codemap/desk.md`. Dirección: `docs/design/desk.md` y `docs/design/mascots.md`.

## Registro

`src/three/desk/index.ts` exporta `install()`, que llama a `registerShotProvider(new DeskSet())`. Mundo = cuarto, 1 u = 1 m, origen en el suelo bajo el centro del tablero, −Z hacia la ventana (`src/three/desk/layout.ts`).

## `getShot` / `subShotCount` (`SUB_SHOTS`)

| Capítulo | Sub-planos |
|---|---|
| `intro`, `hero` | 1, el mismo plano frente al monitor |
| `about` | 2: en horizontal, el mismo plano (cuadro de la pared + monitor; cambia el slide); apilado, 0 = cuadro + tarjeta impresa de frente, 1 = monitor al ~97 % del ancho |
| `experience` | 5: 0 = estante (`exp-intro`), luego `EXPERIENCE_ORDER` = SYSARP, Baufest, Intercorp, TCS (carpeta abierta de la mesa) |
| `company` | 1 (Alfa) |
| `products` | 3: SkyMek, Parati, Ventixs (`PRODUCT_FIGURES`) |
| `contact` | 1 (teléfono) |
| `outro` | 1: en horizontal, la misma caja que el hero con 9 % de margen y rumbo −16° (hacia el teléfono, si no contacto → cierre pasa de 1.4 m); apilado, el monitor con marco al 91 % del ancho girado 8° hacia el teléfono |

- Encuadres por viewport con caché (`framings`). El FOV es el del director (`context.fov()`).
- Horizontal (`box-fit.ts`): en ≥ 768 px los paneles HTML de productos, empresa y experiencia están ocultos (el texto va impreso en el cuarto), así que cada plano centra una caja de encuadre (protagonista + objeto con texto) con 7 % de margen y la parte de arriba bajo el HUD (72 px); la distancia sale del aspecto actual y se recalcula al redimensionar (`framings` cachea por viewport; en escritorio también un cambio solo de alto). Hero, about y cierre: cuadro y lámpara, monitor, corcho y la línea de la mesa en z = 0 (`roomShot`, `about-shots.ts`); productos: figura + su tarjeta (Ventixs sin Alfa, con el teléfono fuera de cuadro); estante: carpetas + portada; carpetas sueltas: no más cerca de 1.18 m. Vertical no apilado (tablet) sigue con `storyShot`/`heroDistance`. Apilado: panel acoplado abajo, sujeto en la mitad superior bajo el HUD; hero y stack con el monitor y su marco al 93 % del ancho; hero, stack y cierre centran en alto el monitor con Charizard y Pikachu entre el HUD y el 90 % del lienzo (`stacked-monitor-place.ts`; en 390×844 el marco va de 261 a 468 px).

## Límites entre planos (`checkShots`, `SHOT_LIMITS`)

- Planos consecutivos en orden de historia: ≤ 28° entre direcciones de vista y ≤ 1.4 m entre posiciones. Así ninguna transición pasa de 1.4 s en el director.
- Comprobar: `mountDeskPreview(container).checks()` (`src/three/desk/preview.ts`, la app no lo importa) en 1280 × 720, 1362 × 663, 1440 × 900, 1920 × 1080, 1024 × 768, 844 × 390, 390 × 844, 375 × 667 y 360 × 780.

## `getSurface('monitor' | 'phone')`

- Plano exacto del vidrio (+1.5 mm), con `scale` a 1:1 desde el plano que lo lee: el monitor desde `hero` (o `about` sub 1 en `about`), el teléfono desde `contact`.
- `size` en metros: monitor 0.598 × 0.336, teléfono 0.065 × 0.14 (`MONITOR.screen`, `PHONE.screen`).

## `getAnchor(name)` (`ANCHOR_NAMES`)

`hero`, `about-bio`, `about-stack`, `company`, `product-skymek`, `product-parati`, `product-ventixs`, `exp-intro`, `exp-tcs`, `exp-intercorp-retail`, `exp-baufest`, `exp-sysarp`, `outro`, y `lamp` (posición de la lámpara; la usa `stage:reveal`). `outro` cae sobre la pared trasera, arriba a la izquierda.

## `getFocus` y `picks`

- Foco: el sujeto del encuadre (pantalla, Alfa, figura activa, carpeta, teléfono); `outro` → `null` (sin DoF).
- Destinos: Alfa → `#company`; SkyMek, Parati, Ventixs y sus post-its → `#products` (con `product`); las 4 carpetas y la carpeta abierta → `#experience` (con `experience` y `sub`); teléfono → `#contact`.
- Acciones sin viaje (`action` → `desk:action`): lámpara e interruptor (`lamp`), Pikachu/Charizard (`battle`), cuadro (`portrait`, desvío de cámara), ventana o cadena (`blind`: baja o sube en ~1.1 s con un rebote leve y se mece al parar; la luz sigue el valor animado), planta, laptop, visitar producto (`visit`); taza y reloj (`desk:clock`) solo reaccionan.
- Clic en la carpeta del sub-plano actual la saca del estante (`folder`); Esc o clic fuera la devuelve.

## `update(dt, time, state)`

- Luz por capítulo (`src/three/desk/set/levels.ts`), de noche y de día (`html[data-time="day"]`).
- `intro`: dos destellos de 60 ms, la lámpara sube y luego el monitor en 0.3 s.
- `company` / `products`: la cabeza de Alfa sigue al puntero; la figura activa sube y gira (≤ 0.05 rad/s).
- `experience`: el estante se ilumina; la carpeta del sub-plano se abre sola al asentarse la cámara.
- `contact`: el teléfono se enciende.
- `outro`: la lámpara se apaga, amanece y la luz de la ventana se vuelve cálida.
- Las ventanas de la ciudad se apagan en cascada según `LATENESS` del capítulo (`uLate`, de 0 en `hero` a 0.6 en `outro`).
- Con reduced-motion o en captura todo salta al estado final (`step` = 10).
- Sombra de la lámpara solo en `high`, con `shadowMap.autoUpdate = false`: se re-renderiza solo cuando cambia la pose de una figura, el reloj suena o se mueve una carpeta.

## Decisiones que se apartan de `docs/design/desk.md`

1. **Peana de 50 cm** (no 24): SkyMek y Parati en los extremos, Alfa atrás a la izquierda del centro, Burbu delante. Cada macro de producto deja a las vecinas fuera de cuadro.
2. **Lámpara atrás a la derecha**: el doc pide "atrás a la izquierda" y a la vez la peana "a la derecha, bajo su cono". Manda el cono.
3. **Teléfono en un soporte inclinado** (`PHONE.lean`) en vez de tumbado con plano cenital: la superficie se ve de frente a 1:1 y el giro desde el plano anterior cabe en 28°.
4. **Calibración de luces y albedo**: `LIGHT_CALIBRATION` en `src/three/desk/set/lighting.ts` y `PERCEIVED_TO_ALBEDO` en `src/three/desk/props/palette.ts`. El monitor ilumina con una `PointLight`: `RectAreaLight` pesaba unos 100 KB.
5. **Lo nuevo va después del primer frame**: el margen del presupuesto es ~2 KB (`docs/3d/budget.md`).

## Trampas de las figuras animadas (`src/three/desk/life/classify.ts`)

- **Alfa**: todo lo que está por encima de `ALFA_NECK_Y` (6.7 cm sobre la base) gira con la cabeza, y lo emisivo a la altura de `ALFA_HEAD_Y` se trata como ojos. Base, cintura, pecho y brazos de `props/figures/alfa.ts` tienen que quedar debajo de 6.7 cm, y solo debe brillar la luz del pecho.
- **Regalo (Parati)**: todo lo que está por encima de `GIFT_SEAM_BAND` (4.28 cm) sube con la tapa. En `props/figures/gift.ts`, la caja y su cinta van debajo y cada pieza del moño y de la tapa va encima.
- **Pikachu y Charizard** comparten el negro y el blanco: `life/pokemon/parts.ts` los distingue por la distancia a cada base (`REACH`, `HEIGHT`), no por el color.

## Batalla Pokémon (`life/pokemon/`)

- Solo `parts.ts` va en el arranque (parte las mallas). `PokemonLife` llega con `deferred`: hasta entonces las figuras están en reposo y un clic queda en cola hasta que llega.
- Golpes (s, `timeline/beats.ts`, 8.8 s): cara a cara 0–1.1 (se giran, Pikachu se agacha con chispas, Charizard se encabrita y abre las alas) · despegue 1.0–2.05 (amago, aleteo de 0.34 s con la membrana plegada en la subida y vaivén del cuerpo, 3.2 cm de altura) · Lanzallamas 2.05–3.4 (inspira y lanza) · Ataque Rápido 2.48–3.02 (salto lateral de 2.8 cm con estela, sin salirse de la base del monitor; el fuego da donde estaba) · Impactrueno 3.35–4.55 (carga 0.45 s, tres descargas a 3.8/4.05/4.28) · impacto 3.83–4.9 (destello, retroceso 1.2 cm, temblor, chispas, humo) · aterrizaje 4.6–6 · victoria 5.85–7.4 (Pikachu salta dos veces, orejas arriba, cola) y rugido con humo 6.2–7.3 · vuelta al reposo 7.5–8.8.
- Cada golpe suma contribuciones que valen exactamente 0 fuera de su ventana: al terminar, la pose es la de reposo. `still` apaga la vida en reposo (orejas, alas) durante la batalla para que no pelee con el aleteo.
- Doble clic bloqueado mientras dura; otro clic al terminar la repite. El inicio se fija en el siguiente cuadro (el reloj del escritorio puede estar viejo con el bucle dormido).
- **Luz**: no se agrega una luz (cambiar el número de luces recompila todos los materiales). Se toma prestada la `PointLight` del monitor (`LightRig.monitorLight`): durante el fuego o el rayo se mueve sobre la pelea, se tiñe de naranja o azul y suma `FIRE_INTENSITY`/`BOLT_INTENSITY` (`effects/flash-light.ts`); al terminar vuelve a su sitio y color. `lights.apply` reescribe la intensidad en cada cuadro antes de `life.pose`.
- **Movimiento reducido o pausa** (`motionAllowed(readMotion())`, no `context.motion()`, que es la ventana de vida en reposo): versión tranquila de 3.4 s, se miran a medias, la llama de la cola y la boca brillan suave y las mejillas se encienden sin parpadeo. Sin destellos, temblor, partículas ni luz.
- Los efectos son aditivos con `depthWrite: false` y quedan por debajo del borde del monitor (y ≈ 0.93). `poseKey` solo incluye lo que da sombra.
- **Papel impreso**: la lámpara lava el papel iluminado, así que las caras impresas se oscurecen con `PAPER_LEVEL` (`notes/paper.ts`) para que la tinta conserve el contraste. Además cada cara tiene una luz propia baja (`PAPER_SELF_LIGHT`, el mapa impreso como emisivo): una tarjeta a contraluz de la lámpara, como la de Parati de noche, no se vuelve negra y la tinta sigue oscura.

## Ids de objeto (`OBJECT_ID`, `src/three/desk/builder.ts`)

1 Alfa, 2 Ventixs, 3 Parati, 4 SkyMek, 5–8 carpetas SYSARP/Baufest/Intercorp/TCS, 9 carpeta abierta, 10 teléfono, 11 tapa de la carpeta abierta. El shader del atlas usa el id por vértice para el brillo, la elevación y el giro de las figuras: un GLB que reemplace una pieza tiene que llevar ese id o animar el nodo directamente.

## Pendiente

- Reflejo falso de la ventana desde ángulos oblicuos: solo existe el reflejo de la lámpara en el vidrio (`uLampReflection`).
