# Motion: texto cinético, navegación por planos y microinteracciones

Estados, atributos, eventos y timings de `src/motion/**` y `src/styles/motion/*.css`; léelo antes de tocar cómo entra el texto de las placas, la navegación plano a plano (`story:*`), el magnetismo o la proximidad. Qué archivo editar: `docs/codemap/motion-audio.md`.

## Límite de la capa

- El motor 3D (`src/three/plates.ts`) mueve, inclina y hace flotar las placas; esta capa solo anima su contenido (spans, listas, cifras, señal del borde, botones). Nunca escribe el `transform` de `.plate`.
- CSS: `src/styles/motion/kinetic.css` (tokens y base), `reveal.css` (estados ocultos y entradas), `keyframes.css` (keyframes, `forced-colors`), importados desde `src/styles/global.css`.

## Estados `k-armed`, `data-reveal`, `data-settled`, `data-motion-live`

| Estado | Lo pone | Efecto |
|---|---|---|
| `html.k-armed` | Script inline del primer `KineticText` de la petición (`firstInRequest`, antes de pintar) y `kinetic/boot.ts` | Solo con esta clase existen estados ocultos. No se pone con `html[data-motion="paused"]`; `boot` la quita con `prefers-reduced-motion`. Failsafe: si `window.__kinetic` no aparece en 4 s, el inline la quita |
| `data-reveal="in"` | `kinetic/reveal.ts`, en cada raíz (`[data-kinetic]`, `[data-kinetic-cascade]`, `[data-kinetic-count]`) | Entrada con stagger; al quitarlo, salida corta sin stagger |
| `data-settled` | `kinetic/settle.ts` | Fin de la entrada (`transitionend` de opacidad de la última `.k-i`, respaldo 3.2 s): quita la máscara `clip-path`, habilita brillo |
| `data-motion-live` | `kinetic/groups.ts`, en la placa | La placa se lee: flotación, señal del borde, cursor, proximidad |
| `html[data-chapter-moving]` | `kinetic/boot.ts` entre `chapter:enter` y `chapter:settled` | Congela proximidad; las placas pierden `data-motion-live` |

## Modos de revelado (`kinetic/modes.ts`)

- **3D con eventos de capítulo** (tras el primer `chapter:*`): en `chapter:settled {id}` se revelan las placas no `data-dormant` cuyo capítulo es `id` (`data-station` de la sección original o `data-station-plates` del contenedor); `data-motion-live` = placa con `data-active`. `data-dormant` recoge el texto.
- **3D sin eventos**: `MutationObserver` sobre `data-active`/`data-dormant`; revela cuando la placa **o una hermana de su columna** tiene `data-active`; al pasar a `data-dormant` se recoge y vuelve a emerger en la siguiente visita.
- **Plano** (sin `is-3d`): `IntersectionObserver` (umbral 0.15, margen inferior −8 %); revela una vez y no se recoge al salir; `data-motion-live` mientras está visible.
- El cambio de modo se detecta observando la clase de `<html>` (`is-3d` aparece al cargar el chunk 3D o se va al degradar).

## Pausa y reduced motion

- `motion:toggle` o cambio de `prefers-reduced-motion`: sin `k-armed`, todo revelado y asentado, contadores al valor final, tecleo cortado, sin señal, cursor, brillo, magnetismo ni proximidad.
- Al reanudar se vuelve a armar sin ocultar lo visible.
- `src/styles/tokens/modes.css` pone todos los `--duration-*` a `0.01ms` con `prefers-reduced-motion` y con `html[data-motion="paused"]`.

## `KineticText` (`src/components/ui/KineticText.astro`)

```astro
<KineticText text={profile.name} split="chars" />
<KineticText text={t('hero.headline')} type delay={360} />
<KineticText text={metric.value} counts />
```

