// ===== SISTEMA DE GESTIÓN DE ESTILOS DINÁMICOS =====

class StyleManager {
    constructor() {
        this.currentTheme = 'light';
        this.styleCache = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupThemeObserver();
        this.setupScrollObserver();
        this.setupIntersectionObserver();
        this.setupResponsiveManager();
        this.setupAnimationController();
    }
    
    // ===== GESTIÓN DE TEMAS =====
    setupThemeObserver() {
        // Observar cambios de tema
        window.addEventListener('themeChanged', (event) => {
            this.currentTheme = event.detail.theme;
            this.updateThemeStyles();
        });
    }
    
    updateThemeStyles() {
        const isDark = this.currentTheme === 'dark';
        
        // Aplicar estilos de tema dinámicamente
        this.applyThemeColors(isDark);
        this.updateParticleColors(isDark);
        this.updateConstellationColors(isDark);
        this.updateCursorColors(isDark);
    }
    
    applyThemeColors(isDark) {
        const root = document.documentElement;
        const colors = isDark ? this.getDarkThemeColors() : this.getLightThemeColors();
        
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }
    
    getDarkThemeColors() {
        return {
            '--bg-color': '#0a0a0a',
            '--card-bg': '#1a1a1a',
            '--text-primary': '#ffffff',
            '--text-secondary': '#b0b0b0',
            '--border-color': '#333333',
            '--shadow-color': 'rgba(0, 0, 0, 0.5)'
        };
    }
    
    getLightThemeColors() {
        return {
            '--bg-color': '#ffffff',
            '--card-bg': '#f8f9fa',
            '--text-primary': '#1a1a1a',
            '--text-secondary': '#666666',
            '--border-color': '#e0e0e0',
            '--shadow-color': 'rgba(0, 0, 0, 0.1)'
        };
    }
    
