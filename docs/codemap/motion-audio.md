# Mapa del código · Navegación, movimiento y sonido

## Navegación y movimiento
| Para cambiar… | Edita |
| --- | --- |
| Navegación por planos: montaje y listeners | `src/motion/story-nav/setup.ts` (`motion/story-nav.ts` solo reexporta) |
| Tween de scroll entre planos (duración, easing, autoKill) | `src/motion/story-nav/scroll.ts` |
| Plano siguiente, anterior, más cercano | `src/motion/story-nav/shot-index.ts`; `story:goto` en `goto.ts` |
| Asentar en el plano más cercano al parar | `src/motion/story-nav/snap.ts` |
| Teclado (flechas, Re Pág, espacio, Inicio, Fin) | `src/motion/story-nav/keys.ts` |
| Rueda (un plano por gesto) | `src/motion/story-nav/wheel.ts` |
| Toque y arrastre con el mouse | `src/motion/story-nav/gestures.ts` |
| Enlaces a capítulos (`#products`) | `src/motion/story-nav/anchors.ts` |
| Tour automático (pausa de lectura, espera de `chapter:settled`) | `src/motion/story-nav/tour.ts` |
| Texto cinético: arranque, eventos de capítulo | `src/motion/kinetic/boot.ts` (`motion/kinetic.ts` es el punto de entrada) |
| Texto cinético: marcado por letra o palabra, líneas, cascadas | `src/motion/kinetic/split-markup.ts` |
| Texto cinético: cuándo entra cada placa (3D por capítulo, plano por intersección) | `src/motion/kinetic/modes.ts`, `groups.ts` |
| Texto cinético: entrar y salir, fin de la transición | `src/motion/kinetic/reveal.ts`, `settle.ts` |
| Contadores animados | `src/motion/kinetic/count.ts` |
| Sonido de tecla al escribir (`desk:key`) | `src/motion/kinetic/type-keys.ts` |
| Botones magnéticos | `src/motion/magnetic.ts` |
| Proximidad del cursor por letra en titulares | `src/motion/proximity.ts` |
| Partir texto en letras y palabras, contadores | `src/motion/split.ts` |
| Ejecutar una vez por petición de frame (`firstInRequest`) | `src/motion/once.ts` |


## Sonido
| Para cambiar… | Edita |
| --- | --- |
| Lecho de ambiente por capítulo, swell, campanilla | `src/audio/ambience.ts` |
| Bus maestro, limitador, reverbs y filtro del pad | `src/audio/mix-graph.ts` |
| Música por acto (muestras CC0) | `src/audio/music.ts`; créditos en `docs/audio.md` |
| Acordes del pad y rampas | `src/audio/pad.ts` |
| Preset de sonido por capítulo | `src/audio/chapters.ts` |
| Día y noche en la mezcla (corte del pad, tono del cuarto) | `src/audio/daylight.ts`, `src/audio/room.ts` |
| Coches que pasan por la calle | `src/audio/traffic.ts` |
| Sonidos de objetos del escritorio (`desk:*`) | `src/audio/desk-sounds.ts`, voces en `desk-voices.ts` |
| Tecla, tock y campanilla | `src/audio/voices.ts`; envolventes y síntesis en `synth.ts`, ruido e impulsos en `buffers.ts` |
| Sonidos de la UI (botones, menú) | `src/audio/ui-sounds.ts` |
