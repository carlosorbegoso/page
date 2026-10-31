# Copy del portafolio — Español (es-PE)

Fuente de hechos: `public/cv/Carlos-Orbegoso-CV.pdf` y los hechos confirmados del brief. Voz: `docs/copy/voice.md`.
Entre corchetes, la clave de destino en `src/i18n/ui.es.ts` o el campo de `src/content/*/es.json`.

---

## SEO y Open Graph

| Página | Campo | Texto | Car. |
|---|---|---|---|
| Inicio | `<title>` [`meta.title`] | Carlos Orbegoso · Backend Developer Java y Quarkus | 50 |
| Inicio | meta description [`meta.description`] | Backend Developer en Lima. Modernizo servicios del BCP con Java y Quarkus en TCS y construyo SkyMek, Parati y Ventixs con TUSOCIO IA. | 133 |
| Inicio | `og:title` [`meta.ogTitle`] | Carlos Orbegoso: backends para la banca y productos propios | 59 |
| Inicio | `og:description` [`meta.ogDescription`] | De día, backends para el BCP en TCS. De noche, SkyMek, Parati y Ventixs con TUSOCIO IA, la empresa que cofundé. | 111 |
| Inicio | `og:image:alt` [`meta.ogImageAlt`] | Carlos Orbegoso, Backend Developer en Java y Quarkus | — |
| 404 | `<title>` [`notFound.metaTitle`] | Página no encontrada · Carlos Orbegoso | 38 |
| 404 | meta description [`notFound.description`] | Esta página no existe o cambió de lugar. Vuelve al inicio para ver mi experiencia, mis productos y cómo escribirme. | 115 |

---

## Header / navegación

- Logo (texto + aria) [`nav.home`]: "Carlos Orbegoso, ir al inicio"
- Nav [`nav.label`]: "Navegación principal"
- Ítems: Sobre mí · TUSOCIO IA · Productos · Experiencia · Contacto
- Menú móvil: "Abrir menú" [`nav.openMenu`] / "Cerrar menú" [`nav.closeMenu`]
- Selector de idioma: etiqueta "Idioma" [`lang.label`], enlace "English" [`lang.switchTo`], idioma actual "Español" [`lang.current`]
- Skip link [`skipLink`]: "Saltar al contenido"
- Animación [`motion.pause` / `motion.play`]: "Pausar animación" / "Reanudar animación"

---

## 1. Hero

- **H1 (SEO, en el HTML):** Carlos Orbegoso — Backend Developer · Java y Quarkus [`profile.name` + `profile.role`]
- **Titular de impacto** [`hero.headline`]: **De día, backends para la banca. De noche, mis propios productos.**
- **Subtítulo** [`profile.tagline`]: En TCS para el BCP · Cofundador de TUSOCIO IA
- **CTAs:** "Ver productos" [`hero.ctaProducts`] (principal) · "Escríbeme" [`hero.ctaContact`] · "Descargar CV" [`cv.download`]
- **Alt de la imagen de fallback del 3D** [`hero.fallbackAlt`]: "Alfa, la mascota de TUSOCIO IA, sobre una red de nodos conectados"
  - Nota: hoy `StageCanvas` la pinta con `alt=""` dentro de `aria-hidden` (decorativa). Si se decide que sea informativa, usar esta clave.

Recomendación para UI: el titular de impacto es el texto grande visible; el H1 con nombre y rol puede ir encima como eyebrow, sin perder el H1 semántico.

---

## 2. Sobre mí

- **Título** [`about.title`]: Sobre mí
- **Subtítulo** [`about.subtitle`]: Desarrollador backend en Lima, con más de 5 años construyendo sistemas en Java.
- **Cuerpo** [`profile.summary`]:
  1. Soy desarrollador backend con más de 5 años de experiencia. Hoy trabajo en TCS para el BCP, donde migro servicios a Quarkus y llevo el stack hacia lo cloud-native.
  2. Antes pasé por Intercorp Retail, Baufest y SYSARP: observabilidad, CQRS, microservicios y mejoras de hasta 40 % en el rendimiento.
  3. De noche construyo productos propios con TUSOCIO IA, la empresa que cofundé.
  4. Técnico en Computación e Informática por CIBERTEC (2023) y becado en el Bootcamp Java Developer de Alura Latam (2023).
- **Formación** [`about.education`]: Ingeniería de Sistemas · Universidad Peruana de Ciencias Aplicadas (UPC) · 10.º ciclo, horario nocturno
- **Stack principal** [`about.stack`, `profile.stack`]:
  - Backend: Java, Quarkus, Spring Boot, WebFlux, Microservicios, APIs REST
  - Mensajería: Kafka, SQS, Pub/Sub
  - Cloud y DevOps: Docker, CI/CD, Azure DevOps, Azure Functions, SonarQube
  - Observabilidad: Grafana, Loki, Tempo, Prometheus
  - Bases de datos: PostgreSQL, SQL Server, MongoDB, DynamoDB
  - También: Angular, JavaScript, Python
- **Alt de la foto** [`profile.photoAlt`]: "Carlos Orbegoso con lentes de sol y polera blanca, frente a un muro de piedra"

---

## 3. TUSOCIO IA

- **Título** [`company.title`]: TUSOCIO IA
- **Subtítulo** [`company.subtitle`]: La empresa que cofundé para construir productos propios.
- **Rol** [`profile.company.role`]: Cofundador · TUSOCIO IA S.A.C.
- **Cuerpo** [`profile.company.summary`]:
  1. TUSOCIO IA S.A.C. es la empresa que cofundé para lanzar productos digitales propios desde el Perú.
  2. Hoy son tres: SkyMek, ya en producción, y Parati y Ventixs, en construcción. Alfa, nuestra mascota, es la marca madre que los une.
