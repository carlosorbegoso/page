// ===== SISTEMA PRINCIPAL DEL PORTFOLIO - COMPLETO Y OPTIMIZADO =====

import VisualEffectsEngine from './visual-effects-engine.js';
import StyleManager from './style-manager.js';
import ProgressSystem from './progress-system.js';
import LanguageSystem from './language-system.js';

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando portfolio...');
    
    try {
        // Inicializar gestores
        const styleManager = new StyleManager();
        const visualEngine = new VisualEffectsEngine();
        const progressSystem = new ProgressSystem();
        const languageSystem = new LanguageSystem();
        
        // Hacer accesibles globalmente
        window.styleManager = styleManager;
        window.visualEngine = visualEngine;
        window.progressSystem = progressSystem;
        window.languageSystem = languageSystem;
        
        // Configurar funcionalidades básicas
        setupThemeToggle();
        setupMobileMenu();
        setupSmoothScrolling();
        setupAnimations();
        setupCounters();
        setupInteractiveElements();
        setupPerformanceOptimizations();
        setupLanguageToggle(); // Llamar a la nueva función
        
        console.log('✅ Portfolio inicializado correctamente!');
        
    } catch (error) {
        console.error('❌ Error inicializando portfolio:', error);
        showFallbackMessage();
    }
});

// ===== FUNCIONALIDADES BÁSICAS =====

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (!themeToggle || !themeIcon) return;
    
    // Obtener tema guardado
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        
        // Cambiar tema
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Actualizar icono
        updateThemeIcon(newTheme);
        
        // Disparar evento para el motor visual
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
        
        // Mostrar notificación
        showNotification(`Tema cambiado a ${newTheme === 'light' ? 'claro' : 'oscuro'}`, 'success');
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Animar icono del menú
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        }
    });
    
    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        });
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Mostrar notificación de navegación
                const sectionName = this.textContent.trim();
                showNotification(`Navegando a ${sectionName}`, 'info');
            }
        });
    });
}

function setupAnimations() {
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Aplicar animaciones específicas
                applySpecificAnimations(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos con animaciones
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

function applySpecificAnimations(element) {
    // Animaciones para estadísticas
    if (element.classList.contains('stat-number')) {
        animateNumber(element);
    }
    
    // Animaciones para barras de habilidades
    if (element.closest('.skill-item')) {
        animateSkillBar(element.closest('.skill-item'));
    }
    
    // Animaciones para timeline
    if (element.classList.contains('timeline-item')) {
        animateTimelineItem(element);
    }
    
    // Animaciones para proyectos
    if (element.classList.contains('project-card')) {
        animateProjectCard(element);
    }
}

function setupCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        counter.classList.add('completed');
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function setupInteractiveElements() {
    // Efectos hover para tech badges
    document.querySelectorAll('.tech-badge').forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-5px) scale(1.1)';
            badge.style.boxShadow = '0 15px 30px rgba(100, 181, 246, 0.4)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0) scale(1)';
            badge.style.boxShadow = '0 5px 15px rgba(100, 181, 246, 0.2)';
        });
    });
    
    // Efectos para botones
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efectos para cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function setupPerformanceOptimizations() {
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimizar scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.visualEngine) {
                window.visualEngine.setPerformanceMode('low');
                setTimeout(() => {
                    window.visualEngine.setPerformanceMode('high');
                }, 1000);
            }
        }, 100);
    });
}

// ===== FUNCIÓN DE CAMBIO DE IDIOMA =====
function setupLanguageToggle() {
    console.log('🔧 Configurando botón de cambio de idioma...');
    const languageToggle = document.getElementById('language-toggle');
    console.log('🔍 Botón encontrado:', languageToggle);
    
    if (languageToggle) {
        console.log('✅ Agregando event listener al botón de idioma');
        languageToggle.addEventListener('click', () => {
            console.log('🖱️ Botón de idioma clickeado!');
            if (window.languageSystem) {
                console.log('✅ LanguageSystem disponible, cambiando idioma');
                window.languageSystem.toggleLanguage();
            } else {
                console.error('❌ LanguageSystem NO disponible!');
            }
        });
        console.log('✅ Event listener agregado correctamente');
    } else {
        console.error('❌ Botón de idioma NO encontrado!');
    }
}

// ===== ANIMACIONES ESPECÍFICAS =====

function animateNumber(element) {
    const finalValue = element.textContent;
    const isNumber = /^\d+/.test(finalValue);
    
    if (isNumber) {
        const target = parseInt(finalValue);
        let current = 0;
        const increment = target / 30;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.add('completed');
            }
            element.textContent = Math.floor(current) + finalValue.replace(/^\d+/, '');
        }, 50);
    }
}

function animateSkillBar(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    if (progressBar) {
        const width = progressBar.style.width || '80%';
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.width = width;
            progressBar.classList.add('animated');
        }, 300);
    }
}

function animateTimelineItem(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-50px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
        element.classList.add('animated');
    }, 100);
}

function animateProjectCard(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.8s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.classList.add('animated');
    }, 200);
}

// ===== SISTEMA DE NOTIFICACIONES =====

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border-color);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// ===== UTILIDADES GLOBALES =====

function showFallbackMessage() {
    showNotification('⚠️ Algunos efectos visuales no están disponibles', 'warning');
}

function optimizeAfterScroll() {
    if (window.visualEngine) {
        window.visualEngine.setPerformanceMode('low');
        setTimeout(() => {
            window.visualEngine.setPerformanceMode('high');
        }, 1000);
    }
}

function cleanupOffscreenElements() {
    if (window.visualEngine) {
        // Implementar lógica de limpieza si es necesario
    }
}

// ===== EVENTOS GLOBALES =====

// Optimizar en scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(optimizeAfterScroll, 100);
});

// Pausar animaciones cuando la página no está visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (window.visualEngine) {
            window.visualEngine.setPerformanceMode('low');
        }
        if (window.progressSystem) {
            window.progressSystem.toggleAnimations(true);
        }
    } else {
        if (window.visualEngine) {
            window.visualEngine.setPerformanceMode('high');
        }
        if (window.progressSystem) {
            window.progressSystem.toggleAnimations(false);
        }
    }
});

// Manejar resize
window.addEventListener('resize', () => {
    if (window.visualEngine) {
        window.visualEngine.onWindowResize();
    }
});

// Eventos de teclado para accesibilidad
document.addEventListener('keydown', (e) => {
    // ESC para cerrar menú móvil
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.getElementById('menu-toggle');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
    
    // T para cambiar tema
    if (e.key === 't' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('theme-toggle')?.click();
    }
});

console.log('📦 Main.js cargado correctamente con todas las funcionalidades');
