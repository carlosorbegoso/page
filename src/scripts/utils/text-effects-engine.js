/**
 * Text Effects Engine
 * Motor de efectos de texto avanzado que se integra con Three.js
 */

export class TextEffectsEngine {
    constructor() {
        this.isInitialized = false;
        this.currentTheme = 'light';
        this.effects = new Map();
        this.animationId = null;
        
        // Configuración de efectos
        this.config = {
            glow: {
                intensity: 0.3,
                spread: 15,
                color: {
                    light: '#64B5F6',
                    dark: '#4FC3F7'
                }
            },
            particles: {
                count: 20,
                size: { min: 1, max: 3 },
                speed: { min: 0.5, max: 2 },
                opacity: { min: 0.1, max: 0.4 }
            },
            wave: {
                amplitude: 2,
                frequency: 0.02,
                speed: 0.5
            }
        };
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.createTextEffects();
        this.animate();
        
        this.isInitialized = true;
        console.log('🎨 Text Effects Engine inicializado');
    }

    setupEventListeners() {
        // Observar cambios de tema
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme');
                    this.updateTheme(newTheme);
                }
            });
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Observar scroll para efectos parallax
        window.addEventListener('scroll', () => {
            this.updateScrollEffects();
        });

        // Observar mouse para efectos interactivos
        document.addEventListener('mousemove', (event) => {
            this.updateMouseEffects(event);
        });
    }

    createTextEffects() {
        // Efectos para el título principal
        this.createTitleEffects();
        
        // Efectos para subtítulos
        this.createSubtitleEffects();
        
        // Efectos para badges y elementos
        this.createBadgeEffects();
    }

    createTitleEffects() {
        const titleFirst = document.querySelector('.title-first');
        const titleSecond = document.querySelector('.title-second');
        
        if (titleFirst) {
            this.createGlowEffect(titleFirst, this.config.glow.color.light);
            this.createParticleEffect(titleFirst);
            this.createWaveEffect(titleFirst);
        }
        
        if (titleSecond) {
            this.createGlowEffect(titleSecond, this.config.glow.color.dark);
            this.createParticleEffect(titleSecond);
            this.createWaveEffect(titleSecond);
        }
    }

    createSubtitleEffects() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            this.createSubtleGlowEffect(subtitle);
        }
    }

    createBadgeEffects() {
        const badges = document.querySelectorAll('.tech-badge, .hero-badge, .company-badge');
        badges.forEach(badge => {
            this.createBadgeGlowEffect(badge);
        });
    }

    createGlowEffect(element, color) {
        const effectId = `glow-${Math.random().toString(36).substr(2, 9)}`;
        
        // Crear elemento de glow
        const glow = document.createElement('div');
        glow.className = 'text-glow';
        glow.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, ${color}20 0%, transparent 70%);
            filter: blur(${this.config.glow.spread}px);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: -1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glow);
        
        // Guardar referencia
        this.effects.set(effectId, {
            type: 'glow',
            element: glow,
            target: element,
            color: color
        });
        
        // Activar glow
        setTimeout(() => {
            glow.style.opacity = this.config.glow.intensity;
        }, 100);
    }

    createParticleEffect(element) {
        const effectId = `particles-${Math.random().toString(36).substr(2, 9)}`;
        const particles = [];
        
        // Crear partículas
        for (let i = 0; i < this.config.particles.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'text-particle';
            
            const size = Math.random() * 
                (this.config.particles.size.max - this.config.particles.size.min) + 
                this.config.particles.size.min;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${this.currentTheme === 'dark' ? '#4FC3F7' : '#64B5F6'};
                border-radius: 50%;
                opacity: 0;
                pointer-events: none;
                z-index: 10;
            `;
            
            element.appendChild(particle);
            particles.push(particle);
        }
        
        // Guardar referencia
        this.effects.set(effectId, {
            type: 'particles',
            particles: particles,
            target: element
        });
    }

    createWaveEffect(element) {
        const effectId = `wave-${Math.random().toString(36).substr(2, 9)}`;
        
        // Crear elemento de onda
        const wave = document.createElement('div');
        wave.className = 'text-wave';
        wave.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, ${this.currentTheme === 'dark' ? '#4FC3F7' : '#64B5F6'}20, transparent);
            opacity: 0;
            transform: translateX(-100%);
            transition: all 0.6s ease;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.appendChild(wave);
        
        // Guardar referencia
        this.effects.set(effectId, {
            type: 'wave',
            element: wave,
            target: element
        });
        
        // Activar onda periódicamente
        setInterval(() => {
            wave.style.transform = 'translateX(100%)';
            wave.style.opacity = '0.3';
            
            setTimeout(() => {
                wave.style.transform = 'translateX(-100%)';
                wave.style.opacity = '0';
            }, 600);
        }, 3000);
    }

    createSubtleGlowEffect(element) {
        const effectId = `subtle-glow-${Math.random().toString(36).substr(2, 9)}`;
        
        const glow = document.createElement('div');
        glow.className = 'subtle-glow';
        glow.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(100, 181, 246, 0.1) 0%, transparent 80%);
            filter: blur(8px);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            z-index: -1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(glow);
        
        this.effects.set(effectId, {
            type: 'subtle-glow',
            element: glow,
            target: element
        });
        
        setTimeout(() => {
            glow.style.opacity = '1';
        }, 200);
    }

    createBadgeGlowEffect(badge) {
        const effectId = `badge-glow-${Math.random().toString(36).substr(2, 9)}`;
        
        const glow = document.createElement('div');
        glow.className = 'badge-glow';
        glow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #64B5F6, #4FC3F7, #64B5F6);
            border-radius: inherit;
            opacity: 0;
            filter: blur(4px);
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: -1;
        `;
        
        badge.style.position = 'relative';
        badge.appendChild(glow);
        
        this.effects.set(effectId, {
            type: 'badge-glow',
            element: glow,
            target: badge
        });
        
        // Activar glow en hover
        badge.addEventListener('mouseenter', () => {
            glow.style.opacity = '0.6';
        });
        
        badge.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        
        // Actualizar colores de efectos
        this.effects.forEach((effect, id) => {
            if (effect.type === 'glow') {
                const newColor = theme === 'dark' ? 
                    this.config.glow.color.dark : 
                    this.config.glow.color.light;
                
                effect.element.style.background = `radial-gradient(circle, ${newColor}20 0%, transparent 70%)`;
                effect.color = newColor;
            }
            
            if (effect.type === 'particles') {
                effect.particles.forEach(particle => {
                    particle.style.background = theme === 'dark' ? '#4FC3F7' : '#64B5F6';
                });
            }
            
            if (effect.type === 'wave') {
                effect.element.style.background = `linear-gradient(90deg, transparent, ${theme === 'dark' ? '#4FC3F7' : '#64B5F6'}20, transparent)`;
            }
        });
    }

    updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.001;
        
        // Efectos de parallax en partículas
        this.effects.forEach((effect, id) => {
            if (effect.type === 'particles') {
                effect.particles.forEach((particle, index) => {
                    const speed = (index / effect.particles.length) * 0.5;
                    particle.style.transform = `translateY(${rate * speed * 100}px)`;
                });
            }
        });
    }

    updateMouseEffects(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // Efectos de mouse en partículas
        this.effects.forEach((effect, id) => {
            if (effect.type === 'particles') {
                effect.particles.forEach((particle, index) => {
                    const rect = effect.target.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const deltaX = (mouseX - centerX) * 0.01;
                    const deltaY = (mouseY - centerY) * 0.01;
                    
                    particle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                });
            }
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.isInitialized) return;
        
        const time = Date.now() * 0.001;
        
        // Animar partículas
        this.effects.forEach((effect, id) => {
            if (effect.type === 'particles') {
                effect.particles.forEach((particle, index) => {
                    const speed = this.config.particles.speed.min + 
                        (this.config.particles.speed.max - this.config.particles.speed.min) * 
                        (index / effect.particles.length);
                    
                    const opacity = this.config.particles.opacity.min + 
                        (this.config.particles.opacity.max - this.config.particles.opacity.min) * 
                        Math.sin(time * speed + index);
                    
                    particle.style.opacity = opacity;
                });
            }
        });
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Limpiar efectos
        this.effects.forEach((effect, id) => {
            if (effect.element && effect.element.parentNode) {
                effect.element.parentNode.removeChild(effect.element);
            }
            
            if (effect.particles) {
                effect.particles.forEach(particle => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                });
            }
        });
        
        this.effects.clear();
        this.isInitialized = false;
    }
}
