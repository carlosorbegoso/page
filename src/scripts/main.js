/* ===== ARCHIVO PRINCIPAL DEL PORTFOLIO - REORGANIZADO Y LIMPIO ===== */

import { CONFIG, FEATURES, DEBUG } from './config/config.js';
import { log, initLogger } from './utils/logger.js';
import { DOM, Events, Performance } from './utils/helpers.js';
import VisualEffectsEngine from './engines/visual-effects-engine.js';
import { componentLoader } from './utils/component-loader.js';
import { getOrderedComponents, getConditionalComponents, getLoadingConfig } from './config/components.js';
import { DeviceDetector } from './utils/device-detector.js';
import { MobileMenuManager } from './utils/mobile-menu.js';
import { HeroAnimations } from './utils/hero-animations.js';
import { AboutAnimations } from './utils/about-animations.js';

// ===== CLASE PRINCIPAL DEL PORTFOLIO =====
class Portfolio {
    constructor() {
        this.isInitialized = false;
        this.modules = new Map();
        this.eventListeners = new Map();
        this.visualEngine = null;
        this.deviceDetector = null;
        this.mobileMenuManager = null;
        this.heroAnimations = null;
        this.aboutAnimations = null;
    }

    /**
     * Inicializa el portfolio
     */
    async init() {
        try {
            // Inicializar logger primero
            initLogger({
                appName: CONFIG.APP_NAME,
                logLevel: DEBUG.LOG_LEVEL
            });
            
            log.info('🚀 Inicializando portfolio...');
            
            // Verificar configuración
            this.validateConfiguration();
            
            // Inicializar módulos básicos
            await this.initializeBasicModules();
            
            // Configurar funcionalidades
            this.setupBasicFeatures();
            
            // Inicializar módulos avanzados
            await this.initializeAdvancedModules();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            // Marcar como inicializado
            this.isInitialized = true;
            
            log.info('✅ Portfolio inicializado correctamente');
            
        } catch (error) {
            log.error('❌ Error inicializando portfolio:', error);
            this.showFallbackMessage();
        }
    }

