# Escritorio de noche: implementación del set (`ShotProvider`)

Dirección: sección final de `docs/PLAN.md`, `docs/design/desk.md` v2 y `docs/design/mascots.md`. Código: `src/three/desk/**`. `index.ts` registra `new DeskSet()` con `registerShotProvider`.

## Archivos

| Archivo | Qué hace |
|---|---|
| `DeskSet.ts` | `ShotProvider`: carga el set, luces por capítulo, acciones (encendido, Alfa, figuras, carpetas, teléfono, amanecer), superficies, anclas, foco, picks y hover. |
| `shots.ts` | Encuadre por capítulo y subplano (horizontal y vertical), `toShot`, `panelAnchor` y `checkShots` (límites del director: ≤ 28° entre vistas y ≤ 1.4 m). |
| `layout.ts` | Medidas y posiciones (mundo = cuarto, 1 u = 1 m, origen en el suelo bajo el centro del tablero, −Z hacia la ventana). |
| `props.ts` | Geometría procedural de cada prop y paleta leída de los tokens. |
| `atmosphere.ts` | Cielo y ciudad en 3 capas (un draw call, amanecer por uniform), vidrio con lluvia (`withFluidFragment`) y vapor de la taza (`withFluidDisplacement`). |
| `materials.ts` | Material atlas: color, rugosidad, metalness, emisión, veta y id por vértice; AO analítico; elevación y giro de las figuras en el vertex shader; brillo por objeto; texturas de pantalla y teléfono; env map nocturno. |
| `builder.ts` | `PartBuilder` (fusiona primitivas) e ids de objeto. |
| `preview.ts` | `mountDeskPreview(container)`: render aislado con `show(chapter, sub)`, `surface(name, html)` y `checks()`. La app no lo importa. |

## API (`ShotProvider`)

- `getShot(chapter, sub)`: los 8 capítulos (`intro` usa el plano de `hero`). `subShotCount`: `about` 2 (mismo plano: cambia el slide), `products` 3 (SkyMek, Parati, Ventixs) y `experience` 4 (TCS en la carpeta abierta de la mesa, luego Intercorp, Baufest y SYSARP en la estantería). El FOV es el del director (`context.fov()`).
- `getSurface('monitor' | 'phone')`: el plano exacto del vidrio, con `scale` a 1:1 desde el plano que lo lee (`hero`/`about` para el monitor, `contact` para el teléfono) y `size` en metros (monitor 0.598 × 0.336, teléfono 0.065 × 0.14).
- `getAnchor(name)`: `company`, `product-skymek`, `product-parati`, `product-ventixs`, `exp-tcs`, `exp-intercorp-retail`, `exp-baufest`, `exp-sysarp`, `outro`. El punto 3D se proyecta donde arranca el panel: en horizontal, la columna del 54 % y el 34 % de alto (el sujeto queda en el 32 %); en vertical, el margen del 6 % y el 60 % de alto (el sujeto en el tercio superior). `outro` cae sobre la pared trasera, arriba a la izquierda.
- `getFocus(chapter, sub)`: la pantalla, Alfa, la figura activa, la carpeta activa o el teléfono. En `outro` devuelve `null` (sin DoF).
- `picks`: Alfa → `#company`; SkyMek, Parati y Ventixs → `#products` (con `product`); las 4 carpetas → `#experience` (con `experience`); el teléfono → `#contact`. `setHover` y `resolvePick` funcionan como antes.
- `update(dt, time, state)`:
  - Luz por capítulo (desk.md §5).
  - `intro`: dos destellos de 60 ms, la lámpara de 0 a 1 en 0.5 s y después el monitor en 0.3 s.
  - `company`: Alfa gira 20° a ≤ 0.1 rad/s y su señal sube.
  - `products`: la figura activa sube 2 cm y gira a 0.05 rad/s.
  - `experience`: el lomo activo se ilumina (la carpeta abierta, con TCS).
  - `contact`: el teléfono se enciende con una notificación.
  - `outro`: la lámpara se apaga, el cielo amanece, las ventanas de la ciudad se apagan en cascada y la luz de la ventana se vuelve cálida.
  - Con reduced motion o en captura todo salta al estado final.

