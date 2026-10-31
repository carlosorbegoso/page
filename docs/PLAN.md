# Rediseño del portafolio — landing/portafolio 3D con Three.js

Estado: **versión inicial del Arquitecto (Fase 1)**. Pendiente de revisión (Fase 2).
Fecha: 2026-10-31 · Rama: `develop` · PR único `develop → main` (draft).

---

## 0. Decisiones confirmadas por Carlos

| Tema | Decisión |
|---|---|
| Idioma | **Bilingüe**: español por defecto en `/page/`, inglés en `/page/en/`. |
| Modelos 3D | **Generados con IA** (texto/imagen → 3D), luego limpiados y optimizados. |
| Puesto actual | **IT Analyst en TCS · cliente BCP** (se nombra a BCP). |
| LinkedIn | `https://linkedin.com/in/carlos-orbergoso-loayza` |
| Stack 3D | Three.js + glTF/GLB (Draco/Meshopt) + KTX2 + GSAP. Fijo. |

---

## 1. Análisis del repo actual

### 1.1 Stack

| Pieza | Versión actual | Observación |
|---|---|---|
| Astro | 5.18 (latest: 7.4) | Sitio estático, `base: '/page'`, deploy a GitHub Pages en push a `main`. |
| Vite | 7.3 | Vía Astro. |
| Tailwind | 4.2 (`@tailwindcss/vite`) | Instalado, pero casi todo el estilo es CSS a mano (~40 archivos). |
| Three.js | **0.158** (2023; latest 0.187) | Hay que subir: cambian imports de `examples/jsm` → `three/addons`, `ColorManagement`/`outputColorSpace`, luces físicas por defecto (r155+). |
| Runtime | Bun (CI usa `bun install`), también `package-lock.json` | Dos lockfiles. |
| Otros | `astro-compressor`, `@astrojs/sitemap`, `astro-robots-txt`, `web-vitals` | Se conservan. |
| Font Awesome 6 por CDN | — | Bloquea render y pesa ~80 KB para pocos íconos. |

### 1.2 Estructura y tamaño
~28 000 líneas entre `src/components` (14 `.astro`), `src/scripts` (13 motores Three/canvas, utilidades, servicios) y `src/styles` (~40 CSS). La página monta 9 componentes; varios motores Three.js corren a la vez (hero, partículas conectadas, cursor, audio reactivo, criaturas SVG), cada uno con su propio renderer. Es la causa principal de mal rendimiento móvil y no se puede "ajustar": se reemplaza.

### 1.3 Se conserva / se elimina

**Nada se borra hasta su tarea en Fase 3 y en un commit propio llamado `chore: remove legacy …`.** Lo eliminado queda en el historial de git (y en el tag `legacy-v2` que se crea antes de borrar).

