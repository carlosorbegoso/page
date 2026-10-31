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

**Con 3D (`html.is-3d`) y director de cámara** — en cuanto llega el primer evento `chapter:*`, el texto solo entra al asentarse la cámara:
- `chapter:enter {id}` → `html[data-chapter-moving]`, las placas pierden `data-motion-live` (se congela la flotación y la proximidad);
- `chapter:settled {id}` → se quita el atributo y se revelan las placas no `data-dormant` del capítulo `id` (capítulo = `data-station` de la sección original de la placa, o `data-station-plates` del contenedor del motor); `data-motion-live` = placa con `data-active`;
- `data-dormant` sigue recogiendo el texto.

**Con 3D sin eventos de capítulo (motor antiguo)** — un `MutationObserver` mira `data-active`/`data-dormant` de cada placa:
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
| `shine` | `boolean` | `false` | Brillo que recorre las letras del texto asentado; solo en la página plana. |
| `type` | `boolean` | `false` | Tecleo: caracteres uno a uno (18 ms) con cursor `_` (implica `split="chars"`). Titular del hero en el monitor. |
| `counts` | `boolean` | `false` | No parte el texto: las cifras seguidas de `%` cuentan de 0 al revelarse (cifras del hero). |
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

## 4. Vida e interacción (`src/motion/proximity.ts`)

Regla de la dirección final: una sola fuente de movimiento a la vez y el texto quieto para leer.
- **Reposo**: solo la placa activa flota ±1 px (7 s, `--ease-in-out`), nunca durante una transición de cámara. Sin deriva por palabra, sin órbitas ni capas `translateZ`.
- **Proximidad por letra** (solo `pointer: fine`, solo titulares de ≤ 32 caracteres partidos por letras, nunca párrafos): elevación 4 px, separación 2 px, ×1.08, resorte (170/19). Usa `transform` en `.k-i`; congelada con `data-chapter-moving`.
- **Ola** al entrar el ratón en un `h2`/`h3` de placa (WAAPI `translate`, `composite: 'add'`, 28 ms entre letras). **Táctil**: onda breve desde el punto de contacto sobre las letras de los titulares cercanos.
- **Hover**: tags suben 2 px; el contenido del botón crece ×1.035, magnetismo y línea de luz (no en `ghost`); los enlaces de texto dibujan su subrayado.

## 5. Timings

| Uso | Valor | Token |
|---|---|---|
| Entrada de palabra/carácter | 420 ms (opacidad 80 %, blur 70 %); total por bloque ≤ 700 ms | `--k-rise` = `--duration-slow` × 1.05, `--ease-out` |
| Salida (recogerse) | 240 ms, sin stagger | `--k-exit` = `--duration-base`, `--ease-in` |
| Stagger | palabras 30 ms (tope 8) · caracteres 12 ms (tope 20) · líneas 60 ms · tecleo 18 ms (sin tope) · cascada 30 ms (tope 6, retardo 120 ms) | `--k-stagger-*` |
| Cascada | 400 ms | `--duration-slow`, `--ease-out` |
| Cursor | 1.6 s alterno, opacidad 0.65 ↔ 0.12 | `--ease-in-out` |
| Señal del borde | 7 s alterno | `--ease-in-out` |
| Brillo (`shine`, solo plano) | ciclo de 14 s por letra, 35 ms entre letras | `linear` |
| Flotación en reposo | ±1 px, 7 s alterno, solo placa activa | `--ease-in-out` |

Con `prefers-reduced-motion` todos los tokens `--duration-*` ya valen `0.01ms` (`tokens.css`), y además no hay estados ocultos.

Nota sobre `identity.md` §5 («desplazamiento máximo 12–16 px»): las palabras suben su propia altura, pero dentro de una máscara, así que el ojo ve una emergencia y no un desplazamiento de bloque. Los bloques y cascadas sí respetan 8–12 px.

## 6. Rendimiento

- JS: `kinetic.ts` (con `split.ts`) ≈ 2.0 KB gzip minificado y `magnetic.ts` ≈ 0.5 KB, módulos de Astro (diferidos), sin dependencias ni GSAP.
- Sin layout thrash: las lecturas (`offsetTop` en `lines`, `getBoundingClientRect` del botón al entrar) se hacen una vez y en bloque; los contadores solo cambian el texto de un span de ancho fijo.
- Animación continua solo en la placa activa; el `filter` vuelve a `none` al terminar la entrada para no forzar rasterizado dentro de la placa 3D. Sin `will-change`.
- `forced-colors`: sin destellos ni brillo; el texto vuelve a su color de sistema.
