// ===== SISTEMA DE IDIOMAS FUNCIONAL =====

class LanguageSystem {
    constructor() {
        this.currentLanguage = 'en'; // Por defecto en inglés
        this.translations = {
            en: {
                // Header
                'nav-home': 'Home',
                'nav-about': 'About',
                'nav-experience': 'Experience',
                'nav-skills': 'Skills',
                'nav-projects': 'Projects',
                'nav-contact': 'Contact',
                
                // Hero Section
                'hero-title': 'Carlos Orbegoso',
                'hero-role': 'Backend Developer & Java Specialist',
                'hero-company': '@ Tata Consultancy Services',
                'hero-know-more': 'Learn More',
                'hero-lets-talk': 'Let\'s Talk',
                
                // About Section
                'about-title': 'About Me',
                'about-subtitle': 'Backend Developer Specialized',
                'about-description': 'I am a backend developer with more than 5 years of experience in developing robust and scalable enterprise applications. My passion for Java and modern technologies has led me to specialize in Spring Boot, Quarkus and microservice architectures.',
                'about-description-2': 'I have worked on high-complexity projects for leading companies like Tata Consultancy Services, where I have developed solutions that handle millions of daily transactions. My experience includes implementing design patterns, automated testing and deployment in cloud environments.',
                'about-description-3': 'I constantly keep myself updated with the latest trends in backend development, participating in technical conferences and contributing to open source projects. My goal is to create clean, maintainable code that generates real value for end users.',
                'years-experience': 'Years of Experience',
                'projects-completed': 'Projects Completed',
                'technologies-mastered': 'Technologies Mastered',
                'client-satisfaction': 'Client Satisfaction',
                
                // Experience Section
                'experience-title': 'Professional Experience',
                'backend-developer': 'Backend Developer',
                'java-developer': 'Java Developer',
                'full-stack-developer': 'Full Stack Developer',
                'present': 'Present',
                'experience-description-1': 'Development of enterprise applications using Java, Spring Boot and Quarkus. Implementation of microservice architectures in cloud environments. Collaboration in legacy migration projects to modern technologies.',
                'experience-description-2': 'Development of Java enterprise applications using Spring Framework and web technologies. Participation in full-stack development projects and legacy system maintenance. Collaboration in agile teams for quality solution delivery.',
                'experience-description-3': 'Collaboration in the development of complete web solutions. Frontend implementation with Angular and backend with Java. Integration of third-party systems and APIs.',
                
                // Skills Section
                'skills-title': 'Technical Skills',
                'programming-languages': 'Programming Languages',
                'frameworks-libraries': 'Frameworks & Libraries',
                'tools-devops': 'Tools & DevOps',
                'databases': 'Databases',
                
                // Projects Section
                'projects-title': 'Featured Projects',
                'trading-system': 'Automated Trading System',
                'ecommerce-microservices': 'E-commerce Microservices',
                'hospital-management': 'Hospital Management System',
                'project-type-backend': 'Backend - Java',
                'project-type-fullstack': 'Full Stack - Java + Angular',
                'project-type-quarkus': 'Backend - Quarkus',
                'project-description-1': 'Development of an automated trading system using Java, Spring Boot and machine learning algorithms. Integration with exchange APIs and real-time data analysis.',
                'project-description-2': 'Microservice architecture for e-commerce platform. Implementation of user, catalog, cart and payment services with Spring Boot and Angular.',
                'project-description-3': 'Comprehensive hospital management system with Quarkus. Patient, doctor, appointment and pharmacy modules. REST API with OpenAPI documentation and automated testing.',
                
                // Contact Section
                'contact-title': 'Let\'s Connect!',
                'contact-description': 'Do you have a challenging backend project? Want to collaborate on Java or Quarkus? I\'d love to talk to you!',
                'email': 'Email',
                'linkedin': 'LinkedIn',
                'github': 'GitHub',
                
                // Footer
                'footer-copyright': '© 2024 Carlos Orbegoso. All rights reserved.',
                
                // Notifications
                'theme-changed-light': 'Theme changed to light',
                'theme-changed-dark': 'Theme changed to dark',
                'navigating-to': 'Navigating to',
                'effects-unavailable': 'Some visual effects are not available'
            },
            es: {
                // Header
                'nav-home': 'Inicio',
                'nav-about': 'Sobre mí',
                'nav-experience': 'Experiencia',
                'nav-skills': 'Habilidades',
                'nav-projects': 'Proyectos',
                'nav-contact': 'Contacto',
                
                // Hero Section
                'hero-title': 'Carlos Orbegoso',
                'hero-role': 'Backend Developer & Java Specialist',
                'hero-company': '@ Tata Consultancy Services',
                'hero-know-more': 'Conoce más',
                'hero-lets-talk': 'Hablemos',
                
                // About Section
                'about-title': 'Sobre mí',
                'about-subtitle': 'Desarrollador Backend Especializado',
                'about-description': 'Soy un desarrollador backend con más de 5 años de experiencia en el desarrollo de aplicaciones empresariales robustas y escalables. Mi pasión por Java y las tecnologías modernas me ha llevado a especializarme en Spring Boot, Quarkus y arquitecturas de microservicios.',
                'about-description-2': 'He trabajado en proyectos de alta complejidad para empresas líderes como Tata Consultancy Services, donde he desarrollado soluciones que manejan millones de transacciones diarias. Mi experiencia incluye la implementación de patrones de diseño, testing automatizado y despliegue en entornos cloud.',
                'about-description-3': 'Me mantengo constantemente actualizado con las últimas tendencias en desarrollo backend, participando en conferencias técnicas y contribuyendo a proyectos open source. Mi objetivo es crear código limpio, mantenible y que genere valor real para los usuarios finales.',
                'years-experience': 'Años de Experiencia',
                'projects-completed': 'Proyectos Completados',
                'technologies-mastered': 'Tecnologías Dominadas',
                'client-satisfaction': '% Satisfacción Cliente',
                
                // Experience Section
                'experience-title': 'Experiencia Profesional',
                'backend-developer': 'Backend Developer',
                'java-developer': 'Java Developer',
                'full-stack-developer': 'Full Stack Developer',
                'present': 'Presente',
                'experience-description-1': 'Desarrollo de aplicaciones empresariales utilizando Java, Spring Boot y Quarkus. Implementación de arquitecturas de microservicios en entornos cloud. Colaboración en proyectos de migración legacy a tecnologías modernas.',
                'experience-description-2': 'Desarrollo de aplicaciones Java empresariales utilizando Spring Framework y tecnologías web. Participación en proyectos de desarrollo full-stack y mantenimiento de sistemas legacy. Colaboración en equipos ágiles para entrega de soluciones de calidad.',
                'experience-description-3': 'Colaboración en el desarrollo de soluciones web completas. Implementación de frontend con Angular y backend con Java. Integración de sistemas y APIs de terceros.',
                
                // Skills Section
                'skills-title': 'Habilidades Técnicas',
                'programming-languages': 'Lenguajes de Programación',
                'frameworks-libraries': 'Frameworks & Librerías',
                'tools-devops': 'Herramientas & DevOps',
                'databases': 'Bases de Datos',
                
                // Projects Section
                'projects-title': 'Proyectos Destacados',
                'trading-system': 'Sistema de Trading Automatizado',
                'ecommerce-microservices': 'E-commerce Microservicios',
                'hospital-management': 'Sistema de Gestión Hospitalaria',
                'project-type-backend': 'Backend - Java',
                'project-type-fullstack': 'Full Stack - Java + Angular',
                'project-type-quarkus': 'Backend - Quarkus',
                'project-description-1': 'Desarrollo de un sistema de trading automatizado utilizando Java, Spring Boot y algoritmos de machine learning. Integración con APIs de exchanges y análisis de datos en tiempo real.',
                'project-description-2': 'Arquitectura de microservicios para plataforma de e-commerce. Implementación de servicios de usuario, catálogo, carrito y pagos con Spring Boot y Angular.',
                'project-description-3': 'Sistema integral de gestión hospitalaria con Quarkus. Módulos de pacientes, médicos, citas y farmacia. API REST con documentación OpenAPI y testing automatizado.',
                
                // Contact Section
                'contact-title': '¡Conectemos!',
                'contact-description': '¿Tienes un proyecto backend desafiante? ¿Quieres colaborar en Java o Quarkus? ¡Me encantaría conversar contigo!',
                'email': 'Email',
                'linkedin': 'LinkedIn',
                'github': 'GitHub',
                
                // Footer
                'footer-copyright': '© 2024 Carlos Orbegoso. Todos los derechos reservados.',
                
                // Notifications
                'theme-changed-light': 'Tema cambiado a claro',
                'theme-changed-dark': 'Tema cambiado a oscuro',
                'navigating-to': 'Navegando a',
                'effects-unavailable': 'Algunos efectos visuales no están disponibles'
            }
        };
        
        this.init();
    }
    
