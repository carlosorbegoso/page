# Motion y tipografía cinética

La vida **dentro** de las placas. El motor 3D (`src/three/plates.ts`) mueve, inclina y hace flotar las placas (`transform` de la placa y su columna); esta capa solo anima su contenido: spans de texto, listas, cifras, la línea de señal y los botones. Nunca toca el `transform` de `.plate` ni `src/three/**`.

Archivos: `src/components/ui/KineticText.astro`, `src/motion/{kinetic,magnetic,split,once}.ts`, `src/styles/motion.css` (importado en `global.css`).

## 1. Estados y disparadores

| Estado | Quién lo pone | Efecto |
|---|---|---|
| `html.k-armed` | Script inline (lo emite el primer `KineticText` de la página, antes de pintar) y `kinetic.ts` | Solo con esta clase existen los estados ocultos. Sin JS, con `prefers-reduced-motion` o con `html[data-motion="paused"]` no se añade y todo se ve directamente. Si el módulo no arranca en 4 s, el propio script la quita (failsafe). |
| `data-reveal="in"` | `kinetic.ts`, en cada raíz animable | Dispara la entrada con stagger. Al quitarlo, la raíz se recoge (salida corta, sin stagger). |
| `data-settled` | `kinetic.ts` (raíces con `shine`) | La entrada terminó: se quita la máscara y empieza el brillo. |
| `data-motion-live` | `kinetic.ts`, en la placa | La placa se está leyendo: corren la señal del borde y el cursor. |

**Con 3D (`html.is-3d`)** — un `MutationObserver` mira `data-active`/`data-dormant` de cada placa:
- la placa revela su contenido cuando ella **o una hermana de su columna** recibe `data-active` (así las placas visibles de la misma estación no quedan vacías) y no está `data-dormant`;
- al pasar a `data-dormant` (ya invisible) se recoge, y vuelve a emerger en la siguiente visita;
- `data-motion-live` = la placa tiene `data-active`.

**Sin 3D** — `IntersectionObserver` (umbral 0.15, margen inferior −8 %): revela una sola vez al entrar en pantalla (no se recoge al salir: en lectura vertical sería ruido) y marca `data-motion-live` mientras está visible. El cambio de modo (`is-3d` aparece al cargar el chunk 3D o desaparece al degradar) se detecta observando la clase de `<html>`.

**Pausa / reduced motion** — en `motion:toggle` y en el cambio de `prefers-reduced-motion`: se quita `k-armed`, todo queda revelado y asentado, los contadores saltan al valor final, se apagan señal, cursor, brillo y magnetismo. Al reanudar se vuelve a armar sin ocultar lo ya visible.

## 2. `KineticText`

```astro
<KineticText text={t('hero.headline')} delay={120} shine />
<h3><KineticText text={company} /></h3>
<KineticText as="p" split="lines" text={tagline} class="text-lg" />
```

| Prop | Tipo | Por defecto | |
|---|---|---|---|
| `as` | etiqueta HTML | `span` | `span` permite meterlo dentro de `h1–h3`/`p` sin tocar sus clases. |
| `text` | `string` | — | Si se omite, usa el slot cuando es texto plano; si el slot trae HTML, no se parte y se anima como bloque (`data-kinetic="block"`). |
| `split` | `'words' \| 'lines' \| 'chars'` | `words` | `lines` agrupa las palabras por línea real (se mide `offsetTop` una vez, al revelar). `chars` parte en grafemas (`Intl.Segmenter`). |
| `delay` | `number` (ms) | `0` | Retardo antes de la primera unidad (`--k-delay`). |
| `shine` | `boolean` | `false` | Brillo lento que cruza el texto ya asentado (titular del hero). |
| `class` | `string` | — | Clases del elemento raíz. |

Marcado generado (en el servidor):

```html
<span class="kinetic" data-kinetic="words">
  <span class="sr-only select-none">Texto completo</span>
  <span class="kinetic__visual" aria-hidden="true">
    <span class="k-w" style="--k-i:0"><span class="k-i">Texto</span></span> …
  </span>
</span>
```

- Accesible: el lector y el nombre accesible de los encabezados leen la copia `sr-only`; los spans visuales son `aria-hidden`. La copia es `select-none` para que copiar/pegar no duplique el texto.
- Cada palabra (`.k-w`) es su propia máscara (`clip-path: inset(...)` con margen para tildes y descendentes); la unidad (`.k-i`) sube desde `115 %`, de `blur(6px)` a nítido y con un tracking que se asienta (desplazamiento X proporcional al índice, `0.04em` por palabra, `0.06em` por carácter). Solo se animan `opacity`, `translate` y `filter`.
- Los títulos y eyebrows de `SectionHeader` (fuera de esta capa) se parten en el cliente con el mismo marcado; el eyebrow usa la variante «tecleo» (`data-kinetic-variant="type"`: caracteres por opacidad, 26 ms) y un cursor `_` (`data-kinetic-cursor`, contenido generado con texto alternativo vacío).

## 3. Otros atributos

