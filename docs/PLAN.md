# Rediseño del portafolio — landing/portafolio 3D con Three.js

Estado: **versión final tras revisión (Fase 2)**. Pendiente de aprobación de Carlos antes de implementar.
Fecha: 2026-10-31 · Rama: `develop` · PR único `develop → main` (draft).

---

## 0. Decisiones confirmadas por Carlos

| Tema | Decisión |
|---|---|
| Idioma | **Bilingüe**: español por defecto en `/page/`, inglés en `/page/en/`. |
| Modelos 3D | **Generados con IA** (texto/imagen → 3D), luego limpiados y optimizados. |
| Puesto actual | **Backend Developer en TCS · cliente BCP** (según el CV; se nombra a BCP). |
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
| Runtime | Bun (CI usa `bun-version: latest` y `bun install` sin `--frozen-lockfile`) | `package-lock.json` existe en disco pero está en `.gitignore`. |
| Otros | `astro-compressor`, `@astrojs/sitemap`, `astro-robots-txt`, `web-vitals` | Se conserva solo `@astrojs/sitemap` (ver §1.3). |
| Font Awesome 6 por CDN | — | Bloquea render y pesa ~80 KB para pocos íconos. |

### 1.2 Estructura y tamaño
~28 000 líneas entre `src/components` (14 `.astro`), `src/scripts` (13 motores Three/canvas, utilidades, servicios) y `src/styles` (~40 CSS). La página monta 9 componentes; varios motores Three.js corren a la vez (hero, partículas conectadas, cursor, audio reactivo, criaturas SVG), cada uno con su propio renderer. Es la causa principal de mal rendimiento móvil y no se puede "ajustar": se reemplaza.

### 1.3 Se conserva / se elimina

**Nada se borra hasta su tarea en Fase 3 y en un commit propio llamado `chore: remove legacy …`.** Lo eliminado queda en el historial de git (y en el tag `legacy-v2` que se crea antes de borrar).

| Elemento | Decisión | Motivo |
|---|---|---|
| `astro.config.mjs` | **Se rehace** en el esqueleto nuevo conservando `site`, `base: '/page'` y sitemap; se agrega i18n y `trailingSlash: 'always'`; se quitan `prefetch` y `manualChunks`. | El deploy depende de `base: '/page'`. |
| `astro-compressor` | **Se elimina**. | GitHub Pages no sirve `.br/.gz` precomprimidos; hoy triplica `dist/_astro`. |
| `astro-robots-txt` | **Se elimina**; se reemplaza por `public/robots.txt` estático de 3 líneas (`User-agent: *`, `Allow: /`, `Sitemap: …/page/sitemap-index.xml`). | El generado lleva `Disallow: /_astro/` y `Crawl-delay: 10` (frena a Bing). |
| `web-vitals` | **Se elimina** (solo hacía `console.log`); medición en `?debug`. | |
| `.github/workflows` (deploy Pages) | **Se conserva**; se pinea `bun-version` y `bun install --frozen-lockfile`; se agregan Lighthouse CI y chequeo de enlaces (ver §6.7). | |
| `src/layouts/Layout.astro` | **Se reescribe** reutilizando meta SEO, OG, JSON-LD Person. | Hay que corregir `lang`, hreflang y textos. |
| `public/images/profile.jpeg`, `og-image.jpg` | **Se conserva** profile; **se regenera** OG (ES y EN, 1200×630). | El OG actual es la misma foto que el perfil. |
| `public/favicon.svg`, `manifest.json` | **Se conserva**, se actualizan colores al nuevo sistema. | |
| `public/sitemap.xml` | **Se elimina** (lo genera `@astrojs/sitemap`). | Duplicado. `public/robots.txt` se reescribe (ver arriba). |
| `public/cv/` (vacío) y botón "Download CV" del Hero | Enlace roto hoy. **Se decide en §9** si hay CV descargable. | |
| Contenido de `Experience.astro` (TCS, Intercorp, Baufest, SYSARP) | **Se migra** a `src/content/` como datos. Markup: se reescribe. | |
| Datos de skills de `TechProjects.astro` | **Se migran** a `src/content/`. | |
| `src/scripts/engines/*` (13 motores) | **Se elimina** todo. | Reemplazados por un único motor 3D. |
| `GitHubStats.astro`, `services/github-api.js`, `visitor-api.js` | **Se elimina**. | API sin auth → rate limit, cajas vacías en "0", JS extra. Si se quiere, datos de GitHub en *build time* (opcional, Fase 3+). |
| `ArtVisualizer`, `SvgCreatures`, `ScanlineOverlay`, `KonamiEasterEgg`, `public/svg*/` | **Se elimina**. | No encajan en una identidad empresarial. |
| Llamadas a Open-Meteo y Quotable | **Se elimina**. | Dependencias externas sin valor para el visitante. |
| `src/styles/**` (~40 CSS) | **Se elimina**; lo reemplaza el sistema de tokens del Diseñador. | |
| `Skills.astro`, `Projects.astro`, `About.astro` (no montados) | **Se elimina**. | Código muerto. |
| `server.js`, `clear-cache.html`, `tailwind.config.js`, `postcss.config.js` | **Se elimina**. | Astro sirve el sitio; Tailwind 4 no usa config JS. |
| `package-lock.json` | **Se borra del disco** (`rm`, no está trackeado); queda `bun.lock`. | El CI usa Bun. |
| **Cambios sin commitear** (8 archivos: `package.json`, `bun.lock` con bumps de tailwind/vite/prettier, y 6 de motores/visualizer) | **No se tocan.** Antes de Fase 3 Carlos decide: commitear como legacy o descartar. | No los hice yo; los motores se borran después igualmente. |

---

