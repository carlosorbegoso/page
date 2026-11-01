# Espaciado, radios, capas y movimiento

Tokens de layout (`--spacing-*`, `--container-*`, `--radius-*`, `--shadow-*`, `--z-*`) y de movimiento (`--duration-*`, `--ease-*`, `data-motion`); léelo antes de maquetar UI o animar algo.

Valores: `src/styles/tokens/scale.css`, `src/styles/tokens/stage.css` (duraciones, capas) y `src/styles/tokens/modes.css` (pausa). Coreografía y reveals: `docs/motion.md`.

## Espaciado (`--spacing`, `--spacing-gutter`, `--spacing-stack`, `--spacing-section`)

- Base `--spacing: 0.25rem` (`p-4` = 16 px). Ritmo: 4, 8, 12, 16, 24, 32, 48, 64.
- `px-gutter` 16 → 40 px (margen lateral) · `gap-stack` 24 → 40 px (entre bloques) · `py-section` 64 → 128 px (entre secciones).
- `--spacing-tap` 44 px → `min-h-tap min-w-tap` en todo control; ≥ 8 px entre objetivos contiguos.

## Contenedores (`--container-*`)

- `max-w-reading` 40rem · `--container-measure` 60ch (paneles 3D) · `max-w-content` 72rem · `max-w-wide` 80rem.

## Radios (`--radius-*`)

- `xs` 4 px chips de código · `sm` 6 px inputs, chips · `md` 10 px botones · `lg` 16 px tarjetas · `xl` 24 px hoja inferior · `pill` / `full`.
- Paneles: `--plate-radius` 1.25rem (1rem bajo 48rem).

## Elevación (`--shadow-*`, `--shadow-color`)

- En oscuro manda el paso de superficie (`bg` → `surface` → `surface-raised`) + `border`; la sombra solo refuerza.
- `shadow-sm` controles · `shadow-md` tarjeta en hover · `shadow-lg` hoja inferior, menú.
- `--shadow-color` cambia por modo (`rgb(0 0 0 / 0.55)` oscuro, `rgb(16 24 40 / 0.14)` claro).
- `shadow-focus` = `0 0 0 2px bg, 0 0 0 4px focus`.

## Capas (`--z-*`)

- canvas 0 · contenido 10 · header 40 · hoja/menú 50 · skip link 60.

## Duraciones y easings (`--duration-*`, `--ease-*`)

| Token | Valor | Uso |
|---|---|---|
| `--duration-instant` | 80 ms | Hover de color, presión |
| `--duration-fast` | 150 ms | Botones, foco, chips |
| `--duration-base` | 240 ms | Tarjetas, menú, tooltips |
| `--duration-slow` | 400 ms | Hoja inferior, reveals |
| `--duration-scene` | 900 ms | Transiciones de cámara 3D |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Por defecto |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Salidas |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Cámara, desplazamientos largos |

Tailwind: `transition-colors duration-(--duration-fast) ease-standard`.

## Reglas de movimiento

- Lento, amortiguado y con propósito: nunca rebotes ni elasticidad.
- Reveals de bloque: desplazamiento máximo 12–16 px + opacidad; nada de escalas > 1.02 ni rotaciones en la UI.
- Cámara 3D: límites en `CAMERA_LIMITS` (`src/three/director.ts`) y en `desk.md`.

## Pausa (`prefers-reduced-motion`, `data-motion="paused"`)

- `src/layouts/Base.astro` pone `data-motion="paused"` si hay `prefers-reduced-motion: reduce` o si el usuario pausó (`localStorage.motion`); si no, `running`. El botón es `src/components/MotionToggle.astro` (WCAG 2.2.2). El modo lectura siempre va en pausa.
- En pausa: todas las `--duration-*` pasan a `0.01ms` (no `0`, para que `transitionend` siga disparando); `animation-iteration-count: 1`, `scroll-behavior: auto`.
- En 3D: sin giro continuo, sin parallax, cortes con disolvencia (`desk.md`, sección "Pausa").