| Elemento | Decisión | Motivo |
|---|---|---|
| `astro.config.mjs` (site, base, sitemap, robots, compressor) | **Se conserva** y se amplía (i18n). | Funciona y el deploy depende de `base: '/page'`. |
| `.github/workflows` (deploy Pages) | **Se conserva**; se agrega job de Lighthouse CI (ver §7). | |
| `src/layouts/Layout.astro` | **Se reescribe** reutilizando meta SEO, OG, JSON-LD Person. | Hay que corregir `lang`, hreflang y textos. |
| `public/images/profile.jpeg`, `og-image.jpg` | **Se conserva** profile; **se regenera** OG (ES y EN, 1200×630). | El OG actual es la misma foto que el perfil. |
| `public/favicon.svg`, `manifest.json` | **Se conserva**, se actualizan colores al nuevo sistema. | |
| `public/sitemap.xml`, `public/robots.txt` | **Se elimina** (lo generan las integraciones). | Duplicados que pisan a los generados. |
| Contenido de `Experience.astro` (TCS, Intercorp, Baufest, SYSARP) | **Se migra** a `src/content/` como datos. Markup: se reescribe. | |
| Datos de skills de `TechProjects.astro` | **Se migran** a `src/content/`. | |
| `src/scripts/engines/*` (13 motores) | **Se elimina** todo. | Reemplazados por un único motor 3D. |
| `GitHubStats.astro`, `services/github-api.js`, `visitor-api.js` | **Se elimina**. | API sin auth → rate limit, cajas vacías en "0", JS extra. Si se quiere, datos de GitHub en *build time* (opcional, Fase 3+). |
| `ArtVisualizer`, `SvgCreatures`, `ScanlineOverlay`, `KonamiEasterEgg`, `public/svg*/` | **Se elimina**. | No encajan en una identidad empresarial. |
| Llamadas a Open-Meteo y Quotable | **Se elimina**. | Dependencias externas sin valor para el visitante. |
| `src/styles/**` (~40 CSS) | **Se elimina**; lo reemplaza el sistema de tokens del Diseñador. | |
| `Skills.astro`, `Projects.astro`, `About.astro` (no montados) | **Se elimina**. | Código muerto. |
| `server.js`, `clear-cache.html`, `tailwind.config.js`, `postcss.config.js` | **Se elimina**. | Astro sirve el sitio; Tailwind 4 no usa config JS. |
| `package-lock.json` | **Se elimina**; queda `bun.lock`. | El CI usa Bun. |
| **Cambios sin commitear en `main`** (6 archivos de motores/visualizer) | **No se tocan.** Antes de Fase 3 Carlos decide: commitear como legacy o descartar. | No son míos; los archivos se borran después igualmente. |

---

## 2. Stack propuesto

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Astro** (subir a 7.x al iniciar Fase 3; si alguna integración falla, quedarse en 5.18) | HTML estático por defecto, cero JS salvo islas, i18n nativo, ya desplegado en Pages. |
| UI interactiva | **Vanilla TS** en islas `<script>` de Astro. Sin React/Vue. | No paga runtime de framework; la única interacción pesada es el canvas. |
| 3D | **three@0.187** + `three/addons` (`GLTFLoader`, `DRACOLoader`, `KTX2Loader`, `MeshoptDecoder`, `RoomEnvironment`/HDR) | Fijo por el brief. |
| Animación | **GSAP 3.15 + ScrollTrigger** (gratuito, incluidos plugins, desde 2024) | Narrativa con scroll; `gsap.matchMedia()` para reduced-motion y breakpoints. |
| Scroll suave | **Ninguno** (scroll nativo). | Lenis y similares perjudican accesibilidad e INP en móvil. |
| Estilos | **Tailwind 4** con tokens en `@theme` (CSS variables) + CSS propio mínimo. | Ya instalado; tokens únicos para UI y para el 3D (los colores del 3D se leen de las mismas variables). |
| Tipografía | 2 familias variables **auto-hospedadas** (woff2, subset latin), `font-display: swap`, preload solo de la del título. | Elimina Google Fonts + Font Awesome por CDN. |
| Íconos | SVG inline (`astro-icon` o sprites propios). | |
| Pipeline de assets | **@gltf-transform/cli 4.5**: `dedup → prune → weld → simplify → resize → ktx2 (etc1s/uastc) → draco o meshopt`. Script `bun run assets` reproducible; los fuentes `.glb` sin optimizar en `assets-src/` (fuera de `public`). | Presupuesto < 2 MB verificable en CI. |
| Generación de modelos | Herramienta IA texto/imagen→3D (Meshy, Tripo o Rodin — lo elige Carlos según cuenta) → limpieza en **Blender** (retopología/decimate, materiales PBR simples, pivotes, escala 1 u = 1 m) → gltf-transform. | Decisión de Carlos (§0). |
| Calidad | ESLint 9 (flat) + Prettier, `astro check`, **Playwright** (smoke 375/768/1440 + enlaces), **Lighthouse CI**. | Fase 4 automatizada. |
| Métrica en dev | `stats.js` y `renderer.info` tras `?debug` (no se incluye en producción). Spector.js para inspeccionar draw calls. | |

