# Audio: ambiente, música CC0 y foley

Diseño sonoro, cadena de nodos, eventos, niveles y créditos de `src/audio/**` y `public/audio/`; léelo antes de tocar el ambiente por capítulo, la música, los sonidos de objetos o el botón de sonido. Qué archivo editar: `docs/codemap/motion-audio.md`.

## Resumen

- Web Audio API. El cuarto (lluvia, zumbido, ciudad, coches), el pad, las teclas, los tocks, el chime y el foley de objetos se sintetizan en el navegador.
- Encima, **música CC0 por acto** (`src/audio/music.ts`) y muestras CC0 (interruptor de la lámpara, hoja de carpeta).
- Apagado por defecto. Los archivos (`public/audio/`, ~3.1 MB en AAC 96 kbps) solo se descargan al activar el sonido.
- Tono: una habitación de noche con lluvia en la ventana; el pad es casi un color; nada de efectos de juego.

## Tono de cuarto (`room.ts`, `traffic.ts`)

- **Lluvia en el vidrio**: lavado de ruido (paso alto 450 Hz, paso bajo 4.8 kHz, ráfagas a 0.07 Hz) + gotas: cuatro ticks de vidrio (2.4/3.1/3.8/4.7 kHz, `createDrop`), ~9/s × nivel de lluvia, tono, volumen (sesgo cúbico: casi todas suaves) y panorama aleatorios. No se programan con el contexto suspendido.
- **Zumbido**: ruido grave (paso bajo 160 Hz) + 60/120/180 Hz muy bajos.
- **Ciudad**: ruido lento, paso bajo 280 Hz, realce en 110 Hz, vaivén a 0.023 Hz (~43 s).
- **Coches** (`CityPasses`): pasadas de 2.5–6 s que cruzan el estéreo, probabilidad 0.22/s × `passes`.

## Día y noche (`daylight.ts`)

`html[data-time="day"]` → `day`, salvo `contact`/`outro` → `dusk`; si no, `night`.

| | lluvia × | zumbido × | ciudad × | coches | corte del pad × |
|---|---|---|---|---|---|
| `night` | 1 | 1 | 1 | 0.12 | 1 |
| `dusk` | 0 | 0.6 | 0.9 | 0.35 | 1.1 |
| `day` | 0 | 0.35 | 1.5 (tope 1.6) | 1 | 1.35 |

`time:toggle` reaplica la mezcla en `crossfade + 2` s y cambia la pista de música.

## Pad por capítulo (`chapters.ts`, `pad.ts`)

Todo en Re mayor: cualquier crossfade es consonante. Dos osciladores por nota (triangle −7 ct, sine +7 ct, ±1.5 ct de deriva alterna).

| Capítulo | Acorde | Corte | Lluvia / zumbido / ciudad | Room / hall | Crossfade |
|---|---|---|---|---|---|
| `intro` | Dmaj9 | 520 Hz | 1 / 0.8 / 0.7 | 0.55 / 0.12 | 2 s |
| `hero` | Dmaj9 | 650 Hz | 1 / 1 / 0.7 | 0.55 / 0.12 | 3 s |
| `about` | Bm7 | 760 Hz | 1 / 1.25 / 0.55 | 0.55 / 0.12 | 3 s |
| `company` | Gmaj7#11 | 900 Hz | 0.85 / 0.8 / 0.7 | 0.55 / 0.12 | 3 s |
| `products` | Em9 | 980 Hz | 0.85 / 0.8 / 0.7 | 0.55 / 0.12 | 3 s |
| `experience` | Aadd9 | 820 Hz | 0.9 / 0.85 / 0.7 | 0.55 / 0.12 | 3 s |
| `contact` | Dadd9 | 1050 Hz | 0.8 / 1 / 0.7 | 0.55 / 0.12 | 3 s |
| `outro` (amanecer) | Re abierto, 7 voces (D2…E5) | 2600 Hz | **0** / 0.2 / 1 | 0.2 / 0.7 | 6 s |

- `outro`: con `chapter:progress` el corte va del 70 % al 100 % de su valor.
- Al empezar la primera pista de música el pad baja de 0.32 a 0.12 (`padUnderMusic`).
- Swell en cada capítulo nuevo: ×1.45 y vuelve en ~3 s; subplano nuevo del mismo capítulo: ×1.2.

## Música y muestras (`music.ts`)

