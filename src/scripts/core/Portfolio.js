/**
 * Portfolio - Main application controller
 * Manages all engines, modules, and interactions
 */

import { CONFIG } from '../config/config.js';
import { log } from '../utils/logger.js';
import { DOM, Events, Performance } from '../utils/helpers.js';
import { NeuralBackgroundEngine } from '../engines/neural-background-engine.js';
import { DeviceDetector } from '../utils/device-detector.js';
import { MobileMenuManager } from '../utils/mobile-menu.js';
import { HeroAnimations } from '../utils/hero-animations.js';
import { AboutAnimations } from '../utils/about-animations.js';
import { KonamiEasterEgg } from './KonamiEasterEgg.js';

// Lazy imports for desktop-only engines
let VisualEffectsEngine = null;
let HeroThreeEngine = null;
let CursorParticlesEngine = null;

export class Portfolio {
    constructor() {
        this.visualEngine = null;
        this.brainEngine = null;
        this.neuralBackground = null;
        this.heroEngine = null;
        this.cursorEngine = null;
        this.deviceDetector = null;
        this.mobileMenuManager = null;
        this.heroAnimations = null;
        this.aboutAnimations = null;
        this.konamiEasterEgg = null;
        this.isInitialized = false;
        this.modules = new Map();
    }

    async init() {
        try {
            await this.initializeBasicModules();
            this.setupBasicFeatures();
            await this.initializeAdvancedModules();
            this.setupGlobalEvents();
            this.isInitialized = true;
            log.info('Portfolio initialized');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
        }
    }

    async initializeBasicModules() {
        this.deviceDetector = new DeviceDetector();
        this.mobileMenuManager = new MobileMenuManager();
        this.heroAnimations = new HeroAnimations();
        this.aboutAnimations = new AboutAnimations();
        this.konamiEasterEgg = new KonamiEasterEgg();
    }

    async initializeAdvancedModules() {
        const isMobile = window.innerWidth <= 768;
        const isLowPower = window.innerWidth <= 480 ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

        // Visual Effects Engine (skip on mobile for performance)
        if (!isMobile) {
            try {
                const module = await import('../engines/visual-effects-engine.js');
                VisualEffectsEngine = module.VisualEffectsEngine;
                this.visualEngine = new VisualEffectsEngine();
                const currentTheme = localStorage.getItem('theme') || CONFIG.THEMES.DEFAULT;
                this.visualEngine.updateTheme(currentTheme);
                this.initializeSectionEffects();
            } catch (error) {
                log.error('Error initializing visual engine:', error);
            }
        }

        // Global Neural Background (unified background for entire site)
        // Skip on mobile for performance
        if (!isMobile) {
            try {
                this.neuralBackground = new NeuralBackgroundEngine('neural-background-container');
            } catch (error) {
                console.error('Error creating Neural Background:', error);
            }
        }

        // Hero Three.js Engine (skip on low power devices)
        if (!isLowPower) {
            try {
                const module = await import('../engines/hero-three-engine.js');
                HeroThreeEngine = module.HeroThreeEngine;
                this.heroEngine = new HeroThreeEngine();
                await this.heroEngine.init('hero-particles');
            } catch (error) {
                log.error('Error initializing Hero Three.js Engine:', error);
            }
        }

        // Cursor Particles Engine (only on desktop)
        if (!isMobile) {
            try {
                const module = await import('../engines/cursor-particles-engine.js');
                CursorParticlesEngine = module.CursorParticlesEngine;
                this.cursorEngine = new CursorParticlesEngine();
            } catch (error) {
                console.error('Error initializing Cursor Particles Engine:', error);
            }
        }
    }

    initializeSectionEffects() {
        if (!this.visualEngine) return;

        const sections = [
            { name: 'Hero', containerId: 'hero-effects' },
            { name: 'About', containerId: 'about-effects' },
            { name: 'Experience', containerId: 'experience-effects' },
            { name: 'Skills', containerId: 'skills-effects' },
            { name: 'Projects', containerId: 'projects-effects' },
            { name: 'Contact', containerId: 'contact-effects' }
        ];

        sections.forEach(section => {
            const sectionElement = document.getElementById(section.name.toLowerCase());
            if (sectionElement) {
                this.visualEngine.initSectionEffects(section.name, section.containerId);
            }
        });

        this.setupSectionEffectsObserver();
    }

