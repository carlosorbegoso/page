# Carlos Orbegoso · Portafolio

Sitio estático bilingüe (ES en `/page/`, EN en `/page/en/`) con un escritorio 3D: <https://carlosorbegoso.github.io/page/>. Documentación en [`docs/README.md`](docs/README.md).

## Stack
- Astro 7 (estático, i18n, content collections) + TypeScript
- Three.js + GSAP (ScrollTrigger) para el escritorio 3D
- Tailwind CSS 4 vía `@tailwindcss/vite`; tokens en `src/styles/tokens/`
- Bun 1.4.4 como gestor de paquetes y runtime de scripts
- ESLint 9 (flat) + Prettier, `astro check`, Playwright y Lighthouse CI

## Comandos
| Comando | Acción |
| --- | --- |
| `bun install` | Instala dependencias (`bun.lock` es la fuente) |
| `bun run dev` | Servidor de desarrollo en `/page/` |
| `bun run build` | Genera `dist/` |
| `bun run preview` | Sirve `dist/` |
| `bun run check` | Tipos y componentes Astro |
| `bun run lint` | ESLint |
| `bun run format` | Prettier (`format:check` solo verifica) |
| `bun run assets` | Optimiza los GLB de `assets-src/` |
| `bun run capture` | Regenera las imágenes de fallback (con el dev server levantado) |

## Estructura
```
src/
  pages/        home ES/EN, modo lectura ES/EN, 404
  layouts/      Base.astro: <head>, SEO, hreflang, JSON-LD
  components/   HUD, secciones, ui/, three/ (arranque del canvas)
  content/      perfil, experiencia y productos (es.json / en.json)
  i18n/         textos de interfaz por idioma y helpers de URL
  styles/       tokens/, plates/, motion/, sections/
  motion/       navegación por planos y texto cinético
  audio/        sonido ambiente
  three/        motor 3D, escritorio (desk/), postproceso (fx/), 404 (notfound/)
```

Las URLs internas se construyen con `withBase()` y `localeUrl()` de `src/i18n/utils.ts` para respetar `base: '/page'` y la barra final.

## Despliegue
Un push a `main` ejecuta `.github/workflows/deploy.yml` y publica en GitHub Pages.
