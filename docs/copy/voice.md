# Voz y tono

Reglas de voz para todo texto del portafolio (ES es-PE por defecto, EN como adaptación) y dónde vive el copy; léelo antes de escribir o cambiar cualquier texto visible.

## Fuente de verdad del copy (`src/i18n`, `src/content`)

| Texto | Archivo |
|---|---|
| UI, meta, SEO, OG, navegación, secciones, contacto | `src/i18n/<es|en>/meta.ts`, `nav.ts`, `sections.ts`, `contact.ts` (se unen en `src/i18n/ui.es.ts` y `src/i18n/ui.en.ts`) |
| Perfil, resumen, stack, formación, empresa | `src/content/profile/<es|en>.json` |
| Experiencia (empresas, fechas, logros, tags) | `src/content/experience/<es|en>.json` |
| Productos (tagline, descripción, puntos, `featured`) | `src/content/products/<es|en>.json` |
| Hechos del CV | `public/cv/Carlos-Orbegoso-CV.pdf` |

No hay copia en Markdown: el texto se edita en esos archivos, siempre en los dos idiomas a la vez.

## Quién habla y a quién

- Habla **Carlos, en primera persona** ("construyo", "migré"). Es su sitio, no una ficha corporativa.
- Lectores: reclutadores y líderes técnicos (banca, consultoras), posibles socios y clientes de los productos.

## Tuteo, no usted

- Es el registro de los productos de TUSOCIO IA (Parati, Ventixs) y del ecosistema tech peruano; usted sonaría distinto a sus propios productos.
- "Escríbeme" acerca más que "Escríbame".
- Profesional: sin jerga, sin diminutivos, sin emojis, sin exclamaciones.
- Excepción: un texto legal o de facturación iría en usted.

## Reglas

1. **Frases cortas.** Una idea por frase. Titulares de 4 a 9 palabras.
2. **Verbo de acción al inicio** en logros: migré, lideré, optimicé, implementé, refactoricé.
3. **Verbo + resultado + cifra** cuando la cifra está en el CV (30–40 %, 20 %, 30 %, equipo de 3). Sin cifra, el resultado concreto (escalabilidad, arranque rápido), nunca un adjetivo vacío.
4. **Cero datos inventados.** Solo lo que dicen el CV, el sitio del producto o hechos confirmados. Nada de clientes, usuarios, métricas ni funcionalidades que no estén ahí: si no hay funcionalidades confirmadas, el producto va sin puntos.
5. **Nombres propios exactos:** TCS, BCP, Intercorp Retail, Baufest, Cencosud, SYSARP, TUSOCIO IA (S.A.C. solo en contexto legal), SkyMek, Parati, Ventixs, Alfa, Burbu.
6. **Términos técnicos en su forma usual:** Quarkus, Spring Boot, cloud-native, serverless, CQRS; no se traducen. "Backend Developer" como título de puesto (así figura en el CV); en prosa, "desarrollador backend".
7. **Porcentajes:** ES `30 %` con espacio y coma decimal; EN `30%`.
8. **Fechas:** ES "jun 2025 – actualidad"; EN "Jun 2025 – Present". Las formatea `formatYearMonth` (`src/i18n/utils.ts`).
9. **Sin superlativos** ("el mejor", "experto", "apasionado"). Que hablen los hechos.
10. **El teléfono no se publica.**

## Hilo narrativo (`hero.headline`)

> De día, backends para la banca. De noche, mis propios productos.

- EN: *By day, backends for banking. By night, products of my own.*
- Aparece en el hero y se retoma en Sobre mí, TUSOCIO IA y el cierre. El cierre tiene variante de día (`outro.titleDay`), que invierte el día y la noche.
- El titular de impacto es el texto grande visible; nombre y rol van encima como eyebrow, sin perder el h1 semántico.

## SEO y OG (`meta.*`)

- `<title>` ≤ 60 caracteres; meta description ≤ 155; `og:title` ≤ 60.
- Cada texto nombra el rol (Backend Developer, Java y Quarkus) y, si cabe, TCS/BCP y TUSOCIO IA.

## Productos (`src/content/products`)

- **SkyMek** es el producto estrella (`featured: true`): en producción, Carlos es su dueño. Sus puntos salen de skymek.app; vuelve a comprobarlos allí antes de cambiarlos.
- **Parati** y **Ventixs**: breves y "en construcción". Solo lo confirmado: Parati = invitaciones digitales con mesa de regalos, aportes por Yape, crear un evento es gratis; Ventixs = bot de ventas por WhatsApp.

## Inglés

- Adaptación natural (en-US), no traducción literal: más directo.
- Contracciones moderadas ("doesn't", "I'm") en microcopy, nunca en logros.

## Pendientes

- `hero.fallbackAlt` existe en ES y EN pero nada lo usa, y describe "Alfa sobre una red de nodos", que ya no es la escena. Reescríbelo para el escritorio o bórralo.
