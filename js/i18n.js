// ===== SISTEMA DE INTERNACIONALIZACIÓN =====

import translations from './translations.js';

class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || this.detectLanguage();
        this.translations = translations;
        this.init();
    }

    // Detectar idioma del navegador
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('es') ? 'es' : 'en';
    }

    // Inicializar el sistema
    init() {
        this.setLanguage(this.currentLanguage);
        this.updateContent();
        this.updateNavigation();
    }

    // Cambiar idioma
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not supported`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-language', lang);
        
        // Actualizar icono del botón de idioma
        this.updateLanguageButton();
    }

    // Obtener traducción
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }
        
        return value;
    }

    // Actualizar todo el contenido
    updateContent() {
        // Hero Section
        this.updateElement('.hero h1', this.t('hero.title'));
        this.updateElement('.hero .role', this.t('hero.role'));
        this.updateElement('.hero .company', this.t('hero.company'));
        this.updateElement('.cta-primary', this.t('hero.cta.primary'));
        this.updateElement('.cta-secondary', this.t('hero.cta.secondary'));

        // About Section
        this.updateElement('#about .section-title', this.t('about.title'));
        this.updateElement('.about-text h3', this.t('about.subtitle'));
        this.updateElement('.about-text p:nth-of-type(1)', this.t('about.description'));
        this.updateElement('.about-text p:nth-of-type(2)', this.t('about.experience'));
        this.updateElement('.about-text p:nth-of-type(3)', this.t('about.collaboration'));
        this.updateElement('.about-text p:nth-of-type(4)', this.t('about.personal'));
        
        // Stats
        this.updateElement('.stat-item:nth-child(1) .stat-label', this.t('about.stats.experience'));
        this.updateElement('.stat-item:nth-child(2) .stat-label', this.t('about.stats.projects'));
        this.updateElement('.stat-item:nth-child(3) .stat-label', this.t('about.stats.companies'));
        this.updateElement('.stat-item:nth-child(4) .stat-label', this.t('about.stats.specialty'));

        // Experience Section
        this.updateElement('#experience .section-title', this.t('experience.title'));
        
        // Skills Section
        this.updateElement('#skills .section-title', this.t('skills.title'));
        this.updateElement('.skill-category:nth-child(1) .category-title', this.t('skills.categories.backend'));
        this.updateElement('.skill-category:nth-child(2) .category-title', this.t('skills.categories.database'));
        this.updateElement('.skill-category:nth-child(3) .category-title', this.t('skills.categories.frontend'));
        this.updateElement('.skill-category:nth-child(4) .category-title', this.t('skills.categories.devops'));

        // Projects Section
        this.updateElement('#projects .section-title', this.t('projects.title'));
        
        // Contact Section
        this.updateElement('#contact .section-title', this.t('contact.title'));
        this.updateElement('#contact p', this.t('contact.subtitle'));
        this.updateElement('.contact-item:nth-child(1) h3', this.t('contact.info.email'));
        this.updateElement('.contact-item:nth-child(2) h3', this.t('contact.info.location'));
        this.updateElement('.contact-item:nth-child(3) h3', this.t('contact.info.availability'));
        this.updateElement('.contact-item:nth-child(2) p', this.t('contact.location'));
        this.updateElement('.contact-item:nth-child(3) p', this.t('contact.availability'));
    }

    // Actualizar navegación
    updateNavigation() {
        const navItems = document.querySelectorAll('.nav-links a');
        const navKeys = ['nav.home', 'nav.about', 'nav.experience', 'nav.skills', 'nav.projects', 'nav.contact'];
        
        navItems.forEach((item, index) => {
            if (navKeys[index]) {
                item.textContent = this.t(navKeys[index]);
            }
        });
    }

    // Actualizar elemento específico
    updateElement(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    // Actualizar botón de idioma
    updateLanguageButton() {
        const languageButton = document.getElementById('languageToggle');
        if (languageButton) {
            const icon = languageButton.querySelector('i');
            const nextLang = this.currentLanguage === 'es' ? 'en' : 'es';
            
            if (icon) {
                icon.textContent = nextLang.toUpperCase();
            }
            
            languageButton.title = this.t('ui.language.toggle');
        }
    }

    // Cambiar al siguiente idioma
    toggleLanguage() {
        const newLang = this.currentLanguage === 'es' ? 'en' : 'es';
        this.setLanguage(newLang);
        this.updateContent();
        this.updateNavigation();
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: newLang } 
        }));
    }

    // Obtener idioma actual
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Verificar si es español
    isSpanish() {
        return this.currentLanguage === 'es';
    }

    // Verificar si es inglés
    isEnglish() {
        return this.currentLanguage === 'en';
    }
}

// Crear instancia global
const i18n = new I18n();

export default i18n;
