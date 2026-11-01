# Mapa del código

Qué archivo editar para cada cambio. Cada archivo tiene 300 líneas como máximo y un solo tema (ver `docs/PLAN-arquitectura.md`).

## Página y layout
| Para cambiar… | Edita |
| --- | --- |
| `<head>`, meta, theme-color, carga de fuentes | `src/layouts/Base.astro` |
| Orden de las secciones de la home | `src/components/HomePage.astro` |
| Estilos globales, reset | `src/styles/global.css` |
| Animaciones CSS, `prefers-reduced-motion` | `src/styles/motion.css` |
| Placas HTML sobre la escena 3D (montaje, visibilidad por capítulo) | `src/styles/plates.css`, `src/three/plates/Plates.ts` (`three/plates.ts` solo reexporta) |
| Placas: envolver y devolver las placas, capas CSS3D y 2D | `src/three/plates/mount.ts` |
| Placas: dónde va un panel junto a su ancla, placas sobre monitor y teléfono | `src/three/plates/anchoring.ts` |
| Placas: márgenes del HUD y `safe-area-inset` | `src/three/plates/safe-area.ts` |
| Placas: panel más alto que la pantalla (recorte y scroll interno) | `src/three/plates/overflow.ts` |
| Placas: orden de Tab por capítulos | `src/three/plates/tab-order.ts` |

## Tokens de diseño
| Para cambiar… | Edita |
| --- | --- |
| Fuentes (`@font-face`, familias, pesos) | `src/styles/tokens/fonts.css` |
| Colores (UI, escena, marcas, día) | `src/styles/tokens/colors.css` (Base.astro lee `--color-bg` de aquí para theme-color) |
| Tipografía fluida, espaciado, radios, sombras, easing | `src/styles/tokens/scale.css` |
| Duraciones, z-index, materiales, placas, luces y fx del Stage | `src/styles/tokens/stage.css` |
| Modo día, tema claro, movimiento reducido o pausado | `src/styles/tokens/modes.css` |
| Cómo lee three los tokens (`tokenColor`, `tokenNumber`) | `src/three/tokens.ts` |

## HUD y cabecera
| Para cambiar… | Edita |
| --- | --- |
| Cabecera: compone barra, menú e índice | `src/components/Header.astro` |
| Barra del HUD: logo, reloj de la historia, progreso, recorrido rápido | `src/components/hud/HudBar.astro` (frases por capítulo en su frontmatter) |
| Menú del HUD: idioma, sonido, movimiento, hora, enlaces | `src/components/hud/HudMenu.astro` |
| Hoja de índice de secciones | `src/components/hud/IndexSheet.astro` |
| Abrir y cerrar el menú (hover, clic, Escape) | `src/components/hud/menu.ts` |
| Hoja de índice (cerrar, devolver el foco) | `src/components/hud/index-sheet.ts` |
| Barra de progreso de la historia | `src/components/hud/progress.ts` |
| Botones de recorrido y su insignia | `src/components/hud/tour-badge.ts` |
| Aviso de sonido disponible | `src/components/hud/audio-hint.ts` |
| Frase del capítulo y enlace activo del índice | `src/components/hud/chapter-beat.ts`, `hud/beats.ts` |
| Orden de arranque del HUD | `src/components/hud/main.ts` (sin three ni GSAP) |

## Secciones
| Para cambiar… | Edita |
| --- | --- |
| Hero | `src/components/sections/Hero.astro` |
| Sobre mí: placas y orden | `src/components/sections/About.astro` |
| Sobre mí: foto, bio y datos | `src/components/sections/about/AboutBio.astro` |
| Sobre mí: estudios y stack | `src/components/sections/about/AboutStack.astro` |
| Sobre mí: pantalla `carlos.yml` | `src/components/sections/about/AboutCode.astro` |
| Sobre mí en el monitor (vertical / horizontal) | `src/styles/sections/about/monitor.css`, `monitor-landscape.css`, `code.css` |
| Sobre mí en teléfonos apilados | `src/styles/sections/about/anchored.css` |
| Experiencia | `src/components/sections/Experience.astro`, `src/components/experience/` |
| Empresa | `src/components/sections/Company.astro` |
| Productos | `src/components/sections/Products.astro`, `src/components/products/` |
| Contacto y teléfono | `src/components/sections/Contact.astro`, `src/components/contact/`, `src/scripts/phone/` |
| Cierre | `src/components/sections/Outro.astro` |
| Página de lectura (sin 3D) | `src/components/sections/reading/ReadingPage.astro` |
| Textos de la UI | `src/i18n/<es|en>/meta.ts` (meta, 404, idioma, CV, pie, sonido, hora), `nav.ts` (navegación, HUD, recorrido, historia), `sections.ts` (secciones y lectura), `contact.ts` (contacto y teléfono); `ui.<locale>.ts` los une y define `UiKey` |
| Contenido (perfil, experiencia) | `src/content/` |

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

