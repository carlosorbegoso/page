# Carlos Orbegoso · Portafolio

Sitio estático bilingüe (ES por defecto en `/page/`, EN en `/page/en/`) publicado en
<https://carlosorbegoso.github.io/page/>. El plan del rediseño está en [`docs/PLAN.md`](docs/PLAN.md).

## Stack

- Astro 7 (estático, i18n nativo, content collections) + TypeScript
- Tailwind CSS 4 vía `@tailwindcss/vite`, tokens en `src/styles/tokens.css`
- Three.js + GSAP para la escena 3D (en preparación)
- Bun 1.4.4 como gestor de paquetes y runtime de scripts
- ESLint 9 (flat) + Prettier, `astro check`, Playwright y Lighthouse CI para QA

## Comandos

| Comando           | Acción                                         |
| ----------------- | ---------------------------------------------- |
| `bun install`     | Instala dependencias (`bun.lock` es la fuente) |
| `bun run dev`     | Servidor de desarrollo en `/page/`             |
| `bun run build`   | Genera `dist/`                                 |
| `bun run preview` | Sirve `dist/` localmente                       |
| `bun run check`   | Verifica tipos y componentes Astro             |
| `bun run lint`    | ESLint                                         |
| `bun run format`  | Prettier (`format:check` solo verifica)        |

## Estructura

```
src/
  content/            perfil, experiencia y productos en es.json / en.json
  content.config.ts   schemas de las colecciones
  i18n/               textos de interfaz (ui.es.ts, ui.en.ts) y helpers
  config/site.ts      datos fijos: email, redes, ruta del CV, ids de sección
  layouts/Base.astro  <head>, SEO, hreflang, JSON-LD
  components/         Header, Footer, LangSwitch, sections/, ui/, three/
  pages/              index.astro, en/index.astro, 404.astro
  styles/             global.css y tokens.css
```

Las URLs internas se construyen con `withBase()` y `localeUrl()` de `src/i18n/utils.ts`
para respetar `base: '/page'` y la barra final.

## Despliegue

Un push a `main` ejecuta `.github/workflows/deploy.yml` y publica en GitHub Pages.
