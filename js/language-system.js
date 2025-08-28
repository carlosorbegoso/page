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
        try {
            console.log('🚀 Inicializando LanguageSystem...');
            
            // Obtener idioma guardado o usar inglés por defecto
            this.currentLanguage = localStorage.getItem('language') || 'en';
            console.log('🌍 Idioma inicial:', this.currentLanguage);
            
            // Aplicar idioma inicial
            this.applyLanguage(this.currentLanguage);
            console.log('✅ Idioma aplicado');
            
            // Configurar botón de cambio de idioma
            this.setupLanguageToggle();
            console.log('✅ Botón de idioma configurado');
            
            // Actualizar icono del botón
            this.updateLanguageIcon();
            console.log('✅ Icono actualizado');
            
            console.log(`✅ LanguageSystem inicializado en: ${this.currentLanguage}`);
        } catch (error) {
            console.error('❌ Error inicializando LanguageSystem:', error);
        }
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
        console.log('🔄 Iniciando cambio de idioma a:', language);
        this.currentLanguage = language;
        localStorage.setItem('language', language);
        
        console.log('💾 Idioma guardado en localStorage');
        
        // Aplicar nuevo idioma
        this.applyLanguage(language);
        console.log('✅ Idioma aplicado');
        
        // Forzar visibilidad de elementos traducidos
        this.forceVisibility();
        console.log('✅ Visibilidad forzada');
        
        // Verificar que las traducciones se aplicaron
        this.verifyTranslations();
        console.log('✅ Verificación completada');
        
        // Actualizar icono
        this.updateLanguageIcon();
        console.log('✅ Icono actualizado');
        
        // Disparar evento de cambio de idioma
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language } 
        }));
        console.log('📡 Evento languageChanged disparado');
        
        // Mostrar notificación
        const languageName = language === 'en' ? 'English' : 'Español';
        if (window.showNotification) {
            window.showNotification(`Idioma cambiado a ${languageName}`, 'success');
        }
        
        console.log('🎉 Cambio de idioma completado!');
    }
    
    applyLanguage(language) {
        console.log('🌍 Aplicando idioma:', language);
        const translations = this.translations[language];
        if (!translations) {
            console.error('❌ No se encontraron traducciones para:', language);
            return;
        }
        
        console.log('📚 Traducciones encontradas:', Object.keys(translations).length);
        console.log('🔍 Ejemplo de traducciones:', {
            'nav-home': translations['nav-home'],
            'hero-title': translations['hero-title'],
            'about-title': translations['about-title']
        });
        
        // Aplicar traducciones a elementos con data-i18n
        const i18nElements = document.querySelectorAll('[data-i18n]');
        console.log('🔍 Elementos con data-i18n encontrados:', i18nElements.length);
        
        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
                console.log(`✅ Traducido: ${key} -> ${translations[key]}`);
            }
        });
        
        // Aplicar traducciones específicas
        console.log('🎯 Aplicando traducciones específicas...');
        this.translateSpecificElements(translations);
        console.log('✅ Traducciones específicas aplicadas');
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
        this.translateElement('.hero h1', translations['hero-title']);
        this.translateElement('.hero .role', translations['hero-role']);
        this.translateElement('.hero .company', translations['hero-company']);
        this.translateElement('.hero-buttons .btn-primary', translations['hero-know-more']);
        this.translateElement('.hero-buttons .btn-secondary', translations['hero-lets-talk']);
        
        // About Section
        this.translateElement('#about .section-title', translations['about-title']);
        this.translateElement('.about-text h3', translations['about-subtitle']);
        this.translateElement('.about-text p:nth-child(2)', translations['about-description']);
        this.translateElement('.about-text p:nth-child(3)', translations['about-description-2']);
        this.translateElement('.about-text p:nth-child(4)', translations['about-description-3']);
        this.translateElement('.stat-item:nth-child(1) .stat-label', translations['years-experience']);
        this.translateElement('.stat-item:nth-child(2) .stat-label', translations['projects-completed']);
        this.translateElement('.stat-item:nth-child(3) .stat-label', translations['technologies-mastered']);
        this.translateElement('.stat-item:nth-child(4) .stat-label', translations['client-satisfaction']);
        
        // Experience Section
        this.translateElement('#experience .section-title', translations['experience-title']);
        this.translateElement('.timeline-item:nth-child(1) .job-title', translations['backend-developer']);
        this.translateElement('.timeline-item:nth-child(2) .job-title', translations['java-developer']);
        this.translateElement('.timeline-item:nth-child(3) .job-title', translations['full-stack-developer']);
        // Traducir períodos de trabajo manualmente
        this.translateWorkPeriods(translations['present']);
        this.translateElement('.timeline-item:nth-child(1) p', translations['experience-description-1']);
        this.translateElement('.timeline-item:nth-child(2) p', translations['experience-description-2']);
        this.translateElement('.timeline-item:nth-child(3) p', translations['experience-description-3']);
        
        // Skills Section
        this.translateElement('#skills .section-title', translations['skills-title']);
        this.translateElement('.skill-category:nth-child(1) .category-title', translations['programming-languages']);
        this.translateElement('.skill-category:nth-child(2) .category-title', translations['frameworks-libraries']);
        this.translateElement('.skill-category:nth-child(3) .category-title', translations['tools-devops']);
        this.translateElement('.skill-category:nth-child(4) .category-title', translations['databases']);
        
        // Projects Section
        console.log('🚀 Traduciendo projects section...');
        this.translateElement('#projects .section-title', translations['projects-title']);
        this.translateElement('.project-card:nth-child(1) .project-title', translations['trading-system']);
        this.translateElement('.project-card:nth-child(2) .project-title', translations['ecommerce-microservices']);
        this.translateElement('.project-card:nth-child(3) .project-title', translations['hospital-management']);
        this.translateElement('.project-card:nth-child(1) .project-type', translations['project-type-backend']);
        this.translateElement('.project-card:nth-child(2) .project-type', translations['project-type-fullstack']);
        this.translateElement('.project-card:nth-child(3) .project-type', translations['project-type-quarkus']);
        
        // Corregir selectores para las descripciones de proyectos
        this.translateElement('.project-card:nth-child(1) .project-content p', translations['project-description-1']);
        this.translateElement('.project-card:nth-child(2) .project-content p', translations['project-description-2']);
        this.translateElement('.project-card:nth-child(3) .project-content p', translations['project-description-3']);
        
        // Contact Section
        this.translateElement('#contact .section-title', translations['contact-title']);
        this.translateElement('#contact p', translations['contact-description']);
        this.translateElement('.contact-item:nth-child(1) h4', translations['email']);
        this.translateElement('.contact-item:nth-child(2) h4', translations['linkedin']);
        this.translateElement('.contact-item:nth-child(3) h4', translations['github']);
        
        // Footer
        this.translateElement('.footer p', translations['footer-copyright']);
    }
    
    // Método para traducir períodos de trabajo
    translateWorkPeriods(translatedText) {
        const periodElements = document.querySelectorAll('.job-period');
        periodElements.forEach(element => {
            if (element.textContent.includes('Present')) {
                element.textContent = element.textContent.replace('Present', translatedText);
            }
        });
    }
    
    translateElement(selector, text) {
        try {
            const element = document.querySelector(selector);
            if (element && text) {
                console.log(`🔄 Traduciendo: ${selector} -> "${text}"`);
                console.log(`📍 Elemento encontrado:`, element);
                console.log(`📝 Texto anterior: "${element.textContent}"`);
                
                // Traducir el texto
                element.textContent = text;
                
                // Verificar si el elemento tiene fade-in y asegurar que sea visible
                if (element.classList.contains('fade-in')) {
                    console.log(`👁️ Elemento con fade-in detectado, asegurando visibilidad`);
                    element.classList.add('visible');
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                
                console.log(`✅ Traducido exitosamente: ${selector}`);
                console.log(`📝 Texto nuevo: "${element.textContent}"`);
                console.log(`👁️ Estado de visibilidad:`, {
                    'fade-in': element.classList.contains('fade-in'),
                    'visible': element.classList.contains('visible'),
                    'opacity': element.style.opacity,
                    'transform': element.style.transform
                });
            } else {
                if (!element) {
                    console.warn(`⚠️ Elemento no encontrado: ${selector}`);
                    // Buscar elementos similares para debug
                    const similarElements = document.querySelectorAll(selector.split(' ')[0]);
                    if (similarElements.length > 0) {
                        console.log(`🔍 Elementos similares encontrados:`, similarElements);
                    }
                }
                if (!text) {
                    console.warn(`⚠️ Texto de traducción vacío para: ${selector}`);
                }
            }
        } catch (error) {
            console.error(`❌ Error traduciendo selector: ${selector}`, error);
        }
    }
    
    updateLanguageIcon() {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            const icon = languageToggle.querySelector('i');
            if (icon) {
                icon.className = this.currentLanguage === 'en' ? 'fas fa-globe-americas' : 'fas fa-globe';
            }
        }
    }
    
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getTranslation(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
    
    // Método para forzar visibilidad de elementos traducidos
    forceVisibility() {
        console.log('👁️ Forzando visibilidad de elementos traducidos...');
        
        // Buscar todos los elementos con fade-in que han sido traducidos
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            if (element.textContent && element.textContent.trim() !== '') {
                console.log(`👁️ Forzando visibilidad de:`, element);
                element.classList.add('visible');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        console.log('✅ Visibilidad forzada completada');
    }
    
    // Método para verificar que las traducciones se aplicaron correctamente
    verifyTranslations() {
        console.log('🔍 Verificando traducciones aplicadas...');
        
        // Verificar navegación
        const navHome = document.querySelector('a[href="#hero"]');
        const navAbout = document.querySelector('a[href="#about"]');
        const navExperience = document.querySelector('a[href="#experience"]');
        
        console.log('🧭 Navegación:', {
            'Home/Inicio': navHome?.textContent,
            'About/Sobre mí': navAbout?.textContent,
            'Experience/Experiencia': navExperience?.textContent
        });
        
        // Verificar hero section
        const heroTitle = document.querySelector('.hero h1');
        const heroRole = document.querySelector('.hero .role');
        
        console.log('🌟 Hero Section:', {
            'Título': heroTitle?.textContent,
            'Rol': heroRole?.textContent
        });
        
        // Verificar about section
        const aboutTitle = document.querySelector('#about .section-title');
        const aboutSubtitle = document.querySelector('.about-text h3');
        
        console.log('👤 About Section:', {
            'Título': aboutTitle?.textContent,
            'Subtítulo': aboutSubtitle?.textContent
        });
        
        // Verificar experience section
        const expTitle = document.querySelector('#experience .section-title');
        const jobTitle1 = document.querySelector('.timeline-item:nth-child(1) .job-title');
        
        console.log('💼 Experience Section:', {
            'Título': expTitle?.textContent,
            'Job 1': jobTitle1?.textContent
        });
        
        // Verificar projects section
        const projTitle = document.querySelector('#projects .section-title');
        const proj1Title = document.querySelector('.project-card:nth-child(1) .project-title');
        
        console.log('🚀 Projects Section:', {
            'Título': projTitle?.textContent,
            'Proyecto 1': proj1Title?.textContent
        });
        
        console.log('✅ Verificación de traducciones completada');
    }
}

// Exportar para uso global
export default LanguageSystem;
