# Sonido ambiente: "Una noche en el escritorio"

Audio generativo con Web Audio API. **Cero archivos de audio**: osciladores, ruido, gotas e impulsos de reverb se sintetizan en el navegador. Apagado por defecto.

## Diseño sonoro

Una habitación de noche con lluvia en la ventana. El pad es casi un color, no música; lo que se oye primero es el cuarto. Nada de efectos de juego.

**Tono de cuarto (continuo, `src/audio/room.ts`)**

- **Lluvia en el vidrio**: un lavado de ruido (paso alto 450 Hz, paso bajo 4.8 kHz, ráfagas lentas a 0.07 Hz) y gotas sueltas: cuatro "ticks" de vidrio sintetizados (anillo amortiguado de 2.4–4.7 kHz + transitorio), ~9 por segundo con densidad proporcional al nivel de lluvia, tono, volumen (sesgo cúbico: casi todas suaves) y panorama aleatorios.
- **Zumbido de habitación**: ruido grave (paso bajo 160 Hz) + 60/120/180 Hz muy bajos.
- **Ciudad lejana**: ruido a baja velocidad, paso bajo 280 Hz, realce en 110 Hz y vaivén de tráfico a 0.023 Hz (un ciclo cada ~43 s).

**Pad por capítulo** (`src/audio/chapters.ts`, todo en Re mayor para que cualquier crossfade sea consonante)

| Capítulo | Acorde | Filtro | Lluvia / zumbido / ciudad | Nota |
|---|---|---|---|---|
| `intro` | Dmaj9 | 520 Hz | 1 / 0.8 / 0.7 | La lámpara se enciende. |
| `hero` | Dmaj9 | 650 Hz | 1 / 1 / 0.7 | Cálido, íntimo. |
| `about` | Bm7 | 760 Hz | 1 / 1.25 / 0.55 | Cerca del monitor: más zumbido. |
| `company` | Gmaj7#11 | 900 Hz | 0.85 / 0.8 / 0.7 | Bajo la lámpara. |
| `products` | Em9 | 980 Hz | 0.85 / 0.8 / 0.7 | |
| `experience` | Aadd9 | 820 Hz | 0.9 / 0.85 / 0.7 | |
| `contact` | Dadd9 | 1050 Hz | 0.8 / 1 / 0.7 | |
| `outro` (amanecer) | Re abierto en 7 voces (D2…E5) | 2600 Hz | **0** / 0.2 / 1 | Crossfade de 6 s: el acorde se abre, la lluvia se va, la ciudad despierta, más reverb larga. El filtro sigue abriéndose con `chapter:progress`. |

**Interacción** (`src/audio/voices.ts`)

- **Tecla mecánica suave** por cada `desk:key` (titular tecleado del hero): click en paso banda ~2.6 kHz + "thock" grave de 210→120 Hz, con variación aleatoria. Máx. 1 cada 28 ms.
- **"Tock" de madera** al hacer hover sobre un objeto del escritorio (`scene:hover` con etiqueta nueva) y, más fuerte, al hacer clic (`product:focus`/`experience:focus` con `source: 'scene'`): golpe afinado ~480 Hz con caída de tono y dos parciales cortos. Máx. 1 cada 250 ms.
- **Chime del teléfono** al asentarse `contact` (`chapter:settled`): dos notas de vidrio a una quinta (E6 → B6). Máx. 1 cada 4 s.
- **Swell** en cada `chapter:enter`: el pad sube ×1.45 y vuelve en ~3 s; en un cambio de subplano (mismo capítulo, otro `subIndex`, p. ej. entre productos) ×1.2.

**Pausa** (`motion:toggle { paused: true }`, `data-motion="paused"` o `prefers-reduced-motion`): el cuarto y el pad siguen, pero sin teclas, tocks, chime, swells ni seguimiento del scroll.

## Cadena de nodos