    init() {
        // Verificar estado del DOM
        const domState = {
            readyState: document.readyState,
            bodyExists: !!document.body,
            navExists: !!document.querySelector('a[href="#hero"]'),
            projectsExists: !!document.querySelector('#projects .section-title')
        };
        
        // Configurar idioma inicial
        this.currentLanguage = localStorage.getItem('portfolio-language') || 'en';
        
        // Aplicar idioma inicial
        this.applyLanguage(this.currentLanguage);
        
        // Configurar botón de idioma
        this.setupLanguageToggle();
        
        // Actualizar icono
        this.updateLanguageIcon();
        
        // Configurar sistema de persistencia
        this.setupTranslationPersistence();
    }
    
    setupLanguageToggle() {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }
    
    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
        this.changeLanguage(newLanguage);
    }
    
    changeLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('portfolio-language', language);
        
        this.applyLanguage(language);
        this.forceVisibility();
        this.verifyTranslations();
        this.updateLanguageIcon();
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));
        
        // Mostrar notificación
        this.showNotification(`Idioma cambiado a ${language === 'es' ? 'Español' : 'English'}`);
    }
    
    applyLanguage(language) {
        const translations = this.translations[language];
        if (!translations) {
            return;
        }
        
        // Aplicar traducciones específicas
        this.translateSpecificElements(translations);
    }
    
    translateSpecificElements(translations) {
        // Navegación
        this.translateElement('a[href="#hero"]', translations['nav-home']);
        this.translateElement('a[href="#about"]', translations['nav-about']);
        this.translateElement('a[href="#experience"]', translations['nav-experience']);
        this.translateElement('a[href="#skills"]', translations['nav-skills']);
        this.translateElement('a[href="#projects"]', translations['nav-projects']);
        this.translateElement('a[href="#contact"]', translations['nav-contact']);
        
        // Hero Section
        this.translateElement('.hero-title', translations['hero-title']);
        this.translateElement('.hero-subtitle', translations['hero-subtitle']);
        this.translateElement('.hero-description', translations['hero-description']);
        this.translateElement('.hero-cta-primary', translations['hero-cta-primary']);
        this.translateElement('.hero-cta-secondary', translations['hero-cta-secondary']);
        
        // About Section
        this.translateElement('#about .section-title', translations['about-title']);
        this.translateElement('#about .section-description', translations['about-description']);
        
        // Experience Section
        this.translateElement('#experience .section-title', translations['experience-title']);
        this.translateElement('#experience .section-description', translations['experience-description']);
        
        // Skills Section
        this.translateElement('#skills .section-title', translations['skills-title']);
        this.translateElement('#skills .section-description', translations['skills-description']);
        
        // Projects Section
        this.translateElement('#projects .section-title', translations['projects-title']);
        this.translateElement('#projects .section-description', translations['projects-description']);
        this.translateElement('.project-card:nth-child(1) .project-title', translations['trading-system']);
        this.translateElement('.project-card:nth-child(1) .project-content p', translations['trading-description']);
        this.translateElement('.project-card:nth-child(2) .project-title', translations['ecommerce-system']);
        this.translateElement('.project-card:nth-child(2) .project-content p', translations['ecommerce-description']);
        this.translateElement('.project-card:nth-child(3) .project-title', translations['api-gateway']);
        this.translateElement('.project-card:nth-child(3) .project-content p', translations['api-description']);
        
        // Contact Section
        this.translateElement('#contact .section-title', translations['contact-title']);
        this.translateElement('#contact .section-description', translations['contact-description']);
        this.translateElement('.contact-item:nth-child(1) .contact-label', translations['contact-email']);
        this.translateElement('.contact-item:nth-child(2) .contact-label', translations['contact-phone']);
        this.translateElement('.contact-item:nth-child(3) .contact-label', translations['contact-location']);
        
        // Footer
        this.translateElement('footer .footer-text', translations['footer-text']);
        
        // Traducir períodos de trabajo
        this.translateWorkPeriods(translations['present']);
    }
    
    translateWorkPeriods(translatedText) {
        document.querySelectorAll('.job-period').forEach(element => {
            if (element.textContent.includes('Present')) {
                element.textContent = element.textContent.replace('Present', translatedText);
            }
        });
    }
    
    translateElement(selector, text) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = text;
                element.setAttribute('data-translated', 'true');
                
                // Si el elemento tiene clase fade-in, asegurar visibilidad
                if (element.classList.contains('fade-in')) {
                    element.classList.add('visible');
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            }
        } catch (error) {
            // Silenciar errores de traducción
        }
    }
    
    updateLanguageIcon() {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.innerHTML = this.currentLanguage === 'en' ? '🇪🇸' : '🇺🇸';
        }
    }
    
    forceVisibility() {
        document.querySelectorAll('.fade-in').forEach(element => {
            if (element.textContent && element.textContent.trim() !== '') {
                element.classList.add('visible');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    verifyTranslations() {
        // Verificación silenciosa de traducciones
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // ===== SISTEMA DE PERSISTENCIA DE TRADUCCIONES =====
    setupTranslationPersistence() {
        // Ejecutar traducciones después de que todo esté cargado
        if (document.readyState === 'complete') {
            this.scheduleTranslationCheck();
        } else {
            window.addEventListener('load', () => {
                this.scheduleTranslationCheck();
            });
        }
        
        // Verificar traducciones cada 2 segundos durante los primeros 10 segundos
        let checkCount = 0;
        const maxChecks = 5;
        const checkInterval = setInterval(() => {
            checkCount++;
            if (checkCount >= maxChecks) {
                clearInterval(checkInterval);
            } else {
                this.verifyAndRestoreTranslations();
            }
        }, 2000);
    }
    
    scheduleTranslationCheck() {
        // Esperar un poco más para que todos los scripts se ejecuten
        setTimeout(() => {
            this.verifyAndRestoreTranslations();
        }, 1000);
    }
    
    verifyAndRestoreTranslations() {
        if (this.currentLanguage === 'en') return;
        
        const translations = this.translations[this.currentLanguage];
        
        // Verificar elementos clave
        const keyElements = [
            { selector: 'a[href="#hero"]', expected: translations['nav-home'] },
            { selector: '#projects .section-title', expected: translations['projects-title'] },
            { selector: '.project-card:nth-child(1) .project-title', expected: translations['trading-system'] }
        ];
        
        let restoredCount = 0;
        keyElements.forEach(({ selector, expected }) => {
            const element = document.querySelector(selector);
            if (element && element.textContent !== expected) {
                element.textContent = expected;
                element.setAttribute('data-translated', 'true');
                restoredCount++;
            }
        });
    }
    
    showNotification(message) {
        // Crear notificación simple
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Exportar para uso global
export default LanguageSystem;