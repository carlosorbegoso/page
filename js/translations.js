// ===== TRADUCCIONES MULTILINGÜES =====

const translations = {
    es: {
        // Navegación
        nav: {
            home: "Inicio",
            about: "Sobre mí",
            experience: "Experiencia",
            skills: "Habilidades",
            projects: "Proyectos",
            contact: "Contacto"
        },
        
        // Hero Section
        hero: {
            title: "Carlos Orbegoso",
            role: "Backend Developer & Java Specialist",
            company: "@ Tata Consultancy Services",
            cta: {
                primary: "Conoce más",
                secondary: "Hablemos"
            }
        },
        
        // About Section
        about: {
            title: "Sobre mí",
            subtitle: "Desarrollador Backend especializado en Java y Quarkus",
            description: "Soy un desarrollador backend apasionado por crear arquitecturas robustas y escalables. Actualmente trabajo en Tata Consultancy Services, donde desarrollo soluciones empresariales utilizando las últimas tecnologías del ecosistema Java. Anteriormente trabajé en Baufest, donde adquirí experiencia en desarrollo Java empresarial y metodologías ágiles.",
            experience: "Mi experiencia se centra en Java, Spring Framework, Quarkus y desarrollo de microservicios cloud-native. Me especializo en crear APIs RESTful de alto rendimiento, implementar patrones de arquitectura empresarial y optimizar aplicaciones para entornos containerizados.",
            collaboration: "Además de mi trabajo principal, colaboro activamente en proyectos como Sysarp y Skyblue, donde aplico metodologías ágiles y las mejores prácticas de DevOps. También comparto mi conocimiento creando contenido educativo en redes sociales para la comunidad de desarrolladores Java.",
            personal: "Cuando no estoy programando, me mantengo actualizado con las últimas tendencias en arquitectura de software, cloud computing y prácticas de desarrollo limpio.",
            stats: {
                experience: "Años Exp.",
                projects: "Proyectos",
                companies: "Empresas",
                specialty: "Especialidad"
            }
        },
        
        // Experience Section
        experience: {
            title: "Experiencia Profesional",
            tcs: {
                title: "Backend Developer",
                company: "Tata Consultancy Services",
                period: "2020 - Presente",
                description: "Desarrollo de aplicaciones empresariales utilizando Java, Spring Boot y Quarkus. Implementación de arquitecturas de microservicios en entornos cloud. Colaboración en proyectos de migración legacy a tecnologías modernas."
            },
            baufest: {
                title: "Java Developer",
                company: "Baufest",
                period: "2018 - 2020",
                description: "Desarrollo de aplicaciones Java empresariales utilizando Spring Framework y tecnologías web. Participación en proyectos de desarrollo full-stack y mantenimiento de sistemas legacy. Colaboración en equipos ágiles para entrega de soluciones de calidad."
            },
            sysarp: {
                title: "Full Stack Developer",
                company: "Sysarp (Colaboración)",
                period: "2022 - Presente",
                description: "Colaboración en el desarrollo de soluciones web completas. Implementación de frontend con Angular y backend con Java. Integración de sistemas y APIs de terceros."
            },
            skyblue: {
                title: "Software Developer",
                company: "Skyblue Project",
                period: "2021 - Presente",
                description: "Desarrollo y mantenimiento de la plataforma Skyblue. Implementación de nuevas funcionalidades y optimización de rendimiento. Colaboración en el diseño de la arquitectura del sistema."
            }
        },
        
        // Skills Section
        skills: {
            title: "Habilidades Técnicas",
            categories: {
                backend: "Backend Development",
                database: "Bases de Datos",
                frontend: "Frontend",
                devops: "DevOps & Cloud"
            }
        },
        
        // Projects Section
        projects: {
            title: "Proyectos Destacados",
            sysarp: {
                title: "Sysarp Platform",
                type: "Aplicación Empresarial",
                description: "Plataforma integral de gestión empresarial desarrollada con Spring Boot y Angular. Incluye módulos de CRM, inventario y reportes en tiempo real.",
                link: "Ver Proyecto"
            },
            skyblue: {
                title: "Skyblue Platform",
                type: "Aplicación Cloud",
                description: "Sistema web completo desplegado en Heroku. Desarrollo de backend con Java y frontend interactivo. Arquitectura escalable y responsive.",
                link: "Ver Demo"
            },
            quarkus: {
                title: "Quarkus Microservices",
                type: "Arquitectura de Microservicios",
                description: "Suite de microservicios desarrollados con Quarkus para alta performance. Implementación de patrones cloud-native con container-first approach.",
                link: "Ver Código"
            },
            spring: {
                title: "Spring Data JPA Projects",
                type: "CRUD Applications",
                description: "Colección de proyectos CRUD utilizando Spring Data JPA, Hibernate ORM con Panache, y diferentes patrones de repositorio para optimizar el acceso a datos.",
                link: "Repositorios"
            }
        },
        
        // Contact Section
        contact: {
            title: "¡Conectemos!",
            subtitle: "¿Tienes un proyecto backend desafiante? ¿Quieres colaborar en Java o Quarkus? ¡Me encantaría conversar contigo!",
            info: {
                email: "Email",
                location: "Ubicación",
                availability: "Disponibilidad"
            },
            location: "Lima, Perú",
            availability: "Proyectos & Colaboraciones"
        },
        
        // UI Elements
        ui: {
            theme: {
                light: "Tema claro",
                dark: "Tema oscuro",
                toggle: "Cambiar tema"
            },
            language: {
                es: "Español",
                en: "English",
                toggle: "Cambiar idioma"
            },
            loading: "Cargando...",
            backToTop: "Volver arriba",
            skipToContent: "Saltar al contenido"
        }
    },
    
    en: {
        // Navigation
        nav: {
            home: "Home",
            about: "About",
            experience: "Experience",
            skills: "Skills",
            projects: "Projects",
            contact: "Contact"
        },
        
        // Hero Section
        hero: {
            title: "Carlos Orbegoso",
            role: "Backend Developer & Java Specialist",
            company: "@ Tata Consultancy Services",
            cta: {
                primary: "Learn More",
                secondary: "Let's Talk"
            }
        },
        
        // About Section
        about: {
            title: "About Me",
            subtitle: "Backend Developer specialized in Java and Quarkus",
            description: "I'm a passionate backend developer focused on creating robust and scalable architectures. Currently working at Tata Consultancy Services, where I develop enterprise solutions using the latest Java ecosystem technologies. Previously, I worked at Baufest, where I gained experience in enterprise Java development and agile methodologies.",
            experience: "My experience focuses on Java, Spring Framework, Quarkus, and cloud-native microservices development. I specialize in creating high-performance RESTful APIs, implementing enterprise architecture patterns, and optimizing applications for containerized environments.",
            collaboration: "Besides my main work, I actively collaborate on projects like Sysarp and Skyblue, where I apply agile methodologies and DevOps best practices. I also share my knowledge by creating educational content on social media for the Java developer community.",
            personal: "When I'm not programming, I keep up to date with the latest trends in software architecture, cloud computing, and clean development practices.",
            stats: {
                experience: "Years Exp.",
                projects: "Projects",
                companies: "Companies",
                specialty: "Specialty"
            }
        },
        
        // Experience Section
        experience: {
            title: "Professional Experience",
            tcs: {
                title: "Backend Developer",
                company: "Tata Consultancy Services",
                period: "2020 - Present",
                description: "Development of enterprise applications using Java, Spring Boot, and Quarkus. Implementation of microservices architectures in cloud environments. Collaboration on legacy migration projects to modern technologies."
            },
            baufest: {
                title: "Java Developer",
                company: "Baufest",
                period: "2018 - 2020",
                description: "Development of enterprise Java applications using Spring Framework and web technologies. Participation in full-stack development projects and legacy system maintenance. Collaboration in agile teams for quality solution delivery."
            },
            sysarp: {
                title: "Full Stack Developer",
                company: "Sysarp (Collaboration)",
                period: "2022 - Present",
                description: "Collaboration in complete web solution development. Implementation of Angular frontend and Java backend. Integration of third-party systems and APIs."
            },
            skyblue: {
                title: "Software Developer",
                company: "Skyblue Project",
                period: "2021 - Present",
                description: "Development and maintenance of the Skyblue platform. Implementation of new features and performance optimization. Collaboration in system architecture design."
            }
        },
        
        // Skills Section
        skills: {
            title: "Technical Skills",
            categories: {
                backend: "Backend Development",
                database: "Databases",
                frontend: "Frontend",
                devops: "DevOps & Cloud"
            }
        },
        
        // Projects Section
        projects: {
            title: "Featured Projects",
            sysarp: {
                title: "Sysarp Platform",
                type: "Enterprise Application",
                description: "Comprehensive business management platform developed with Spring Boot and Angular. Includes CRM modules, inventory, and real-time reports.",
                link: "View Project"
            },
            skyblue: {
                title: "Skyblue Platform",
                type: "Cloud Application",
                description: "Complete web system deployed on Heroku. Java backend development and interactive frontend. Scalable and responsive architecture.",
                link: "View Demo"
            },
            quarkus: {
                title: "Quarkus Microservices",
                type: "Microservices Architecture",
                description: "Suite of microservices developed with Quarkus for high performance. Implementation of cloud-native patterns with container-first approach.",
                link: "View Code"
            },
            spring: {
                title: "Spring Data JPA Projects",
                type: "CRUD Applications",
                description: "Collection of CRUD projects using Spring Data JPA, Hibernate ORM with Panache, and different repository patterns to optimize data access.",
                link: "Repositories"
            }
        },
        
        // Contact Section
        contact: {
            title: "Let's Connect!",
            subtitle: "Do you have a challenging backend project? Want to collaborate on Java or Quarkus? I'd love to talk with you!",
            info: {
                email: "Email",
                location: "Location",
                availability: "Availability"
            },
            location: "Lima, Peru",
            availability: "Projects & Collaborations"
        },
        
        // UI Elements
        ui: {
            theme: {
                light: "Light theme",
                dark: "Dark theme",
                toggle: "Change theme"
            },
            language: {
                es: "Español",
                en: "English",
                toggle: "Change language"
            },
            loading: "Loading...",
            backToTop: "Back to top",
            skipToContent: "Skip to content"
        }
    }
};

export default translations;