## 2. Stack propuesto

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Astro 7.4.4**: esqueleto nuevo con `bun create astro@latest` en Fase 3.0 (no hay migración: todo se reescribe). Versiones exactas pineadas (`three 0.187.0`, `gsap 3.15.0`, `@gltf-transform/cli 4.5.1`). | HTML estático por defecto, cero JS salvo islas, i18n nativo, ya desplegado en Pages. |
| UI interactiva | **Vanilla TS** en islas `<script>` de Astro. Sin React/Vue. | No paga runtime de framework; la única interacción pesada es el canvas. |
| 3D | **three@0.187** + `three/addons` (`GLTFLoader`, `DRACOLoader`, `KTX2Loader`, `MeshoptDecoder`, `RoomEnvironment`/HDR) | Fijo por el brief. |
| Animación | **GSAP 3.15 + ScrollTrigger** (gratuito con todos los plugins desde 3.13, abril 2025). **Vive solo en el chunk 3D.** La UI (hover, menú, copiar email, reveals) usa CSS transitions, `animation-timeline: view()` con `@supports` e IntersectionObserver vanilla. | Narrativa con scroll; `gsap.matchMedia()` para reduced-motion y breakpoints. Así GSAP no entra al JS inicial. |
| Scroll suave | **Ninguno** (scroll nativo). | Lenis y similares perjudican accesibilidad e INP en móvil. |
| Estilos | **Tailwind 4** con tokens en `@theme` (CSS variables) + CSS propio mínimo. | Ya instalado; tokens únicos para UI y para el 3D (los colores del 3D se leen de las mismas variables). |
| Tipografía | 2 familias variables **auto-hospedadas** (woff2, subset latin), `font-display: swap`, preload solo de la del título. | Elimina Google Fonts + Font Awesome por CDN. |
| Íconos | SVG inline (`astro-icon` o sprites propios). | |
| Pipeline de assets | **@gltf-transform/cli 4.5.1**, script `bun run assets` reproducible: `optimize --compress meshopt --texture-compress ktx2 --texture-size 1024`, `etc1s` para albedo y `uastc` para `normalTexture`/`metallicRoughnessTexture`, texturas potencia de 2. **Meshopt por defecto** (decoder ~30 KB, sin wasm aparte); Draco solo si el GLB sale > 20 % mayor. Genera **variantes por tier** (`*.high.glb`, `*.mid.glb` vía `simplify --ratio --error`) y **nombres con hash** (Pages cachea solo 10 min). Fuentes sin optimizar en `assets-src/`. | Presupuesto verificable en CI. |
| Generación de modelos | Herramienta IA texto/imagen→3D (Meshy, Tripo o Rodin — lo elige Carlos según cuenta) → limpieza en **Blender** (retopología/decimate, materiales PBR simples, pivotes, escala 1 u = 1 m) → gltf-transform. | Decisión de Carlos (§0). |
| Calidad | ESLint 9 (flat) + Prettier, `astro check`, **Playwright** + axe (smoke 375/768/1440 + enlaces), **Lighthouse CI**, `sharp` (fallbacks AVIF/WebP). | Fase 4 automatizada. |
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

- **Un solo `WebGLRenderer` y un solo `<canvas>` fijo** (`position: fixed; height: 100lvh`, detrás del contenido, `aria-hidden="true"`). Opciones: `alpha: false` (pinta el color de fondo de los tokens), `antialias` solo en `high`, `stencil: false`, `powerPreference: 'high-performance'`; `toneMapping = ACESFilmicToneMapping`, `outputColorSpace = SRGBColorSpace`, intensidades en unidades físicas (r155+). El fundido sobre el fallback es `opacity` CSS del canvas.
- **iOS / barra de direcciones**: `ScrollTrigger.config({ ignoreMobileResize: true })`; el renderer solo se redimensiona si cambia el ancho o la altura > 150 px (orientación); **sin `pin`** en móvil (el canvas fijo ya hace de pin); `scrub: 0.5–1`, nunca `true`; **no** usar `ScrollTrigger.normalizeScroll()`. Las secciones de contenido son HTML real encima. Varias escenas se muestran en el mismo canvas según la sección activa; así hay un único contexto WebGL (los móviles limitan contextos y cada uno cuesta memoria).
- **Escenas** (clase base con `load() / enter() / update(dt, progress) / leave() / dispose()`):
  1. `HeroScene` — Alfa como figura central, sobria, con parallax del puntero **solo con `pointer: fine`** (sin giroscopio: iOS pediría permiso) y una composición geométrica abstracta (red/nodos = backend).
  2. `VenturesScene` (fusiona Company + Products en una escena con `progress` 0→1) — Alfa se "despliega" en tres nodos que se convierten en herramienta/llave estilizada (SkyMek), caja de regalo (Parati) y Burbu (Ventixs). Cada tarjeta HTML de producto enfoca su objeto. Una sola escena evita tener dos vivas durante la transición.
  - Sobre mí, Experiencia y Contacto: **sin 3D**; el canvas pasa a `display: none` (sale de la capa del compositor) y el loop se detiene.
- **Movimiento en reposo**: `high` gira lento a 60 fps; `mid` limitado a 30 fps (frames alternos); `low` y reduced-motion renderizan a demanda sin giro.
- **Cámara**: una `PerspectiveCamera` cuya posición/target se animan con GSAP por sección. FOV y encuadre distintos por breakpoint (objeto más chico y arriba en móvil, a un lado del texto en desktop).
- **Iluminación**: `high` usa `RoomEnvironment` + `PMREMGenerator` (`pmrem.dispose()` tras generar); `mid` usa un env map pre-filtrado de 64–128 px en KTX2 o 2 luces simples. **Máximo 1 luz direccional** sin sombras dinámicas. Sombra de contacto **horneada** en textura (plano con alpha). AO horneado en los modelos.
- **Materiales**: `MeshStandardMaterial` (no `Physical` salvo un acento en desktop alto). Paleta tomada de los tokens. Sin post-processing en móvil; en desktop alto, como mucho un bloom muy contenido (opcional, se descarta si cuesta > 2 ms).
- **Carga**:
  - Hero: geometría ligera + Alfa (presupuesto §5). Lo demás se carga **cuando la sección está a 1 viewport** (IntersectionObserver con `rootMargin`).
  - Meshopt desde `three/addons` (sin archivos extra). Transcoder Basis (~560 KB) en `public/decoders/basis/` con `setTranscoderPath(import.meta.env.BASE_URL + 'decoders/basis/')` y `KTX2Loader.detectSupport(renderer)`; se pide solo con la primera textura KTX2.
  - La variante del modelo (`high`/`mid`) se elige **antes del fetch** según el tier (no se usa `THREE.LOD`, que descarga todos los niveles).
  - Cuando una sección está a 1 viewport, `Stage` hace en idle `renderer.compileAsync()` + `initTexture()` antes de `enter()` para que el primer frame no tenga tirón.
  - `requestIdleCallback` con polyfill `setTimeout` (no existe en Safari).
