# Mapa del código · Motor 3D

Qué archivo editar en el motor 3D: arranque, Stage, director, scroll, placas, interacción, tier, assets, debug.

| Para cambiar… | Edita |
| --- | --- |
| Cargador previo a three (progreso, filamento, haz de sol, línea de arranque) | `src/components/three/stage-loader/loader.ts` (`stage-loader.ts` solo reexporta) |
| Cargador: dibujo de día, de noche y línea del monitor | `src/components/three/stage-loader/scene.ts`, primitivas en `paint.ts` |
| Cargador: marcas del póster, ritmo del progreso, texto de estado | `src/components/three/stage-loader/frame.ts`, `progress.ts`, `status.ts` |
| Arranque del Stage y cableado de piezas (ensamblador) | `src/three/Stage.ts` |
| Bucle de render a demanda, ventana de inactividad, DPR adaptativo | `src/three/stage/frame-loop.ts` |
| Placas, scroll ↔ capítulo, intro que retiene el capítulo; `data-plate-stacked="printed"` deja la placa solo para lectores de pantalla en teléfono vertical (`data-plate-printed`) | `src/three/stage/chapters.ts`, `stage/plates-mount.ts` |
| Clic en un objeto: reacción y viaje de cámara | `src/three/stage/navigate.ts` |
| Escritorio y FX registrados, precompilado | `src/three/stage/modules.ts`, `stage/extensions.ts` |
| Tamaño, layout apilado, FOV y plano por layout | `src/three/stage/shots.ts` |
| Listeners (resize, puntero, visibilidad, tema) | `src/three/stage/listen.ts` |
| Renderer WebGL y tokens de exposición | `src/three/stage/renderer.ts` |
| Contexto que reciben las estaciones | `src/three/stage/station-context.ts` |
| Contratos entre Stage, escritorio, fx | `src/three/contracts.ts` |
| Hover y clic sobre objetos 3D (raycast, cursor, `desk:interact`) | `src/three/interaction/index.ts`, `interaction/picker.ts`, `interaction/events.ts` |
| Enter sobre el panel de experiencia saca la carpeta | `src/three/interaction/folder-keys.ts` |
| Tier de calidad por dispositivo | `src/three/tier.ts` |
| Arranque sin three: contenedor del canvas, `<picture>` de fallback, cuándo se importa el 3D | `src/components/three/StageCanvas.astro`, preload del fallback en `HeroFallbackPreload.astro` |
| Punto de entrada del chunk 3D (`boot`) | `src/three/index.ts` |
| Opciones del Stage y de `?capture` | `src/three/stage/types.ts` |
| Revelado del canvas al primer frame (`stage:reveal`) | `src/three/stage/reveal.ts` |
| Desvío de cámara (acercarse a un objeto y volver) | `src/three/stage/detour.ts` |
| Director de cámara: límites, duración y easing de cada transición, parallax | `src/three/director.ts` |
| Scroll ↔ capítulo (ScrollTrigger) | `src/three/scroll.ts`; capítulo de cada sección en `src/three/sections.ts` |
| Escena base: cielo mínimo y adaptador del módulo heredado | `src/three/world.ts`, `src/three/scenes/Sky.ts` |
| `damp`, `smoothstep`, tipo de layout (`layoutKind`, `stackedLayout`) | `src/three/scenes/common.ts` |
| Placas HTML sobre la escena 3D (montaje, visibilidad por capítulo) | `src/three/plates/Plates.ts` (`three/plates.ts` solo reexporta); estilos en `src/styles/plates/` |
| Placas: envolver y devolver las placas, capas CSS3D y 2D | `src/three/plates/mount.ts` |
| Placas: dónde va un panel junto a su ancla, placas sobre monitor y teléfono | `src/three/plates/anchoring.ts` |
| Placas: márgenes del HUD y `safe-area-inset` | `src/three/plates/safe-area.ts` |
| Placas: panel más alto que la pantalla (recorte y scroll interno) | `src/three/plates/overflow.ts` |
| Placas: orden de Tab por capítulos | `src/three/plates/tab-order.ts` |
| Puntero normalizado de la escena | `src/three/pointer.ts` |
| Movimiento permitido (reduced, pausado) | `src/three/motion.ts` |
| Trabajo en tiempo libre del hilo (`onIdle`, `yieldToMain`) | `src/three/idle.ts` |
| Caché de GLB y texturas (refcount), loaders | `src/three/assets.ts`, variantes de modelo en `models.generated.ts` (lo escribe `bun run assets`) |
| Overlay `?debug` (FPS p75, DPR, draw calls, memoria) | `src/three/debug.ts` |
| Tokens CSS leídos desde three (`tokenColor`, `tokenNumber`) | `src/three/tokens.ts` |