```
ChordLayer (por capítulo; crossfade lineal de 3 s, 6 s en outro)
  2 osciladores por nota (triangle −7 ct, sine +7 ct) → voz → capa ─┐
                                                                   ↓
padBus (0.32) → padFilter (lowpass Q 0.6, LFO ±90 Hz a 0.045 Hz) → swell ─┬─ dry ──────────────┐
RoomTone (lluvia + gotas, zumbido, ciudad) ───────────────────────────────┤ (+ room 0.25)      │
fxBus (teclas, tocks) ────────────────────────────────────────────────────┤ (room 0.35)        │
chimeBus (teléfono) ──────────────────────────────────────────────────────┤ (room/hall 0.6/0.5)│
                                              roomSend → Convolver 1.2 s ─┤                    │
                                              hallSend → Convolver 3.6 s ─┘                    ↓
                                                           master (0 → MASTER_LEVEL) → compresor suave → destino
```

Los envíos `room`/`hall` de cada capítulo escalan los dos convolvers. Se usan dos convolvers mezclados por ganancia porque cambiar el `buffer` de un convolver en marcha produce un clic.

## Eventos (en `window`)

| Evento | Detalle | Uso |
|---|---|---|
| `chapter:enter` | `{ id, subIndex }` | Cambia el preset con swell; subplano nuevo → swell menor. Fuente preferente. |
| `chapter:settled` | `{ id, subIndex }` | `contact` → chime del teléfono. |
| `chapter:progress` | `{ id, progress }` (0..1) | Solo en `outro`: el filtro se abre del 70 % al 100 %. |
| `station:enter`, `section:active` | `{ id }` | Respaldo (por este orden) mientras no llegue `chapter:enter`; con ellos el chime de `contact` suena a los 0.9 s. |
| `scene:hover` | `{ label }` | Tock suave. |
| `product:focus`, `experience:focus` | `{ id, source }` | Tock de clic si `source === 'scene'`. |
| `desk:key` | cualquiera | **Contrato nuevo**: quien teclee el titular del hero debe emitir uno por carácter. |
| `motion:toggle` | `{ paused }` | Pausa. |
| `audio:invite` | — | **Lo emite el toggle**: primer scroll, sin preferencia guardada, una vez por sesión. El HUD puede pintar una invitación discreta (p. ej. un punto en el monograma). El propio botón lleva `data-invite` 10 s. |

## Encendido, autoplay y carga

- `src/components/AudioToggle.astro` (`hud-control hud-icon`, 44 × 44 px, `aria-pressed`, etiquetas `audio.enable` / `audio.mute` / `audio.armed`). Oculto sin Web Audio.
- El `AudioContext` se crea **dentro del clic**, antes de cualquier `await` (Safari lo deja suspendido si no). Después `import('../audio/ambience')`: chunk aparte (~13 KB minificado, ~4.4 KB gzip) que no se descarga hasta entonces.
- Preferencia en `localStorage['audio']` (`on`/`off`). Al recargar con `on`: estado **armado** (icono silenciado + punto, `aria-pressed="false"`) y arranca con el primer `pointerup` (un toque, no un scroll táctil) o tecla que no sea Escape. Nunca suena sin gesto.
- Pestaña oculta: fundido a 0 en 0.6 s y `suspend()`; al volver, si sigue activado, sube en 2.5 s. Al silenciar: 1.2 s y `suspend()`. Las gotas no se programan con el contexto suspendido.

## Ajustar volúmenes

Fijados por cálculo, no a oído: ajustar escuchando.

- `src/audio/ambience.ts`: `MASTER_LEVEL` (0.11, no pasar de ~0.15) y `LEVELS` (`pad` 0.32, `room` 1, `key` 0.1, `tockHover` 0.09, `tockClick` 0.18, `chime` 0.16), `SWELL_GAIN`, `SUB_SHOT_SWELL_GAIN`, tiempos y límites de frecuencia.
- `src/audio/room.ts`: `ROOM_LEVELS` (`rainWash` 0.05, `drops` 0.07, `hum` 0.12, `city` 0.16) y `DROPS_PER_SECOND`.
- `src/audio/chapters.ts`: por capítulo `chord`, `cutoff`, `rain`, `hum`, `city`, `room`, `hall`, `crossfade`.