- **Memoria**: `assets.ts` mantiene una caché por URL con **refcount** (Alfa la usan Hero y Ventures). Cada escena solo hace `dispose()` de lo suyo (render targets, geometría procedural); un asset compartido se libera cuando su refcount llega a 0 y tras unos segundos de gracia. Las escenas a > 2 secciones de distancia se liberan; las vecinas se conservan. `renderer.info.memory` se verifica en `?debug` para confirmar que vuelve a la base.
- **Loop**: `renderer.setAnimationLoop` solo cuando el canvas es visible y la pestaña activa (`IntersectionObserver` + `visibilitychange`). Sin interacción ni scroll → render a demanda (no se re-renderiza un frame idéntico).
- **Pixel ratio**: `high` `Math.min(devicePixelRatio, 2)`; `mid` **arranca en 1.0** y sube a 1.25 → 1.5 (tope) solo si el p75 del frame time es < 60 % del intervalo durante 3 s; `low` 1.0. **Resolución adaptativa** en ambos sentidos: si p75 > 1.5× el intervalo, baja un escalón; si ya está en el mínimo, pasa al fallback. En móvil el cuello de botella es el fill rate, no los triángulos.

### 3.3 Niveles de dispositivo (`tier.ts`)

| Tier | Criterio | Experiencia |
|---|---|---|
| `none` | Sin WebGL2, renderer de software (`WEBGL_debug_renderer_info` contiene SwiftShader/llvmpipe/Software), `saveData`, `forced-colors: active`, o `webglcontextlost` | Fallback estático (`<picture>` AVIF/WebP). Nunca se descarga three.js. |
| `mid` | `pointer: coarse` o ancho < 1024 px | 3D simplificado: variante `mid` de modelos, sin post, DPR 1.0 → 1.5, Hero + Ventures. |
| `high` | Resto | Experiencia completa, DPR ≤ 2. |
| `low` | **Degradación posterior** (three ya descargado): el p75 medido no cumple ni con DPR 1.0 | Se detiene el loop y se muestra el fallback. |

No se usan `deviceMemory` ni `hardwareConcurrency` (solo Chromium y mal calibrados: un Galaxy A5x tiene 8 núcleos). **Medición de FPS**: (1) calibrar 500 ms el intervalo de rAF vacío (detecta 30/60/120 Hz y el modo de bajo consumo de iOS), (2) medir después de `compileAsync` + `initTexture`, (3) p75 del frame time durante 1 s descartando los 10 primeros frames, relativo al intervalo calibrado.

`prefers-reduced-motion: reduce` → la escena se muestra pero **sin `scrub` ni giro continuo** (solo `toggleActions` con fundidos); parallax del puntero desactivado.

### 3.4 Fallback estático
Script `scripts/capture-fallbacks.ts` (Playwright, `--headless=new` con la GPU real del Mac; SwiftShader solo de reserva con `--enable-unsafe-swiftshader`, que Chrome ≥ 131 exige). `Stage` tiene un modo `?capture=<escena>&progress=1&w=375` que dibuja un frame determinista (sin animación ni parallax, `preserveDrawingBuffer`, fondo igual al CSS) y expone `window.__captureReady`. Se captura a 375, 768 y 1440 con DPR 2; `sharp` convierte a AVIF (q≈50) y WebP. Se ejecuta a mano tras cambiar modelos y se commitea en `public/fallback/` (≤ 600 KB en total). El `<picture>` está en el HTML desde el inicio y el canvas se superpone con un fundido cuando el primer frame está listo.

### 3.5 Rendimiento del hero (para Lighthouse ≥ 85 móvil)
- **El LCP será la imagen de fallback del hero** (es el elemento pintado más grande), así que se presupuesta como tal: AVIF ≤ 60 KB a 375 px y ≤ 150 KB a 1440, `<link rel="preload" as="image" imagesrcset imagesizes>`, `fetchpriority="high"`, `decoding="async"`, nunca `loading="lazy"`. Fuente del título con preload.
- **Diferir tras `load` no basta**: Lighthouse sigue trazando hasta que la CPU queda quieta, así que la descarga, el parseo de three, los shaders y el GLB cuentan para TBT. **Spike obligatorio en Fase 3.0** (antes del trabajo en paralelo) que mide con Lighthouse móvil sobre `astro preview /page/`: (a) 3D diferido tras `load`, (b) 3D gateado por la primera interacción/scroll con timeout de 3–4 s. Se adopta la opción que cumpla TBT ≤ 200 ms y Performance ≥ 85. Sus resultados fijan los números finales de §5.
- En cualquier caso el arranque 3D se trocea en tareas < 50 ms (`scheduler.yield()` con fallback `setTimeout(0)`) entre import → renderer → `compileAsync` → parseo del GLB.
- JS inicial sin 3D: < 30 KB gzip. Chunk 3D (three + loaders + GSAP/ScrollTrigger + escenas): ≤ 260 KB gzip (se confirma en el spike).
- CSS inline (`inlineStylesheets: 'always'`: con tokens + Tailwind el CSS supera los 4 KB del modo `auto`), sin CSS de terceros.
- Imágenes con `astro:assets` (AVIF/WebP, `width/height`, `loading="lazy"` fuera del primer viewport).

