# Sonido ambiente

Audio generativo con Web Audio API. **Cero archivos de audio**: todo (osciladores, ruido, impulsos de reverb) se sintetiza en el navegador. Apagado por defecto.

## Diseño sonoro

Un pad nocturno, lento y bajo, que acompaña el viaje del escritorio al espacio. Nada de efectos de juego: sin barridos, sin impactos, sin ritmos.

| Estación | Acorde (MIDI) | Carácter |
|---|---|---|
| `hero` (escritorio) | D3 A3 C#4 E4 (Dmaj9 sin raíz arriba) | Cálido e íntimo: filtro cerrado (620 Hz), reverb de habitación corta, leve hum de cuarto (ruido grave + 60/120 Hz). |
| `about` | B2 F#3 A3 D4 F#4 (Bm11) | Primer paso fuera: el filtro se abre, entra el aire y la reverb larga. |
| `company` (Alfa) | G2 D3 F#3 C#4 F#4 (Gmaj7#11, lidio) | Luminoso y suspendido, sin hum. |
| `products` | E3 B3 D4 F#4 A4 (Em11) | Más agudo, la órbita de las lunas. |
| `experience` | A2 E3 B3 C#4 E4 (Aadd9) | Asentado, reverb más larga. |
| `contact` | D3 A3 E4 F#4 A4 (Dadd9 abierto) | Lo más abierto: vuelve a casa (Re) pero en el espacio. |

Todo está en Re mayor, así que cualquier crossfade entre estaciones suena consonante.

- **Cambio de estación**: el acorde nuevo entra en una capa nueva y la anterior sale, crossfade lineal de 3 s; filtro, hum, aire y envíos de reverb se mueven con `setTargetAtTime` (≈ 3 s hasta asentarse).
- **`station:progress`**: mientras la cámara viaja (|progress| → 1) el filtro se abre hasta un 18 % más; al llegar vuelve a su sitio.
- **Ping**: campana cristalina (seno + parciales inarmónicos 2.756× y 5.404×, ataque 8 ms, cola 2.4 s) enviada sobre todo a la reverb larga. Suena al entrar en una estación nueva (máx. 1 cada 1.2 s; nunca en la primera estación) y al hacer hover sobre un objeto navegable con una etiqueta distinta (máx. 1 cada 450 ms, la mitad de volumen).
- **Pausa** (`motion:toggle { paused: true }`, `data-motion="paused"` o `prefers-reduced-motion`): el pad sigue sonando, pero sin pings, sin trémolo del brillo y sin seguir el `progress`. El LFO del filtro (0.045 Hz, un ciclo cada 22 s) se mantiene: no es una modulación perceptible como movimiento.

## Cadena de nodos

```
ChordLayer (por estación, se reemplaza con crossfade)
  2 osciladores por nota (triangle −7 ct, sine +7 ct) → voz (1/n) → pad ─┐
  octava alta de las 2 notas superiores (sine)              → shimmer ─┐ │
                                                                       │ │
pad ──→ padBus (0.5) → padFilter (lowpass, Q 0.6, LFO ±140 Hz) ──┬─ dry ──────────┐
shimmer → shimmerBus (air × 0.09) → trémolo (LFO 0.21 Hz) ───────┤                │
hum: ruido → lowpass 170 Hz + seno 60 Hz + 120 Hz → humGain ─────┤                │
aire: ruido → bandpass 5.2 kHz → airGain ────────────────────────┤                │
pings → pingBus ─────────────────────────────────────────────────┤                │
                                                                 ├→ roomSend → Convolver 1.4 s ─┤
                                                                 └→ spaceSend → Convolver 5.5 s ┤
                                                                                                ↓
                                                     master (0 → MASTER_LEVEL) → compresor suave → destino
```

Los impulsos de reverb son ruido estéreo con caída exponencial y un paso bajo que se oscurece a lo largo de la cola (`src/audio/buffers.ts`). Se usan dos convolvers con mezcla por ganancia porque cambiar el `buffer` de un convolver en marcha produce un clic.

## Encendido, autoplay y carga

- `src/components/AudioToggle.astro` (en el HUD, `hud-control hud-icon`, 44 × 44 px, `aria-pressed`, etiqueta i18n `audio.enable` / `audio.mute` / `audio.armed`). Oculto si el navegador no tiene Web Audio.
- El `AudioContext` se crea **dentro del clic**, antes de cualquier `await` (Safari lo deja suspendido si no). Después se hace `import('../audio/ambience')`: el código de audio es un chunk aparte (~9 KB minificado, ~3 KB gzip) que no se descarga hasta ese momento.
- La preferencia se guarda en `localStorage['audio']` (`on`/`off`, con try/catch). Al recargar con `on`, el botón queda en estado **armado** (icono silenciado + punto de acento, `aria-pressed="false"`) y el sonido arranca con el primer gesto del usuario en la página (`pointerdown` o tecla que no sea Escape). Nunca suena sin gesto.
- Con la pestaña oculta el master baja a 0 en 0.6 s y el contexto se suspende; al volver, si sigue activado, sube en 2.5 s. Al silenciar: fundido de 1.2 s y `suspend()` (sin coste de CPU).

## Eventos (en `window`)

| Evento | Detalle | Uso |
|---|---|---|
| `station:enter` | `{ id }` | Cambia el preset. Una vez recibido, se ignora `section:active`. |
| `section:active` | `{ id }` | Respaldo (lo emite el Header) mientras el motor 3D no publique `station:enter`. |
| `station:progress` | `{ id, progress }` | Apertura ligera del filtro durante los viajes. |
| `scene:hover` | `{ label }` | Ping de hover (solo cuando cambia a una etiqueta no nula). |
| `motion:toggle` | `{ paused }` | Pausa: sin pings ni modulaciones rápidas. |

## Ajustar volúmenes

Todo en `src/audio/ambience.ts`:

- `MASTER_LEVEL` (0.11): volumen máximo global. No pasar de ~0.15; el compresor de salida es una red de seguridad, no un limitador de volumen.
- `LEVELS`: `pad` 0.5, `shimmer` 0.09, `hum` 0.05, `air` 0.012, `ping` 0.05, `hoverPing` 0.025. Son relativos al master.
- Tiempos: `CROSSFADE_SECONDS`, `FADE_IN_SECONDS`, `FADE_OUT_SECONDS`, `HIDDEN_FADE_SECONDS`, `STATION_PING_GAP_MS`, `HOVER_PING_GAP_MS`.

Por estación, en `src/audio/presets.ts`: `chord`, `cutoff`, `hum`, `air`, `room`, `space` (0..1, multiplican los niveles de arriba o los envíos de reverb) y `bells` (notas que puede tocar el ping).
