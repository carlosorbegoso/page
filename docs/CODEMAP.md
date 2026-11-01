# Mapa del código

Qué archivo editar para cada cambio. Cada archivo tiene 300 líneas como máximo y un solo tema (ver `docs/PLAN-arquitectura.md`). Las secciones marcadas con *(pendiente)* todavía no se han partido.

## Página y layout
| Para cambiar… | Edita |
| --- | --- |
| `<head>`, meta, theme-color, carga de fuentes | `src/layouts/Base.astro` |
| Orden de las secciones de la home | `src/components/HomePage.astro` |
| Estilos globales, reset | `src/styles/global.css` |
| Animaciones CSS, `prefers-reduced-motion` | `src/styles/motion.css` |
| Placas HTML sobre la escena 3D | `src/styles/plates.css`, `src/three/plates.ts` |

## Tokens de diseño *(pendiente: `src/styles/tokens/`)*
| Para cambiar… | Edita |
| --- | --- |
| Colores, tipografía, escala, tokens del Stage | `src/styles/tokens.css` |
| Cómo lee three los tokens (`tokenColor`, `tokenNumber`) | `src/three/tokens.ts` |

## HUD y cabecera *(pendiente: `src/components/hud/`)*
| Para cambiar… | Edita |
| --- | --- |
| Marcado y estilos de la cabecera, menú, índice | `src/components/Header.astro` |

## Secciones
| Para cambiar… | Edita |
| --- | --- |
| Hero | `src/components/sections/Hero.astro` |
| Sobre mí *(pendiente: `about/`)* | `src/components/sections/About.astro` |
| Experiencia | `src/components/sections/Experience.astro`, `src/components/experience/` |
| Empresa | `src/components/sections/Company.astro` |
| Productos | `src/components/sections/Products.astro`, `src/components/products/` |
| Contacto y teléfono | `src/components/sections/Contact.astro`, `src/components/contact/`, `src/scripts/phone/` |
| Cierre | `src/components/sections/Outro.astro` |
| Página de lectura (sin 3D) | `src/components/sections/reading/ReadingPage.astro` |
| Textos de la UI | `src/i18n/ui.es.ts`, `src/i18n/ui.en.ts` |
| Contenido (perfil, experiencia) | `src/content/` |

## Navegación y movimiento
| Para cambiar… | Edita |
| --- | --- |
| Scroll por capítulos, tour, snap *(pendiente: `story-nav/`)* | `src/motion/story-nav.ts` |
| Texto cinético | `src/motion/kinetic.ts` |
| Botones magnéticos | `src/motion/magnetic.ts` |