### 3.6 i18n y SEO
- `astro.config` → `i18n: { defaultLocale: 'es', locales: ['es','en'], routing: { prefixDefaultLocale: false } }`, `trailingSlash: 'always'`.
- **Sin redirección automática** por idioma (en estático solo sería en cliente y perjudica SEO). Como mucho, un aviso descartable.
- **Ids de sección iguales en ambos idiomas** (`#products`, `#experience`…), con el texto visible traducido; `LangSwitch` conserva `location.hash`.
- URLs siempre con `getRelativeLocaleUrl()` / `import.meta.env.BASE_URL`; canonical, hreflang y `og:url` con `new URL(Astro.url.pathname, Astro.site)` (hoy el canonical sale `…/page` y el sitemap `…/page/`).
- `<html lang>` correcto, `hreflang` es/en y `x-default` → `/page/`. OG por idioma (`og:locale` es_PE / en_US) en **JPEG/PNG** (LinkedIn y WhatsApp no leen AVIF) con URL absoluta; `twitter:creator` solo si la cuenta existe.
- `404.astro` bilingüe simple (Pages sirve `/page/404.html`).
- JSON-LD: `Person` (Carlos, alumniOf UPC, worksFor TCS, sameAs GitHub/LinkedIn) + `Organization` (TUSOCIO IA S.A.C.) con `owns`/`makesOffer` para los 3 productos.
- Todo el contenido existe como HTML semántico aunque no haya 3D (crawlers y lectores de pantalla no dependen del canvas).
- Sitemap con alternates: `@astrojs/sitemap` con `i18n: { defaultLocale: 'es', locales: { es: 'es-PE', en: 'en-US' } }`.

### 3.7 Accesibilidad
- Canvas `aria-hidden`, toda la información en HTML. Skip link, landmarks, un solo `h1`, orden de headings correcto.
- Contraste AA (≥ 4.5:1 texto, 3:1 UI). **El texto nunca pisa el 3D sin un panel/scrim sólido** (≥ 60 % de opacidad) y el contraste se valida contra el color del scrim (no se puede validar sobre un render en movimiento).
- Fuentes: `@font-face` de fallback con `size-adjust` / `ascent-override` / `descent-override` para que el `swap` no genere CLS.
- `forced-colors: active` → se oculta el canvas y se muestra el fallback.
- Foco visible, navegación completa por teclado, objetivos táctiles ≥ 44×44 px.
- Animaciones: `gsap.matchMedia('(prefers-reduced-motion: reduce)')` + botón "Pausar animación" visible (WCAG 2.2.2) que detiene el movimiento automático en reposo (no el ligado al scroll).

---

## 4. Secciones y narrativa

Hilo: *"Construyo backends sólidos para bancos de día, y productos propios con mi empresa de noche."*

| # | Sección | Contenido | 3D |
|---|---|---|---|
| 1 | **Hero** | Carlos Orbegoso · Backend Developer (Java/Quarkus). Subtítulo: Backend Developer en TCS para BCP · Cofundador de TUSOCIO IA. CTAs: "Ver productos" y "Contacto". | Alfa + red de nodos. |
| 2 | **Sobre mí** | Foto, resumen breve, Ingeniería de Sistemas en la UPC (10.º ciclo), stack principal (Java 17+, Quarkus, Spring Boot, microservicios, PostgreSQL, Docker/K8s, AWS). | Ninguno (fondo ambiental). |
| 3 | **TUSOCIO IA** | La empresa: qué hace, rol de cofundador. Presenta a Alfa como marca madre. | Alfa se divide en tres. |
| 4 | **Productos** | 3 tarjetas con estado: **SkyMek** (dueño, en producción) — SaaS de gestión de talleres automotrices → skymek.app. **Parati** (en construcción) — invitaciones digitales y mesa de regalos con aportes por Yape, crear un evento es gratis → paratipe.com. **Ventixs** (en construcción) — bot de ventas por WhatsApp → ventixs.com. Enlaces externos con `rel="noopener"` y `target="_blank"` + aviso de nueva pestaña para lectores de pantalla. | Llave/herramienta, caja de regalo, Burbu. |
| 5 | **Experiencia** | Timeline (fuente: CV en `public/cv/Carlos-Orbegoso-CV.pdf`): TCS — Backend Developer, cliente BCP (jun 2025–hoy) · Intercorp Retail — Backend Developer (abr 2024–jun 2025) · Baufest — Backend Developer (mar 2022–feb 2024) · SYSARP — Frontend Developer (ene 2020–dic 2021). | Ninguno. |
| 6 | **Contacto** | Email `car_11.09@hotmail.com`, LinkedIn `carlos-orbergoso-loayza`, GitHub `carlosorbegoso`, X `@carlosorbegoso`, Descargar CV. Sin formulario (no hay backend; evita spam). Botón copiar email. | Opcional: Alfa pequeño de cierre (solo desktop alto). |

"Descargar CV" en Hero y Contacto con el PDF que entrega Carlos (§9).

Header: logo/monograma, navegación por anclas, selector ES/EN. En móvil: barra superior compacta + menú en hoja inferior.

---

## 5. Presupuestos (criterios de aceptación globales)

