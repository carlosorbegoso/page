# Plan: el portafolio cuenta una historia (2026-10-31)

Seis especialistas revisaron el código y las capturas en modo solo lectura: UX/UI y narrativa, diseño de información en 3D, tech lead WebGL, dirección de animación y cámara, contenido y reclutamiento, arquitectura frontend (a11y/perf/SEO). Este documento une sus propuestas y resuelve los choques entre ellas.

## La idea
Una sola noche en el escritorio, contada *in medias res*. Empieza **esta noche**, vuelve a **2020** y recorre los años **de día** hasta hoy. Luego llega **el giro a la noche** (TUSOCIO IA y los productos) y la lámpara se apaga al amanecer. La historia la cuentan el cuarto, la luz y los objetos. El texto queda en una idea por plano y el detalle pasa al modo lectura.

Regla de oro del movimiento: **la cámara se mueve, o se mueve un objeto, o entra texto. Nunca dos a la vez.** Los cambios de luz se esconden dentro de los cortes.

## Guion (orden nuevo)
| # | Capítulo | Hora | Qué entiende el visitante | Dónde vive |
|---|---|---|---|---|
| 1 | Hero | 23:00 | Rol, TCS para el BCP, 3 cifras | Monitor |
| 2 | Sobre mí (2 pantallas) | 23:30 | Quién es; UPC de noche como semilla del "de noche" | Monitor |
| 3 | De día · puente | — | Rótulo «De día · 2020 → hoy», la estantería entera | Rótulo anclado |
| 4–7 | SYSARP 2020 → Baufest 2022 → Intercorp 2024 → TCS 2025 | recuerdo | Una época por plano, un logro con cifra | Lomo de carpeta + caption corto |
| 8 | Giro | 00:30 | Click de la lámpara: empieza la noche | Plano general, solo luz |
| 9 | TUSOCIO IA | 01:00 | La empresa que fundó con dos amigos | Alfa se enciende + cartela |
| 10–12 | SkyMek, Parati, Ventixs | 01:30–02:30 | Tres productos, los tres en producción | Cada figura se enciende + cartela |
| 13 | Contacto | 03:30 | Cómo escribirle | Teléfono |
| 14 | Outro | 05:58 | Se apaga la lámpara, amanece | Créditos |

**Conflicto entre orden cronológico e inverso (reclutador).** El hero y «Sobre mí» dan el presente en los primeros 10 s: rol, TCS/BCP y cifras. El acto «De día» cierra otra vez en TCS («Hoy»). El modo lectura y el CV siguen en orden inverso.

## Decisiones tomadas al unir las propuestas
- **Experiencia en la estantería, no en una columna web.** Va de izquierda a derecha en orden cronológico (`FOLDERS` ya está así). Cada lomo lleva nombre y años legibles en `CanvasTexture`, y la carpeta activa sale 3 cm y se ilumina. TCS termina en la carpeta abierta del escritorio y su tapa se abre.
- **Plano puente obligatorio.** El tech lead midió `about:1 → experience SYSARP` en 34–36°, por encima del límite de 28°. Se añade un plano general de la estantería (heading −14°/−20°, pitch −4°, 1,6 m), medido en 17–25°. Es donde va el rótulo «De día». `SUB_SHOTS.experience = 5`.
- **El giro día → noche es un time-lapse con la cámara quieta.** Después del dolly hacia atrás (1,4 s), el monitor baja, *click*, la lámpara sube a cálida y la gradación se calienta, en unos 2,2 s. Luego entra el rótulo «De noche».
- **Hora como hilo conductor.** Un reloj en la barra del monitor primero y, más adelante, un reloj de mesa. Las luces de la ciudad se apagan por capítulo y el amanecer llega en el outro.
- **Se descarta WhatsApp en contacto:** no se publica el teléfono.
- **Captions cortos.** Eyebrow con fechas, empresa · rol, un logro con cifra y nada más. Los bullets y el stack completo van al modo lectura.

## Fases (cada paso es un commit local verificable)
### F1 · Orden de la historia
1. Tipos: `duration` en `ChapterState` y en el detalle de `chapter:enter`. `checkShots` deriva el orden de `SECTION_CHAPTERS`.
2. Reordenar en un solo commit:
   - `CHAPTERS` (`contracts.ts`);
   - `HomePage.astro`;
   - `Header.astro` (índice);
   - `ReadingPage.astro` (queda en orden inverso dentro de experiencia).
