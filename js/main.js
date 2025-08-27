// ===== FUNCIONALIDAD PRINCIPAL DEL PORTFOLIO =====

// Importar módulos
import i18n from './i18n.js';
import UIEnhancements from './enhancements.js';

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeToggle.title = 'Cambiar a tema claro';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeToggle.title = 'Cambiar a tema oscuro';
    }
}

// Language toggle functionality
const languageToggle = document.getElementById('languageToggle');

languageToggle.addEventListener('click', () => {
    i18n.toggleLanguage();
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scrolling for navigation links
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
        navLinks.classList.remove('active');
    });
});

// Intersection Observer for fade-in animations
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

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Active nav link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Interactive effects for cards
document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill tags hover effect
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function() {
        // Add a ripple effect or highlight
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// Tech stack rotation in hero
const techBadges = document.querySelectorAll('.tech-badge');
let currentIndex = 0;

setInterval(() => {
    techBadges.forEach((badge, index) => {
        badge.style.transform = index === currentIndex ? 'scale(1.1)' : 'scale(1)';
    });
    currentIndex = (currentIndex + 1) % techBadges.length;
}, 2000);

// Dynamic typing effect for role
const roles = ['Backend Developer', 'Java Specialist', 'Quarkus Expert', 'Spring Developer'];
const roleElement = document.querySelector('.role');
let roleIndex = 0;

function typeRole() {
    if (roleElement && roles.length > 1) {
        roleElement.style.opacity = '0';
        setTimeout(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            roleElement.textContent = roles[roleIndex];
            roleElement.style.opacity = '1';
        }, 300);
    }
}

// Activate typing effect every 4 seconds
setInterval(typeRole, 4000);

// ===== FUNCIONALIDADES ADICIONALES =====

// Lazy loading para imágenes (cuando se agreguen)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
}

// Smooth reveal on scroll
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Parallax effect for hero section
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    revealOnScroll();
    parallaxEffect();
}, 16)); // ~60fps

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading
    lazyLoadImages();
    
    // Add reveal class to elements that should animate on scroll
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('reveal');
    });
    
    // Initial reveal check
    revealOnScroll();
    
    console.log('Portfolio loaded successfully! 🚀');
});

// ===== MEJORAS DE ACCESIBILIDAD =====

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
    
    // Enter key activates focused elements
    if (e.key === 'Enter') {
        const focused = document.activeElement;
        if (focused.classList.contains('skill-tag')) {
            focused.click();
        }
    }
});

// Focus management for mobile menu
menuToggle.addEventListener('click', function() {
    if (navLinks.classList.contains('active')) {
        // Focus first menu item when opening
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
    }
});

// ===== ANALYTICS Y MONITOREO =====

// Track user interactions
function trackInteraction(element, action) {
    // Aquí puedes integrar Google Analytics o similar
    console.log(`User ${action} on ${element}`);
}

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', throttle(() => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) { // Track every 25%
            trackInteraction('page', `scrolled to ${maxScroll}%`);
        }
    }
}, 1000));
