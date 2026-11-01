# Mapa del código · Escritorio 3D

Qué archivo editar en el escritorio 3D: encuadres (shots), luz, props, figuras, carpetas, pantallas, retrato, corcho, reloj.

| Para cambiar… | Edita |
| --- | --- |
| Encuadres por capítulo (ensamblado, caché por viewport) | `src/three/desk/shots/framings.ts` (`desk/shots.ts` solo reexporta) |
| Cámara de hero, about, contacto y cierre; en teléfono vertical, el monitor a ~97 % del ancho (hero, stack, cierre) | `src/three/desk/shots/monitor-shots.ts` |
| Cámara de about: el cuadro de la pared y el monitor juntos (en teléfono vertical, el cuadro y la tarjeta impresa); distancia del hero para que entre el cuadro | `src/three/desk/shots/about-shots.ts` |
| Cámara de empresa | `src/three/desk/shots/figure-shots.ts` |
| Cámara de productos (rumbo, inclinación, lado del texto) | `src/three/desk/shots/product-shots.ts` |
| Encuadre de escritorio al lado del panel de texto (zona libre, distancia mínima) | `src/three/desk/shots/beside-text.ts` |
| Cámara del estante y las carpetas | `src/three/desk/shots/experience-shots.ts` |
| Encuadre vertical: protagonistas enteros, vecinos fuera, retoques | `src/three/desk/shots/portrait-fit.ts`, puntos en `protagonists.ts` |
| Mezcla por aspecto, ajuste por ancho o alto | `src/three/desk/shots/math.ts`; zona libre bajo el HUD en `context.ts` |
| Proyección, `toShot`, ancla de panel | `src/three/desk/shots/projection.ts` |
| Orden de experiencia, sub-planos, límites entre planos | `src/three/desk/shots/story.ts`, comprobación en `check.ts` |
| Marco del vidrio del monitor y del teléfono | `src/three/desk/shots/surfaces.ts` |
| Montaje del escritorio y orden de `update` (ensamblador) | `src/three/desk/DeskSet.ts` |
| Cuadro con la foto en la pared: posición, tamaño y ruta de la foto (`PORTRAIT_PHOTO`) | `src/three/desk/portrait/layout.ts` |
| Cuadro: marco y sombra en la pared, paspartú y foto en B/N cálido, vidrio (reflejos, brillo al hover), luz de latón que se enciende de noche | `src/three/desk/portrait/{frame,photo,glass,light}.ts`, GLSL en `glass.glsl.ts`, ensamblado en `portrait.ts` |
| Clic en el cuadro: la cámara se acerca y vuelve con Esc, rueda o cambio de plano | `src/three/desk/portrait/inspect.ts`, desvío de cámara en `src/three/stage/detour.ts` |
| Luz por capítulo, día y noche, encendido de la intro, clic en la lámpara | `src/three/desk/set/levels.ts` |
| Persiana: subida y bajada con easing por reloj (no se corta al acabar la ventana de movimiento), estado guardado en `sessionStorage` | `src/three/desk/set/blind-travel.ts` |
| Bombilla de la lámpara (difusor, halo, luz cálida cercana) e interruptor de la base | `src/three/desk/lamp/bulb.ts`, `src/three/desk/lamp/switch.ts` |
| Persiana enrollable (llega después del primer frame): tela de lino con trama y caída, barra lastrada, vaivén al parar | `src/three/desk/room-life/blind.ts`, tela y trama en `blind-cloth.ts`, cadena de bolitas en `blind-chain.ts`, carga en `late.ts`; el cajón de arriba es parte del cuarto (`props/room.ts`, `BLIND` en `layout.ts`) |
| Planta que se mece | `src/three/desk/room-life/plant.ts` |
| Hover y clic de lámpara, ventana y planta | `src/three/desk/room-life/room-life.ts` |
| Luces (lámpara, monitor, luna/sol, relleno, estante) | `src/three/desk/set/lighting.ts` |
| Presencia, neón, elevación y giro de las figuras | `src/three/desk/set/figures.ts` |
| Carpetas del estante, carpeta abierta (bisagra), carpeta en mano | `src/three/desk/set/folders.ts` |
| Pantallas de monitor, teléfono y laptop | `src/three/desk/set/screens.ts` |
| Laptop viva: tapa con bisagra, imagen (bloqueo o escritorio), fps y frustum | `src/three/desk/screens/laptop.ts`, `laptopLid.ts`, `laptopDisplay.ts` |
| Escritorio de la laptop (IntelliJ + terminal, Grafana, barra de menús; llega después del primer frame) | `src/three/desk/screens/desktop.ts` |
| Lo que se carga después del primer frame (carpeta para leer, escritorio de la laptop, persiana): cuándo y cómo se monta | `src/three/desk/set/deferred.ts`; el chunk en `src/three/desk/deferred/index.ts` |
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
| Corcho de TUSOCIO tras la peana: marco, corcho y chinches (`geometry.ts`), y lo impreso encima (`print.ts`: título a mano, ficha con rol y frase, tarjeta de Alfa, post-its de SkyMek, Parati y Ventixs en `BOARD_LAYOUT`) | `src/three/desk/notes/corkboard/` |
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
| Hoja de TCS apoyada en la carpeta abierta del escritorio, de cara a la cámara | `src/three/desk/folder-detail/open-sheet-pose.ts` |
| Hoja impresa de la carpeta (dibujo, ajuste de líneas) | `src/three/desk/folder-detail/sheet-canvas.ts`, `wrap.ts` |
| Qué texto lleva la hoja (se lee de `src/content/experience/<idioma>.json`) | `src/three/desk/folder-detail/sheet-content.ts` |
| Tapa que se abre al sacar la caja; clic fuera la devuelve | `src/three/desk/folder-detail/flap.ts`, `outside-click.ts` |
| Cara interior de la tapa (cartón, bolsillo, etiqueta, tecnologías) | `src/three/desk/folder-detail/flap-inside.ts` |
| La carpeta del sub-plano se abre sola al aterrizar la cámara | `src/three/desk/set/folder-auto-open.ts` |
| Hoja de portada del archivo (título del capítulo experiencia en 3D) | `src/three/desk/archive-cover.ts` |
| El enfoque (DOF) sigue a la carpeta en mano (`desk:focus`) | `src/three/desk/set/folders.ts`, `src/three/stage/listen.ts` |
| Texto real de TCS impreso sobre las hojas de la carpeta abierta | `src/three/desk/folders/open-folder-print.ts` |
| Gemela de la caja y mallas de la hoja | `src/three/desk/folder-detail/twin.ts`, `mesh.ts` |
| Objetos que viajan con la carpeta (`follow`) | `src/three/desk/folder-detail/follow.ts` |
| Reloj despertador | `src/three/desk/clock.ts`, `src/three/desk/clock/` |
| Figuras animadas | `src/three/desk/life/` |
| Tarjetas impresas de los productos (se acuestan en el escritorio y se paran en su plano) | `src/three/desk/notes/cards/` |
| Batalla de Pikachu y Charizard al hacer clic (piezas, efectos, línea de tiempo) | `src/three/desk/life/pokemon/` |
| Haz de luz visible de la lámpara | `src/three/desk/beam.ts` |
| Etiquetas de los lomos | `src/three/desk/spines.ts` |
| Ensamblar primitivas en una malla (`PartBuilder`, ids de objeto) | `src/three/desk/builder.ts` |
| Medidas y posiciones del cuarto (1 u = 1 m) | `src/three/desk/layout.ts` |
| Papel impreso: densidad, nivel de tinta frente a la lámpara (`PAPER_LEVEL`), fuentes | `src/three/desk/notes/paper.ts`; textos en `notes/content.ts`, posiciones en `notes/layout.ts` |
| Vista aislada del escritorio para depurar (la app no la importa) | `src/three/desk/preview.ts` |
| Ficha impresa bajo el cuadro (solo teléfono vertical; titular y Hoy/Antes/De noche leídos del HTML de about-bio), llega después del primer frame | `src/three/desk/portrait/bio-card.ts`, dibujo en `bio-print.ts`, posición `BIO_CARD` en `portrait/layout.ts` |
| Acción al hacer clic en las figuras (tapa con bisagra, giros de la llave, «escribiendo…»), bloqueo del doble clic, elevación al pasar el cursor | `src/three/desk/life/{gift,wrench,bubble,index}.ts` |
| Lo que aparece al hacer clic (invitación y aviso de Yape, ticket de OT, burbujas de chat, globo de Alfa): planos impresos en la capa tardía, guiones y textos ES/EN con variaciones, carga diferida | `src/three/desk/life/beats/` (`scripts.ts` guiones, `copy.ts` textos, `draw.ts` dibujo, `paths.ts` trayectorias, `beats.ts` ciclo de vida) |
| Cuánto espera la cámara a que termine la acción antes de viajar | `ACTION_MS` en `src/three/stage/navigate.ts` |