---

## 3. Arquitectura

### 3.1 Estructura de carpetas

```
src/
  content/                 # datos tipados (Astro content collections), ES y EN
    profile.{es,en}.json
    experience.{es,en}.json
    products.{es,en}.json   # SkyMek, Parati, Ventixs
  i18n/ ui.{es,en}.ts       # textos de interfaz
  layouts/Base.astro        # <head>, SEO, hreflang, JSON-LD
  components/
    Header.astro  Footer.astro  LangSwitch.astro  SkipLink.astro
    sections/ Hero.astro About.astro Company.astro Products.astro Experience.astro Contact.astro
    ui/ Button.astro Card.astro Tag.astro ProductCard.astro TimelineItem.astro
    three/ StageCanvas.astro      # contenedor + fallback <picture>
  pages/ index.astro  en/index.astro  404.astro
  styles/ tokens.css  global.css
  three/                   # motor 3D (solo se carga como isla)
    Stage.ts               # renderer único, loop, resize, pausa, tier
    tier.ts                # detección de capacidad del dispositivo
    assets.ts              # loaders y caché, dispose
    scenes/ HeroScene.ts  CompanyScene.ts  ProductsScene.ts
    mascots/ Alfa.ts  Burbu.ts  GiftBox.ts
    scroll.ts              # puente GSAP ScrollTrigger ↔ escenas
assets-src/                # GLB/texturas originales (no se publican)
scripts/ optimize-assets.ts  capture-fallbacks.ts
public/models/ public/textures/ public/decoders/ public/fallback/
```

### 3.2 Escena 3D

- **Un solo `WebGLRenderer` y un solo `<canvas>` fijo** (`position: fixed`, detrás del contenido, `aria-hidden="true"`). Las secciones de contenido son HTML real encima. Varias escenas se muestran en el mismo canvas según la sección activa; así hay un único contexto WebGL (los móviles limitan contextos y cada uno cuesta memoria).
- **Escenas** (clase base con `load() / enter() / update(dt, progress) / leave() / dispose()`):
  1. `HeroScene` — Alfa como figura central, sobria, girando con la posición del puntero/giroscopio (desactivado con reduced-motion) y una composición geométrica abstracta (red/nodos = backend).
  2. `CompanyScene` — Alfa se "despliega" en tres nodos que dan paso a los productos (transición con scroll).
  3. `ProductsScene` — tres estaciones: herramienta/llave estilizada (SkyMek), caja de regalo (Parati), Burbu (Ventixs). Cada tarjeta HTML de producto activa su objeto.
  - Sobre mí, Experiencia y Contacto: **sin 3D propio**; el canvas muestra un fondo ambiental de muy bajo coste o se oculta (pausa total).
- **Cámara**: una `PerspectiveCamera` cuya posición/target se animan con GSAP por sección. FOV y encuadre distintos por breakpoint (objeto más chico y arriba en móvil, a un lado del texto en desktop).
- **Iluminación**: environment map pre-filtrado (`RoomEnvironment` con `PMREMGenerator`, o un HDR de 256 px en KTX2) + **máximo 1 luz direccional** sin sombras dinámicas. Sombra de contacto **horneada** en textura (plano con alpha). AO horneado en los modelos.
- **Materiales**: `MeshStandardMaterial` (no `Physical` salvo un acento en desktop alto). Paleta tomada de los tokens. Sin post-processing en móvil; en desktop alto, como mucho un bloom muy contenido (opcional, se descarta si cuesta > 2 ms).
- **Carga**:
  - Hero: geometría ligera + Alfa (presupuesto §5). Lo demás se carga **cuando la sección está a 1 viewport** (IntersectionObserver con `rootMargin`).
  - Decoders Draco/Basis copiados a `public/decoders/` (respetando `base: '/page'`) y cargados solo cuando hacen falta.
  - Todo `fetch` de modelos tras `requestIdleCallback` posterior al primer paint.
