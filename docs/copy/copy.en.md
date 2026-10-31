# Portfolio copy — English (en-US)

Natural adaptation of `copy.es.md`, same structure and keys. Voice: `docs/copy/voice.md`.
Brackets show the target key in `src/i18n/ui.en.ts` or the field in `src/content/*/en.json`.

---

## SEO and Open Graph

| Page | Field | Text | Chars |
|---|---|---|---|
| Home | `<title>` [`meta.title`] | Carlos Orbegoso · Java & Quarkus Backend Developer | 50 |
| Home | meta description [`meta.description`] | Lima-based backend developer. I modernize BCP services with Java and Quarkus at TCS and build SkyMek, Parati and Ventixs with TUSOCIO IA. | 137 |
| Home | `og:title` [`meta.ogTitle`] | Carlos Orbegoso: banking backends and products of my own | 56 |
| Home | `og:description` [`meta.ogDescription`] | By day, backends for BCP at TCS. By night, SkyMek, Parati and Ventixs with TUSOCIO IA, the company I co-founded. | 112 |
| Home | `og:image:alt` [`meta.ogImageAlt`] | Carlos Orbegoso, Java and Quarkus Backend Developer | — |
| 404 | `<title>` [`notFound.metaTitle`] | Page not found · Carlos Orbegoso | 32 |
| 404 | meta description [`notFound.description`] | This page doesn't exist or has moved. Head back home to see my work, my products and how to reach me. | 101 |

---

## Header / navigation

- Logo (text + aria) [`nav.home`]: "Carlos Orbegoso, go to home"
- Nav [`nav.label`]: "Main navigation"
- Items: About · TUSOCIO IA · Products · Experience · Contact
- Mobile menu: "Open menu" [`nav.openMenu`] / "Close menu" [`nav.closeMenu`]
- Language switch: label "Language" [`lang.label`], link "Español" [`lang.switchTo`], current "English" [`lang.current`]
- Skip link [`skipLink`]: "Skip to content"
- Animation [`motion.pause` / `motion.play`]: "Pause animation" / "Resume animation"

---

## 1. Hero

- **H1 (SEO, in the HTML):** Carlos Orbegoso — Backend Developer · Java & Quarkus [`profile.name` + `profile.role`]
- **Headline** [`hero.headline`]: **By day, backends for banking. By night, products of my own.**
- **Subtitle** [`profile.tagline`]: At TCS for BCP · Co-founder of TUSOCIO IA
- **CTAs:** "See products" [`hero.ctaProducts`] (primary) · "Get in touch" [`hero.ctaContact`] · "Download CV" [`cv.download`]
- **3D fallback alt** [`hero.fallbackAlt`]: "Alfa, the TUSOCIO IA mascot, over a network of connected nodes"

---

## 2. About

- **Title** [`about.title`]: About me
- **Subtitle** [`about.subtitle`]: Backend developer in Lima, building Java systems for 5+ years.
- **Body** [`profile.summary`]:
  1. I'm a backend developer with more than five years of experience. Today I work at TCS for BCP, moving services to Quarkus and taking the stack cloud-native.
  2. Before that: Intercorp Retail, Baufest and SYSARP. Observability, CQRS, microservices and performance gains of up to 40%.
  3. After hours, I build my own products with TUSOCIO IA, the company I co-founded.
  4. IT technician degree from CIBERTEC (2023) and scholarship recipient of Alura Latam's Java Developer Bootcamp (2023).
- **Education** [`about.education`]: Systems Engineering · Universidad Peruana de Ciencias Aplicadas (UPC) · 10th semester, evening program
- **Main stack** [`about.stack`, `profile.stack`]:
  - Backend: Java, Quarkus, Spring Boot, WebFlux, Microservices, REST APIs
  - Messaging: Kafka, SQS, Pub/Sub
  - Cloud & DevOps: Docker, CI/CD, Azure DevOps, Azure Functions, SonarQube
  - Observability: Grafana, Loki, Tempo, Prometheus
  - Databases: PostgreSQL, SQL Server, MongoDB, DynamoDB
  - Also: Angular, JavaScript, Python
- **Photo alt** [`profile.photoAlt`]: "Carlos Orbegoso in sunglasses and a white hoodie, in front of a stone wall"

---

## 3. TUSOCIO IA

- **Title** [`company.title`]: TUSOCIO IA
- **Subtitle** [`company.subtitle`]: The company I co-founded to build products of our own.
- **Role** [`profile.company.role`]: Co-founder · TUSOCIO IA S.A.C.
- **Body** [`profile.company.summary`]:
  1. TUSOCIO IA S.A.C. is the company I co-founded to launch our own digital products from Peru.
  2. There are three today: SkyMek, already live, plus Parati and Ventixs, still in the works. Alfa, our mascot, is the parent brand that ties them together.