## Escena 3D
| Para cambiar… | Edita |
| --- | --- |
| Arranque del Stage y cableado de piezas (ensamblador) | `src/three/Stage.ts` |
| Bucle de render a demanda, ventana de inactividad, DPR adaptativo | `src/three/stage/frame-loop.ts` |
| Placas, scroll ↔ capítulo, intro que retiene el capítulo | `src/three/stage/chapters.ts`, `stage/plates-mount.ts` |
| Clic en un objeto: reacción y viaje de cámara | `src/three/stage/navigate.ts` |
| Escritorio y FX registrados, precompilado | `src/three/stage/modules.ts`, `stage/extensions.ts` |
| Tamaño, layout apilado, FOV y plano por layout | `src/three/stage/shots.ts` |
| Listeners (resize, puntero, visibilidad, tema) | `src/three/stage/listen.ts` |
| Renderer WebGL y tokens de exposición | `src/three/stage/renderer.ts` |
| Contexto que reciben las estaciones | `src/three/stage/station-context.ts` |
| Contratos entre Stage, escritorio, fx | `src/three/contracts.ts` |
| Tier de calidad por dispositivo | `src/three/tier.ts` |
| Posición de cámara por capítulo | `src/three/desk/shots.ts` |
| Montaje del escritorio y orden de `update` (ensamblador) | `src/three/desk/DeskSet.ts` |
| Luz por capítulo, día y noche, encendido de la intro, clic en la lámpara | `src/three/desk/set/levels.ts` |
| Luces (lámpara, monitor, luna/sol, relleno, estante) | `src/three/desk/set/lighting.ts` |
| Presencia, neón, elevación y giro de las figuras | `src/three/desk/set/figures.ts` |
| Carpetas del estante, carpeta abierta (bisagra), carpeta en mano | `src/three/desk/set/folders.ts` |
| Pantallas de monitor, teléfono y laptop | `src/three/desk/set/screens.ts` |
| Zonas de clic, etiquetas y hover | `src/three/desk/set/picks.ts` |
| Reloj (hora de la historia, timbre) | `src/three/desk/set/clock-wiring.ts` |
| Ciudad, lluvia, vapor y haz de la lámpara cada frame | `src/three/desk/set/weather.ts` |
| Malla estática de la habitación y sombras de contacto | `src/three/desk/set/room.ts` |
| Planos de cámara, superficies CSS3D, anclas de paneles | `src/three/desk/set/framing.ts` |
| Orden de la historia (`storyRank`), qué presenta cada plano | `src/three/desk/set/story.ts` |
| `damp`, `towards`, `seeded` | `src/three/desk/math.ts` |
| Colores y acabados de la habitación (`readPalette`) | `src/three/desk/props/palette.ts` |
| Paredes, suelo, ventana, escritorio, estantes, silla | `src/three/desk/props/room.ts` |
| Monitor, teclado, taza, laptop, teléfono, lámpara | `src/three/desk/props/workstation.ts` |
| Carpeta abierta de TCS (tapas, bolsillo, hojas, clip, ligas) | `src/three/desk/props/openFolder.ts` |
| Planta y telescopio | `src/three/desk/props/decor.ts` |
| Coleccionables (Alfa, Burbu, regalo, llave) | `src/three/desk/props/figures.ts` |
| Sombras de contacto | `src/three/desk/props/shadows.ts` |
| Ayudas de geometría (`seg`, `shade`, `rod`) | `src/three/desk/props/geometry.ts` |
| Material atlas de la habitación | `src/three/desk/materials/atlas.ts`, GLSL en `atlas.glsl.ts`, ranuras en `slots.ts` |
| Texturas de canvas (pantallas, teléfono, sombra) | `src/three/desk/materials/canvas.ts` |
| Mapa de entorno nocturno | `src/three/desk/materials/environment.ts` |
| Cielo, acantilados y ciudad tras la ventana | `src/three/desk/atmosphere/backdrop.ts`, GLSL en `backdrop.glsl.ts` |
| Siluetas y ventanas de la ciudad (atlas), luces de aviación | `src/three/desk/atmosphere/city-atlas.ts` |
| Lluvia en el vidrio de la ventana | `src/three/desk/atmosphere/glass.ts`, GLSL en `glass.glsl.ts` |
| Vapor del café | `src/three/desk/atmosphere/steam.ts`, GLSL en `steam.glsl.ts` |
| Reloj despertador | `src/three/desk/clock.ts`, `src/three/desk/clock/` |
| Figuras animadas | `src/three/desk/life/` |
| Página 404: montaje, orden de arranque, disposer | `src/three/notfound/scene.ts` |
| 404: hoja impresa (texto, sello, renglones) | `src/three/notfound/paper-texture.ts` |
| 404: escritorio, pared, ventana con lluvia, taza | `src/three/notfound/room.ts`, GLSL en `rain.glsl.ts` |
| 404: carpeta y hoja curvada | `src/three/notfound/folder.ts` |
| 404: lámpara, haz visible, foco y luna | `src/three/notfound/lamp.ts` (GLSL en `beam.glsl.ts`), `lights.ts` |
| 404: polvo en el haz | `src/three/notfound/dust.ts`, GLSL en `dust.glsl.ts` |
| 404: encuadre, desplazamiento por el texto HTML, balanceo | `src/three/notfound/camera-rig.ts` |
| 404: bucle de frames, frame quieto | `src/three/notfound/loop.ts` |
| 404: puntero, inclinación, resize, visibilidad, pérdida de contexto | `src/three/notfound/input.ts` |

## Postproceso (fx)
| Para cambiar… | Edita |
| --- | --- |
| Orden de pasadas, eventos de capítulo, `settling` | `src/three/fx/pipeline.ts` |
| Tipos públicos (`CinematicFx`, `FxStats`) | `src/three/fx/types.ts` |
| Rack focus (retención y tirón de foco) | `src/three/fx/focus.ts` |
| Presupuesto GPU (qué se corta y cuándo) | `src/three/fx/adapt.ts` |
| Render targets y tamaños | `src/three/fx/targets.ts` |
| Cómo se dibuja cada pasada (uniforms) | `src/three/fx/passes/{bloom,streak,dof,composite}.ts` |
| GLSL de cada pasada | `src/three/fx/shaders/*.glsl.ts` (`coc.glsl.ts` lo comparten DoF y composite) |
| Simulación de fluido | `src/three/fx/fluid/field.ts`, GLSL en `fluid/simulation.glsl.ts` |
| Entrada de puntero del fluido | `src/three/fx/fluid/pointer.ts` |
| Desplazar un material con el fluido | `src/three/fx/fluid/patch.ts` (`withFluidDisplacement`, `withFluidFragment`), GLSL en `fluid/displace.glsl.ts` |
| Uniforms compartidos del fluido | `src/three/fx/fluid/uniforms.ts` |
| Grading por capítulo | `src/three/fx/grading.ts` |
| Tokens y perfiles por tier | `src/three/fx/settings.ts` |