3. Experiencia cronológica con el plano puente:
   - `EXPERIENCE_ORDER` y `Experience.astro` (`newestFirst`, `firstYear`, `SectionHeader`) en el mismo commit;
   - picks de carpetas en `Stage.ts`;
   - `checkShots` en verde a 1440, 390, 1024×1366 y 1920.
4. a11y: el orden de Tab en 3D sigue el orden de capítulos (`plates.ts`). Hoy el teléfono quedaría antes que toda la experiencia.

### F2 · Rótulos de época y captions
5. `EraCard.astro` y `src/motion/era.ts`:
   - entra a settled + 120 ms, pausa 1,1 s, sale en 240 ms y se cancela con otro `chapter:enter`;
   - anclas `era-day` (estantería) y `era-night` (lámpara) en `DeskSet.getAnchor` y `ANCHOR_NAMES`;
   - `aria-hidden`; en el DOM, el texto real va como eyebrow de la placa.
6. Captions de experiencia, TUSOCIO y productos recortados a 3–4 líneas, como cartelas de museo.
7. HUD: «23:10 · De día · 2022» con un riel fino de marcas en lugar de «01 / 07».

### F3 · La noche avanza
8. `src/three/night.ts`: tabla única hora → luces, ventana y gradación. `DeskSet.update` interpola con la duración del movimiento (sin `damp`). Uniform `setNight` en `atmosphere.ts`.
9. `ChapterGrading.enter(..., duration)` con temperatura y exposición tomadas de `nightAt`.
10. Secuencia del giro (`company:0`, plano general) y lámpara del outro. Eventos `desk:switch` y `desk:light` para el sonido.

### F4 · Objetos que cuentan
11. Presencia de las figuras: `uPresence` en `materials.ts`. Apagadas hasta su capítulo, encendido tipo neón (60 ms + 120 ms + rampa de 400 ms). Sin memoria, así que es reversible.
12. Tapa de la carpeta TCS: oid 11 y bisagra en el vertex shader (`uFolderOpen`), 0→165° en 1,1 s.
13. Etiquetas de lomo legibles y grosor de cada carpeta según la duración del trabajo.
14. Badge «TCS · BCP» con lanyard sobre la carpeta abierta: la bisagra del día a la noche.

### F5 · Pulido
15. «Sobre mí», pantalla 2: el stack como editor o terminal (`application.properties` con Quarkus y Kafka) en vez de tabla.
16. Reloj de mesa. Carné UPC junto al teclado. Tres post-its con iniciales de los cofundadores, si Carlos quiere.
17. Reduced-motion y pausa: luz, gradación, presencia y carpeta se aplican en el corte. Rótulos estáticos.
18. Medir FPS y bundle (hoy 237 de 260 KB). Actualizar `docs/3d/*`, `docs/motion.md`, `docs/copy/*` y `docs/PLAN.md` (que todavía pide orden inverso).

## Presupuesto y riesgos
- Bundle: menos de 2 KB gzip en total. Sin draw calls nuevos ni recompilaciones: solo `intensity`, `color` y uniforms.
- Riesgos:
  - pins de ScrollTrigger fuera del orden del DOM (`CHAPTERS` tiene que coincidir con el DOM);
  - el puente alarga la experiencia en un viewport;
  - la luz y la gradación se desincronizan si no salen de `night.ts`.
- No hay tests de orden. Se verifica con check, lint, build, `checkShots`, capturas por capítulo y Tab manual.

## Preguntas para Carlos (sin respuesta, no se publican frases que dependan de ellas)
1. ¿Por qué empezaste a programar? ¿Hubo un momento concreto?
2. ¿Por qué pasaste de frontend (SYSARP) a backend (Baufest)?
3. ¿Qué te movió de Baufest a Intercorp y de Intercorp a TCS?
4. ¿En qué año fundaron TUSOCIO IA y cuál fue la chispa? ¿Se nombra a tus dos amigos?
5. ¿Por qué SkyMek y talleres mecánicos?
6. ¿En qué años estudiaste en la UPC, cuándo egresaste y ya tienes el título?
7. ¿Qué buscas hoy: un puesto, socios o clientes? Eso decide el botón principal del hero.
8. ¿«Más de 5 años» o «casi 7»? En total son casi 7; en backend, unos 4,5.
9. Cifras del hero: ¿cambiamos «Monolito → CQRS» por «3 productos en producción»?