    // ===== GESTIÓN DE SCROLL =====
    setupScrollObserver() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollStyles();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateScrollStyles() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrolled / maxScroll) * 100;
        
        // Actualizar navbar
        this.updateNavbarStyles(scrolled);
        
        // Aplicar efectos de parallax
        this.applyParallaxEffects(scrolled);
        
        // Actualizar indicador de scroll
        this.updateScrollIndicator(scrollPercent);
        
        // Aplicar efectos de profundidad
        this.applyDepthEffects(scrolled);
    }
    
    updateNavbarStyles(scrolled) {
        const navbar = document.querySelector('header');
        if (!navbar) return;
        
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.backgroundColor = this.currentTheme === 'dark' 
                ? 'rgba(10, 10, 10, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.backgroundColor = this.currentTheme === 'dark' 
                ? 'rgba(10, 10, 10, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)';
        }
    }
    
    applyParallaxEffects(scrolled) {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    updateScrollIndicator(percent) {
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.transform = `scaleX(${percent / 100})`;
        }
    }
    
    applyDepthEffects(scrolled) {
        const sections = document.querySelectorAll('section');
        const viewportHeight = window.innerHeight;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);
            const maxDistance = viewportHeight / 2;
            const depth = Math.max(0, 1 - distanceFromCenter / maxDistance);
            
            // Aplicar efectos de profundidad
            section.style.transform = `translateZ(${depth * 20}px)`;
            section.style.opacity = 0.3 + (depth * 0.7);
        });
    }
    
    // ===== GESTIÓN DE INTERSECCIÓN =====
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar elementos con animaciones
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateElement(element) {
        const animationType = element.dataset.animate || 'fadeIn';
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add('animated', animationType);
            
            // Aplicar animaciones específicas
            this.applySpecificAnimation(element, animationType);
        }, delay);
    }
    
    applySpecificAnimation(element, type) {
        switch (type) {
            case 'slideInLeft':
                element.style.transform = 'translateX(0)';
                element.style.opacity = '1';
                break;
            case 'slideInRight':
                element.style.transform = 'translateX(0)';
                element.style.opacity = '1';
                break;
            case 'slideInUp':
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
                break;
            case 'fadeIn':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
            case 'scaleIn':
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
                break;
        }
    }
    
    // ===== GESTIÓN RESPONSIVA =====
    setupResponsiveManager() {
        this.updateResponsiveStyles();
        window.addEventListener('resize', () => {
            this.updateResponsiveStyles();
        });
    }
    
    updateResponsiveStyles() {
        const width = window.innerWidth;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;
        
        // Aplicar estilos responsivos
        this.applyResponsiveStyles(isMobile, isTablet);
        
        // Optimizar efectos para móviles
        if (isMobile) {
            this.optimizeForMobile();
        }
    }
    
    applyResponsiveStyles(isMobile, isTablet) {
        const root = document.documentElement;
        
        if (isMobile) {
            root.style.setProperty('--section-padding', '60px 0');
            root.style.setProperty('--title-size', '2rem');
            root.style.setProperty('--container-padding', '1rem');
        } else if (isTablet) {
            root.style.setProperty('--section-padding', '80px 0');
            root.style.setProperty('--title-size', '2.5rem');
            root.style.setProperty('--container-padding', '1.5rem');
        } else {
            root.style.setProperty('--section-padding', '120px 0');
            root.style.setProperty('--title-size', '3rem');
            root.style.setProperty('--container-padding', '2rem');
        }
    }
    
    optimizeForMobile() {
        // Reducir efectos en móviles
        document.querySelectorAll('[data-mobile-optimize]').forEach(element => {
            element.style.animationDuration = '0.5s';
            element.style.transform = 'none';
        });
        
        // Deshabilitar efectos complejos
        this.disableComplexEffects();
    }
    
    disableComplexEffects() {
        // Deshabilitar efectos que pueden afectar el rendimiento en móviles
        const complexElements = document.querySelectorAll('.particle-effect, .constellation-effect');
        complexElements.forEach(element => {
            element.style.display = 'none';
        });
    }
    
    // ===== CONTROLADOR DE ANIMACIONES =====
    setupAnimationController() {
        // Restaurar todas las animaciones que funcionaban
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupTypingEffects();
        
        // Comentar temporalmente métodos que no existen
        // this.setupFloatingElements();
        // this.setupRevealAnimations();
        // this.setupParallaxEffects();
    }
    
    setupHoverEffects() {
        // Efectos de hover para cards
        document.querySelectorAll('.card-hover').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.applyHoverEffect(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.applyHoverEffect(card, 'leave');
            });
        });
    }
    
    applyHoverEffect(element, state) {
        if (state === 'enter') {
            element.style.transform = 'translateY(-10px) scale(1.03)';
            element.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        } else {
            element.style.transform = 'translateY(0) scale(1)';
            element.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }
    }
    
    setupClickEffects() {
        // Efectos de click para botones
        document.querySelectorAll('.btn, .nav-link').forEach(button => {
            button.addEventListener('click', () => {
                this.applyClickEffect(button);
            });
        });
    }
    
    applyClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
    
    setupTypingEffects() {
        // Efecto de escritura para títulos
        const typingElements = document.querySelectorAll('.typing-effect');
        typingElements.forEach(element => {
            this.createTypingEffect(element);
        });
    }
    
    createTypingEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                element.style.borderRight = 'none';
            }
        };
        
        // Iniciar cuando el elemento sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    }
    
    // ===== GESTIÓN DE PARTÍCULAS =====
    updateParticleColors(isDark) {
        if (window.particleSystem && typeof window.particleSystem.updateTheme === 'function') {
            window.particleSystem.updateTheme(this.currentTheme);
        }
    }
    
    updateConstellationColors(isDark) {
        if (window.constellationSystem && typeof window.constellationSystem.updateTheme === 'function') {
            window.constellationSystem.updateTheme(this.currentTheme);
        }
    }
    
    updateCursorColors(isDark) {
        if (window.threeCursorSystem && typeof window.threeCursorSystem.updateTheme === 'function') {
            window.threeCursorSystem.updateTheme(this.currentTheme);
        }
    }
    
    // ===== UTILIDADES =====
    addCustomStyle(selector, styles) {
        const styleId = `custom-style-${Date.now()}`;
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        
        let cssText = '';
        Object.entries(styles).forEach(([property, value]) => {
            cssText += `${property}: ${value}; `;
        });
        
        styleElement.textContent = `${selector} { ${cssText} }`;
        document.head.appendChild(styleElement);
        
        return styleId;
    }
    
    removeCustomStyle(styleId) {
        const styleElement = document.getElementById(styleId);
        if (styleElement) {
            styleElement.remove();
        }
    }
    
    // ===== LIMPIEZA =====
    dispose() {
        // Limpiar observadores
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Limpiar cache
        this.styleCache.clear();
    }
}

// Exportar para uso global
export default StyleManager;
