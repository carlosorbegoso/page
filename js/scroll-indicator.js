// ===== INDICADOR DE SCROLL VISUAL =====

class ScrollIndicator {
    constructor() {
        this.sections = [];
        this.indicator = null;
        this.currentSection = 0;
        
        this.init();
    }

    init() {
        this.createIndicator();
        this.getSections();
        this.addEventListeners();
        this.updateIndicator();
    }

    createIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.className = 'section-indicator';
        this.indicator.innerHTML = `
            <div class="section-dot" data-section="Inicio" data-section-id="hero"></div>
            <div class="section-dot" data-section="Sobre Mí" data-section-id="about"></div>
            <div class="section-dot" data-section="Experiencia" data-section-id="experience"></div>
            <div class="section-dot" data-section="Habilidades" data-section-id="skills"></div>
            <div class="section-dot" data-section="Proyectos" data-section-id="projects"></div>
            <div class="section-dot" data-section="Contacto" data-section-id="contact"></div>
        `;
        
        document.body.appendChild(this.indicator);
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
                    height: element.offsetHeight
                };
            }
            return null;
        }).filter(section => section !== null);
    }

    addEventListeners() {
        // Scroll event
        window.addEventListener('scroll', () => {
            this.updateIndicator();
        });

        // Click en indicadores
        this.indicator.addEventListener('click', (e) => {
            if (e.target.classList.contains('section-dot')) {
                const sectionId = e.target.getAttribute('data-section-id');
                this.scrollToSection(sectionId);
            }
        });

        // Resize event
        window.addEventListener('resize', () => {
            this.getSections();
        });
    }

    updateIndicator() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const scrollMiddle = scrollTop + windowHeight / 2;

        let activeSection = 0;

        this.sections.forEach((section, index) => {
            const sectionTop = section.top;
            const sectionBottom = section.top + section.height;

            if (scrollMiddle >= sectionTop && scrollMiddle < sectionBottom) {
                activeSection = index;
            }
        });

        if (activeSection !== this.currentSection) {
            this.currentSection = activeSection;
            this.updateActiveDot();
        }
    }

    updateActiveDot() {
        const dots = this.indicator.querySelectorAll('.section-dot');
        
        dots.forEach((dot, index) => {
            if (index === this.currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = 80; // Altura del header
            const targetPosition = section.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Método para mostrar/ocultar el indicador
    toggle() {
        if (this.indicator) {
            this.indicator.style.display = this.indicator.style.display === 'none' ? 'flex' : 'none';
        }
    }

    // Método para limpiar recursos
    dispose() {
        if (this.indicator) {
            this.indicator.remove();
        }
        
        window.removeEventListener('scroll', this.updateIndicator);
        window.removeEventListener('resize', this.getSections);
    }
}

export default ScrollIndicator;
