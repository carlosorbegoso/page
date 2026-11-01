# Plan de modularización (2026-11-01)

Objetivo: archivos pequeños, de 300 líneas como máximo y con una sola responsabilidad cada uno, para que cada cambio necesite poco contexto y varios agentes puedan trabajar a la vez en `develop` sobre archivos distintos.

## Cortes
- **`desk/DeskSet.ts`** (947 líneas): pasa a ser un ensamblador de unas 250 líneas y el resto se reparte en `desk/set/`.
  - `levels.ts`: luz por capítulo, día y noche, cambios de lámpara, `introLevels`.
  - `lighting.ts`: el rig de luces.
  - `figures.ts`: presencia de las figuras, neón, elevación y giro, juego al hacer clic.
  - `folders.ts`: bisagra, carpeta que sale del estante, brillo, detalle.
  - `screens.ts`: monitor, teléfono y laptop.
  - `picks.ts`: zonas de clic, etiquetas, hover.
  - `clock-wiring.ts`: el reloj.
  - `story.ts`: `storyRank`.

  **Contrato:** cada módulo expone `update(frame): boolean` y `apply(uniforms)`, y el ensamblador junta los resultados con `settling ||= m.update(frame)`. Ojo: no meter otra llamada a `update` dentro de un `||=`, porque si `settling` ya es verdadero esa llamada no se ejecuta (ya pasó con la carpeta).
- **`desk/props.ts`**: se reparte en `props/`.
  - `palette`, `geometry`, `room`, `workstation`, `decor`, `figures`, `shadows`.
  - `index.ts` como barrel.
- **`desk/atmosphere.ts`**: se reparte en `atmosphere/`.
  - `backdrop` con su `backdrop.glsl.ts`, `city-atlas`, `glass`, `steam`.
  - `index.ts` como barrel.
- **`desk/materials.ts`**: se reparte en `materials/`.
  - `atlas` con su `atlas.glsl.ts`, `canvas`, `environment`.
- **`desk/math.ts`**: `damp`, `towards` y `seeded`, en una sola copia.
- **fx**:
  - `shaders/` con un archivo por pasada: `fullscreen`, `coc`, `bloom`, `streak`, `dof`, `composite`.
  - `fluid/`: `shaders`, `patch`, `field`, `index`.
  - `pipeline.ts` de unas 250 líneas, más `passes/`, `targets.ts` y `adapt.ts`.
- **`Header.astro`**: se queda con el marcado y los estilos. Su script pasa a `components/hud/`:
  - `menu`, `index-sheet`, `progress`, `tour-badge`, `audio-hint`, `chapter-beat`, `beats`, `main`.
- **`About.astro`**:
  - Componentes `about/AboutBio`, `AboutStack`, `AboutCode`.
  - CSS en `styles/sections/about/`: `monitor`, `monitor-landscape`, `anchored`.
- **i18n**: `i18n/<locale>/<namespace>.ts`. `ui.<locale>.ts` los combina con spread y `UiKey` no cambia.
- **`tokens.css`**: se reparte en `styles/tokens/`.
  - `fonts`, `colors`, `scale`, `stage`, `modes`, cada uno con su `@theme static`.
  - `Base.astro` importa `tokens/colors.css?raw`.
- **Ola 3**:
  - `story-nav/`: `scroll`, `input`, `tour`, `snap`.
  - `stage/`: `frame-loop`, `plates-mount`, `listen`, `station-context`.
  - `ReadingPage`, `notfound/scene`.

## Convenciones
- ESLint `max-lines` a 300 (en modo `warn` al empezar y `error` al terminar).
- Un tema por archivo. El GLSL va en `*.glsl.ts`.
- Barrels con exports con nombre, sin `export *`. Un submódulo nunca importa a su ensamblador.
- Sin comentarios que narren el código.
- Mover código y limpiar van en commits separados.
- `docs/CODEMAP.md` dice qué archivo editar para cada cosa.

## Ejecución (todo en `develop`, sin worktrees, cada agente con sus archivos)
- **Verificación de cada paso:**
  - `bun run check`, `bun run lint` y `bun run build`;
  - tamaño gzip del chunk 3D (límite: 260 KB);
  - capturas de hero, about, experience:2, company, products:1, contact y outro a 1440 y 375 px, de día y de noche, comparadas con las capturas base.
- **Paso 0:** capturas base, `max-lines` en `warn`, `desk/math.ts` y esqueleto de CODEMAP.
- **Ola 1, en paralelo:**
  - A: props, atmosphere, materials.
  - B: fx.
  - C: i18n, tokens, scripts del HUD.
- **Ola 2:**
  - A: DeskSet en `set/*`.
  - C: About.
- **Ola 3:** story-nav, Stage, ReadingPage, notfound. Al final, CODEMAP definitivo y `max-lines` en `error`.

## Riesgos
- **Imports circulares:** comprobar con `bunx madge --circular src`.
- **Peso del JS inicial:** `hud/*` no debe importar three ni GSAP, porque se colarían en el JS inicial.
- **CSS de About:** al sacarlo del `<style>` del componente pierde especificidad; si alguna regla se rompe, anteponer `#about`.
- **Orden de imports de tokens:** si un `@theme static` queda fuera de orden, `tokens.ts` lee valores vacíos. Comprobarlo en el build de producción.
- **HMR:** que los listeners de `hud/*` no se dupliquen al recargar.