| Prop | Tipo | Defecto | Nota |
|---|---|---|---|
| `as` | etiqueta | `span` | `span` cabe dentro de `h1–h3`/`p` |
| `text` | `string` | — | Sin `text`, usa el slot si es texto plano; si trae HTML se anima como bloque (`data-kinetic="block"`) |
| `split` | `'words' \| 'lines' \| 'chars'` | `words` | `lines` agrupa por `offsetTop` (medido una vez, al revelar); `chars` por grafemas (`Intl.Segmenter`) |
| `delay` | ms | `0` | `--k-delay` |
| `type` | `boolean` | `false` | Tecleo carácter a carácter con cursor `_` (implica `chars`); `kinetic/type-keys.ts` emite `desk:key` por carácter |
| `counts` | `boolean` | `false` | No parte: cifras seguidas de `%` (`splitCounts()` en `src/motion/split.ts`) cuentan desde 0 |

Marcado (servidor; igual en cliente con `buildSplit`):

```html
<span class="kinetic" data-kinetic="words">
  <span class="sr-only select-none">Texto completo</span>
  <span class="kinetic__visual" aria-hidden="true">
    <span class="k-w" style="--k-i:0"><span class="k-i">Texto</span></span> …
  </span>
</span>
```

- Accesible: lectores y nombre accesible leen la copia `sr-only`; `select-none` evita duplicar al copiar.
- `.k-w` es su máscara (`clip-path: inset(-0.14em -0.2em -0.24em -0.2em)`, margen para tildes y descendentes); `.k-i` sube desde `115 %`, de `blur(6px)` a nítido, con tracking que se asienta (X: `0.04em` × índice de palabra, tope 6; `0.06em` × carácter dentro de la palabra). Solo `opacity`, `translate`, `filter`.
- Cliente (`kinetic/split-markup.ts`): `[data-plate] header > h2` se parte en `chars`; el eyebrow `header > p.uppercase:first-child` en variante tecleo silenciosa (`data-kinetic-variant="type"`, `data-kinetic-silent`, `data-kinetic-cursor`; no emite `desk:key`).

## Atributos `data-kinetic-*`, `data-magnetic`, `--signal-progress`

| Atributo | Dónde | Efecto |
|---|---|---|
| `data-kinetic-cascade` | `ul`/contenedor | Hijos en cascada: 8 px + opacidad, 30 ms entre hijos (tope 6), retardo `--k-cascade-delay` (defecto 120 ms). Hover en `li`: el contenido sube 2 px |
| `data-kinetic-count="30"` | span `aria-hidden` + copia `sr-only` | 0 → valor en 1.4 s, `easeOutQuart`, 220 ms de retardo. `min-width: --k-digits ch` + `tabular-nums`: sin saltos |
| `data-magnetic` / `data-magnetic-inner` | `src/components/ui/Button.astro` + `src/motion/magnetic.ts` | Solo ratón, `pointer: fine`, sin pausa: el hijo interno sigue al cursor (máx. 6 px X / 4 px Y, `--mx`/`--my`, rAF). Hover: ×1.035. Hover y `:focus-visible`: línea inferior `scale` 0→1 (no en `ghost`); con teclado más gruesa y contenido 1 px arriba |
| `--signal-progress` | `.plate` (`@property <number>`) | Solo plano: 0→1 en 7 s alterno en placas `data-motion-live`; destello del acento por el borde superior (`.plate::after`) |
| `.plate a:not([data-magnetic])` | enlaces de texto | Subrayado que se dibuja en hover/foco |

## Proximidad y ola (`src/motion/proximity.ts`)

Regla: una sola fuente de movimiento a la vez y el texto quieto para leer.

- **Flotación**: hijos de la placa `data-motion-live` ±1 px, 7 s alterno (`k-float`); nunca durante una transición de cámara.
- **Proximidad por letra**: solo ratón con `pointer: fine`, raíces `chars` (no tecleo) de ≤ 32 caracteres dentro de `data-motion-live`, tope 200 unidades. Radio 90 px, elevación 4 px, separación 2 px, ×1.08, resorte 170/19; escribe `transform` en `.k-i`. Se apaga 4 s después del último movimiento y con `data-chapter-moving`.
- **Ola**: ratón entra en `[data-plate] h2/h3` → WAAPI `translate` −0.14em, `composite: 'add'`, 28 ms entre letras, 620 ms; enfriamiento 900 ms por titular.
- **Táctil/lápiz**: `pointerdown` dentro de `data-motion-live` → onda de 680 ms en un radio de 220 px.
- `refreshProximity()` lo llama `setLive`; `resize` y `motion:toggle` invalidan.

## Timings (`kinetic.css`)

