/**
 * About Animations - Sistema de animaciones para la sección About
 */
import { AboutThreeEngine } from '../engines/about-three-engine.js';

class AboutAnimations {
    constructor() {
        this.aboutSection = null;
        this.aboutThreeEngine = null;
        this.observer = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        try {
            this.setupIntersectionObserver();
            this.setupScrollAnimations();
            this.setupHoverEffects();
            console.log('🎬 About Animations inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando About Animations:', error);
        }
    }
    
    setupIntersectionObserver() {
        // Observar cuando la sección About es visible
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.onAboutVisible(entry.target);
                } else {
                    this.onAboutHidden(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observar la sección About
        this.aboutSection = document.getElementById('about');
        if (this.aboutSection) {
            this.observer.observe(this.aboutSection);
        }
    }
    
    onAboutVisible(target) {
        if (this.isInitialized) return;
        
        console.log('🌟 Sección About visible - Inicializando efectos');
        this.isInitialized = true;
        
        // Inicializar Three.js Engine
        this.initThreeJSAnimations();
        
        // Activar animaciones CSS
        this.activateCSSAnimations();
        
        // Inicializar efectos de partículas
        this.initParticleEffects();
    }
    
    onAboutHidden(target) {
        console.log('🌙 Sección About oculta');
        
        // Limpiar Three.js Engine
        if (this.aboutThreeEngine) {
            this.aboutThreeEngine.dispose();
            this.aboutThreeEngine = null;
        }
        
        this.isInitialized = false;
    }
    
    initThreeJSAnimations() {
        try {
            // Verificar que Three.js esté disponible
            if (typeof THREE === 'undefined') {
                console.warn('⚠️ Three.js no está disponible, usando animaciones CSS alternativas');
                return;
            }
            
            // Verificar que el módulo AboutThreeEngine esté disponible
            if (typeof AboutThreeEngine === 'undefined') {
                console.warn('⚠️ AboutThreeEngine no está disponible, usando animaciones CSS alternativas');
                return;
            }
            
            this.aboutThreeEngine = new AboutThreeEngine();
            console.log('🚀 About Three.js Engine inicializado');
        } catch (error) {
            console.error('❌ Error inicializando About Three.js Engine:', error);
            console.log('🔄 Continuando con animaciones CSS alternativas');
        }
    }
    
    activateCSSAnimations() {
        // Activar animaciones de entrada
        const animatedElements = this.aboutSection.querySelectorAll('.animate-fade-in-up');
        
        animatedElements.forEach((element, index) => {
            const delay = parseFloat(element.getAttribute('data-delay')) || 0;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay * 1000);
        });
    }
    
    initParticleEffects() {
        // Efectos de partículas para elementos específicos
        this.initAvatarParticles();
        this.initStatsParticles();
        this.initSpecialtyParticles();
        this.initTechParticles();
        this.initValuesParticles();
        
        // Inicializar animaciones de contador
        this.initCounterAnimations();
        
        // Inicializar animaciones de iconos
        this.initIconAnimations();
    }
    