- **Memoria**: `dispose()` de geometrías, materiales, texturas y render targets al salir de una escena que no volverá pronto (las escenas a > 2 secciones de distancia se liberan; las vecinas se conservan para que el scroll de ida y vuelta no recargue). `renderer.info.memory` se verifica en `?debug` para confirmar que vuelve a la base.
- **Loop**: `renderer.setAnimationLoop` solo cuando el canvas es visible y la pestaña activa (`IntersectionObserver` + `visibilitychange`). Sin interacción ni scroll → render a demanda (no se re-renderiza un frame idéntico).
- **Pixel ratio**: `Math.min(devicePixelRatio, 2)` desktop, `1.5` móvil, `1` en tier bajo. **Resolución adaptativa**: si el promedio de frame time supera el objetivo durante 2 s, se baja el pixel ratio un escalón; si cae a tier bajo se cambia al fallback.

### 3.3 Niveles de dispositivo (`tier.ts`)

| Tier | Criterio | Experiencia |
|---|---|---|
| `none` | Sin WebGL2, `prefers-reduced-data`, `saveData`, o falla de contexto | Fallback estático (imagen `<picture>` AVIF/WebP). Nunca se descarga three.js. |
| `low` | `deviceMemory ≤ 2`, `hardwareConcurrency ≤ 4`, o FPS medido < 24 en los primeros 2 s | Fallback estático, o hero 3D sin interacción y sin escenas posteriores. |
| `mid` (móvil típico) | Resto de móviles/tablets | 3D simplificado: menos geometría, sin post, DPR ≤ 1.5, escenas Hero + Products. |
| `high` | Desktop con GPU decente | Experiencia completa, DPR ≤ 2. |

`prefers-reduced-motion: reduce` → la escena se muestra pero **sin animación ligada al scroll ni giro continuo**; transiciones por fundido; parallax del puntero desactivado.

### 3.4 Fallback estático
Script `scripts/capture-fallbacks.ts` (Playwright headless con WebGL por SwiftShader) renderiza cada escena en su encuadre final para 375, 768 y 1440 y exporta AVIF/WebP. Se ejecuta a mano tras cambiar modelos y el resultado se commitea en `public/fallback/`. El `<picture>` del fallback está en el HTML desde el inicio y el canvas se superpone con un fundido cuando el primer frame está listo — así no hay salto visual.

### 3.5 Rendimiento del hero (para Lighthouse ≥ 85 móvil)
- **LCP = el título del hero (texto)**, no el canvas. Fuente del título con preload; nada del 3D bloquea el render.
- three.js y la escena se importan **dinámicamente** después de `load` + `requestIdleCallback` (o con la primera interacción, lo que ocurra antes). Lighthouse móvil (CPU 4×) no debe ver la ejecución de three en el TBT del arranque.
- JS inicial sin 3D: < 30 KB gzip. Chunk 3D (three tree-shaken + escena): objetivo < 180 KB gzip.
- CSS crítico inline (Astro `inlineStylesheets: 'auto'`), sin CSS de terceros.
- Imágenes con `astro:assets` (AVIF/WebP, `width/height`, `loading="lazy"` fuera del primer viewport).

### 3.6 i18n y SEO
- `astro.config` → `i18n: { defaultLocale: 'es', locales: ['es','en'], routing: { prefixDefaultLocale: false } }`.
- `<html lang>` correcto, `hreflang` es/en/x-default, canonical por idioma, OG por idioma (`og:locale` es_PE / en_US).
- JSON-LD: `Person` (Carlos, alumniOf UPC, worksFor TCS, sameAs GitHub/LinkedIn) + `Organization` (TUSOCIO IA S.A.C.) con `owns`/`makesOffer` para los 3 productos.
- Todo el contenido existe como HTML semántico aunque no haya 3D (crawlers y lectores de pantalla no dependen del canvas).
- Sitemap con alternates i18n (`@astrojs/sitemap` lo soporta).