## Sonido
| Para cambiar… | Edita |
| --- | --- |
| Lecho de ambiente por capítulo, swell, campanilla | `src/audio/ambience.ts` |
| Bus maestro, limitador, reverbs y filtro del pad | `src/audio/mix-graph.ts` |

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
| Hover y clic sobre objetos 3D (raycast, cursor, `desk:interact`) | `src/three/interaction/index.ts`, `interaction/picker.ts`, `interaction/events.ts` |
| Enter sobre el panel de experiencia saca la carpeta | `src/three/interaction/folder-keys.ts` |
| Tier de calidad por dispositivo | `src/three/tier.ts` |
| Posición de cámara por capítulo | `src/three/desk/shots.ts` |
| Montaje del escritorio y orden de `update` (ensamblador) | `src/three/desk/DeskSet.ts` |
| Luz por capítulo, día y noche, encendido de la intro, clic en la lámpara, persiana bajada | `src/three/desk/set/levels.ts` |
| Bombilla de la lámpara (difusor, halo, luz cálida cercana) e interruptor de la base | `src/three/desk/lamp/bulb.ts`, `src/three/desk/lamp/switch.ts` |
| Persiana enrollable de la ventana, planta que se mece | `src/three/desk/room-life/blind.ts`, `src/three/desk/room-life/plant.ts` |
| Hover y clic de lámpara, ventana y planta | `src/three/desk/room-life/room-life.ts` |
| Luces (lámpara, monitor, luna/sol, relleno, estante) | `src/three/desk/set/lighting.ts` |
| Presencia, neón, elevación y giro de las figuras | `src/three/desk/set/figures.ts` |
| Carpetas del estante, carpeta abierta (bisagra), carpeta en mano | `src/three/desk/set/folders.ts` |
| Pantallas de monitor, teléfono y laptop | `src/three/desk/set/screens.ts` |
| Laptop viva: tapa con bisagra, imagen (IntelliJ + terminal, Grafana, bloqueo), fps y frustum | `src/three/desk/screens/laptop.ts`, `laptopLid.ts`, `laptopDisplay.ts` |
| Contenido de la laptop (código Java, log de Quarkus, git log) | `src/three/desk/screens/laptopScript.ts`, `editor.ts`, `terminal.ts`, `dashboard.ts`, `lockScreen.ts` |
| Teclas de la laptop que se hunden al escribir con el teclado real | `src/three/desk/screens/keycaps.ts`, `typing.ts`, distribución en `props/laptopKeys.ts` |
| Vidrio del monitor (reflejo del entorno, respiración del brillo) | `src/three/desk/screens/monitorGlass.ts` |
| Zonas de clic, etiquetas y hover | `src/three/desk/set/picks.ts` |
| Reloj (hora de la historia, timbre) | `src/three/desk/set/clock-wiring.ts` |
| Qué hace cada `desk:action` (juguetes, carpeta, laptop, lámpara) | `src/three/desk/set/actions.ts` |
| Figuras animadas, carpeta en mano y lomos al cargar | `src/three/desk/set/extras.ts` |
| Ciudad, lluvia, vapor y haz de la lámpara cada frame | `src/three/desk/set/weather.ts` |
| Malla estática de la habitación y sombras de contacto | `src/three/desk/set/room.ts` |
| Planos de cámara, superficies CSS3D, anclas de paneles | `src/three/desk/set/framing.ts` |
| Orden de la historia (`storyRank`), qué presenta cada plano | `src/three/desk/set/story.ts` |
| `damp`, `towards`, `seeded` | `src/three/desk/math.ts` |
| Colores y acabados de la habitación (`readPalette`) | `src/three/desk/props/palette.ts` |
| Paredes, suelo, ventana, escritorio, estantes, silla | `src/three/desk/props/room.ts` |
| Monitor, teclado, taza, teléfono, lámpara | `src/three/desk/props/workstation.ts` |
| Laptop (carcasa, teclas, tapa, cable USB-C) | `src/three/desk/props/laptop.ts` |
| Carpeta abierta de TCS (tapas, bolsillo, hojas, clip, ligas) | `src/three/desk/props/openFolder.ts` |
| Pikachu de vinilo sobre la base del monitor (posición en `PIKACHU` de `layout.ts`) | `src/three/desk/props/pikachu.ts` |
| Charizard de vinilo junto a Pikachu, llama de la cola emisiva (`CHARIZARD` en `layout.ts`) | `src/three/desk/props/charizard.ts` |
| Suculenta viva en maceta entre la laptop y el monitor (`SUCCULENT` en `layout.ts`) | `src/three/desk/props/succulent.ts` |
| Planta (maceta y hojas) y telescopio | `src/three/desk/props/decor.ts` |
| Peana y coleccionables: Alfa, Burbu (Ventixs), regalo (Parati), llave (SkyMek), un archivo cada uno | `src/three/desk/props/figures/` |
| Sombras de contacto | `src/three/desk/props/shadows.ts` |
| Ayudas de geometría (`seg`, `shade`, `rod`) | `src/three/desk/props/geometry.ts` |
| Material atlas de la habitación | `src/three/desk/materials/atlas.ts`, GLSL en `atlas.glsl.ts`, ranuras en `slots.ts` |
| Texturas de canvas (pantallas, teléfono, sombra) | `src/three/desk/materials/canvas.ts` |
| Mapa de entorno nocturno | `src/three/desk/materials/environment.ts` |
| Cielo, acantilados y ciudad tras la ventana | `src/three/desk/atmosphere/backdrop.ts`, GLSL en `backdrop.glsl.ts` |
| Siluetas y ventanas de la ciudad (atlas), luces de aviación | `src/three/desk/atmosphere/city-atlas.ts` |
| Lluvia en el vidrio de la ventana | `src/three/desk/atmosphere/glass.ts`, GLSL en `glass.glsl.ts` |
| Vapor del café | `src/three/desk/atmosphere/steam.ts`, GLSL en `steam.glsl.ts` |
| Sacar la carpeta del estante: estado, toggle, update | `src/three/desk/folder-detail/FolderDetail.ts` (`desk/folderDetail.ts` solo reexporta) |
| Dónde se sostiene la carpeta, giro hacia la cámara | `src/three/desk/folder-detail/aim.ts`, tiempos en `constants.ts` |
| Hoja impresa de la carpeta (dibujo, ajuste de líneas) | `src/three/desk/folder-detail/sheet-canvas.ts`, `wrap.ts` |
| Qué texto lleva la hoja (se lee de `src/content/experience/<idioma>.json`) | `src/three/desk/folder-detail/sheet-content.ts` |
| Tapa que se abre al sacar la caja; clic fuera la devuelve | `src/three/desk/folder-detail/flap.ts`, `outside-click.ts` |
| Texto real de TCS impreso sobre las hojas de la carpeta abierta | `src/three/desk/folders/open-folder-print.ts` |
| Gemela de la caja y mallas de la hoja | `src/three/desk/folder-detail/twin.ts`, `mesh.ts` |
| Objetos que viajan con la carpeta (`follow`) | `src/three/desk/folder-detail/follow.ts` |
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
| Paso del fluido por frame y uniforms compartidos | `src/three/fx/fluid/driver.ts` |
| Desplazar un material con el fluido | `src/three/fx/fluid/patch.ts` (`withFluidDisplacement`, `withFluidFragment`), GLSL en `fluid/displace.glsl.ts` |
| Uniforms compartidos del fluido | `src/three/fx/fluid/uniforms.ts` |
| Grading por capítulo | `src/three/fx/grading.ts` |
| Tokens y perfiles por tier | `src/three/fx/settings.ts` |
