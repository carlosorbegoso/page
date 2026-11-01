# Director, capítulos, placas y navegación por planos

Contratos entre el Stage y el resto (capítulos, eventos, `ShotProvider`, placas), límites de cámara y cómo el scroll elige el plano; léelo antes de tocar `src/three/director.ts`, `src/three/scroll.ts`, `src/three/stage/chapters.ts`, `src/three/plates/` o `src/motion/story-nav/`. Archivos: `docs/codemap/stage.md`.

## `CHAPTERS`

`intro, hero, about, experience, company, products, contact, outro` (`src/three/contracts.ts`). Debe coincidir con el orden DOM de las secciones. `intro` es el encendido y no tiene sección; el resto son `section[data-station="<id>"]` (`SECTION_CHAPTERS`, `chapterElement`).

## Eventos en `window`

| Evento | `detail` | Cuándo |
|---|---|---|
| `chapter:enter` | `{id, subIndex, duration}` | Se pide un plano; la cámara empieza a moverse |
| `chapter:settled` | `{id, subIndex}` | La cámara se asentó; el texto entra ahora |
| `chapter:progress` | `{id, progress}` | Scroll dentro del capítulo, 0..1 |
| `story:progress` | `{value, index, total}` | Progreso global: 0 en el centro del primer sub-plano, 1 en el del último |
| `story:ready` / `story:disposed` | `{total}` / — | Navegación por planos montada / desmontada |
| `story:goto` | `{chapter, sub?}` · `{step: ±1}` · `{edge: 'start'\|'end'}` | Petición de ir a un plano |
| `story:tour` | `{action?: 'toggle'\|'start'\|'stop'}` | Petición de recorrido automático |
| `story:tour-state` | `{state: 'playing'\|'paused'\|'finished'}` | Estado del recorrido |
| `scene:hover` | `{label}` | Objeto bajo el puntero, o `null` |
| `desk:focus` | `{point}` | El DoF enfoca un punto (carpeta en mano) o vuelve al sujeto |
| `desk:detour` | `{shot}` | Desvío de cámara hacia un plano y vuelta con `null` (1.2 s, `src/three/stage/detour.ts`) |
| `stage:progress` / `stage:reveal` | `{value}` / `{intro, lamp}` | Carga y primer frame (`docs/3d/engine.md`) |

Clic en un objeto (`src/three/stage/navigate.ts`): `desk:action` para juguetes y acciones; si no, espera 550 ms (figura) o 300 ms y hace scroll al plano, con `product:focus` / `experience:focus` (`source: 'scene'`). Con reduced-motion viaja sin espera.

## `ShotProvider`

Lo registra el escritorio con `registerShotProvider` (`src/three/desk/index.ts`). Miembros: `object3D`, `load(context)`, `update(dt, t, state)` (true mientras se mueve), `getShot(chapter, sub)`, `subShotCount`, `getSurface('monitor'|'phone')`, `getAnchor(name)`, `getFocus(chapter, sub)`, `picks`, `resolvePick`, `setHover`, `dispose`. Detalle del escritorio: `docs/3d/desk.md`.

- Sub-planos de un capítulo: `ShotProvider.subShotCount`; si no hay, el número de placas; mínimo `products` = 3.
- `StationContext.readingPose` es heredado: devuelve el plano 0 del capítulo (`World.shot`) y el escritorio no lo usa.

## `CameraDirector` (`CAMERA_LIMITS`)

- Un plano fijo por capítulo o sub-plano; la cámara solo se mueve entre planos. Roll 0 (`lookAt` con +Y del mundo).
- Duración = `clamp(max(distancia / 1 m/s, ángulo / 20°/s), 0.9, 1.4)` s, easing quíntico (`cinematicEase`), interpolación lineal de posición y objetivo, sin arcos. `lastRequiredSeconds` > 1.4 indica que dos planos están demasiado lejos: hay que acercarlos en el escritorio (`checkShots`).
- FOV: lo decide el Stage por layout (30 / 40 / 52 apilado); el FOV del `Shot` se ignora.
- Parallax del cursor ≤ 1.5° yaw y ≤ 0.8° pitch, solo asentado, `pointer: fine` y en la ventana de reposo. `PointerField.enabled` es `false` durante las transiciones.
- Respiración (asentado y en reposo): 6 mm, 0.12°, periodo 11 s, entra en 2.5 s. Solo en `company`, `products`, `experience` y `outro`; en apilado también `hero` y `about` (`breathes`).
- Reduced-motion o pausa: corte con fundido a negro de 150 + 150 ms sobre el canvas, la capa CSS3D y los paneles, hecho con WAAPI (`filter: brightness`) para que el kill-switch global de transiciones de `src/styles/tokens/modes.css` no lo anule.
- Intro: si la página carga arriba y hay movimiento, se queda en `intro` 2.4 s desde el primer frame; los planos pedidos mientras tanto quedan en `pending` y se aplican al terminar.