### 3.7 Accesibilidad
- Canvas `aria-hidden`, toda la información en HTML. Skip link, landmarks, un solo `h1`, orden de headings correcto.
- Contraste AA (≥ 4.5:1 texto, 3:1 UI) validado sobre el fondo real, incluido donde el texto pisa el 3D (se usa scrim/gradiente).
- Foco visible, navegación completa por teclado, objetivos táctiles ≥ 44×44 px.
- Animaciones: `gsap.matchMedia('(prefers-reduced-motion: reduce)')` + botón "Pausar animación" visible (WCAG 2.2.2).

---

## 4. Secciones y narrativa

Hilo: *"Construyo backends sólidos para bancos de día, y productos propios con mi empresa de noche."*

| # | Sección | Contenido | 3D |
|---|---|---|---|
| 1 | **Hero** | Carlos Orbegoso · Backend Developer (Java/Quarkus). Subtítulo: IT Analyst en TCS para BCP · Cofundador de TUSOCIO IA. CTAs: "Ver productos" y "Contacto". | Alfa + red de nodos. |
| 2 | **Sobre mí** | Foto, resumen breve, Ingeniería de Sistemas en la UPC (10.º ciclo), stack principal (Java 17+, Quarkus, Spring Boot, microservicios, PostgreSQL, Docker/K8s, AWS). | Ninguno (fondo ambiental). |
| 3 | **TUSOCIO IA** | La empresa: qué hace, rol de cofundador. Presenta a Alfa como marca madre. | Alfa se divide en tres. |
| 4 | **Productos** | 3 tarjetas con estado: **SkyMek** (dueño, en producción) — SaaS de gestión de talleres automotrices → skymek.app. **Parati** (en construcción) — invitaciones digitales y mesa de regalos con aportes por Yape, crear un evento es gratis → paratipe.com. **Ventixs** (en construcción) — bot de ventas por WhatsApp → ventixs.com. Enlaces externos con `rel="noopener"` y `target="_blank"` + aviso de nueva pestaña para lectores de pantalla. | Llave/herramienta, caja de regalo, Burbu. |
| 5 | **Experiencia** | Timeline: TCS — IT Analyst, cliente BCP (jun 2025–hoy) · Intercorp Retail — Full-stack Developer (abr 2024–jun 2025) · Baufest — Java Developer (mar 2022–feb 2024) · SYSARP — Frontend Web Developer (ene 2021–sep 2022). | Ninguno. |
| 6 | **Contacto** | Email `car_11.09@hotmail.com`, LinkedIn `carlos-orbergoso-loayza`, GitHub `carlosorbegoso`. Sin formulario (no hay backend; evita spam). Botón copiar email. | Opcional: Alfa pequeño de cierre (solo desktop alto). |

Header: logo/monograma, navegación por anclas, selector ES/EN. En móvil: barra superior compacta + menú en hoja inferior.

---

## 5. Presupuestos (criterios de aceptación globales)

| Métrica | Objetivo |
|---|---|
| Lighthouse móvil | Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 95 |
| LCP móvil (Slow 4G de Lighthouse) | ≤ 2.5 s · CLS ≤ 0.05 · TBT ≤ 200 ms |
| FPS | 60 estables desktop · ≥ 30 en móvil de gama media (referencia: Moto G-class / Galaxy A5x, o Chrome DevTools CPU 4× + perfil real si hay equipo) |
| Draw calls | < 100 en cualquier escena (objetivo real < 50) — `renderer.info.render.calls` |
| Modelos del hero | < 2 MB en total (GLB + texturas), Alfa ≤ 800 KB |
| Todos los modelos | ≤ 4 MB en total; cada mascota ≤ 25 k triángulos (móvil ≤ 10 k vía LOD) |
| Texturas | KTX2, ≤ 1024 px (512 en móvil), atlas por modelo |
| JS | Inicial < 30 KB gzip · chunk 3D < 180 KB gzip |
| Memoria GPU | `renderer.info.memory` vuelve a la base tras salir de una escena liberada |

