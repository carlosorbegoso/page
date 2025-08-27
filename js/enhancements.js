// ===== MEJORAS AVANZADAS DE UI/UX =====

class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.createSkipToContent();
        this.createBackToTop();
        this.createProgressBar();
        this.createLoadingStates();
        this.createSkeletonScreens();
        this.createMicroInteractions();
        this.createKeyboardShortcuts();
        this.createTouchGestures();
        this.createParallaxEffects();
        this.createStaggeredAnimations();
        this.createProjectFilters();
        this.createSearchFunctionality();
        this.createProjectModals();
        this.createTimelineInteractions();
        this.createHapticFeedback();
        this.createOfflineSupport();
    }

    // ===== ACCESIBILIDAD =====
    
    createSkipToContent() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido';
        skipLink.className = 'skip-to-content';
        skipLink.setAttribute('aria-label', 'Saltar al contenido principal');
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Agregar ID al contenido principal
        const mainContent = document.querySelector('.hero');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    }

    // ===== NAVEGACIÓN MEJORADA =====
    
    createBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.setAttribute('aria-label', 'Volver arriba');
        backToTop.style.display = 'none';
        
        document.body.appendChild(backToTop);
        
        // Mostrar/ocultar botón
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        // Scroll suave al hacer click
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // ===== ESTADOS DE CARGA =====
    
    createLoadingStates() {
        // Agregar loading states a botones
        document.querySelectorAll('button, .cta-button').forEach(button => {
            button.addEventListener('click', function() {
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
                    
                    // Simular carga
                    setTimeout(() => {
                        this.classList.remove('loading');
                        this.innerHTML = this.getAttribute('data-original-text') || this.innerHTML;
                    }, 2000);
                }
            });
        });
    }

    createSkeletonScreens() {
        // Crear skeleton para proyectos
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('loading-skeleton');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('loading-skeleton');
            });
        });
    }

    // ===== MICRO-INTERACCIONES =====
    
    createMicroInteractions() {
        // Efectos de ripple en botones
        document.querySelectorAll('button, .cta-button, .skill-tag').forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Efectos de hover mejorados
        document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            });
        });
    }

    // ===== ATAJOS DE TECLADO =====
    
    createKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + L: Cambiar idioma
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                const languageToggle = document.getElementById('languageToggle');
                if (languageToggle) languageToggle.click();
            }
            
            // Ctrl/Cmd + T: Cambiar tema
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) themeToggle.click();
            }
            
            // ESC: Cerrar modales/menús
            if (e.key === 'Escape') {
                const navLinks = document.getElementById('navLinks');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
            
            // Números para navegación rápida
            if (e.key >= '1' && e.key <= '6') {
                const sections = ['#home', '#about', '#experience', '#skills', '#projects', '#contact'];
                const targetSection = sections[parseInt(e.key) - 1];
                if (targetSection) {
                    e.preventDefault();
                    document.querySelector(targetSection)?.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // ===== GESTOS TÁCTILES =====
    
    createTouchGestures() {
        let startX = 0;
        let startY = 0;
        let currentSection = 0;
        const sections = document.querySelectorAll('section');
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Swipe horizontal para cambiar secciones
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0 && currentSection < sections.length - 1) {
                    currentSection++;
                } else if (diffX < 0 && currentSection > 0) {
                    currentSection--;
                }
                
                sections[currentSection]?.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Pull to refresh effect
            if (diffY > 100 && window.pageYOffset === 0) {
                this.createPullToRefreshEffect();
            }
        });
    }

    createPullToRefreshEffect() {
        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-refresh-indicator';
        refreshIndicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Actualizando...';
        document.body.appendChild(refreshIndicator);
        
        setTimeout(() => {
            refreshIndicator.remove();
            // Aquí podrías recargar datos o hacer alguna acción
        }, 2000);
    }

    // ===== EFECTOS VISUALES =====
    
    createParallaxEffects() {
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    createStaggeredAnimations() {
        // Animación escalonada para skill tags
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.1}s`;
            tag.classList.add('staggered-fade-in');
        });
        
        // Animación escalonada para project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('staggered-slide-up');
        });
    }

    // ===== FILTROS Y BÚSQUEDA =====
    
    createProjectFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.innerHTML = `
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">Todos</button>
                <button class="filter-btn" data-filter="java">Java</button>
                <button class="filter-btn" data-filter="spring">Spring</button>
                <button class="filter-btn" data-filter="quarkus">Quarkus</button>
                <button class="filter-btn" data-filter="angular">Angular</button>
            </div>
        `;
        
        const projectsSection = document.querySelector('#projects .container');
        if (projectsSection) {
            projectsSection.insertBefore(filterContainer, projectsSection.firstChild);
        }
        
        // Funcionalidad de filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Actualizar botones activos
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrar proyectos
                document.querySelectorAll('.project-card').forEach(card => {
                    const techs = card.querySelectorAll('.tech-tag');
                    const hasTech = Array.from(techs).some(tech => 
                        filter === 'all' || tech.textContent.toLowerCase().includes(filter.toLowerCase())
                    );
                    
                    card.style.display = hasTech ? 'block' : 'none';
                    if (hasTech) {
                        card.classList.add('filtered-in');
                    }
                });
            });
        });
    }

    createSearchFunctionality() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Buscar habilidades, tecnologías..." class="search-input">
                <button class="search-clear" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const skillsSection = document.querySelector('#skills .container');
        if (skillsSection) {
            skillsSection.insertBefore(searchContainer, skillsSection.firstChild);
        }
        
        const searchInput = searchContainer.querySelector('.search-input');
        const searchClear = searchContainer.querySelector('.search-clear');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const skillTags = document.querySelectorAll('.skill-tag');
            
            skillTags.forEach(tag => {
                const text = tag.textContent.toLowerCase();
                const matches = text.includes(query);
                tag.style.display = matches ? 'inline-block' : 'none';
                
                if (matches) {
                    tag.classList.add('search-highlight');
                } else {
                    tag.classList.remove('search-highlight');
                }
            });
            
            searchClear.style.display = query ? 'block' : 'none';
        });
        
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });
    }

    // ===== MODALES Y LIGHTBOX =====
    
    createProjectModals() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('.project-title').textContent;
                const type = this.querySelector('.project-type').textContent;
                const description = this.querySelector('p').textContent;
                const techs = Array.from(this.querySelectorAll('.tech-tag')).map(t => t.textContent);
                
                this.createProjectModal(title, type, description, techs);
            });
        });
    }

    createProjectModal(title, type, description, techs) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="modal-type">${type}</p>
                    <p class="modal-description">${description}</p>
                    <div class="modal-tech">
                        ${techs.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        
        // ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.remove();
        });
    }

    // ===== INTERACCIONES DEL TIMELINE =====
    
    createTimelineInteractions() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            item.addEventListener('click', function() {
                // Expandir/contraer timeline item
                this.classList.toggle('expanded');
                
                if (this.classList.contains('expanded')) {
                    this.style.height = 'auto';
                    this.style.overflow = 'visible';
                } else {
                    this.style.height = '';
                    this.style.overflow = '';
                }
            });
            
            // Hover effects mejorados
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(10px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0) scale(1)';
            });
        });
    }

    // ===== FEEDBACK HÁPTICO =====
    
    createHapticFeedback() {
        if ('vibrate' in navigator) {
            document.querySelectorAll('button, .cta-button, .skill-tag').forEach(element => {
                element.addEventListener('click', () => {
                    navigator.vibrate(50); // Vibración corta
                });
            });
        }
    }

    // ===== SOPORTE OFFLINE =====
    
    createOfflineSupport() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registrado:', registration);
                })
                .catch(error => {
                    console.log('Error al registrar ServiceWorker:', error);
                });
        }
        
        // Detectar estado offline/online
        window.addEventListener('online', () => {
            this.showNotification('Conexión restaurada', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('Sin conexión - Modo offline', 'warning');
        });
    }

    // ===== NOTIFICACIONES =====
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Ocultar automáticamente
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

export default UIEnhancements;
