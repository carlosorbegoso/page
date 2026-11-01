# Assets 3D: caché, glTF, pipeline y licencias

Cómo se cargan los modelos y texturas externas del 3D y qué hay que anotar al traer uno nuevo (Tripo, Poly Haven); léelo antes de añadir un glTF o tocar `src/three/assets.ts`. Peso y presupuesto: `docs/3d/budget.md`.

## Caché (`src/three/assets.ts`)

- `acquire(key, create, dispose)` / `release(key)`: refcount por clave; al llegar a 0 espera 5 s (`GRACE_MS`) antes de liberar, para que un ir y volver de capítulo no recargue.
- `acquireGltf(url)`: `GLTFLoader` + `KTX2Loader` + Meshopt se importan solo con el primer glTF. El transcoder Basis se busca en `public/decoders/basis/` (hoy vacío: ningún modelo usa KTX2).
- `bindRenderer()` lo llama el Stage al crear el renderer (lo necesita `KTX2Loader.detectSupport`).
- `cacheSnapshot()` sale en el overlay de `?debug`.

## Modelos en uso

| Modelo | Archivo | Origen | Licencia | Notas |
|---|---|---|---|---|
| Reloj despertador | `public/models/alarm-clock/alarm-clock.gltf` | Poly Haven "Alarm Clock 01" | CC0 1.0 | Texturas reducidas a 512 px; lo carga `src/three/desk/clock.ts` |

El resto del escritorio (figuras, cuarto, laptop, Pokémon) es geometría procedural en `src/three/desk/props/`.

## Pipeline `bun run assets`

- `scripts/optimize-assets.ts`: lee `assets-src/models/<id>.glb|gltf` con `<id>` ∈ `alfa`, `burbu`, `gift`, `tool` y escribe `public/models/<id>.high.<hash>.glb` (≤ 25 k tris, texturas ≤ 1024 px) y `<id>.mid.<hash>.glb` (≤ 8 k tris, ≤ 512 px), con Meshopt y KTX2 (ETC1S color/emisivo, UASTC normal/ORM) si está `ktx` (`brew install ktx`); sin `ktx`, las texturas quedan en su formato. Reescribe `src/three/models.generated.ts` y copia el transcoder.
- Hoy no hay fuentes en `assets-src/models/` y lo único que consumía `models.generated.ts` era `src/three/mascots/`, que nada importa. Un GLB nuevo para el escritorio tendría que cargarse desde `src/three/desk/**` con `acquireGltf`.

## Checklist de intake (Tripo u otro)

- [ ] Tris: high ≤ 25 k, mid ≤ 8 k.
- [ ] 1 material + atlas; texturas potencia de 2; UV sin solapes; AO horneado.
- [ ] Escala 1 u = 1 m, pivote en la base, +Y arriba, mirando a +Z.
- [ ] Colores exactos de los tokens.
- [ ] Nodos con nombre según `docs/design/mascots.md`.
- [ ] Licencia comercial anotada en la tabla de arriba (plan de Tripo usado).
