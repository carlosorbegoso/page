/**
 * Hero Animations Manager
 * Maneja todas las animaciones avanzadas del Hero section
 */

export class HeroAnimations {
    constructor() {
        this.hero = null;
        this.heroContent = null;
        this.techBadges = [];
        this.buttons = [];
        this.scrollIndicator = null;
        this.floatingElements = [];
        this.isAnimating = false;
        this.observer = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupIntersectionObserver();
        this.setupEventListeners();
        this.startInitialAnimations();
    }

    setupElements() {
        this.hero = document.querySelector('.hero');
        this.heroContent = document.querySelector('.hero-content');
        this.techBadges = document.querySelectorAll('.tech-badge');
        this.buttons = document.querySelectorAll('.btn-hero');
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator');
        this.floatingElements = document.querySelectorAll('.floating-element');
    }

    setupIntersectionObserver() {
        if (!this.hero) return;

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.onHeroVisible();
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        this.observer.observe(this.hero);
    }

    setupEventListeners() {
        // Scroll indicator click
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                this.scrollToNextSection();
            });
        }

        // Tech badges hover effects
        this.techBadges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                this.animateTechBadge(badge, 'enter');
            });
            
            badge.addEventListener('mouseleave', () => {
                this.animateTechBadge(badge, 'leave');
            });
        });

        // Button hover effects
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.animateButton(button, 'enter');
            });
            
            button.addEventListener('mouseleave', () => {
                this.animateButton(button, 'leave');
            });
        });

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.updateResponsiveAnimations();
        });
    }

    startInitialAnimations() {
        if (!this.heroContent) return;

        // Animar elementos con delays escalonados
        const animatedElements = this.heroContent.querySelectorAll('.animate-fade-in-up');
        
        animatedElements.forEach((element, index) => {
            const delay = parseFloat(element.dataset.delay) || index * 0.1;
            
            setTimeout(() => {
                element.style.animationDelay = `${delay}s`;
                element.classList.add('animate-in');
            }, delay * 1000);
        });

        // Animar tech badges con delay escalonado
        this.techBadges.forEach((badge, index) => {
            const delay = parseFloat(badge.dataset.delay) || index * 0.1;
            
            setTimeout(() => {
                this.animateTechBadge(badge, 'enter');
            }, (1.4 + delay) * 1000);
        });
    }

    onHeroVisible() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Animar floating elements
        this.animateFloatingElements();

        // Animar scroll indicator
        if (this.scrollIndicator) {
            this.animateScrollIndicator();
        }

        // Iniciar animaciones de Three.js si están disponibles
        this.initThreeJSAnimations();
    }

    animateTechBadge(badge, action) {
        if (action === 'enter') {
            badge.style.transform = 'translateY(-8px) scale(1.05)';
            badge.style.boxShadow = '0 12px 30px rgba(100, 181, 246, 0.3)';
            
            // Animar icono
            const icon = badge.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
            
            // Mostrar glow
            const glow = badge.querySelector('.tech-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        } else {
            badge.style.transform = 'translateY(0) scale(1)';
            badge.style.boxShadow = '0 4px 15px rgba(100, 181, 246, 0.1)';
            
            // Resetear icono
            const icon = badge.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            // Ocultar glow
            const glow = badge.querySelector('.tech-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        }
    }

    animateButton(button, action) {
        if (action === 'enter') {
            button.style.transform = 'translateY(-4px)';
            
            // Animar icono
            const icon = button.querySelector('.btn-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
            
            // Mostrar particles si es botón primario
            if (button.classList.contains('btn-primary')) {
                const particles = button.querySelector('.btn-particles');
                if (particles) {
                    particles.style.opacity = '1';
                }
            }
        } else {
            button.style.transform = 'translateY(0)';
            
            // Resetear icono
            const icon = button.querySelector('.btn-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
            
            // Ocultar particles
            const particles = button.querySelector('.btn-particles');
            if (particles) {
                particles.style.opacity = '0';
            }
        }
    }

    animateFloatingElements() {
        this.floatingElements.forEach((element, index) => {
            const delay = index * 0.5;
            
            setTimeout(() => {
                element.style.animation = 'float 6s ease-in-out infinite';
                element.style.opacity = '1';
            }, delay * 1000);
        });
    }

    animateScrollIndicator() {
        if (!this.scrollIndicator) return;

        // Animar flechas
        const arrows = this.scrollIndicator.querySelectorAll('.arrow-line');
        arrows.forEach((arrow, index) => {
            arrow.style.animation = `arrowLine${index + 1} 2s infinite`;
        });

        // Animar texto
        const text = this.scrollIndicator.querySelector('.scroll-text');
        if (text) {
            text.style.animation = 'fadeInOut 2s infinite';
        }
    }

    updateParallax() {
        if (!this.hero) return;

        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax para elementos de fondo
        const backgroundElements = this.hero.querySelectorAll('.hero-particles, .hero-constellations, .hero-stars');
        backgroundElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });

        // Parallax sutil para floating elements
        this.floatingElements.forEach((element, index) => {
            const elementRate = rate * (0.1 + index * 0.05);
            element.style.transform = `translateY(${elementRate}px)`;
        });
    }

    updateResponsiveAnimations() {
        const isMobile = window.innerWidth <= 768;
        
        // Ajustar animaciones para mobile
        if (isMobile) {
            this.heroContent?.style.setProperty('--animation-duration', '0.6s');
        } else {
            this.heroContent?.style.setProperty('--animation-duration', '0.8s');
        }
    }

    scrollToNextSection() {
        const nextSection = this.hero?.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    initThreeJSAnimations() {
        // Verificar si Three.js está disponible
        if (window.VisualEffectsEngine) {
            // Integrar con el motor visual existente
            this.integrateWithThreeJS();
        }
    }

    integrateWithThreeJS() {
        // Crear partículas específicas para el hero
        this.createHeroParticles();
        
        // Crear constelaciones específicas para el hero
        this.createHeroConstellations();
        
        // Crear estrellas específicas para el hero
        this.createHeroStars();
    }

    createHeroParticles() {
        const particlesContainer = document.getElementById('hero-particles');
        if (!particlesContainer) return;

        // Crear partículas HTML para el hero
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(100, 181, 246, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: heroParticleFloat ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    createHeroConstellations() {
        const constellationsContainer = document.getElementById('hero-constellations');
        if (!constellationsContainer) return;

        // Crear constelaciones HTML para el hero
        for (let i = 0; i < 3; i++) {
            const constellation = document.createElement('div');
            constellation.className = 'hero-constellation';
            constellation.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                left: ${20 + i * 30}%;
                top: ${30 + i * 20}%;
                opacity: 0.3;
                animation: heroConstellationGlow ${4 + i}s ease-in-out infinite;
            `;
            constellationsContainer.appendChild(constellation);
        }
    }

    createHeroStars() {
        const starsContainer = document.getElementById('hero-stars');
        if (!starsContainer) return;

        // Crear estrellas HTML para el hero
        for (let i = 0; i < 15; i++) {
            const star = document.createElement('div');
            star.className = 'hero-star';
            star.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: heroStarTwinkle ${2 + Math.random() * 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            starsContainer.appendChild(star);
        }
    }

    // Método para limpiar animaciones
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Remover event listeners
        if (this.scrollIndicator) {
            this.scrollIndicator.removeEventListener('click', this.scrollToNextSection);
        }
        
        // Limpiar elementos
        this.hero = null;
        this.heroContent = null;
        this.techBadges = [];
        this.buttons = [];
        this.scrollIndicator = null;
        this.floatingElements = [];
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimations();
});
