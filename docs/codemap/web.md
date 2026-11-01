# Mapa del código · Web: página, tokens, HUD y secciones

Qué archivo editar en la web: `<head>`, tokens, HUD, secciones, modo lectura, textos (i18n) y contenido.

## Página y layout
| Para cambiar… | Edita |
| --- | --- |
| `<head>`, meta, theme-color, carga de fuentes | `src/layouts/Base.astro` |
| Orden de las secciones de la home | `src/components/HomePage.astro` |
| Páginas (home ES/EN, modo lectura ES/EN, 404) | `src/pages/index.astro`, `pages/en/index.astro`, `pages/lectura/index.astro`, `pages/en/reading/index.astro`, `pages/404.astro` |
| Datos fijos: correo, redes, ruta del CV, ids de sección | `src/config/site.ts` |
| Componentes base (botón, enlace externo, CV, etiqueta, cabecera de sección, texto cinético, monograma «C») | `src/components/ui/` |
| Botones de sonido, movimiento y hora; idioma; skip link; tooltip de la escena; barra del modo lectura; pie | `src/components/{AudioToggle,MotionToggle,TimeToggle,LangSwitch,SkipLink,SceneTooltip,ReadingBar,Footer}.astro` |
| Estilos globales, reset | `src/styles/global.css` |
| Animaciones CSS, `prefers-reduced-motion` | `src/styles/motion/{keyframes,reveal,kinetic}.css` |
| Estilos de las placas (base, ancladas, sueltas, superficies, desbordes, acabado) | `src/styles/plates/` |
| Escritorio Mac del monitor: barra de menús en todas sus pantallas, ventana con los tres botones y fondo en hero y outro (pisa el `::after` de `motion/kinetic.css` y `plates/finish.css` en esos dos) | `src/styles/plates/monitor-chrome.css` |


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
| Sobre mí: bio y datos; la foto queda solo para lectores de pantalla en 3D (cuelga enmarcada en la pared) | `src/components/sections/about/AboutBio.astro` |
| Sobre mí: estudios y stack | `src/components/sections/about/AboutStack.astro` |
| Sobre mí: pantalla `carlos.yml` | `src/components/sections/about/AboutCode.astro` |
| Sobre mí en el monitor (vertical / horizontal) | `src/styles/sections/about/monitor.css`, `monitor-landscape.css`, `code.css` |
| Hero, Stack y Final en el monitor en teléfono vertical | `src/styles/sections/hero/monitor-portrait.css`, `src/styles/sections/outro/monitor-portrait.css`, `src/styles/sections/about/code-portrait.css` |
| Sobre mí en teléfonos apilados | `src/styles/sections/about/anchored.css` |
| Experiencia | `src/components/sections/Experience.astro`, `src/components/experience/` |
| Empresa | `src/components/sections/Company.astro`; ficha en 3D y tarjeta de papel en teléfonos en `src/styles/sections/company/` |
| Productos | `src/components/sections/Products.astro`, `src/components/products/`; estilos en `src/styles/sections/products/` |
| Contacto y teléfono | `src/components/sections/Contact.astro`, `src/components/contact/`, `src/scripts/phone/` |
| Cierre | `src/components/sections/Outro.astro` |
| Página de lectura (sin 3D): datos y orden de secciones | `src/components/sections/reading/ReadingPage.astro` |
| Lectura: cabecera, experiencia, empresa, formación y stack, contacto | `src/components/sections/reading/` (`ReadingMasthead`, `ReadingExperience`, `ReadingCompany`, `ReadingBackground`, `ReadingContact`) |
| Lectura: estilos de pantalla y de impresión A4 | `src/styles/sections/reading/{masthead,sections,print}.css`; botón de imprimir en `src/scripts/reading/print.ts` |
| Textos de la UI | `src/i18n/<es|en>/meta.ts` (meta, 404, idioma, CV, pie, sonido, hora), `nav.ts` (navegación, HUD, recorrido, historia), `sections.ts` (secciones y lectura), `contact.ts` (contacto y teléfono); `ui.<locale>.ts` los une y define `UiKey` |
| Contenido (perfil, experiencia, productos) en `es.json` / `en.json` | `src/content/{profile,experience,products}/`, esquemas en `src/content.config.ts`, lectura en `src/lib/content.ts` |
