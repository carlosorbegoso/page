# Requisitos vigentes

Decisiones de Carlos, presupuestos de rendimiento, tiers, i18n/SEO y accesibilidad que todo cambio debe seguir cumpliendo; léelo antes de añadir peso, cambiar la cámara o tocar SEO.

## Decisiones de Carlos
| Tema | Decisión |
| --- | --- |
| Idioma | Bilingüe: español por defecto en `/page/`, inglés en `/page/en/`. |
| Hosting | GitHub Pages en `carlosorbegoso.github.io/page` (`base: '/page'`). |
| Puesto actual | Backend Developer en TCS · cliente BCP. El CV (`public/cv/Carlos-Orbegoso-CV.pdf`) es la fuente de verdad de puestos y fechas. |
| Stack 3D | Three.js + glTF/GLB (Meshopt) + KTX2 + GSAP. |
| Modelos | Carlos los genera con Tripo (prompts en `docs/design/mascots.md`); mientras tanto, piezas procedurales con la misma interfaz. |
| Marca | Sin logos oficiales: la identidad de TUSOCIO IA y sus productos es la de `docs/design/identity.md`. |
| Redes | Perfil de GitHub (sin repos), LinkedIn y X (`@carlosorbegoso`). No se publica el teléfono ni WhatsApp. |
| Dispositivos de prueba | El Android y el iPhone de Carlos. |

## Dirección: «Una noche en el escritorio»
- Un solo entorno: el escritorio de Carlos, de día los años de empleo y de noche TUSOCIO IA y los productos; amanece en el outro.
- La historia la cuentan el cuarto, la luz y los objetos. Una idea por plano; el detalle va al modo lectura.
- **La cámara se mueve, o se mueve un objeto, o entra texto. Nunca dos a la vez.** Los cambios de luz se esconden dentro de los cortes.
- El rol y tres cifras se leen en los primeros segundos. La experiencia va en orden cronológico en 3D y en orden inverso en el modo lectura y el CV.

### Texto
- El texto nunca rota ni reescala con la cámara. Dos modos: CSS3D a 1:1 solo en superficies frontales (monitor y teléfono) y paneles HTML 2D anclados a un punto 3D (solo traslación).
- Entra cuando la cámara se asienta (`chapter:settled`). La proximidad por letra solo en titulares cortos.

### Reglas anti-mareo (las aplica el director, `src/three/director.ts`)
1. Roll 0°, «arriba» = +Y del mundo, FOV fijo por dispositivo.
2. Por transición ≤ 45° de yaw, ≤ 25° de pitch, ≤ 1,5 m, ≤ 20°/s y ≤ 1 m/s.
3. Transiciones de 0,9–1,4 s con `power2.inOut`; quieto:movimiento ≥ 70:30 por capítulo.
4. Una fuente de movimiento a la vez: el parallax del cursor se apaga durante las transiciones; giros de objetos ≤ 0,05 rad/s; respiración de luz ≤ ±5 %.
5. DoF ≤ 600 ms y nunca sobre texto.
6. Reduced-motion o pausa: cortes con disolvencia de 300 ms.

## Presupuestos (todo en gzip: Pages no sirve brotli)
| Métrica | Objetivo |
| --- | --- |
| Lighthouse móvil | Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 95 |
| LCP / CLS / TBT (móvil, Slow 4G) | ≤ 2,5 s · ≤ 0,05 · ≤ 200 ms |
| JS inicial sin 3D | < 30 KB |
| JS del 3D antes del primer frame | ≤ 260 KB; lo demás se carga después (ver `docs/3d/`) |
| FPS | 60 en desktop, ≥ 30 en un móvil de gama media. Se mide en dispositivo real: CPU 4× de DevTools no limita la GPU y no cuenta. |
| Draw calls | < 50 por plano (`renderer.info.render.calls`) |
| Modelos | Hero < 2 MB, todos ≤ 4 MB (`high`); `high` ≤ 25 k tris y 1024 px, `mid` ≤ 8 k tris y 512 px; KTX2 potencia de 2, un material y atlas por pieza |
| Decoders | Meshopt ≤ 40 KB; transcoder KTX2 diferido hasta la primera textura |
| Pantalla de arranque | HTML/CSS visible en el primer frame, JS ≤ 5 KB gzip, sin three |
| Memoria GPU | `renderer.info.memory` vuelve a la base al liberar una escena |

## Niveles de dispositivo (`src/three/tier.ts`)
- `none`: sin WebGL2, render por software, `saveData`, `forced-colors` o contexto perdido. Sin pantalla de arranque ni 3D (página normal); sin WebGL2 o con render por software, la pantalla muestra `503 · Modo lectura` y lleva al modo lectura. Nunca se descarga three.
- `mid`: `pointer: coarse` o < 1024 px. `high`: el resto. `low`: degradación posterior si el p75 no cumple ni a DPR mínimo.
- No se usan `deviceMemory` ni `hardwareConcurrency`: solo existen en Chromium y están mal calibrados (un Galaxy A5x tiene 8 núcleos).
- Los FPS se miden tras calibrar 500 ms el intervalo de rAF (detecta 30/60/120 Hz y el bajo consumo de iOS), después de compilar shaders y subir texturas, como p75 relativo a ese intervalo.

## Rendimiento del arranque
- La pantalla de arranque es HTML/CSS puro y se pinta en el primer frame, sin esperar a three ni a imágenes.
- Diferir el 3D tras `load` no basta: Lighthouse sigue midiendo hasta que la CPU queda quieta. El 3D espera la primera interacción o unos segundos y se trocea en tareas < 50 ms.
- CSS inline (`inlineStylesheets: 'always'`), sin CSS de terceros.

## i18n y SEO
- Sin redirección automática por idioma. Ids de sección iguales en ES y EN; `LangSwitch` conserva el hash.
- URLs con `withBase()` / `localeUrl()` (`src/i18n/utils.ts`) para respetar `base: '/page'` y la barra final; canonical, hreflang (es, en, `x-default`) y `og:url` absolutos.
- OG por idioma en JPEG/PNG (LinkedIn y WhatsApp no leen AVIF).
- JSON-LD `Person` + `Organization` (TUSOCIO IA S.A.C.) con los tres productos.
- Todo el contenido existe como HTML semántico sin 3D: crawlers y lectores de pantalla no dependen del canvas.

## Accesibilidad
- Canvas `aria-hidden`; skip link, landmarks, un solo `h1`.
- Contraste AA (4,5:1 texto, 3:1 UI). El texto nunca pisa el 3D sin un panel o scrim sólido (≥ 60 %), y el contraste se valida contra ese scrim.
- `forced-colors: active` oculta el canvas y la pantalla de arranque: queda la página normal.
- Foco visible, teclado completo, objetivos táctiles ≥ 44 × 44 px, orden de Tab igual al de los capítulos.
- `prefers-reduced-motion` y el botón de pausa (WCAG 2.2.2) detienen el movimiento automático.