| Métrica | Objetivo |
|---|---|
| Lighthouse móvil | Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 95 |
| LCP móvil (Slow 4G de Lighthouse) | ≤ 2.5 s · CLS ≤ 0.05 · TBT ≤ 200 ms |
| FPS | 60 estables desktop · ≥ 30 en móvil de gama media (referencia: Moto G-class / Galaxy A5x, o Chrome DevTools CPU 4× + perfil real si hay equipo) |
| FPS (cómo se mide) | En dispositivo real: un Android de gama media (prestado, o Samsung Remote Test Lab con Galaxy A, gratuito) y un iPhone real. CPU 4× de DevTools no limita la GPU y no cuenta como prueba. |
| Draw calls | < 100 en cualquier escena (objetivo real < 50) — `renderer.info.render.calls` |
| Modelos del hero | < 2 MB en total (GLB + texturas), Alfa ≤ 800 KB |
| Variantes por mascota | `*.high.glb` ≤ 25 k tris / texturas 1024 px · `*.mid.glb` ≤ 8 k tris / 512 px |
| Todos los modelos | ≤ 4 MB en total (variante `high`) |
| Texturas | KTX2, potencia de 2, 1 material y atlas por mascota |
| Decoders | Meshopt ≤ 40 KB · transcoder KTX2 ≤ 560 KB raw (lazy, solo con la primera textura) |
| Total móvil hasta ver el 3D (`mid`) | ≤ 1.2 MB transferidos (three + decoders + Alfa `mid`) |
| Fallback del hero (LCP) | AVIF ≤ 60 KB a 375 px · ≤ 150 KB a 1440 px · `public/fallback/` ≤ 600 KB total |
| JS | Inicial < 30 KB gzip · chunk 3D ≤ 260 KB gzip (lo confirma el spike de §3.5) |
| Unidades | Todo presupuesto se mide en **gzip** (Pages no sirve brotli). |
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
- **Tareas**: generar mascotas con IA (con prompts del Diseñador) y limpiarlas en Blender pasando un **checklist de intake por modelo** (tris dentro del presupuesto, 1 material, UV sin solapes, escala 1 u = 1 m y pivote en la base, AO horneado, licencia comercial anotada). Hay una **fecha de corte**: el modelo que no la cumpla pasa a la versión procedural de §8; pipeline `bun run assets` con gltf-transform; `Stage`, `tier`, escenas, mascotas, puente ScrollTrigger; environment map y sombras horneadas; carga diferida; `dispose`; pausa; resolución adaptativa; script de fallbacks; modo `?debug` con stats.js.
- **Entregables**: modo `?debug` que guarda p75 de frame time, DPR efectivo y `renderer.info` en `localStorage` para copiarlos a `docs/QA.md`; `src/three/**`, `public/models|textures|decoders|fallback`, `scripts/optimize-assets.ts`, `scripts/capture-fallbacks.ts`, `docs/3d/assets.md` (tabla de cada modelo: tris, KB, texturas, origen/licencia de la herramienta IA).
- **Aceptación**: presupuestos de §5 (draw calls, MB, tris) medidos y anotados; sin WebGL → fallback sin errores en consola; reduced-motion respetado; memoria vuelve a la base; loop detenido con la pestaña oculta (verificable en Performance panel).

### 6.4 UI Desktop (≥ 1024 px)
- **Tareas**: layout de las 6 secciones con el 3D a un lado del texto; header fijo con indicador de sección; microinteracciones (hover/focus de tarjetas, botones, copiar email); transiciones de sección con CSS / `animation-timeline` (GSAP solo dentro del chunk 3D, §2); estado de foco de teclado.
- **Entregables**: componentes `sections/*` y `ui/*` (estilos desktop).
- **Aceptación**: 1440 px y 1024 px sin desbordes; 60 fps durante el scroll; todo operable con teclado.

### 6.5 UI Mobile (< 768 px, mobile-first real)
- **Tareas**: diseño pensado primero para 375 px: hero con texto arriba y objeto 3D reducido (o fallback), tarjetas de producto en carrusel con scroll-snap o pila, timeline vertical compacto, menú en hoja inferior, CTAs al alcance del pulgar; tablet 768 px.
- **Entregables**: estilos base de todos los componentes (las media queries amplían hacia desktop, no al revés).
- **Aceptación**: prueba en iOS Safari real con la barra de direcciones colapsando (sin saltos del canvas ni CLS); 375 y 768 sin scroll horizontal; objetivos táctiles ≥ 44 px; ≥ 30 fps en gama media; Lighthouse móvil ≥ 85/90.

### 6.6 Copywriting ES/EN (extra — justificado por el sitio bilingüe)
- **Tareas**: textos de todas las secciones en español (es-PE) y su versión en inglés; microcopy; descripciones SEO (≤ 155 caracteres) por idioma; textos alternativos.
- **Entregables**: `src/content/*.{es,en}.json`, `src/i18n/ui.{es,en}.ts`.
- **Aceptación**: misma estructura en ambos idiomas; sin textos hardcodeados en componentes; Carlos aprueba el copy.

### 6.7 Performance & QA (extra — el brief exige métricas medibles)
- **Tareas**: Lighthouse CI con `lhci collect` sobre `astro preview` para `/page/` y `/page/en/`, `numberOfRuns: 3`, mediana; a11y/SEO/best-practices como `error`, `performance ≥ 0.85` como `warn` hasta dos corridas verdes seguidas y luego `error` (los runners compartidos varían ±5–8 puntos). Se corre al marcar el PR *ready* (el repo es público, así que los minutos no cuestan; la regla es por consistencia con los demás repos). Playwright en el gate: smoke en 375/768/1440, enlaces internos (`mailto:`, anclas, `/page/en/`), test sin WebGL, con reduced-motion y con `forced-colors`, axe. **Enlaces externos** (skymek.app, paratipe.com, ventixs.com, LinkedIn, GitHub) en un workflow aparte `schedule` semanal + `workflow_dispatch`, no como gate (dos sitios están en construcción). Medición de FPS y draw calls en los dispositivos de §5; check de tamaño de assets.
- **Entregables**: `lighthouserc.json`, `tests/*.spec.ts`, `docs/QA.md` con resultados y capturas.
- **Aceptación**: todos los números de §5 cumplidos y documentados.

### 6.8 Accesibilidad y SEO
Lo cubren el Arquitecto (SEO técnico, §3.6) y QA (auditoría con axe en Playwright, §3.7). No se crea un rol separado para no fragmentar.

---

## 7. Fases, commits y CI