| Atributo | Dónde | Efecto |
|---|---|---|
| `data-kinetic-cascade` | `ul`/contenedor | Los hijos aparecen en cascada (8 px + opacidad, 40 ms entre hijos, retardo `--k-cascade-delay`, por defecto 160 ms). Tags del stack, tecnologías, features de producto, CTAs del hero. |
| `data-kinetic-count="30"` | span `aria-hidden` con la cifra (va acompañado de una copia `sr-only`) | Cuenta de 0 al valor al revelar (1.4 s, `easeOutQuart`, 220 ms de retardo). Ancho fijo `--k-digits` en `ch` + `tabular-nums`: sin saltos de layout. `splitCounts()` en `src/motion/split.ts` detecta cifras seguidas de `%`. |
| `data-magnetic` / `data-magnetic-inner` | `Button.astro` | Solo `pointer: fine`: el **hijo interno** sigue al cursor dentro de la caja del botón (máx. 6 px X / 4 px Y, `translate`, rAF). Hover y `:focus-visible`: línea inferior que se dibuja (`scale` 0→1 desde la izquierda); con teclado la línea es más gruesa y el contenido sube 1 px, además del anillo de foco. |
| `--signal-progress` | `.plate` (propiedad registrada `<number>`) | Solo en la página plana: recorre 0→1→0 en 7 s en placas `data-motion-live` y mueve un destello del acento por el borde superior (`.plate::after`). |
| `data-depth="-50…60"` | bloques de la placa | En `.is-3d`, capa a `translateZ((depth + 50px) × --k-zsign)`: todo queda delante del plano de la placa (donde vive el pozo oscuro). Los títulos, eyebrows y subtítulos de `SectionHeader` se colocan por posición (90/50/30 px). Cada línea del titular lleva un desfase extra de 0–12 px y los tags un abanico de 0–16 px. `preserve-3d` se encadena desde `.stage-plates__station`/`__column` hasta cada capa. |
| `--k-zsign` | placa | `-1` en la estación `hero`: Chrome pinta esas capas en orden de profundidad invertido (la placa del escritorio va a escala ≈3e-4), así que allí van a −Z. Quitarlo cuando se arregle el anclaje del hero en el motor. |

## 4. Vida e interacción (`src/motion/proximity.ts`)

- **Proximidad** (solo `pointer: fine`): en las placas `data-motion-live`, las unidades cercanas al cursor se elevan, se separan y crecen (caracteres: radio 96 px, 6 px, 3 px, ×1.12; palabras: 130 px, 2 px, 1.2 px, ×1.015) con un resorte (rigidez 170, amortiguación 19). Los centros salen del rect de cada palabra (proyectado por CSS3D) más el offset del carácter cacheado: una lectura por palabra y frame, todas antes de escribir. Usa `transform` en `.k-i` (la entrada usa `translate`, así no chocan). Sin `translateZ`, para no cruzar el pozo. Máximo 200 unidades.
- **Deriva en reposo**: cada palabra flota sola (±3 px, ±0.5°, 6–11 s, fases por índice con `sin()`). Los tags y elementos en cascada orbitan 1.5–3 px.
- **Ola**: al entrar el ratón en un `h2`/`h3` de placa, sus letras suben 0.14em en ola (28 ms entre letras). Se hace con WAAPI `translate` y `composite: 'add'`.
- **Táctil**: al tocar una placa viva, onda desde el punto de contacto sobre las unidades a menos de 220 px.
- **Hover**: tags suben 2 px; el contenido del botón crece ×1.035 además del magnetismo y la línea de luz (no en `ghost`, que ya tiene subrayado); los enlaces de texto dibujan un subrayado.
- **Brillo**: por carácter, con un retardo de 35 ms entre letras; solo en la página plana (en 3D el halo oscuro del texto taparía el degradado).

## 5. Timings

| Uso | Valor | Token |
|---|---|---|
| Entrada de palabra/carácter | 810 ms (opacidad 80 %, blur 70 %) | `--k-rise` = `--duration-scene` × 0.9, `--ease-out` |
| Salida (recogerse) | 240 ms, sin stagger | `--k-exit` = `--duration-base`, `--ease-in` |
| Stagger | palabras 42 ms (tope 14) · caracteres 22 ms (tope 40) · líneas 120 ms · tecleo 26 ms · cascada 40 ms (tope 16) | `--k-stagger-*` |
| Cascada | 400 ms | `--duration-slow`, `--ease-out` |
| Cursor | 1.6 s alterno, opacidad 0.65 ↔ 0.12 | `--ease-in-out` |
| Señal del borde | 7 s alterno | `--ease-in-out` |
| Brillo del titular | ciclo de 14 s por letra (cruza en el primer 9 %), empieza 1.2 s tras asentarse + 35 ms × letra | `linear` |

Con `prefers-reduced-motion` todos los tokens `--duration-*` ya valen `0.01ms` (`tokens.css`), y además no hay estados ocultos.

Desviación consciente de `identity.md` §5 («desplazamiento máximo 12–16 px»): las palabras suben su propia altura, pero dentro de una máscara, así que el ojo ve una emergencia y no un desplazamiento de bloque. Los bloques y cascadas sí respetan 8–12 px.

## 6. Rendimiento

- JS: `kinetic.ts` (con `split.ts`) ≈ 2.0 KB gzip minificado y `magnetic.ts` ≈ 0.5 KB, módulos de Astro (diferidos), sin dependencias ni GSAP.
- Sin layout thrash: las lecturas (`offsetTop` en `lines`, `getBoundingClientRect` del botón al entrar) se hacen una vez y en bloque; los contadores solo cambian el texto de un span de ancho fijo.
- Animación continua solo en la placa activa; el `filter` vuelve a `none` al terminar la entrada para no forzar rasterizado dentro de la placa 3D. Sin `will-change`.
- `forced-colors`: sin destellos ni brillo; el texto vuelve a su color de sistema.