- **CTA** [`company.cta`]: "Meet the products"

---

## 4. Products

- **Title** [`products.title`]: Products
- **Subtitle** [`products.subtitle`]: Three TUSOCIO IA products: one live, two on the way.
- **Status:** "Live" [`products.status.production`] · "In development" [`products.status.building`]
- **Role label** [`products.role`]: "My role"
- **Card CTA** [`products.visit`]: "Visit site" + screen-reader note [`link.newTab`]: "(opens in a new tab)"

| Product | Role | Tagline | Description | Points |
|---|---|---|---|---|
| SkyMek · skymek.app | Owner | Auto repair shop management | Peruvian SaaS for running auto repair shops. It's my product, and it's already live. | — |
| Parati · paratipe.com | Co-founder | Digital invitations and gift registry | Digital invitations with a gift registry where guests chip in via Yape. Creating an event is free. | Digital invitations · Gift registry with Yape contributions · Creating an event is free |
| Ventixs · ventixs.com | Co-founder | WhatsApp sales bot | A sales bot that works inside WhatsApp, where your customers already chat. | — |

---

## 5. Experience

- **Title** [`experience.title`]: Experience
- **Subtitle** [`experience.subtitle`]: 5+ years across banking, retail and consulting.
- Labels: "Client" [`experience.client`] · "Present" [`experience.present`] · "Highlights" [`experience.highlights`] · "Tech" [`experience.stack`]

### TCS (Tata Consultancy Services) — Backend Developer · client BCP (Banco de Crédito del Perú)
Jun 2025 – Present
Summary: I modernize BCP backend services with Quarkus and cloud-native architecture.
- Migrated applications from RxJava to Quarkus, moving the stack to a cloud-native architecture.
- Refactored Java services around Quarkus principles: native compilation, fast startup and a low memory footprint.
- Contributed to the Azure Functions initiative, enabling event-driven serverless processes across the bank's ecosystem.
Tags: Java · Quarkus · RxJava · Azure Functions · Cloud-native

### Intercorp Retail — Backend Developer
Apr 2024 – Jun 2025
Summary: Backend for the HR applications of a leading Peruvian retail group.
- Raised system performance by 30–40%, including stored procedure optimization.
- Led the migration from a monolith to CQRS for better scalability and separation of concerns.
- Set up observability with Grafana, Loki, Promtail and Prometheus, and built Spring Batch jobs for high-volume data.
Tags: Java · Spring Boot · Spring Batch · CQRS · SQL · Grafana · Loki · Prometheus

### Baufest — Backend Developer · client Cencosud (Chile and Argentina)
Mar 2022 – Feb 2024
Summary: Microservices and APIs for Cencosud: API security and authentication, architecture templates, internal training and a log dashboard.
- Led a three-person microservices project and moved its build from Maven to Gradle.
- Drove internal system improvements that made our projects 20% more efficient.
- Migrated data from JSON to SQL Server tables, improving data accessibility by 30%.
Tags: Java · Microservices · API security · Maven · Gradle · SQL Server

### SYSARP — Frontend Developer
Jan 2020 – Dec 2021
Summary: Web applications at an IT consultancy, focused on usability and speed.
- Designed and built usable, intuitive web applications.
- Improved load times and application performance with JavaScript.
Tags: JavaScript · HTML · CSS

---

## 6. Contact

- **Title** [`contact.title`]: Contact
- **Subtitle** [`contact.subtitle`]: Have a role, a project or an idea? Drop me a line.
- **Body** [`contact.body`]: You can also find me on LinkedIn, GitHub and X.
- Email [`contact.email`]: "Email" → car_11.09@hotmail.com
- Copy: "Copy email" [`contact.copyEmail`] → "Copied" [`contact.copied`]; error [`contact.copyError`]: "Couldn't copy. Select the address and copy it manually."
- Social [`contact.social`]: "Elsewhere" → LinkedIn · GitHub · X @carlosorbegoso (each with "(opens in a new tab)")
- CV: "Download CV" [`cv.download`] · detail [`cv.format`]: "PDF, in Spanish"
- No phone number.

---

## Footer

- [`footer.tagline`]: "Made in Lima with Astro and Three.js."
- [`footer.rights`]: "All rights reserved."
- [`footer.backToTop`]: "Back to top"

---

## 404

- H1: 404
- Title [`notFound.title`]: Page not found
- Body [`notFound.body`]: This page doesn't exist or has moved.
- CTA [`notFound.home`]: Back to home