1. **Fase 3.0 — Preparación** (Arquitecto + 3D): tag, esqueleto Astro 7, i18n, y **spike de rendimiento** (§3.5) con un GLB de prueba: Lighthouse móvil, tamaño real del chunk 3D y frame time en `mid`. Sus resultados fijan §5 y deciden si el 3D se gatea por interacción. `chore:`/`build:` commits.
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

## 9. Decisiones de Carlos (antes abiertas)

| # | Tema | Decisión |
|---|---|---|
| 1 | Herramienta IA 3D | Sin decidir. Se arranca con **mascotas procedurales** como placeholder (mismos nombres, escala y presupuesto); recomendación: **Tripo** (export GLB, topología limpia, plan de pago con uso comercial). Los GLB reemplazan a los placeholders sin cambiar código. |
| 2 | Marca | No hay logos ni paleta oficiales: el Diseñador propone una identidad nueva y coherente para TUSOCIO IA y sus 3 productos. |
| 3 | 8 archivos sin commitear | Se commitean como legado en `develop` antes del tag `legacy-v2`. |
| 4 | Hosting | Sigue en `carlosorbegoso.github.io/page`. |
| 5 | Repos de GitHub | Se omiten; solo enlace al perfil. |
| 6 | CV | PDF entregado: `public/cv/Carlos-Orbegoso-CV.pdf`, botón "Descargar CV" en Hero y Contacto. Es la fuente de verdad de puestos y fechas. |
| 7 | Dispositivos de prueba | Android y iPhone propios de Carlos. |
| 8 | X/Twitter | `@carlosorbegoso` existe: se mantiene `twitter:creator` y se enlaza en Contacto. |

---

## Cambios tras revisión

Revisión de Claude Fable (2026-10-31), contrastada con el repo. Se aceptaron los 20 puntos; ninguno se rechazó.

| # | Cambio | Sección |
|---|---|---|
| 1 | Diferir three tras `load` no lo saca del TBT de Lighthouse → **spike obligatorio en Fase 3.0** (diferido vs. gateado por interacción), arranque troceado en tareas < 50 ms, polyfill de `requestIdleCallback` para Safari. | §3.5, §7 |
| 2 | El LCP será la imagen de fallback, no el título → presupuesto AVIF ≤ 60 KB a 375 px, preload + `fetchpriority="high"`. | §3.5, §5 |
| 3 | Decoders sin presupuesto (Basis ~560 KB, Draco ~250 KB) → **Meshopt por defecto**, transcoder KTX2 lazy, total móvil ≤ 1.2 MB hasta ver el 3D. | §2, §3.2, §5 |
| 4 | Tiers mal calibrados (`deviceMemory`/`hardwareConcurrency` solo en Chromium y engañosos) → tiers por `pointer`/ancho + detección de render por software; FPS medido con calibración del refresco y p75 tras compilar shaders; `low` es degradación posterior. | §3.3 |
| 5 | `dispose()` por escena rompía assets compartidos → caché con **refcount**; Company + Products fusionadas en `VenturesScene`; `compileAsync` + `initTexture` antes de entrar. | §3.2 |
| 6 | iOS: la barra de direcciones redimensiona el canvas fijo → `100lvh`, `ignoreMobileResize`, sin `pin` en móvil, `scrub` numérico, sin `normalizeScroll`; prueba en iPhone real. | §3.2, §6.5 |
| 7 | Fill rate es el cuello de botella en gama media → `mid` arranca en DPR 1.0 y sube hasta 1.5; `alpha: false`; canvas en `display: none` en secciones sin 3D; PMREM solo en `high`. | §3.2 |
| 8 | Chunk 3D < 180 KB irreal y GSAP se colaba en el JS inicial → chunk ≤ 260 KB gzip; GSAP solo en el chunk 3D, UI con CSS. | §2, §3.5, §5, §6.4 |
| 9 | `THREE.LOD` descarga todos los niveles → variantes `high`/`mid` elegidas antes del fetch; checklist de intake y fecha de corte para modelos IA. | §2, §5, §6.3 |
| 10 | Render a demanda contradecía el giro en reposo; giroscopio pide permiso en iOS → giro por tier, sin giroscopio. | §3.2 |
| 11 | Captura de fallbacks no funcionaría tal cual → GPU real, `--enable-unsafe-swiftshader` de reserva, modo `?capture`, `sharp` para AVIF/WebP. | §3.4 |
| 12 | Contraste sobre 3D no verificable; CLS por fuentes → scrim sólido obligatorio, métricas de fallback de fuentes, `forced-colors`, reduced-motion sin `scrub`. | §3.7 |
| 13 | i18n incompleto → sin redirección automática, ids de sección iguales en ambos idiomas, `x-default`, URLs con helpers de Astro, 404 bilingüe. | §3.6 |
| 14 | `robots.txt` generado con `Disallow: /_astro/` y `Crawl-delay`; canonical sin barra final → robots estático, `trailingSlash: 'always'`, OG en JPEG. | §1.3, §3.6 |
| 15 | Pages no sirve precomprimidos y cachea 10 min → se elimina `astro-compressor`; assets con hash; presupuestos en gzip. | §1.3, §2, §5 |
| 16 | Lighthouse varía en runners compartidos; los enlaces externos fallarían por causas ajenas → 3 corridas con mediana, performance como `warn` al inicio, enlaces externos en un workflow semanal; `bun` pineado y `--frozen-lockfile`. | §6.7, §1.3 |
| 17 | "Subir a 7.x o quedarse en 5.18" era ambiguo → esqueleto nuevo con Astro 7.4.4 y versiones pineadas. | §2 |
| 18 | Pipeline y color poco detallados → comando de gltf-transform explícito, ACES + sRGB, unidades físicas de luz. | §2, §3.2 |
| 19 | Datos corregidos: 8 archivos sin commitear (incluye `package.json`/`bun.lock`), `package-lock.json` no está trackeado, `web-vitals` se elimina, enlace roto al CV, GSAP gratuito desde 3.13, quitar `prefetch`, `inlineStylesheets: 'always'`. | §1, §2, §3.5, §4, §9 |
| 20 | 30 fps no verificables con CPU 4× → dispositivo real (Android gama media + iPhone, o Samsung Remote Test Lab); `?debug` guarda métricas. | §5, §6.3 |