## Scroll (`setupChapterScroll`)

- GSAP + ScrollTrigger + ScrollToPlugin, importados después del primer frame. `ignoreMobileResize`; sin `pin`, sin `scrub`, sin `normalizeScroll`, igual en todos los dispositivos.
- Cada sección es un espaciador de `subs × 100svh` (alto, `min-height`, sin padding). Cada sub-plano posee exactamente un viewport de scroll.
- Un trigger por sección, `top 50%` → `bottom 50%`. Manda el último que entró; al salir, otro activo. Sub-plano = `floor(progress × subs)`; la cámara solo cambia en los límites.
- El último trigger termina 2 px más allá del scroll máximo: ScrollTrigger está inactivo con `progress` 1.
- `positionOf(chapter, sub)` = centro del tramo del sub-plano; el último plano descansa al fondo de la página.
- `history.scrollRestoration = 'manual'`: un scroll restaurado a mitad de página llegaba antes que los triggers y mostraba otro plano. La historia empieza arriba.
- Se re-mide en `load`, `document.fonts.ready` y resize. Si un `chapter:settled` llega con un plano viejo (pedido durante la intro), se vuelve a pedir el que muestra el scroll.

## Navegación por planos (`setupStoryNav`)

| Entrada | Efecto |
|---|---|
| Rueda | Un gesto = un plano: acumula 40 px; un gesto termina tras 160 ms sin eventos; el resto del gesto y la rueda durante un tween se anulan |
| ↓ / PageDown / Espacio · ↑ / PageUp / Shift+Espacio | ±1 plano; Home / End: inicio / último |
| Enlace `#<capítulo>` de la misma página | Va al primer plano de ese capítulo |
| `story:goto`, `story:tour` | Ver eventos |
| Táctil, arrastre, scroll libre | Al soltar, tras 150 ms quieto, ajusta (snap) al plano más cercano |

- Tween: `gsap.to(window, {scrollTo})`, `power2.inOut`, 0.35–1.2 s según distancia, `autoKill` si el usuario hace scroll. Sin movimiento: salto instantáneo y sin snap.
- No intercepta: con modificadores, scroll horizontal, `dialog[open]`, `[data-hud-menu]`, `[role="menu"|"listbox"|"slider"]`, campos de formulario, contenedores con scroll propio, ni Espacio sobre botones/enlaces. Tras una tecla nativa no ajusta durante 1 s.
- Recorrido automático: espera `chapter:settled` (o 2.5 s), lee `clamp(1.5 s + 45 ms × caracteres de las placas activas, 4, 10)` s y avanza; cualquier entrada lo pausa (salvo `[data-story-tour]` / `[data-story-tour-quick]`) y ocultar la pestaña también. Si empieza al final, vuelve al principio.

## Placas (`[data-plate]` dentro de cada sección)

| Atributo | Efecto |
|---|---|
| `data-plate-mode="surface-monitor"\|"surface-phone"` | CSS3D sobre el vidrio, frontal y 1:1, sin animación del motor. Con `size` el motor fija `--surface-width` / `--surface-height` (px CSS) |
| `data-plate-mode="anchored"` (por defecto) | Panel HTML en la capa 2D fija `.stage-panels`, solo trasladado a la proyección de `getAnchor(data-plate-anchor)`; nunca rota ni escala |
| `data-plate-side="left\|right"` | Lado del panel en desktop; por defecto, el contrario al ancla |
| `data-plate-stacked` | En apilado la placa de superficie pasa a `anchored` (necesita `data-plate-anchor`) |
| `data-plate-sub="<n>"` | Sub-plano de la placa; sin él se ve en todos. Si ninguna placa del capítulo lo usa, la k-ésima va al sub-plano k |

- Desktop: panel junto al ancla, a 32 px, dentro de los márgenes del HUD. Táctil: centrado, desde `max(ancla + 10 % alto, 42 % alto)`; si no cabe, se recorta y hace scroll interno (`data-plate-overflow="start|middle|end"`). Ya no se mueve con `chapter:progress`.
- Estados: `data-active` = capítulo y sub-plano actuales y cámara asentada; `data-dormant` = capítulos a más de 1 de distancia. Las placas que no son del plano actual quedan con opacidad 0 y sin puntero, pero enfocables: `focusin` lleva el scroll a su plano, y Tab sigue el orden de la historia.
- Lo que añade el motor: `[data-plate-wrapper]`, `[data-plate-chapter]`, `.stage-surfaces`, `.stage-panels`, `html.is-3d`. Al desmontar (degradar) cada placa vuelve a su sitio del DOM.
