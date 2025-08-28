// ===== SISTEMA PRINCIPAL DEL PORTFOLIO - SIMPLIFICADO Y OPTIMIZADO =====

import VisualEffectsEngine from './visual-effects-engine.js';
import StyleManager from './style-manager.js';

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando portfolio...');
    
    try {
        // Inicializar gestores
        const styleManager = new StyleManager();
        const visualEngine = new VisualEffectsEngine();
        
        // Hacer accesibles globalmente
        window.styleManager = styleManager;
        window.visualEngine = visualEngine;
        
        // Configurar funcionalidades básicas
        setupThemeToggle();
        setupMobileMenu();
        setupSmoothScrolling();
        setupAnimations();
        setupCounters();
        
        console.log('✅ Portfolio inicializado correctamente!');
        
    } catch (error) {
        console.error('❌ Error inicializando portfolio:', error);
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
    });
    
    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
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
            }
        });
    }, observerOptions);
    
    // Observar elementos con animaciones
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .scale-in').forEach(el => {
        observer.observe(el);
    });
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
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ===== UTILIDADES GLOBALES =====

// Función para mostrar mensajes de error
function showFallbackMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    message.textContent = '⚠️ Algunos efectos visuales no están disponibles';
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 5000);
}

// Función para optimizar después del scroll
function optimizeAfterScroll() {
    if (window.visualEngine) {
        window.visualEngine.setPerformanceMode('low');
        setTimeout(() => {
            window.visualEngine.setPerformanceMode('high');
        }, 1000);
    }
}

// Función para limpiar elementos fuera de pantalla
function cleanupOffscreenElements() {
    // Esta función se puede usar para limpiar elementos Three.js fuera de pantalla
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
    } else {
        if (window.visualEngine) {
            window.visualEngine.setPerformanceMode('high');
        }
    }
});

// Manejar resize
window.addEventListener('resize', () => {
    if (window.visualEngine) {
        window.visualEngine.onWindowResize();
    }
});

console.log('📦 Main.js cargado correctamente');
