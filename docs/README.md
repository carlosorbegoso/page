# Docs

Índice: busca tu tema en la primera columna y abre solo ese archivo. Cada doc abre con una línea que dice qué cubre y cuándo leerlo.

| Tema / palabras clave | Archivo |
| --- | --- |
| Qué archivo editar (cualquier cambio) | [`CODEMAP.md`](CODEMAP.md) → `codemap/{web,motion-audio,stage,desk,fx,notfound}.md` |
| Reglas de código, trampas (`settling ||=`, imports del HUD, orden de tokens), verificación | [`conventions.md`](conventions.md) |
| Decisiones de Carlos, presupuestos (Lighthouse, KB, FPS, draw calls), tiers, i18n, SEO, a11y, anti-mareo | [`requirements.md`](requirements.md) |
| Lo que falta, preguntas abiertas, código muerto | [`pending.md`](pending.md) |
| Arranque del 3D, `Stage.start`, tiers y DPR, render a demanda, `?debug` `?tier` `?chapter` `?capture`, fallbacks | [`3d/engine.md`](3d/engine.md) |
| Capítulos, eventos `chapter:*` `story:*` `desk:*`, `ShotProvider`, `CameraDirector`, scroll, placas `data-plate-*` | [`3d/director.md`](3d/director.md) |
| Escritorio: sub-planos, superficies, anclas, foco, picks, acciones, ids de objeto (`oid`) | [`3d/desk.md`](3d/desk.md) |
| Peso de los chunks, qué va antes del primer frame (260 KB), `deferred` | [`3d/budget.md`](3d/budget.md) |
| GLB, KTX2, Meshopt, `bun run assets`, licencias, checklist de intake | [`3d/assets.md`](3d/assets.md) |
| Bloom, DoF, streak, grading por capítulo, fluido, tiers de FX, NaN de `pow()` | [`3d/fx.md`](3d/fx.md) |
| Texto cinético, `KineticText`, revelados, proximidad, story-nav (teclas, rueda, snap, tour) | [`motion.md`](motion.md) |
| Sonido: ambiente, música, foley `desk:*`, niveles, créditos CC0 | [`audio.md`](audio.md) |
| Identidad visual, favicon, OG, tokens que lee el 3D | [`design/identity.md`](design/identity.md) |
| Colores, modos (oscuro, claro, día), contrastes WCAG | [`design/palette.md`](design/palette.md) |
| Fuentes Geist, escala `--text-*`, tracking | [`design/type.md`](design/type.md) |
| Espaciado, radios, sombras, z-index, duraciones, easing, pausa | [`design/spacing-motion.md`](design/spacing-motion.md) |
| Dirección de arte del escritorio: paleta `--color-desk-*`, luz y plano por capítulo | [`design/desk.md`](design/desk.md) |
| Figuras (Alfa, SkyMek, Parati, Ventixs), prompts de Tripo | [`design/mascots.md`](design/mascots.md) |
| Voz y tono, dónde vive el copy (`src/i18n`, `src/content`) | [`copy/voice.md`](copy/voice.md) |

## Mantenerlo al día
- Si un cambio agrega, mueve o borra un archivo, actualiza su fila en `codemap/` en el mismo commit.
- Si cambia algo que un doc describe (valor, evento, regla), corrige ese doc en el mismo commit.
- Un plan terminado se borra (queda en git); lo abierto va a `pending.md`.
- Antes de commitear, comprueba que no queden rutas muertas: cada ruta entre backticks tiene que existir.