- **CTA** [`company.cta`]: "Conoce los productos"

---

## 4. Productos

- **Título** [`products.title`]: Productos
- **Subtítulo** [`products.subtitle`]: Tres productos de TUSOCIO IA: uno en producción y dos en camino.
- **Estados:** "En producción" [`products.status.production`] · "En construcción" [`products.status.building`]
- **Etiqueta de rol** [`products.role`]: "Mi rol"
- **CTA por tarjeta** [`products.visit`]: "Visitar sitio" + aviso para lectores de pantalla [`link.newTab`]: "(se abre en una pestaña nueva)"

| Producto | Rol | Tagline | Descripción | Puntos |
|---|---|---|---|---|
| SkyMek · skymek.app | Cofundador y dueño | Gestión de talleres automotrices | SaaS peruano para gestionar talleres automotrices. Es mi producto y ya está en producción. | — |
| Parati · paratipe.com | Cofundador | Invitaciones digitales y mesa de regalos | Invitaciones digitales con mesa de regalos: tus invitados aportan por Yape. Crear un evento es gratis. | Invitaciones digitales · Mesa de regalos con aportes por Yape · Crear un evento es gratis |
| Ventixs · ventixs.com | Cofundador | Bot de ventas por WhatsApp | Un bot de ventas que trabaja en WhatsApp, el canal donde tus clientes ya conversan. | — |

SkyMek y Ventixs sin "puntos": el brief no confirma funcionalidades concretas y no se inventan.

---

## 5. Experiencia

- **Título** [`experience.title`]: Experiencia
- **Subtítulo** [`experience.subtitle`]: Más de 5 años entre banca, retail y consultoría.
- Etiquetas: "Cliente" [`experience.client`] · "Actualidad" [`experience.present`] · "Logros" [`experience.highlights`] · "Tecnologías" [`experience.stack`]

### TCS (Tata Consultancy Services) — Backend Developer · cliente BCP (Banco de Crédito del Perú)
jun 2025 – actualidad
Resumen: Modernizo servicios backend del BCP hacia Quarkus y arquitecturas cloud-native.
- Migré aplicaciones de RxJava a Quarkus y llevé el stack hacia una arquitectura cloud-native.
- Refactoricé servicios en Java con los principios de Quarkus: compilación nativa, arranque rápido y bajo consumo de memoria.
- Participé en la iniciativa de Azure Functions, que habilita procesos serverless event-driven en el ecosistema bancario.
Tags: Java · Quarkus · RxJava · Azure Functions · Cloud-native

### Intercorp Retail — Backend Developer
abr 2024 – jun 2025
Resumen: Backend para las aplicaciones de gestión humana de un holding líder del retail peruano.
- Subí entre 30 % y 40 % el rendimiento del sistema, entre otras mejoras optimizando procedimientos almacenados.
- Lideré la migración de un monolito a CQRS para ganar escalabilidad y separar responsabilidades.
- Implementé observabilidad con Grafana, Loki, Promtail y Prometheus, y procesos Spring Batch para grandes volúmenes de datos.
Tags: Java · Spring Boot · Spring Batch · CQRS · SQL · Grafana · Loki · Prometheus

### Baufest — Backend Developer · cliente Cencosud (Chile y Argentina)
mar 2022 – feb 2024
Resumen: Microservicios y APIs para Cencosud: seguridad y autenticación de APIs, plantillas de arquitectura, capacitaciones internas y un dashboard de logs.
- Lideré un proyecto de microservicios con un equipo de 3 personas y migré su build de Maven a Gradle.
- Impulsé mejoras en los sistemas internos que elevaron un 20 % la eficiencia de nuestros proyectos.
- Migré datos de JSON a tablas en SQL Server: 30 % más de accesibilidad a los datos.
Tags: Java · Microservicios · Seguridad de APIs · Maven · Gradle · SQL Server

### SYSARP — Frontend Developer
ene 2020 – dic 2021
Resumen: Aplicaciones web en una consultora de TI, con foco en usabilidad y velocidad.
- Diseñé y desarrollé aplicaciones web usables e intuitivas.
- Optimicé la velocidad de carga y el rendimiento de las aplicaciones con JavaScript.
Tags: JavaScript · HTML · CSS

---

## 6. Contacto

- **Título** [`contact.title`]: Contacto
- **Subtítulo** [`contact.subtitle`]: ¿Tienes una vacante, un proyecto o una idea? Escríbeme.
- **Cuerpo** [`contact.body`]: También me encuentras en LinkedIn, GitHub y X.
- Correo [`contact.email`]: "Correo" → car_11.09@hotmail.com
- Copiar: "Copiar correo" [`contact.copyEmail`] → "Copiado" [`contact.copied`]; error [`contact.copyError`]: "No se pudo copiar. Selecciona el correo y cópialo a mano."
- Redes [`contact.social`]: "Redes" → LinkedIn · GitHub · X @carlosorbegoso (cada una con "(se abre en una pestaña nueva)")
- CV: "Descargar CV" [`cv.download`] · detalle [`cv.format`]: "PDF, en español"
- Sin teléfono.

---

## Footer

- [`footer.tagline`]: "Hecho en Lima con Astro y Three.js."
- [`footer.rights`]: "Todos los derechos reservados." (precedido por "© {año} Carlos Orbegoso.")
- [`footer.backToTop`]: "Volver arriba"

---

## 404

- H1: 404
- Título [`notFound.title`]: Página no encontrada
- Cuerpo [`notFound.body`]: Esta página no existe o cambió de lugar.
- CTA [`notFound.home`]: Volver al inicio