    initIconAnimations() {
        // Animar iconos de especialidades
        const specialtyIcons = document.querySelectorAll('.specialty-icon-inline');
        specialtyIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.2}s`;
            icon.classList.add('icon-float');
        });
        
        // Animar iconos de tech stack
        const techIcons = document.querySelectorAll('.tech-icon');
        techIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.1}s`;
            icon.classList.add('icon-pulse');
        });
        
        // Animar iconos de valores
        const valueIcons = document.querySelectorAll('.value-icon-inline');
        valueIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.15}s`;
            icon.classList.add('icon-rotate');
        });
        
        // Animar icono del avatar
        const avatarIcon = document.querySelector('.avatar-icon');
        if (avatarIcon) {
            avatarIcon.classList.add('avatar-icon-float');
        }
    }
    
    initAvatarParticles() {
        const avatarContainer = document.querySelector('.avatar-container');
        if (avatarContainer) {
            // Crear partículas flotantes alrededor del avatar
            this.createFloatingParticles(avatarContainer, 30, {
                color: 'var(--primary-color)',
                size: '2px',
                duration: '8s'
            });
        }
    }
    
    initStatsParticles() {
        const statItems = document.querySelectorAll('.stat-main-item');
        statItems.forEach((item, index) => {
            // Efecto de partículas que se elevan desde los números
            this.createRisingParticles(item, 20, {
                color: 'var(--accent-color)',
                size: '1px',
                duration: '6s',
                delay: index * 200
            });
        });
    }
    
    initSpecialtyParticles() {
        const specialtyItems = document.querySelectorAll('.specialty-inline-item');
        specialtyItems.forEach((item, index) => {
            // Efecto de partículas orbitales
            this.createOrbitalParticles(item, 15, {
                color: 'var(--primary-color)',
                size: '1.5px',
                duration: '10s',
                delay: index * 300
            });
        });
    }
    
    initTechParticles() {
        const techTags = document.querySelectorAll('.tech-tag-compact');
        techTags.forEach((tag, index) => {
            // Efecto de partículas que se expanden
            this.createExpandingParticles(tag, 12, {
                color: 'var(--accent-color)',
                size: '1px',
                duration: '5s',
                delay: index * 100
            });
        });
    }
    
    initValuesParticles() {
        const valueItems = document.querySelectorAll('.value-inline-item');
        valueItems.forEach((item, index) => {
            // Efecto de partículas en espiral
            this.createSpiralParticles(item, 18, {
                color: 'var(--primary-color)',
                size: '1.5px',
                duration: '12s',
                delay: index * 400
            });
        });
    }
    
    createFloatingParticles(container, count, options) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'floating-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.style.position = 'relative';
        container.appendChild(particlesContainer);
        
        for (let i = 0; i < count; i++) {
            this.createParticle(particlesContainer, options, i);
        }
    }
    
    createRisingParticles(container, count, options) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'rising-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.style.position = 'relative';
        container.appendChild(particlesContainer);
        
        for (let i = 0; i < count; i++) {
            this.createRisingParticle(particlesContainer, options, i);
        }
    }
    
    createOrbitalParticles(container, count, options) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'orbital-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.style.position = 'relative';
        container.appendChild(particlesContainer);
        
        for (let i = 0; i < count; i++) {
            this.createOrbitalParticle(particlesContainer, options, i);
        }
    }
    
    createExpandingParticles(container, count, options) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'expanding-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.style.position = 'relative';
        container.appendChild(particlesContainer);
        
        for (let i = 0; i < count; i++) {
            this.createExpandingParticle(particlesContainer, options, i);
        }
    }
    
    createSpiralParticles(container, count, options) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'spiral-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.style.position = 'relative';
        container.appendChild(particlesContainer);
        
        for (let i = 0; i < count; i++) {
            this.createSpiralParticle(particlesContainer, options, i);
        }
    }
    
    createParticle(container, options, index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (index / options.count) * Math.PI * 2;
        const radius = 60 + Math.random() * 40;
        const delay = Math.random() * options.duration;
        
        particle.style.cssText = `
            position: absolute;
            width: ${options.size};
            height: ${options.size};
            background: ${options.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(angle) * radius}px);
            left: calc(50% + ${Math.cos(angle) * radius}px);
            opacity: 0;
            animation: floatingParticle ${options.duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(particle);
    }
    
    createRisingParticle(container, options, index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const delay = options.delay + (index * 50);
        
        particle.style.cssText = `
            position: absolute;
            width: ${options.size};
            height: ${options.size};
            background: ${options.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: risingParticle ${options.duration}s ease-out infinite;
            animation-delay: ${delay}ms;
        `;
        
        container.appendChild(particle);
    }
    
    createOrbitalParticle(container, options, index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (index / options.count) * Math.PI * 2;
        const radius = 40 + Math.random() * 20;
        const delay = options.delay + (index * 100);
        
        particle.style.cssText = `
            position: absolute;
            width: ${options.size};
            height: ${options.size};
            background: ${options.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(angle) * radius}px);
            left: calc(50% + ${Math.cos(angle) * radius}px);
            opacity: 0;
            animation: orbitalParticle ${options.duration}s linear infinite;
            animation-delay: ${delay}ms;
        `;
        
        container.appendChild(particle);
    }
    
    createExpandingParticle(container, options, index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (index / options.count) * Math.PI * 2;
        const delay = options.delay + (index * 80);
        
        particle.style.cssText = `
            position: absolute;
            width: ${options.size};
            height: ${options.size};
            background: ${options.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: expandingParticle ${options.duration}s ease-out infinite;
            animation-delay: ${delay}ms;
        `;
        
        container.appendChild(particle);
    }
    
    createSpiralParticle(container, options, index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const delay = options.delay + (index * 200);
        
        particle.style.cssText = `
            position: absolute;
            width: ${options.size};
            height: ${options.size};
            background: ${options.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: spiralParticle ${options.duration}s ease-in-out infinite;
            animation-delay: ${delay}ms;
        `;
        
        container.appendChild(particle);
    }
    
    setupScrollAnimations() {
        // Efectos de parallax suave en scroll
        window.addEventListener('scroll', () => {
            if (!this.aboutSection || !this.isInitialized) return;
            
            const rect = this.aboutSection.getBoundingClientRect();
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            
            if (scrollProgress > 0 && scrollProgress < 1) {
                this.updateScrollEffects(scrollProgress);
            }
        });
    }
    
    // Animaciones de contador para números
    initCounterAnimations() {
        const statNumbers = document.querySelectorAll('.stat-main-number');
        
        statNumbers.forEach(statNumber => {
            const finalValue = parseInt(statNumber.textContent);
            const suffix = statNumber.textContent.replace(/\d/g, ''); // Obtener sufijo (+, %, etc.)
            const numericValue = parseInt(statNumber.textContent.replace(/\D/g, '')); // Solo números
            
            // Resetear a 0
            statNumber.textContent = '0' + suffix;
            
            // Crear observador para el contador
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(statNumber, 0, numericValue, suffix);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counterObserver.observe(statNumber);
        });
    }
    
    animateCounter(element, start, end, suffix) {
        const duration = 2000; // 2 segundos
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Función de easing suave
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = currentValue + suffix;
            
            // Agregar efecto visual durante la animación
            element.style.transform = `scale(${1 + progress * 0.1})`;
            element.style.color = `hsl(${200 + progress * 60}, 70%, ${60 + progress * 20}%)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Finalizar animación
                element.style.transform = 'scale(1)';
                element.style.color = '';
                
                // Efecto de celebración
                this.createCelebrationEffect(element);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    createCelebrationEffect(element) {
        // Crear partículas de celebración
        const container = element.parentElement;
        const celebrationParticles = document.createElement('div');
        celebrationParticles.className = 'celebration-particles';
        celebrationParticles.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
        `;
        
        container.style.position = 'relative';
        container.appendChild(celebrationParticles);
        
        // Crear múltiples partículas
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.style.cssText = `
                position: absolute;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #64B5F6, #4FC3F7);
            border-radius: 50%;
            animation: celebrationParticle 1.5s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        celebrationParticles.appendChild(particle);
    }
    
    // Limpiar después de la animación
    setTimeout(() => {
        celebrationParticles.remove();
    }, 2000);
}
    
    updateScrollEffects(progress) {
        // Efectos de parallax para elementos del About
        const avatarContainer = document.querySelector('.avatar-container');
        if (avatarContainer) {
            const translateY = progress * 20;
            avatarContainer.style.transform = `translateY(${translateY}px)`;
        }
        
        // Efectos de opacidad para las estadísticas
        const statItems = document.querySelectorAll('.stat-main-item');
        statItems.forEach((item, index) => {
            const opacity = Math.max(0.3, 1 - (progress * 0.5));
            item.style.opacity = opacity;
        });
    }
    
    setupHoverEffects() {
        // Efectos de hover mejorados
        const specialtyItems = document.querySelectorAll('.specialty-inline-item');
        specialtyItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.activateHoverEffect(item, 'specialty');
            });
            
            item.addEventListener('mouseleave', () => {
                this.deactivateHoverEffect(item, 'specialty');
            });
        });
        
        const techTags = document.querySelectorAll('.tech-tag-compact');
        techTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                this.activateHoverEffect(tag, 'tech');
            });
            
            tag.addEventListener('mouseleave', () => {
                this.deactivateHoverEffect(tag, 'tech');
            });
        });
        
        const valueItems = document.querySelectorAll('.value-inline-item');
        valueItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.activateHoverEffect(item, 'value');
            });
            
            item.addEventListener('mouseleave', () => {
                this.deactivateHoverEffect(item, 'value');
            });
        });
    }
    
    activateHoverEffect(element, type) {
        // Activar efectos de hover según el tipo
        switch (type) {
            case 'specialty':
                element.style.transform = 'translateY(-8px) scale(1.05)';
                element.style.boxShadow = '0 20px 40px rgba(100, 181, 246, 0.15)';
                break;
            case 'tech':
                element.style.transform = 'translateY(-5px) scale(1.1)';
                element.style.boxShadow = '0 15px 30px rgba(100, 181, 246, 0.2)';
                break;
            case 'value':
                element.style.transform = 'translateY(-6px) scale(1.03)';
                element.style.boxShadow = '0 18px 35px rgba(100, 181, 246, 0.18)';
                break;
        }
        
        // Activar partículas de hover si Three.js está disponible
        if (this.aboutThreeEngine && typeof this.aboutThreeEngine.activateHoverEffect === 'function') {
            try {
                this.aboutThreeEngine.activateHoverEffect(element, type);
            } catch (error) {
                console.warn('⚠️ Error activando hover effect en Three.js:', error);
            }
        }
    }
    
    deactivateHoverEffect(element, type) {
        // Desactivar efectos de hover
        element.style.transform = 'translateY(0) scale(1)';
        element.style.boxShadow = 'none';
        
        // Desactivar partículas de hover si Three.js está disponible
        if (this.aboutThreeEngine && typeof this.aboutThreeEngine.deactivateHoverEffect === 'function') {
            try {
                this.aboutThreeEngine.deactivateHoverEffect(element, type);
            } catch (error) {
                console.warn('⚠️ Error desactivando hover effect en Three.js:', error);
            }
        }
    }
    
    destroy() {
        // Limpiar recursos
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.aboutThreeEngine) {
            this.aboutThreeEngine.dispose();
        }
        
        console.log('🧹 About Animations limpiado');
    }
}

// Exportar para uso en otros módulos
export { AboutAnimations };