    /**
     * Valida la configuración del portfolio
     */
    validateConfiguration() {
        if (!CONFIG.APP_NAME || !CONFIG.VERSION) {
            throw new Error('Configuración incompleta del portfolio');
        }
        log.info(`📋 Configuración validada: ${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
    }

    /**
     * Inicializa módulos básicos
     */
    async initializeBasicModules() {
        log.info('🔧 Inicializando módulos básicos...');
        
        // Cargar componentes HTML primero
        await this.loadPageComponents();
        
        // Inicializar detector de dispositivo y header adaptativo después de cargar componentes
        this.deviceDetector = new DeviceDetector();
        log.info('📱 DeviceDetector inicializado');
        
        // Inicializar menú móvil después de cargar componentes
        this.mobileMenuManager = new MobileMenuManager();
        log.info('📱 MobileMenuManager inicializado');
        
        // Inicializar animaciones del hero después de cargar componentes
        this.heroAnimations = new HeroAnimations();
        log.info('🎭 HeroAnimations inicializado');
        
        // Inicializar animaciones del About
        this.aboutAnimations = new AboutAnimations();
        log.info('🎭 AboutAnimations inicializado');
        
        // Simular carga de otros módulos
        await this.simulateModuleLoad('StyleManager');
        await this.simulateModuleLoad('LanguageSystem');
        await this.simulateModuleLoad('ThemeManager');
    }

    /**
     * Inicializa módulos avanzados
     */
    async initializeAdvancedModules() {
        if (!FEATURES.THREE_JS) {
            log.info('⚠️ Three.js deshabilitado en configuración');
            return;
        }

        log.info('🌟 Inicializando módulos avanzados...');
        
        // Inicializar motor de efectos visuales
        try {
            this.visualEngine = new VisualEffectsEngine();
            log.info('✅ Motor de efectos visuales inicializado');
            
            // Establecer tema inicial
            const currentTheme = localStorage.getItem('theme') || CONFIG.THEMES.DEFAULT;
            this.visualEngine.updateTheme(currentTheme);
            
        } catch (error) {
            log.error('❌ Error inicializando motor visual:', error);
        }
        
        // Simular carga de otros módulos avanzados
        await this.simulateModuleLoad('UIActionsEngine');
        await this.simulateModuleLoad('NotificationSystem');
        await this.simulateModuleLoad('InteractiveParticlesSystem');
        await this.simulateModuleLoad('ScrollEffectsEngine');
    }

    /**
     * Carga los componentes de la página
     */
    async loadPageComponents() {
        try {
            log.info('📄 Cargando componentes de la página...');
            
            const loadingConfig = getLoadingConfig();
            const mainComponents = getOrderedComponents();
            const conditionalComponents = getConditionalComponents();
            
            // Cargar componentes principales
            if (loadingConfig.strategy === 'sequential') {
                for (const component of mainComponents) {
                    await componentLoader.loadComponent(component.name, component.target, component.data);
                    await this.delay(loadingConfig.delay);
                }
            } else {
                await componentLoader.loadComponents(mainComponents);
            }
            
            // Cargar componentes condicionales
            if (conditionalComponents.length > 0) {
                await componentLoader.loadComponents(conditionalComponents);
            }
            
            log.info('✅ Todos los componentes cargados correctamente');
            
        } catch (error) {
            log.error('❌ Error cargando componentes:', error);
        }
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Simula la carga de un módulo
     */
    async simulateModuleLoad(moduleName) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.modules.set(moduleName, { name: moduleName, loaded: true });
                log.info(`📦 Módulo ${moduleName} cargado`);
                resolve();
            }, 100);
        });
    }

    /**
     * Configura funcionalidades básicas
     */
    setupBasicFeatures() {
        log.info('⚙️ Configurando funcionalidades básicas...');
        
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupLanguageToggle();
        this.setupMobileOptimizations();
        this.setupTouchInteractions();
    }

    /**
     * Configura el toggle de tema
     */
    setupThemeToggle() {
        const themeToggle = DOM.select('#theme-toggle');
        if (!themeToggle) {
            log.warn('⚠️ Toggle de tema no encontrado');
            return;
        }

        // Obtener tema guardado
        const currentTheme = localStorage.getItem('theme') || CONFIG.THEMES.DEFAULT;
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);

        Events.on(themeToggle, 'click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            
            // Cambiar tema
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Actualizar icono
            this.updateThemeIcon(newTheme);
            
            // Actualizar motor visual
            if (this.visualEngine) {
                this.visualEngine.updateTheme(newTheme);
            }
            
            // Disparar evento para el motor visual
            Events.trigger(window, 'themeChanged', { theme: newTheme });
            
            log.info(`🎨 Tema cambiado a ${newTheme}`);
        });

        log.info('🎨 Toggle de tema configurado');
    }

    /**
     * Actualiza el icono del tema
     */
    updateThemeIcon(theme) {
        const themeIcon = DOM.select('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    /**
     * Configura el menú móvil
     */
    setupMobileMenu() {
        const menuToggle = DOM.select('#menu-toggle');
        const navLinks = DOM.select('.nav-links');
        
        if (!menuToggle || !navLinks) {
            log.warn('⚠️ Elementos del menú móvil no encontrados');
            return;
        }

        // Mejorar el HTML del menú toggle
        if (menuToggle.querySelector('i')) {
            menuToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
        }

        Events.on(menuToggle, 'click', () => {
            DOM.toggleClass(navLinks, 'active');
            DOM.toggleClass(menuToggle, 'active');
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Cerrar menú al hacer click en un enlace
        DOM.selectAll('.nav-link').forEach(link => {
            Events.on(link, 'click', () => {
                DOM.removeClasses(navLinks, 'active');
                DOM.removeClasses(menuToggle, 'active');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer click fuera
        Events.on(document, 'click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                DOM.removeClasses(navLinks, 'active');
                DOM.removeClasses(menuToggle, 'active');
                document.body.style.overflow = '';
            }
        });

        // Cerrar menú al cambiar tamaño de ventana
        Events.on(window, 'resize', Performance.throttle(() => {
            if (window.innerWidth > CONFIG.BREAKPOINTS.MOBILE) {
                DOM.removeClasses(navLinks, 'active');
                DOM.removeClasses(menuToggle, 'active');
                document.body.style.overflow = '';
            }
        }, 100));

        log.info('📱 Menú móvil configurado');
    }

    /**
     * Configura scroll suave
     */
    setupSmoothScrolling() {
        DOM.selectAll('a[href^="#"]').forEach(anchor => {
            Events.on(anchor, 'click', (e) => {
                e.preventDefault();
                const target = DOM.select(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    const sectionName = anchor.textContent.trim();
                    log.info(`📍 Navegando a ${sectionName}`);
                }
            });
        });

        log.info('📍 Scroll suave configurado');
    }

    /**
     * Configura el toggle de idioma
     */
    setupLanguageToggle() {
        const languageToggle = DOM.select('#language-toggle');
        if (!languageToggle) {
            log.warn('⚠️ Toggle de idioma no encontrado');
            return;
        }

        // Obtener idioma guardado
        const currentLanguage = localStorage.getItem('language') || CONFIG.LANGUAGES.DEFAULT;
        this.setLanguage(currentLanguage);

        Events.on(languageToggle, 'click', () => {
            const newLanguage = this.getCurrentLanguage() === 'en' ? 'es' : 'en';
            this.setLanguage(newLanguage);
            log.info(`🌍 Idioma cambiado a ${newLanguage}`);
        });

        log.info('🌍 Toggle de idioma configurado');
    }

    /**
     * Obtiene el idioma actual
     */
    getCurrentLanguage() {
        return localStorage.getItem('language') || CONFIG.LANGUAGES.DEFAULT;
    }

    /**
     * Establece el idioma
     */
    setLanguage(language) {
        localStorage.setItem('language', language);
        document.documentElement.setAttribute('data-language', language);
        Events.trigger(window, 'languageChanged', { language });
    }

    /**
     * Configura optimizaciones móviles
     */
    setupMobileOptimizations() {
        // Detectar dispositivo móvil
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            DOM.addClasses(document.body, 'mobile-device');
            log.info('📱 Dispositivo móvil detectado, aplicando optimizaciones');
        }
        
        // Optimizar para tablets
        const isTablet = window.innerWidth <= CONFIG.BREAKPOINTS.TABLET && window.innerWidth > CONFIG.BREAKPOINTS.MOBILE;
        if (isTablet) {
            DOM.addClasses(document.body, 'tablet-device');
            log.info('📱 Tablet detectada, aplicando optimizaciones');
        }
    }

    /**
     * Configura interacciones táctiles
     */
    setupTouchInteractions() {
        const interactiveElements = DOM.selectAll('.btn, .tech-badge, .nav-link, .card');
        
        interactiveElements.forEach(element => {
            Events.on(element, 'touchstart', () => {
                element.style.transform = 'scale(0.95)';
            });
            
            Events.on(element, 'touchend', () => {
                element.style.transform = '';
            });
            
            Events.on(element, 'touchcancel', () => {
                element.style.transform = '';
            });
        });

        log.info('👆 Interacciones táctiles configuradas');
    }

    /**
     * Configura eventos globales
     */
    setupGlobalEvents() {
        // Optimizar en scroll
        let scrollTimeout;
        Events.on(window, 'scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.optimizeAfterScroll();
            }, 100);
        });

        // Pausar animaciones cuando la página no está visible
        Events.on(document, 'visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Manejar resize
        Events.on(window, 'resize', Performance.throttle(() => {
            this.handleResize();
        }, 100));

        // Eventos de teclado para accesibilidad
        Events.on(document, 'keydown', (e) => {
            this.handleKeyboardEvents(e);
        });

        log.info('🌐 Eventos globales configurados');
    }

    /**
     * Optimiza después del scroll
     */
    optimizeAfterScroll() {
        // Implementar optimizaciones de scroll si es necesario
        log.debug('📜 Optimizando después del scroll');
    }

    /**
     * Pausa las animaciones
     */
    pauseAnimations() {
        log.debug('⏸️ Pausando animaciones');
    }

    /**
     * Reanuda las animaciones
     */
    resumeAnimations() {
        log.debug('▶️ Reanudando animaciones');
    }

    /**
     * Maneja el resize de la ventana
     */
    handleResize() {
        log.debug('📐 Ventana redimensionada');
    }

    /**
     * Maneja eventos de teclado
     */
    handleKeyboardEvents(e) {
        // ESC para cerrar menú móvil
        if (e.key === 'Escape') {
            const navLinks = DOM.select('.nav-links');
            const menuToggle = DOM.select('#menu-toggle');
            if (navLinks && navLinks.classList.contains('active')) {
                DOM.removeClasses(navLinks, 'active');
                DOM.removeClasses(menuToggle, 'active');
            }
        }
        
        // T para cambiar tema
        if (e.key === 't' && e.ctrlKey) {
            e.preventDefault();
            DOM.select('#theme-toggle')?.click();
        }
    }

    /**
     * Muestra mensaje de fallback
     */
    showFallbackMessage() {
        const message = '⚠️ Algunos efectos visuales no están disponibles';
        log.warn(message);
        
        // Crear notificación visual
        const notification = DOM.create('div', {
            className: 'fallback-notification',
            textContent: message
        });
        
        DOM.addClasses(notification, 'error');
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Obtiene un módulo por nombre
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Verifica si el portfolio está inicializado
     */
    isReady() {
        return this.isInitialized;
    }
}

// ===== INICIALIZACIÓN DEL PORTFOLIO =====
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const portfolio = new Portfolio();
        await portfolio.init();
        
        // Hacer accesible globalmente
        window.portfolio = portfolio;
        
    } catch (error) {
        log.error('❌ Error fatal inicializando portfolio:', error);
    }
});

// ===== EXPORTAR PARA USO EN MÓDULOS =====
export default Portfolio;