| Acto | Capítulos (noche) | Con `data-time="day"` | Archivo |
|---|---|---|---|
| `night` | `intro`, `hero`, `about`, `company`, `products`, `contact` | solo `outro` | `music-night.m4a` |
| `day` | `experience` | todo salvo `outro` | `music-day.m4a` |
| `dawn` | `outro` | — | `music-dawn.m4a` |

- Crossfade lineal 3 s (5 s hacia `dawn`); bucle infinito.
- `loopStart` = 0.046 s (`ENCODER_PRIMING_SECONDS`): salta el relleno de silencio que el codificador AAC pone al inicio, para que el bucle no tenga hueco.
- Muestras (playbackRate 0.96–1.04): `switchOn`/`switchOff` en `desk:switch {on}`; `pageFlip` en cada subplano de `experience` > 0 (no en pausa).
- URL con `import.meta.env.BASE_URL` (el sitio vive bajo `/page/`).

## Foley

| Sonido | Disparo | Límite |
|---|---|---|
| Tecla mecánica (`voices.ts` `playKey`): click paso banda ~2.6 kHz + thock 210→120 Hz | `desk:key` (tecleo del titular del hero) | 1 / 28 ms |
| Tock de madera (`playTock`): ~480 Hz con caída y dos parciales | `scene:hover` con etiqueta nueva (suave); `product:focus`/`experience:focus` con `source: 'scene'` (fuerte) | 1 / 250 ms |
| Chime del teléfono (`playChime`): E6 → B6 | `chapter:settled` de `contact` | 1 / 4 s |
| Objetos del escritorio (`desk-sounds.ts`, voces en `desk-voices.ts`): `clock`, `laptop`, `keyboard`, `folder`, `chat`, `gift`, `mug`, `wrench`, `toy`, `phone`, `blind` | `desk:interact` (`press`/`activate`), `desk:action` (`play`, `folder`, `folder-close`), `desk:clock`; `phone` también en `chapter:enter` de `contact` (1 / 6 s) | 350 ms por voz (`clock` 1.2 s, `phone`/`gift` 0.5 s, `blind` 1.1 s) |

El objeto se elige por prefijo del id (`soundFor`): `folder`/`paper` → `folder`, `skymek` → `wrench`, `ventixs` → `chat`, `parati` → `gift`, `alfa` → `toy`, `window` → `blind`, `macbook` → `laptop`; `lamp` no suena (la lámpara usa las muestras del interruptor).

**Pausa** (`motion:toggle {paused: true}`, `data-motion="paused"`, `prefers-reduced-motion`): siguen el cuarto, el pad y la música; se callan teclas, tocks, chime, hoja, swells y el seguimiento de `chapter:progress`. El foley de objetos sí suena (responde a un clic del usuario); la batalla tranquila solo suena una vez `spark`.

## Cadena de nodos (`mix-graph.ts`)

```
ChordLayer (por capítulo, crossfade lineal)
  2 osciladores por nota → voz → capa ─┐
                                       ↓
padBus (0.32) → padFilter (lowpass Q 0.6, LFO ±90 Hz a 0.045 Hz) → swell ─ dry 1 · room 1 · hall 1
RoomTone (lluvia, gotas, zumbido, ciudad, coches) ──────────────────────── dry 1 · room 0.25
MusicBed (×2.2) ─────────────────────────────────────────────────────────── dry 1 · room 0.12
fxBus (teclas, tocks, foley, muestras) ──────────────────────────────────── dry 0.85 · room 0.35 · hall 0.05
chimeBus (teléfono) ─────────────────────────────────────────────────────── dry 0.6 · room 0.6 · hall 0.5
roomSend → Convolver 1.2 s ─┐
hallSend → Convolver 3.6 s ─┴→ master (0 → MASTER_LEVEL) → limitador (−18 dB, 6:1) → destino
```

- `room`/`hall` del capítulo mueven las ganancias de `roomSend`/`hallSend`.
- Dos convolvers fijos mezclados por ganancia: cambiar el `buffer` de un convolver en marcha hace clic.

## Eventos (`window`)