    setupSectionEffectsObserver() {
        const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'contact'];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-effects-active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) observer.observe(section);
        });
    }

    setupBasicFeatures() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupLanguageToggle();
        this.setupMobileOptimizations();
        this.setupTouchInteractions();
    }

    setupThemeToggle() {
        const themeToggle = DOM.select('#theme-toggle');
        if (!themeToggle) return;

        const currentTheme = localStorage.getItem('theme') || CONFIG.THEMES.DEFAULT;
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);

        Events.on(themeToggle, 'click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);

            if (this.visualEngine) this.visualEngine.updateTheme(newTheme);
            if (this.heroEngine) this.heroEngine.updateTheme(newTheme);
            if (this.neuralBackground) this.neuralBackground.updateTheme(newTheme);

            Events.trigger(window, 'themeChanged', { theme: newTheme });
        });
    }

    updateThemeIcon(theme) {
        const themeIcon = DOM.select('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    setupMobileMenu() {
        const menuToggle = DOM.select('#menu-toggle');
        // Support both .nav-links and .cosmic-nav classes
        const navLinks = DOM.select('.cosmic-nav') || DOM.select('.nav-links');
        if (!menuToggle || !navLinks) return;

        Events.on(menuToggle, 'click', () => {
            DOM.toggleClass(navLinks, 'active');
            DOM.toggleClass(menuToggle, 'active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        DOM.selectAll('.nav-link, .cosmic-link').forEach(link => {
            Events.on(link, 'click', () => {
                DOM.removeClasses(navLinks, 'active');
                DOM.removeClasses(menuToggle, 'active');
                document.body.style.overflow = '';
            });
        });

        Events.on(document, 'click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                DOM.removeClasses(navLinks, 'active');
                DOM.removeClasses(menuToggle, 'active');
                document.body.style.overflow = '';
            }
        });
    }

    setupSmoothScrolling() {
        DOM.selectAll('a[href^="#"]').forEach(anchor => {
            Events.on(anchor, 'click', (e) => {
                e.preventDefault();
                const target = DOM.select(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    setupLanguageToggle() {
        const languageToggle = DOM.select('#language-toggle');
        if (!languageToggle) return;

        const currentLanguage = localStorage.getItem('language') || CONFIG.LANGUAGES.DEFAULT;
        document.documentElement.setAttribute('data-language', currentLanguage);

        Events.on(languageToggle, 'click', () => {
            const newLanguage = localStorage.getItem('language') === 'en' ? 'es' : 'en';
            localStorage.setItem('language', newLanguage);
            document.documentElement.setAttribute('data-language', newLanguage);
            Events.trigger(window, 'languageChanged', { language: newLanguage });
        });
    }

    setupMobileOptimizations() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) DOM.addClasses(document.body, 'mobile-device');

        const isTablet = window.innerWidth <= CONFIG.BREAKPOINTS.TABLET && window.innerWidth > CONFIG.BREAKPOINTS.MOBILE;
        if (isTablet) DOM.addClasses(document.body, 'tablet-device');
    }

    setupTouchInteractions() {
        const interactiveElements = DOM.selectAll('.btn, .tech-badge, .nav-link, .card');
        interactiveElements.forEach(element => {
            Events.on(element, 'touchstart', () => { element.style.transform = 'scale(0.95)'; });
            Events.on(element, 'touchend', () => { element.style.transform = ''; });
            Events.on(element, 'touchcancel', () => { element.style.transform = ''; });
        });
    }

    setupGlobalEvents() {
        Events.on(document, 'visibilitychange', () => {
            // Pause/resume animations based on visibility
        });

        Events.on(window, 'resize', Performance.throttle(() => {
            // Handle resize
        }, 100));

        // Keyboard shortcuts
        Events.on(document, 'keydown', (e) => {
            // Escape to close menu
            if (e.key === 'Escape') {
                const navLinks = DOM.select('.cosmic-nav') || DOM.select('.nav-links');
                const menuToggle = DOM.select('#menu-toggle');
                if (navLinks?.classList.contains('active')) {
                    DOM.removeClasses(navLinks, 'active');
                    DOM.removeClasses(menuToggle, 'active');
                    document.body.style.overflow = '';
                }
            }
            // Ctrl+T to toggle theme
            if (e.key === 't' && e.ctrlKey) {
                e.preventDefault();
                DOM.select('#theme-toggle')?.click();
            }

            // Konami code detection
            if (this.konamiEasterEgg) {
                this.konamiEasterEgg.handleKeyPress(e.key);
            }
        });
    }
}
