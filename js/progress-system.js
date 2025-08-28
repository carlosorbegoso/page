// ===== SISTEMA DE PROGRESO INTERACTIVO =====

class ProgressSystem {
    constructor() {
        this.progressBar = null;
        this.sections = [];
        this.currentSection = 0;
        this.init();
    }
    
    init() {
        this.createProgressBar();
        this.detectSections();
        this.addEventListeners();
        this.updateProgress();
    }
    
    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        this.progressBar.innerHTML = `
            <div class="progress-fill"></div>
            <div class="progress-text">0%</div>
        `;
        
        // Insertar después del header
        const header = document.querySelector('header');
        if (header) {
            header.parentNode.insertBefore(this.progressBar, header.nextSibling);
        }
    }
    
    detectSections() {
        this.sections = Array.from(document.querySelectorAll('section[id]'));
    }
    
    addEventListeners() {
        window.addEventListener('scroll', () => {
            this.updateProgress();
            this.updateActiveSection();
        });
        
        // Click en secciones del progreso
        this.progressBar.addEventListener('click', (e) => {
            if (e.target.classList.contains('progress-section')) {
                const sectionId = e.target.dataset.section;
                this.scrollToSection(sectionId);
            }
        });
    }
    
    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressFill = this.progressBar.querySelector('.progress-fill');
        const progressText = this.progressBar.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${scrollPercent}%`;
            progressText.textContent = `${Math.round(scrollPercent)}%`;
        }
    }
    
    updateActiveSection() {
        const scrollTop = window.pageYOffset + 100;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                this.currentSection = index;
                this.highlightActiveSection(section.id);
            }
        });
    }
    
    highlightActiveSection(sectionId) {
        // Remover highlight anterior
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar highlight actual
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Método para mostrar progreso de habilidades
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 500);
        });
    }
    
    // Método para mostrar progreso de proyectos
    showProjectProgress() {
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach((project, index) => {
            setTimeout(() => {
                project.style.opacity = '0';
                project.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    project.style.transition = 'all 0.8s ease';
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }
    
    // Método para mostrar estadísticas animadas
    animateStats() {
        const stats = document.querySelectorAll('.stat-number[data-target]');
        
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateStat = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateStat();
        });
    }
    
    // Método para mostrar timeline progresivo
    showTimelineProgress() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-50px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.8s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100);
            }, index * 300);
        });
    }
    
    // Método para mostrar efectos de entrada
    showEntranceEffects() {
        const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => observer.observe(el));
    }
    
    // Método para pausar/reanudar animaciones
    toggleAnimations(pause = false) {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
        
        animatedElements.forEach(el => {
            if (pause) {
                el.style.animationPlayState = 'paused';
            } else {
                el.style.animationPlayState = 'running';
            }
        });
    }
    
    // Método para limpiar
    dispose() {
        if (this.progressBar) {
            this.progressBar.remove();
        }
    }
}

// Exportar para uso global
export default ProgressSystem;