---

## 6. Equipo y tareas

Orden: **Diseñador → (3D ∥ UI Desktop ∥ UI Mobile ∥ Copy) → Arquitecto integra → QA**. Los especialistas pueden editar en paralelo, pero solo **un** `astro dev` / build / Lighthouse a la vez en la máquina, y todo servidor se detiene al terminar (regla de recursos).

### 6.1 Arquitecto (integración)
- **Tareas**: crear tag `legacy-v2`; subir Astro/three/eslint; esqueleto de carpetas, i18n, content collections, Layout con SEO; eliminar legado en commits `chore: remove legacy …`; integrar el trabajo de cada especialista; revisar coherencia.
- **Entregables**: proyecto que compila (`astro check` + `astro build` sin errores) con páginas ES/EN vacías pero navegables.
- **Aceptación**: build verde, rutas `/page/` y `/page/en/` funcionan en `astro preview`, tamaño JS inicial medido.

### 6.2 Diseñador gráfico / identidad visual (va primero)
- **Tareas**: dirección visual "empresarial-tecnológica" (no caricaturesca); paleta con modo oscuro como principal y claro opcional; 2 tipografías; escala tipográfica fluida (`clamp`); espaciado, radios, sombras, motion tokens (duraciones/easings); dirección de arte de mascotas (sobrias, materiales mate/metálicos, sin ojos tipo cartoon) y **prompts + imágenes de referencia** para la herramienta IA; monograma/favicon; plantilla OG.
- **Entregables**: `src/styles/tokens.css` (`@theme`), `docs/design/identity.md` (paleta con contrastes, tipografías, uso), `docs/design/mascots.md` (brief y prompts), OG ES/EN.
- **Aceptación**: todos los pares texto/fondo ≥ 4.5:1; tokens usados por UI y 3D; ningún color "suelto" en componentes.

### 6.3 Experto 3D (Three.js)
- **Tareas**: generar mascotas con IA (con prompts del Diseñador) y limpiarlas en Blender; pipeline `bun run assets` con gltf-transform; `Stage`, `tier`, escenas, mascotas, puente ScrollTrigger; environment map y sombras horneadas; carga diferida; `dispose`; pausa; resolución adaptativa; script de fallbacks; modo `?debug` con stats.js.
- **Entregables**: `src/three/**`, `public/models|textures|decoders|fallback`, `scripts/optimize-assets.ts`, `scripts/capture-fallbacks.ts`, `docs/3d/assets.md` (tabla de cada modelo: tris, KB, texturas, origen/licencia de la herramienta IA).
- **Aceptación**: presupuestos de §5 (draw calls, MB, tris) medidos y anotados; sin WebGL → fallback sin errores en consola; reduced-motion respetado; memoria vuelve a la base; loop detenido con la pestaña oculta (verificable en Performance panel).

### 6.4 UI Desktop (≥ 1024 px)
- **Tareas**: layout de las 6 secciones con el 3D a un lado del texto; header fijo con indicador de sección; microinteracciones (hover/focus de tarjetas, botones, copiar email); transiciones de sección con GSAP coordinadas con el 3D; estado de foco de teclado.
- **Entregables**: componentes `sections/*` y `ui/*` (estilos desktop).
- **Aceptación**: 1440 px y 1024 px sin desbordes; 60 fps durante el scroll; todo operable con teclado.

### 6.5 UI Mobile (< 768 px, mobile-first real)
- **Tareas**: diseño pensado primero para 375 px: hero con texto arriba y objeto 3D reducido (o fallback), tarjetas de producto en carrusel con scroll-snap o pila, timeline vertical compacto, menú en hoja inferior, CTAs al alcance del pulgar; tablet 768 px.
- **Entregables**: estilos base de todos los componentes (las media queries amplían hacia desktop, no al revés).
- **Aceptación**: 375 y 768 sin scroll horizontal; objetivos táctiles ≥ 44 px; ≥ 30 fps en gama media; Lighthouse móvil ≥ 85/90.