| Evento | Detalle | Uso |
|---|---|---|
| `chapter:enter` | `{ id, subIndex }` | Preset con swell; subplano nuevo → swell menor. Fuente preferente |
| `station:enter`, `section:active` | `{ id }` | Respaldo (en ese orden) mientras no llegue `chapter:enter`; con ellos el chime de `contact` suena a los 0.9 s |
| `chapter:settled` | `{ id, subIndex }` | `contact` → chime |
| `chapter:progress` | `{ id, progress }` | Solo `outro`: abre el filtro |
| `time:toggle` | — | Mezcla y música de día/noche |
| `scene:hover` | `{ label }` | Tock suave |
| `product:focus`, `experience:focus` | `{ id, source }` | Tock fuerte si `source === 'scene'` |
| `desk:key` | — | Tecla. Contrato: quien teclee el titular emite uno por carácter |
| `desk:switch` | `{ on }` | Muestra del interruptor |
| `desk:interact`, `desk:action`, `desk:clock` | `{ id, phase }`, `{ action, id }`, — | Foley de objetos |
| `desk:battle` | `{ sound }` | Batalla Pokémon (`battle-voices.ts`): `growl`, `flap`, `flame`, `quick`, `spark`, `thunder`, `impact`, `land`, `chirp`, `roar`. Los emite `PokemonLife` al pasar cada tiempo de `timeline/cues.ts`; si el reloj salta más de 0.5 s (pestaña oculta) no los repone. El tipo `BattleSound` está duplicado en los dos lados a propósito: el audio no importa nada de three |
| `motion:toggle` | `{ paused }` | Pausa |
| `audio:invite` | — | Lo emite el toggle (ver abajo) |

## Botón, autoplay y carga (`src/components/AudioToggle.astro`)

- `hud-control hud-icon`, `aria-pressed`, etiquetas `audio.enable` / `audio.mute` / `audio.armed`. Oculto sin Web Audio.
- El `AudioContext` (`latencyHint: 'playback'`) se crea **dentro del clic**, antes de cualquier `await`: Safari lo deja suspendido si no. Después `import('../audio/ambience')`, chunk aparte que no se descarga hasta entonces.
- Preferencia en `localStorage['audio']` (`on`/`off`). Al recargar con `on`: estado **armado** (`aria-pressed="false"`) que arranca con el primer `pointerup` o tecla distinta de Escape fuera del botón. Nunca suena sin gesto.
- Invitación: primer scroll, sin preferencia y una vez por sesión (`sessionStorage['audio-invited']`): emite `audio:invite` y el botón lleva `data-invite` 10 s.
- Pestaña oculta: fundido a 0 en 0.6 s y `suspend()`; al volver, si sigue activo, sube en 2.5 s. Silenciar: 1.2 s y `suspend()`.

## Ajustar volúmenes

Fijados por cálculo, no a oído: ajustar escuchando.

- `src/audio/ambience.ts`: `MASTER_LEVEL` 0.11 (no pasar de ~0.15); `LEVELS` (`pad` 0.32, `padUnderMusic` 0.12, `music` 2.2, `sample` 0.5, `room` 1, `chime` 0.16); `SWELL_GAIN`, `SUB_SHOT_SWELL_GAIN`, fundidos.
- `src/audio/ui-sounds.ts`: `key` 0.1, `tockHover` 0.09, `tockClick` 0.18 y los límites por tiempo.
- `src/audio/desk-sounds.ts`: `LEVEL` y `GAP_MS` por objeto.
- `src/audio/room.ts`: `ROOM_LEVELS` (`rainWash` 0.05, `drops` 0.07, `hum` 0.12, `city` 0.16), `DROPS_PER_SECOND`; `src/audio/traffic.ts`: `PASS_LEVEL`, `PASSES_PER_SECOND`.
- `src/audio/chapters.ts`: `chord`, `cutoff`, `rain`, `hum`, `city`, `room`, `hall`, `crossfade` por capítulo; `src/audio/daylight.ts`: escalas de día.

## Créditos (CC0 1.0, sin atribución obligatoria)

Copia en `public/audio/CREDITS.txt`; mantener ambas al cambiar archivos.

| Archivo | Obra | Autor | Fuente |
|---|---|---|---|
| `music-night.m4a` | Chill lofi inspired (loop edit) | omfgdude, loop de qubodup | https://opengameart.org/content/chill-lofi-inspired-loop-edit |
| `music-day.m4a` | First Light Particles | yoiyami | https://opengameart.org/content/first-light-particles-%E2%80%93-cc0-atmospheric-pianoambient-track |
| `music-dawn.m4a` | Heavenly Loop | isaiah658 | https://opengameart.org/content/heavenly-loop |
| `switch-on.m4a`, `switch-off.m4a` | Light switch turn on and off | funnydude | https://opengameart.org/content/light-switch-turn-on-and-off-sfx-0 |
| `page-flip.m4a` | 10 book page flips (n.º 2) | starninjas | https://opengameart.org/content/10-book-page-flips |

Conversión: `ffmpeg -vn -map_metadata -1 -c:a aac -b:a 96k`.
