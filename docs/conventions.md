# Convenciones del código

Reglas de organización: skill `arquitectura-modular` (`.claude/skills/arquitectura-modular/SKILL.md`). Qué archivo editar: [mapa del código](CODEMAP.md).

## Reglas
- ESLint `max-lines` en 300 (error) y `max-lines-per-function` en 40 (aviso).
- Un tema por archivo. El GLSL va en `*.glsl.ts`, con la etiqueta `/* glsl */` delante del template.
- Barrels con exports con nombre, sin `export *`. Un submódulo nunca importa a su ensamblador.
- Sin comentarios en el código: lo que no se entiende por los nombres va en estos docs.
- Mover código y limpiar van en commits separados.
- Si agregas, mueves o borras un archivo, actualiza su fila en `docs/codemap/` en el mismo commit.

## Trampas conocidas
- **`settling ||= m.update(frame)`**: los módulos del escritorio exponen `update(frame): boolean` y el ensamblador junta los resultados así. Nunca pongas una llamada a `update` a la derecha de un `||=` que ya pueda ser verdadero: no se ejecuta (ya pasó con la carpeta). Llama primero y combina después.
- **JS inicial**: `src/components/hud/*` no puede importar three ni GSAP, porque se colarían en el JS inicial.
- **Tokens**: si un `@theme static` de `src/styles/tokens/` queda fuera de orden, `src/three/tokens.ts` lee valores vacíos. Compruébalo en el build de producción.
- **CSS de secciones**: al sacar CSS del `<style>` de un componente pierde especificidad; si una regla se rompe, antepón el id de la sección.
- **HMR**: los listeners de `hud/*` no deben duplicarse al recargar.
- **Imports circulares**: compruébalos con `bunx madge --circular src`.

## Verificación de cada cambio
- `bun run check`, `bun run lint` y `bun run build`.
- Tamaño gzip de lo que se descarga antes del primer frame del 3D (≤ 260 KB, ver `docs/requirements.md`).
- Capturas de hero, about, experience, company, products, contact y outro a 1440 y 375 px, de día y de noche.