### 6.6 Copywriting ES/EN (extra — justificado por el sitio bilingüe)
- **Tareas**: textos de todas las secciones en español (es-PE) y su versión en inglés; microcopy; descripciones SEO (≤ 155 caracteres) por idioma; textos alternativos.
- **Entregables**: `src/content/*.{es,en}.json`, `src/i18n/ui.{es,en}.ts`.
- **Aceptación**: misma estructura en ambos idiomas; sin textos hardcodeados en componentes; Carlos aprueba el copy.

### 6.7 Performance & QA (extra — el brief exige métricas medibles)
- **Tareas**: Lighthouse CI en el workflow (solo en PR ready, no en cada push); Playwright: smoke en 375/768/1440, comprobación de enlaces (skymek.app, paratipe.com, ventixs.com, LinkedIn, GitHub, mailto), test sin WebGL y con reduced-motion; medición de FPS y draw calls; check de tamaño de assets.
- **Entregables**: `lighthouserc.json`, `tests/*.spec.ts`, `docs/QA.md` con resultados y capturas.
- **Aceptación**: todos los números de §5 cumplidos y documentados.

### 6.8 Accesibilidad y SEO
Lo cubren el Arquitecto (SEO técnico, §3.6) y QA (auditoría con axe en Playwright, §3.7). No se crea un rol separado para no fragmentar.

---

## 7. Fases, commits y CI

1. **Fase 3.0 — Preparación** (Arquitecto): tag, upgrades, esqueleto, i18n. `chore:`/`build:` commits.
2. **Fase 3.1 — Identidad** (Diseñador). `feat(design): tokens …`
3. **Fase 3.2 — Contenido** (Copy) ∥ **Assets IA** (3D).
4. **Fase 3.3 — UI Mobile → UI Desktop** ∥ **Escenas 3D**.
5. **Fase 3.4 — Integración y borrado de legado** (Arquitecto).
6. **Fase 4 — QA**.

Commits pequeños por especialista. Todo en `develop`; un único PR `develop → main` en draft hasta terminar Fase 4; se marca *ready* solo al final. El deploy a Pages solo ocurre al hacer merge en `main` (lo hace Carlos).

---

## 8. Riesgos

| Riesgo | Mitigación |
|---|---|
| Modelos IA con topología sucia, demasiados polígonos o texturas enormes | Limpieza obligatoria en Blender + `simplify`; presupuesto por modelo; si un modelo no cumple, versión procedural de respaldo. |
| Mascotas IA con aspecto caricaturesco | Prompts y referencias del Diseñador; revisión de Carlos antes de optimizar. |
| Licencia de la herramienta IA | Usar plan que permita uso comercial; anotar en `docs/3d/assets.md`. |
| Lighthouse móvil penaliza three.js | Carga diferida post-LCP (§3.5); tier `none/low` no descarga three. |
| Base path `/page` rompe rutas de decoders/modelos | Todas las rutas vía `import.meta.env.BASE_URL`; test de Playwright sobre `astro preview`. |
| Pérdida de contexto WebGL en móvil | Escuchar `webglcontextlost` → fallback estático. |

---

## 9. Preguntas abiertas para Carlos

1. ¿Qué herramienta IA de 3D usarás (Meshy, Tripo, Rodin u otra) y quién la opera (tú con tu cuenta, o el especialista guiado por ti)?
2. ¿Hay logos oficiales de TUSOCIO IA, SkyMek, Parati y Ventixs (SVG) y alguna paleta de marca que deba respetarse?
3. Los 6 archivos modificados sin commitear en `main` (motores y visualizer): ¿se commitean como legado o se descartan?
4. ¿Mantener GitHub Pages en `carlosorbegoso.github.io/page` o pasar a dominio propio?
5. ¿Agregar datos de GitHub (repos destacados) generados en build, o se omite del todo?

---

## Cambios tras revisión

_Pendiente (Fase 2)._
