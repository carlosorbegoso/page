# Assets 3D: caché, glTF, pipeline y licencias

Cómo se cargan los modelos y texturas externas del 3D y qué hay que anotar al traer uno nuevo (Tripo, Poly Haven); léelo antes de añadir un glTF o tocar `src/three/assets.ts`. Peso y presupuesto: `docs/3d/budget.md`.

## Caché (`src/three/assets.ts`)

- `acquire(key, create, dispose)` / `release(key)`: refcount por clave; al llegar a 0 espera 5 s (`GRACE_MS`) antes de liberar, para que un ir y volver de capítulo no recargue.
- `acquireGltf(url)`: `GLTFLoader` + `KTX2Loader` + Meshopt se importan solo con el primer glTF. El transcoder Basis se busca en `decoders/basis/` bajo la base del sitio (ver «Transcoder KTX2»).
- `bindRenderer()` lo llama el Stage al crear el renderer (lo necesita `KTX2Loader.detectSupport`).
- `cacheSnapshot()` sale en el overlay de `?debug`.

## Modelos en uso

| Modelo | Archivo | Origen | Licencia | Notas |
|---|---|---|---|---|
| Reloj despertador | `public/models/alarm-clock/alarm-clock.gltf` | Poly Haven "Alarm Clock 01" | CC0 1.0 | Texturas reducidas a 512 px; lo carga `src/three/desk/clock.ts` |

El resto del escritorio (figuras, cuarto, laptop, Pokémon) es geometría procedural en `src/three/desk/props/`.

## Pipeline `bun run assets`

- `scripts/optimize-assets.ts`: lee cada `assets-src/models/<id>.glb|gltf` y escribe `public/models/<id>.high.<hash>.glb` (≤ 25 k tris, texturas ≤ 1024 px) y `<id>.mid.<hash>.glb` (≤ 8 k tris, ≤ 512 px), con Meshopt y KTX2 (ETC1S color/emisivo, UASTC normal/ORM) si está `ktx` (`brew install ktx`); sin `ktx`, las texturas quedan en su formato. Imprime cada nombre con hash y copia el transcoder.
- Hoy no hay fuentes en `assets-src/models/`. Nada lee los nombres con hash por sí solo: el módulo de `src/three/desk/**` que use el GLB lo carga con `acquireGltf` y el nombre que imprimió el script.

## Transcoder KTX2

- `KTX2Loader` pide `basis_transcoder.js` y `basis_transcoder.wasm` a `decoders/basis/` (`setTranscoderPath` en `src/three/assets.ts`), con esos nombres fijos: por eso no pasan por Vite con hash.
- Viven en `public/decoders/basis/` y van en git (57 KB + 527 KB sin comprimir). No cuentan para los 260 KB: solo se piden con la primera textura KTX2.
- `bun run assets` los copia desde `node_modules/three/examples/jsm/libs/basis/` cada vez que corre, aunque no haya modelos. Al subir la versión de `three`, corre `bun run assets` y commitea los dos archivos para que el transcoder siga a `KTX2Loader`.

## Checklist de intake (Tripo u otro)

- [ ] Tris: high ≤ 25 k, mid ≤ 8 k.
- [ ] 1 material + atlas; texturas potencia de 2; UV sin solapes; AO horneado.
- [ ] Escala 1 u = 1 m, pivote en la base, +Y arriba, mirando a +Z.
- [ ] Colores exactos de los tokens.
- [ ] Nodos con nombre según `docs/design/mascots.md`.
- [ ] Licencia comercial anotada en la tabla de arriba (plan de Tripo usado).
