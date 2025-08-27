// ===== SISTEMA DE TRANSICIONES DE SECCIÓN PROFESIONAL =====

class SectionTransitions {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isTransitioning = false;
        this.transitionDuration = 1000;
        
        this.init();
    }

    init() {
        this.getSections();
        this.createTransitionElements();
        this.addEventListeners();
        this.observeSections();
    }

    getSections() {
        const sectionIds = ['hero', 'about', 'experience', 'skills', 'projects', 'contact'];
        
        this.sections = sectionIds.map(id => {
            const element = document.getElementById(id);
            if (element) {
                return {
                    id: id,
                    element: element,
                    top: element.offsetTop,
                    height: element.offsetHeight,
                    isVisible: false,
                    animationDelay: 0
                };
            }
            return null;
        }).filter(section => section !== null);
    }

    createTransitionElements() {
        // Crear overlay de transición
        this.transitionOverlay = document.createElement('div');
        this.transitionOverlay.className = 'section-transition-overlay';
        this.transitionOverlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-line"></div>
                <div class="transition-text"></div>
            </div>
        `;
        document.body.appendChild(this.transitionOverlay);

        // Crear indicadores de progreso
        this.progressIndicator = document.createElement('div');
        this.progressIndicator.className = 'section-progress-indicator';
        document.body.appendChild(this.progressIndicator);
    }

    addEventListeners() {
        // Scroll suave para navegación
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.smoothScrollToSection(targetId);
            });
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                this.navigateToNextSection();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                this.navigateToPreviousSection();
            }
        });

        // Resize event
        window.addEventListener('resize', () => {
            this.getSections();
        });
    }

    observeSections() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-10% 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = this.sections.find(s => s.element === entry.target);
                if (section) {
                    if (entry.isIntersecting && !section.isVisible) {
                        this.enterSection(section);
                    } else if (!entry.isIntersecting && section.isVisible) {
                        this.exitSection(section);
                    }
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section.element);
        });
    }

    enterSection(section) {
        section.isVisible = true;
        this.currentSection = this.sections.indexOf(section);
        
        // Animación de entrada
        this.animateSectionEnter(section);
        
        // Actualizar indicador de progreso
        this.updateProgressIndicator();
        
        // Efecto de transición
        this.showTransitionEffect(section.id);
    }

    exitSection(section) {
        section.isVisible = false;
        
        // Animación de salida
        this.animateSectionExit(section);
    }

    animateSectionEnter(section) {
        const elements = section.element.querySelectorAll('.fade-in, .slide-in, .scale-in');
        
        elements.forEach((element, index) => {
            const delay = index * 100;
            
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px) scale(0.95)';
                
                requestAnimationFrame(() => {
                    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) scale(1)';
                });
            }, delay);
        });
    }

    animateSectionExit(section) {
        const elements = section.element.querySelectorAll('.fade-in, .slide-in, .scale-in');
        
        elements.forEach(element => {
            element.style.transition = 'all 0.4s ease-out';
            element.style.opacity = '0.7';
            element.style.transform = 'translateY(-20px) scale(0.98)';
        });
    }

    showTransitionEffect(sectionId) {
        const sectionNames = {
            'hero': 'Inicio',
            'about': 'Sobre Mí',
            'experience': 'Experiencia',
            'skills': 'Habilidades',
            'projects': 'Proyectos',
            'contact': 'Contacto'
        };

        const transitionText = this.transitionOverlay.querySelector('.transition-text');
        transitionText.textContent = sectionNames[sectionId] || sectionId;

        // Mostrar overlay
        this.transitionOverlay.classList.add('active');
        
        // Animar línea
        const line = this.transitionOverlay.querySelector('.transition-line');
        line.style.width = '100%';
        
        // Ocultar después de la animación
        setTimeout(() => {
            this.transitionOverlay.classList.remove('active');
            line.style.width = '0%';
        }, 800);
    }

    updateProgressIndicator() {
        const progress = ((this.currentSection + 1) / this.sections.length) * 100;
        this.progressIndicator.style.width = `${progress}%`;
    }

    smoothScrollToSection(sectionId) {
        const section = this.sections.find(s => s.id === sectionId);
        if (!section || this.isTransitioning) return;

        this.isTransitioning = true;
        
        const targetPosition = section.top;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.transitionDuration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * easedProgress);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.isTransitioning = false;
            }
        };

        requestAnimationFrame(animateScroll);
    }

    navigateToNextSection() {
        if (this.currentSection < this.sections.length - 1) {
            const nextSection = this.sections[this.currentSection + 1];
            this.smoothScrollToSection(nextSection.id);
        }
    }

    navigateToPreviousSection() {
        if (this.currentSection > 0) {
            const prevSection = this.sections[this.currentSection - 1];
            this.smoothScrollToSection(prevSection.id);
        }
    }

    // Efectos especiales
    createParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            this.sections.forEach(section => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                
                if (section.element.classList.contains('parallax')) {
                    section.element.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }

    // Limpiar recursos
    dispose() {
        if (this.transitionOverlay) {
            this.transitionOverlay.remove();
        }
        if (this.progressIndicator) {
            this.progressIndicator.remove();
        }
    }
}

export default SectionTransitions;
