# Director de cámara y capítulos — "Una noche en el escritorio"

Código: `src/three/director.ts`, `src/three/scroll.ts`, `src/three/plates.ts`, `src/three/world.ts`, `src/three/Stage.ts`. Contratos: `src/three/contracts.ts`.

## Contratos (para escritorio, FX, UI, motion y sonido)

- **Capítulos**: `CHAPTERS = intro, hero, about, company, products, experience, contact, outro`. `intro` es el encendido (sin sección); el resto son `section[data-station="<id>"]`.
- **Eventos en `window`**:
  - `chapter:enter {id, subIndex}`: se pide un plano y la cámara empieza a moverse.
  - `chapter:settled {id, subIndex}`: la cámara se asentó; el texto entra ahora.
  - `chapter:progress {id, progress}`: progreso del scroll dentro del capítulo, de 0 a 1.
  - `scene:hover {label}`: objeto bajo el puntero.
- **`ShotProvider`** (lo registra el escritorio con `registerShotProvider`): `object3D`, `load(context)`, `update(dt, t, state)`, `getShot(chapter, sub)`, `subShotCount(chapter)`, `getSurface('monitor'|'phone')` (ancla CSS3D frontal con `scale` y `size` en metros), `getAnchor(name)` (punto 3D de un panel 2D), `getFocus(chapter, sub)` (rack focus) y `picks`, `resolvePick` y `setHover`.
  - Mientras el escritorio siga registrado como `StationModule` de `hero` (legado), `world.ts` lo adapta: su pose de lectura es el plano de `hero`, `about` hace un push-in de 0.4 m y el resto mantiene el plano de `hero`.
- **Placas** (`[data-plate]` dentro de cada sección):
  - `data-plate-mode="surface-monitor" | "surface-phone"`: CSS3D sobre la superficie, frontal y 1:1, sin animación del motor. El motor fija `--surface-width` y `--surface-height` (px CSS) cuando el escritorio da `size`.
  - `data-plate-mode="anchored"` (es el valor por defecto): panel HTML en la capa 2D fija `.stage-panels`, colocado solo por traslación en la proyección de `getAnchor(data-plate-anchor)`; nunca rota ni escala. `data-plate-side="left|right"` elige el lado en desktop. En móvil el panel va centrado bajo el objeto, desde el 42 % del alto, y se desplaza con `chapter:progress` si no cabe.
  - `data-plate-sub="<n>"` asigna una placa a un sub-plano; una placa sin ese atributo se muestra en todos los sub-planos de su capítulo. Si ninguna placa del capítulo lo usa, la k-ésima placa corresponde al sub-plano k.
  - Estados: `data-active` cuando el capítulo y el sub-plano son los actuales y la cámara ya se asentó; `data-dormant` en los capítulos a más de 1 de distancia. Las placas de los capítulos vecinos quedan transparentes pero enfocables: un `focusin` hace scroll a su capítulo.
  - Atributos que añade el motor: `[data-plate-wrapper]`, `[data-plate-chapter]`, `.stage-surfaces`, `.stage-panels`, `section[data-station-spacer]` y `html.is-3d`.

## Director (`CameraDirector`)

- **Un plano fijo por capítulo o sub-plano.** La cámara solo se mueve entre planos.
- **Límites aplicados por código:**
  - Roll 0: `lookAt` con +Y del mundo.
  - FOV 30 en ≥ 1024 px y 40 por debajo, sin respiración.
  - Duración de la transición = `clamp(max(distancia / 1 m/s, ángulo / 20°/s), 0.9, 1.4)` s, con `power2.inOut`. `lastRequiredSeconds` > 1.4 indica que esos dos planos están demasiado lejos y hay que acercarlos en el escritorio.
  - Interpolación lineal de posición y objetivo, sin arcos ni órbitas.
  - Parallax del cursor (≤ 1.5° de yaw, ≤ 0.8° de pitch) solo con la cámara asentada, `pointer: fine` y movimiento permitido. `PointerField.enabled` es `false` durante las transiciones.
- **Reduced-motion o pausa:** corte con disolvencia de 300 ms (150 ms de salida y 150 de entrada) hecha con WAAPI, para que el kill-switch global de transiciones no la anule.
- **Intro:** si la página carga arriba y el movimiento está permitido, se queda en `intro` durante 2.4 s (el escritorio enciende la lámpara y el monitor según `state.id`) y luego pasa al capítulo que marque el scroll.

## Scroll (`setupChapterScroll`)

- **Desktop:** `ScrollTrigger` con `pin: true` por sección durante `subs × 100vh` (inicio en `top top+=2`). El sub-plano es `floor(progress × subs)`.
- **Táctil o < 1024 px:** sin pin y sin scrub. Cada capítulo se dispara cuando su sección cruza el 50 % del viewport, y el espaciador mide `subs × 100svh`.
- Sin `normalizeScroll`. A cada momento un solo capítulo manda: el último que entró.
- El número de sub-planos sale de `ShotProvider.subShotCount`; si no, del número de placas; y como último recurso, `products` = 3.

## Mediciones (build de HEAD, gzip -9)

| Chunk | KB |
|---|---|
| three (motor + director + CSS3D) | 95.8 |
| núcleo de three (chunk `tokens`) | 60.5 |
| gsap + ScrollTrigger | 44.5 |
| desk | 14.8 |
| fx | 10.6 |
| **Total del 3D al arrancar** | **≈ 226** (presupuesto 260) |

JS inicial del 3D: unos 3 KB. Draw calls: 11–18 por capítulo sin el escritorio nuevo.