## Planos (1440 × 900, comprobados con `checkShots`)

| Transición | Ángulo | Distancia |
|---|---|---|
| hero → about | 4° | 0.65 m |
| about → company | 12° | 0.76 m |
| company → products / entre figuras | 2° / 0° | 0.20 / 0.15 m |
| products → exp TCS | 25° | 0.87 m |
| exp TCS → Intercorp | 21° | 0.72 m |
| entre carpetas | 0° | 0.09 m |
| SYSARP → contact | 22° | < 1.4 m |
| contact → outro | 22° | 1.32 m |

También pasan en 390 × 844, 1024 × 1366 y 1920 × 1080.

## Presupuesto medido

| | `high` | `mid` |
|---|---|---|
| Triángulos del set | 20 676 | 15 159 |
| Draw calls | 5–8 según el plano (cuarto, pantalla, teléfono, ciudad, vidrio, sombras de contacto, vapor) | 3–6 |
| Luces | Spot con sombra horneada una vez, Point del monitor, direccional y hemisférica | Igual, sin sombra |

## Decisiones que se apartan de desk.md v2

- **Monitor vertical en < 768 px**: la cabeza (`desk-monitor`, malla propia) gira 90° sobre su pivote; `getSurface('monitor')` devuelve 0.336 × 0.598 m y una escala a 0.82 de 1:1 (`PORTRAIT_SCREEN_PROJECTION`), es decir unos 395 × 703 px CSS a 390 × 844. `about` se acerca hasta que el monitor ocupa el 86 % del ancho.

0. **Peana de 50 cm** (no 24): SkyMek y Parati en los extremos, Alfa atrás a la izquierda del centro y Burbu delante. Así cada macro de producto deja a las vecinas fuera de cuadro. En horizontal el texto va a la izquierda (columna del 56 %) y el sujeto en el 70 % del ancho, también en `company` y `experience`. Alfa es un torno facetado de 9 lados con anillo de latón de 1.3 mm.

1. **Lámpara atrás a la derecha**: el doc pide la lámpara "atrás a la izquierda" y a la vez la peana "a la derecha, bajo su cono". Manda el cono.
2. **Teléfono en un soporte de nogal** inclinado 16° respecto a la vertical, en vez de tumbado y con un plano cenital a 45°. Así la superficie se ve de frente a 1:1 y el plano anterior (estantería) queda dentro del límite de giro.
3. **Estantería**: lomos vistos con rumbo −34° y pitch +3° (en lugar de +18°/−35°), para cumplir ≤ 28° con `products` y con `contact`.
4. **`outro`** se coloca a 0.2 m detrás del `hero` (no 0.3), para cumplir 1.4 m desde `contact`.
5. **Calibración de luces y albedo** (como en v1): `LIGHT_CALIBRATION` en `DeskSet.ts` y `PERCEIVED_TO_ALBEDO` en `props.ts`. El monitor es una `PointLight` suave: `RectAreaLight` pesaba unos 100 KB.
6. Pendiente: la tapa de la caja que sube, los puntos de Burbu "escribiendo", la ventana de la ciudad que se apaga cada ~20 s y el reflejo falso en la ventana desde los ángulos oblicuos.

## GLB (Carlos con Tripo; prompts en `mascots.md`)

La interfaz no cambia: `load()` deja de llamar a los `build*` de esa pieza y carga el GLB (escala real, pivote en la base, +Y arriba). Nodos esperados: `body`, `ring` y `signal` (Alfa); `body` y `dot-1..3` (Burbu); `body`, `lid`, `ribbon` y `signal` (caja); `body`, `band`, `stand` y `signal` (SkyMek); `body` e `inlay` (peana); `body` y `screen` (teléfono: `screen` da el plano de la superficie); `body` y `label` (carpeta, duplicada ×4 con `--color-folder-*`); `body` y `sheet` (carpeta abierta). Las partes `signal`/`dot-N` reciben el emisivo y el id de objeto de su pieza, y las figuras se colocan en `FIGURES` (`layout.ts`). Para mantener el giro y la elevación por shader, hay que asignar el atributo `oid` (1 Alfa, 2 Ventixs, 3 Parati, 4 SkyMek) o animar el nodo directamente.