| Uso | Valor | Token |
|---|---|---|
| Entrada palabra/carácter | 420 ms (opacidad 80 %, blur 70 %) | `--k-rise` = `--duration-slow` × 1.05, `--ease-out` |
| Salida | 240 ms, sin stagger | `--k-exit` = `--duration-base`, `--ease-in` |
| Stagger | palabras 30 ms (tope 8) · caracteres 12 ms (tope 20) · líneas 60 ms · tecleo 18 ms (sin tope) · cascada 30 ms (tope 6) | `--k-stagger-*` |
| Tecleo por carácter | opacidad en `--duration-instant` | `linear` |
| Bloque y cascada | 400 ms | `--duration-slow`, `--ease-out` |
| Cursor | 1.6 s alterno, 0.65 ↔ 0.12 | `--ease-in-out` |
| Señal del borde | 7 s alterno | `--ease-in-out` |

`docs/design/spacing-motion.md` («Reglas de movimiento») pide «desplazamiento máximo 12–16 px»: las palabras suben su propia altura pero dentro de una máscara, así que se ve una emergencia, no un desplazamiento de bloque. Bloques (12 px) y cascadas (8 px) sí lo respetan.

## Navegación por planos (`src/motion/story-nav/`)

La monta `setupChapterScroll` (`src/three/scroll.ts`) con `setupStoryNav(host)`: cada subplano ocupa un viewport de scroll; esta capa lo recorre de a uno.

| Entrada | Comportamiento |
|---|---|
| Teclado (`keys.ts`) | ↓ / Re Pág / Espacio → siguiente; ↑ / Av Pág / Mayús+Espacio → anterior; Inicio / Fin. Sin modificadores ni repetición. Cede a campos, `dialog`, `[data-hud-menu]`, `menu`, `listbox`, `slider` y a Espacio sobre botones/enlaces |
| Rueda (`wheel.ts`) | Un plano por gesto: acumula 40 px (líneas × 16 px); un hueco > 160 ms abre gesto nuevo; `preventDefault` mientras dura. Cede a `dialog`, menús y cualquier contenedor con scroll propio |
| Snap (`snap.ts`) | 150 ms sin scroll → asienta en el plano más cercano. No con tween en curso, dedo o botón del ratón abajo, diálogo abierto, 1 s tras una tecla cedida, ni con motion reducido |
| Enlaces (`anchors.ts`) | `a[href="#capitulo"]` de la misma página → `replaceState` + tween |
| Tween (`scroll.ts`) | GSAP `scrollTo`, `power2.inOut`, 0.35–1.2 s según distancia, `autoKill` (el usuario lo interrumpe). Sin motion: salto instantáneo |

Eventos y estado:

| Evento | Dirección | Detalle |
|---|---|---|
| `story:goto` | entra | `{chapter, sub?}` · `{step: 1 \| -1}` · `{edge: 'start' \| 'end'}` |
| `story:tour` | entra | `{action?: 'toggle' \| 'start' \| 'stop'}` (lo emite `src/components/hud/elements.ts`) |
| `story:tour-state` | sale | `{state: 'playing' \| 'paused' \| 'finished'}` |
| `story:ready` / `story:disposed` | sale | `{total}` / — ; además `html[data-story-nav="ready"]` |

**Tour** (`tour.ts`): lee la placa activa `4–10 s` (1.5 s + 45 ms por carácter de las placas `data-active`), avanza y espera `chapter:settled` del plano destino (respaldo 2.5 s). Cualquier tecla, rueda, toque o clic que no sea el botón del tour (`[data-story-tour]`, `[data-story-tour-quick]`) lo pausa; también ocultar la pestaña.

## Rendimiento

- Módulos de Astro diferidos, sin dependencias; story-nav usa el GSAP que ya carga el chunk 3D.
- Sin layout thrash: lecturas (`offsetTop` de líneas, `getBoundingClientRect` del botón al entrar, centros de proximidad) una vez y en bloque; los contadores solo cambian el texto de un span de ancho fijo.
- El `filter` vuelve a `none` al terminar la entrada para no forzar rasterizado dentro de la placa 3D. Sin `will-change`.
- `forced-colors`: sin destellos, línea magnética ni brillo; texto con color de sistema.