---

## Cambio de dirección (2026-10-31, decisión de Carlos)

Prevalece sobre lo anterior cuando contradiga.

| Tema | Antes | Ahora |
|---|---|---|
| Alcance del 3D | Solo Hero y TUSOCIO IA/Productos; el resto con fondo sólido y canvas oculto. | **Mundo 3D continuo** en toda la landing: una `WorldScene` con estaciones (`hero`, `about`, `company`, `products`, `experience`, `contact`); la cámara recorre un camino ligado al scroll. El texto sigue siendo HTML real en **paneles flotantes** sobre fondo transparente. |
| Navegación | Header fijo con nav por anclas. | **Sin header.** Navegación por la escena (clic en mascotas e hitos → su sección) + UI mínima en esquinas: monograma, idioma, pausa y **☰ Índice** (alternativa accesible), indicador de progreso y tooltip de escena. |
| Móvil | Prioridad rendimiento (3D simplificado en `mid`). | **Prioridad espectacularidad**: mundo completo también en móvil (DPR ≤ 1.5, sin post pesado). Fallback estático solo sin WebGL, render por software, contexto perdido o p75 < 20 fps. |
| Lighthouse móvil | Performance ≥ 85. | **≈ 70–80 aceptado** por Carlos. Accessibility ≥ 90 se mantiene. |

Paneles en desktop (≥ 1024): izquierda en hero, company y experience; derecha en about, products y contact (el objeto 3D en el lado contrario). Móvil/tablet: panel abajo, objeto en el tercio superior. Cada sección mide ≥ 100svh.

Contratos de eventos en `window`: `product:focus` y `experience:focus` (`{ id }`, en ambos sentidos UI ↔ 3D), `motion:toggle` (`{ paused }`), `scene:hover` (`{ label }`, 3D → UI). Atributo de sección: `data-station="<id>"`.

### Segundo cambio: "Constelación" con texto en 3D (2026-10-31)

- **Concepto**: espacio profundo. Alfa es una estrella (TUSOCIO IA); SkyMek, Parati y Ventixs orbitan como lunas que evocan su mascota; la experiencia es una órbita con 4 hitos (SYSARP → Baufest → Intercorp → TCS); el hero es un campo estelar con la constelación del monograma "C"; about es un cúmulo de nodos del stack; contact es una señal emitida desde Alfa. Dirección de arte en `docs/design/constellation.md`.
- **Texto dentro del 3D**: HTML real colocado en el espacio con `CSS3DRenderer` (misma cámara que el `WebGLRenderer`). Sigue siendo texto seleccionable, con enlaces reales, legible por Google y lectores de pantalla.
- **Contrato de placas**: cada `<section data-station>` contiene `<div class="plate" data-plate data-plate-id>` (opcionales `data-plate-anchor`, `data-plate-order`, `data-product`, `data-experience`). Con 3D (`html.is-3d`) el motor mueve las placas al espacio y las secciones quedan como espaciadores que definen el recorrido del scroll; sin 3D la página es un flujo vertical de placas sobre una imagen estática del cielo. `focusin` en una placa lleva la cámara a su estación.
- **HUD** (monograma, idioma, pausa, Índice, mapa estelar de progreso) queda en pantalla, con estilo de observatorio.

### Tercer ajuste: escritorio → constelación, nivel estudio (2026-10-31)

Referencias de Carlos: lusion.co y david-hckh.com (inspiración, sin copiar).
- **Hero = el escritorio de Carlos de noche** (lámpara, monitor, ventana con la constelación, telescopio, figuras de Alfa/Burbu/caja). La placa `hero` vive en la pantalla del monitor. La cámara se aleja, gira hacia la ventana y vuela al espacio, donde sigue la constelación.
- **Imprescindibles**: reacción fluida al cursor (arrastre en táctil), efectos cinematográficos (bloom selectivo, profundidad de campo sobre la placa activa, grano, aberración sutil), transiciones de cámara dramáticas y suaves, y sonido ambiente generativo (apagado por defecto).
- **Reparto**: motor e integración (`src/three/` salvo `desk/` y `fx/`), artista de escenario (`src/three/desk/`), FX/shaders (`src/three/fx/`), sonido (`src/audio/`, `AudioToggle`), dirección de arte (`docs/design/desk.md`). Contratos en `src/three/contracts.ts` (`StationModule`, `FxPipeline`, `PointerField`, eventos `station:enter` y `station:progress`).

---

## Dirección final: "Una noche en el escritorio" (2026-10-31, aprobada por Carlos)

Prevalece sobre todos los cambios de dirección anteriores. Origen: `docs/REVIEW-direccion.md`.

### Idea
Un solo entorno: el escritorio de Carlos de noche, con luz horneada. Línea argumental: "Última hora de trabajo. En el monitor, el día (banca). Bajo la lámpara, la noche (productos). Al amanecer, la ventana." **Capítulos fijados (pin)**, cada uno con un plano casi quieto; la cámara solo cambia de plano **entre** capítulos (dolly corto, deslizamiento lateral o tilt + rack focus). La acción la hacen objetos, luz y texto. **Se elimina el espacio** (vuelo por la ventana, constelación, nebulosas, órbitas, faro, "C" de estrellas); detrás del vidrio solo queda un cielo nocturno mínimo con la ciudad.

