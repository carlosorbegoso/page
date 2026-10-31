/**
 * Portfolio - Main application controller
 * Manages all engines, modules, and interactions
 */

import { CONFIG } from '../config/config.js';
import { log } from '../utils/logger.js';
import { DOM, Events, Performance } from '../utils/helpers.js';
import { DeviceDetector } from '../utils/device-detector.js';
import { MobileMenuManager } from '../utils/mobile-menu.js';
import { HeroAnimations } from '../utils/hero-animations.js';
import { AboutAnimations } from '../utils/about-animations.js';
import { KonamiEasterEgg } from './KonamiEasterEgg.js';

// Lazy imports for desktop-only engines
let VisualEffectsEngine = null;
let HeroThreeEngine = null;
let ConnectedParticlesEngine = null;
let CursorParticlesEngine = null;
let AudioReactiveEngine = null;

export class Portfolio {
    constructor() {
        this.visualEngine = null;
        this.brainEngine = null;
        this.heroEngine = null;
        this.connectedParticlesEngine = null;
        this.cursorEngine = null;
        this.audioEngine = null;
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
            log.error('Error initializing portfolio:', error);
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

        // Connected Particles Engine - interactive particle network
        if (!isLowPower) {
            try {
                const module = await import('../engines/connected-particles-engine.js');
                ConnectedParticlesEngine = module.ConnectedParticlesEngine;
                this.connectedParticlesEngine = new ConnectedParticlesEngine();
                await this.connectedParticlesEngine.init('hero-constellations');
            } catch (error) {
                log.error('Error initializing Connected Particles Engine:', error);
            }
        }

        // Cursor Particles Engine (only on desktop)
        if (!isMobile) {
            try {
                const module = await import('../engines/cursor-particles-engine.js');
                CursorParticlesEngine = module.CursorParticlesEngine;
                this.cursorEngine = new CursorParticlesEngine();
            } catch (error) {
                log.error('Error initializing Cursor Particles Engine:', error);
            }
        }

        // Audio Reactive Engine - global audio-reactive system for entire page
        try {
            const module = await import('../engines/audio-reactive-engine.js');
            AudioReactiveEngine = module.AudioReactiveEngine;
            this.audioEngine = new AudioReactiveEngine();
            await this.audioEngine.init();
            if (this.heroEngine) this.audioEngine.setHeroEngine(this.heroEngine);
            if (this.connectedParticlesEngine) this.audioEngine.setConnectedParticlesEngine(this.connectedParticlesEngine);
            if (this.visualEngine) this.audioEngine.setVisualEngine(this.visualEngine);
            if (this.cursorEngine) this.audioEngine.setCursorEngine(this.cursorEngine);
            this.autoStartAudio();
        } catch (error) {
            log.error('Error initializing Audio Reactive Engine:', error);
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
            if (this.connectedParticlesEngine) this.connectedParticlesEngine.updateTheme(newTheme);
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
        // Command Hub navigation is self-contained in Header.astro script
        // No additional setup needed from Portfolio.js
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

    autoStartAudio() {
        if (!this.audioEngine) return;

        // Browsers require user interaction before allowing microphone access
        // Start on first click/touch/key anywhere on the page
        const startAudio = async () => {
            const success = await this.audioEngine.startListening();
            if (success) {
                log.info('Audio reactive engine started - entire page is now sound-reactive');
            }
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
            document.removeEventListener('keydown', startAudio);
        };

        document.addEventListener('click', startAudio, { once: true });
        document.addEventListener('touchstart', startAudio, { once: true });
        document.addEventListener('keydown', startAudio, { once: true });
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
            // Escape to close command palette
            if (e.key === 'Escape') {
                const palette = document.getElementById('cmd-palette');
                const trigger = document.getElementById('cmd-hub-trigger');
                if (palette?.classList.contains('open')) {
                    palette.classList.remove('open');
                    palette.setAttribute('aria-hidden', 'true');
                    trigger?.classList.remove('active');
                    trigger?.setAttribute('aria-expanded', 'false');
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