### Capítulos (`data-station`)
| Id | Plano | Acción | Texto | Transición al siguiente | Móvil |
|---|---|---|---|---|---|
| `intro` (carga, sin sección) | Negro | La lámpara parpadea y enciende; el monitor despierta | — | 0,8 s | Igual |
| `hero` | Plano general frontal: mesa, monitor, ventana con ciudad, lluvia | Parallax ±1,5°, vapor de la taza, lluvia en el vidrio | Titular tecleado en el monitor (CSS3D 1:1, frontal); rol + 3 cifras; CTAs | Push-in 0,4 m + rack focus, 1,2 s | Monitor a todo el ancho |
| `about` | El monitor llena ~70 % | Cambio de "slide" en la pantalla | Foto, bio, formación y stack en la pantalla (CSS3D frontal) | Deslizamiento lateral hacia la lámpara, 1,4 s | Monitor arriba, texto abajo |
| `company` | Macro bajo la lámpara: peana con Alfa y sus tres figuras | Alfa gira 20°, su señal se enciende | Panel HTML anclado al lado opuesto | Rack focus | Figuras en el tercio superior |
| `products` | Macro de cada figura, una por vez; las otras desenfocadas | La figura sube 2 cm y gira lento | Una placa por producto; **SkyMek como estrella** (captura real, más peso); Parati y Ventixs "en construcción" | Dolly 15–20 cm, 0,9 s entre productos | Una por pantalla |
| `experience` | Tilt a la estantería: carpetas; la de TCS abierta en la mesa | Cada carpeta se ilumina al leerse | **Orden cronológico inverso**: TCS, Intercorp, Baufest; SYSARP en una línea | Tilt al teléfono, 1,0 s | Estantería arriba |
| `contact` | El teléfono junto al teclado se enciende | Notificación + chime | Correo, LinkedIn, GitHub, X, CV en la pantalla del teléfono (CSS3D frontal) | — | Botones al pulgar |
| `outro` | La lámpara se apaga, amanece en la ventana | Luz | Créditos en la pared (sustituyen al footer HTML) + pie técnico "Hecho con Astro + Three.js" | 2,5 s | Igual |

### Texto
- **El texto nunca rota ni reescala con la cámara.** Dos modos: (1) **CSS3D solo en superficies frontales** (monitor en `hero`/`about`, teléfono en `contact`), a 1:1 con la cámara de frente; (2) **paneles HTML 2D anclados** a un punto 3D proyectado (solo traslación en pantalla, suelto y sin caja) en `company`, `products`, `experience`, `outro`.
- El texto entra cuando la cámara se asienta (evento `chapter:settled`), con revelado por palabras. Sin deriva continua ni resorte de proximidad en párrafos; la proximidad por letra solo en titulares cortos.

### Reglas anti-mareo (obligatorias, se aplican por código en el director de cámara)
1. Roll 0°; "arriba" = +Y del mundo; FOV fijo por dispositivo (30 desktop, 40 móvil).
2. Por transición ≤ 45° de yaw, ≤ 25° de pitch, ≤ 1,5 m; ≤ 20°/s y ≤ 1 m/s.
3. Transiciones de 0,9–1,4 s con `power2.inOut`; proporción quieto:movimiento ≥ 70:30 por capítulo; en táctil la transición se dispara al 50 % de visibilidad, sin scrub.
4. Una sola fuente de movimiento a la vez: el parallax del cursor se apaga durante las transiciones; deriva en reposo ≤ 2 px; giros de objetos ≤ 0,05 rad/s; respiración de luz ≤ ±5 % en 6–8 s.
5. Nada cruza el centro del cuadro durante una transición; DoF ≤ 600 ms y nunca sobre texto.
6. Reduced-motion / pausa: cortes con disolvencia de 300 ms.

### Contenido (estratega)
Rol "Backend Developer · Java/Quarkus · Banca" grande desde el primer segundo y 3 cifras (+30–40 % de rendimiento, monolito → CQRS, liderazgo de un equipo de 3 / +20 % de eficiencia); experiencia en orden inverso; SkyMek como estrella; **modo lectura** con un clic (una página limpia con todo el contenido); pie técnico.

### HUD
Solo el monograma persiste; al hover/tap despliega idioma, sonido, pausa, Índice, modo lectura y CV. Sin riel de progreso sobre el contenido.

### Modelos
Carlos genera los modelos con Tripo (prompts en `docs/design/mascots.md` y `docs/design/desk.md`, actualizados al registro "pieza de escritorio ejecutivo": Alfa obsidiana con anillo de latón, Burbu cerámica mate, caja con cinta satinada, más teléfono y carpetas). Mientras tanto, versiones procedurales mejoradas con la misma interfaz y nombres de nodos.

### Reparto
| Especialista | Archivos | Tarea |
|---|---|---|
| Motor / director de cámara | `src/three/` (salvo `desk/`, `fx/`), `StageCanvas` | Capítulos pin, director con límites, eventos `chapter:enter/settled/progress`, texto en 2 modos, eliminar el espacio |
| Artista de escenario | `src/three/desk/` | Sets y planos por capítulo (peana macro, estantería y carpetas, teléfono, lluvia, vapor, encendido, amanecer) |
| FX | `src/three/fx/` | Fluido solo en lluvia/vapor/vidrio, rack focus por capítulo, sin aberración |
| Diseñador | `docs/design/`, `tokens.css`, `plates.css` | Dirección de arte v2, mascotas re-esculpidas, prompts Tripo, escala tipográfica única |
| Copywriter | `src/content/`, `src/i18n/`, `docs/copy/` | Rol + cifras, orden inverso, SkyMek estrella, créditos, modo lectura |
| UI de contenido | `src/components/sections/**`, `products/`, `experience/`, `contact/`, página de modo lectura | Secciones por capítulo, nueva sección `outro`, modo lectura |
| UI Shell | Header/HUD, Footer, StarMap, Base | HUD de monograma, quitar riel y footer plano, botón modo lectura |
| Motion | `src/motion/`, `motion.css` | Revelados al `chapter:settled`, quitar deriva y proximidad en cuerpo |
| Sonido | `src/audio/` | Tono de cuarto (lluvia, zumbido), tecla, "tock" de madera, chime y swell por capítulo |
