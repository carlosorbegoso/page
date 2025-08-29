// ===== MOTOR PRINCIPAL DE EFECTOS VISUALES - ORQUESTADOR =====

// Importar Three.js como módulo ES6 con Vite
import * as THREE from 'three';

// Importar módulos especializados
import { ParticleSystem } from './modules/particle-system.js';
import { ConstellationSystem } from './modules/constellation-system.js';
import { CursorSystem } from './modules/cursor-system.js';
import { BackgroundSystem } from './modules/background-system.js';

class VisualEffectsEngine {
    constructor() {
        this.isInitialized = false;
        this.currentTheme = 'light';
        this.performanceMode = 'high';
        
        // Sistemas modulares
        this.particleSystem = null;
        this.constellationSystem = null;
        this.cursorSystem = null;
        this.backgroundSystem = null;
        
        // Escena principal
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // Efectos por sección
        this.sectionEffects = new Map();
        
        // Inicializar al crear la instancia
        this.init();
    }

    // ===== INICIALIZACIÓN =====
    async init() {
        try {
            this.createScene();
            this.createCamera();
            this.createRenderer();
            
            // Inicializar sistemas modulares
            this.backgroundSystem = new BackgroundSystem(this.scene);
            this.particleSystem = new ParticleSystem(this.scene);
            
            // Inicializar constellation system de forma asíncrona para asegurar que THREE esté listo
            try {
                await this.initializeConstellationSystem();
            } catch (error) {
                console.error('❌ Error inicializando ConstellationSystem:', error);
            }
            
            this.cursorSystem = new CursorSystem(this.scene, this.camera);
            
            // Configurar eventos
            this.addEventListeners();
            
            // Iniciar animación
            this.animate();
            
            this.isInitialized = true;
            
        } catch (error) {
            console.error('❌ Error inicializando motor visual:', error);
        }
    }
    
    // ===== INICIALIZACIÓN ASÍNCRONA DEL SISTEMA DE CONSTELACIONES =====
    async initializeConstellationSystem() {
        // Esperar un poco para asegurar que THREE esté completamente cargado
        await new Promise(resolve => setTimeout(resolve, 50));
        
        this.constellationSystem = new ConstellationSystem(this.scene);
    }

    // ===== CONFIGURACIÓN DE ESCENA =====
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1000, 2000);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            2000
        );
        this.camera.position.set(0, 0, 500);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Agregar al DOM
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.zIndex = '-1';
        this.renderer.domElement.style.pointerEvents = 'none';
    }

    // ===== SISTEMA UNIFICADO DE EFECTOS POR SECCIÓN =====
    
    /**
     * Inicializa efectos para una sección específica reutilizando la lógica del Hero
     */
    initSectionEffects(sectionName, containerId, config = {}) {
        try {
            // Configuración por defecto basada en el Hero
            const defaultConfig = {
                particles: {
                    count: 100,
                    size: { min: 1, max: 3 },
                    speed: { min: 0.1, max: 0.3 },
                    opacity: { min: 0.3, max: 0.8 },
                    colors: ['#64B5F6', '#4FC3F7', '#81D4FA']
                },
                constellations: {
                    count: 3,
                    starsPerConstellation: { min: 4, max: 6 },
                    connectionOpacity: 0.4,
                    glowIntensity: 0.6
                },
                stars: {
                    count: 150,
                    size: { min: 0.5, max: 2 },
                    twinkleSpeed: { min: 2, max: 5 }
                },
                floatingElements: {
                    count: 4,
                    size: { min: 2, max: 4 }
                }
            };

            // Personalizar configuración según la sección
            const sectionConfig = this.getSectionSpecificConfig(sectionName, defaultConfig);
            
            // Crear contenedor si no existe
            this.createSectionContainer(containerId);
            
            // Inicializar efectos
            const effects = {
                particles: this.createSectionParticles(containerId, sectionConfig.particles),
                constellations: this.createSectionConstellations(containerId, sectionConfig.constellations),
                stars: this.createSectionStars(containerId, sectionConfig.stars),
                floatingElements: this.createSectionFloatingElements(containerId, sectionConfig.floatingElements)
            };
            
            // Guardar efectos de la sección
            this.sectionEffects.set(sectionName, effects);
            
            console.log(`✅ Efectos inicializados para ${sectionName}`);
            return effects;
            
        } catch (error) {
            console.error(`❌ Error inicializando efectos para ${sectionName}:`, error);
            return null;
        }
    }
    
    /**
     * Obtiene configuración específica para cada sección
     */
    getSectionSpecificConfig(sectionName, defaultConfig) {
        const config = JSON.parse(JSON.stringify(defaultConfig)); // Deep copy
        
        switch (sectionName.toLowerCase()) {
            case 'hero':
                // Configuración original del Hero
                break;
                
            case 'about':
                // About: Azules y verdes
                config.particles.colors = ['#64B5F6', '#4FC3F7', '#81D4FA'];
                config.constellations.count = 4;
                config.floatingElements.count = 5;
                break;
                
            case 'experience':
                // Experience: Naranjas y rojos
                config.particles.colors = ['#FF6B35', '#FF5722', '#FF8A65'];
                config.constellations.count = 3;
                config.floatingElements.count = 4;
                break;
                
            case 'skills':
                // Skills: Verdes y azules
                config.particles.colors = ['#4CAF50', '#8BC34A', '#64B5F6'];
                config.constellations.count = 5;
                config.floatingElements.count = 6;
                break;
                
            case 'projects':
                // Projects: Púrpuras y azules
                config.particles.colors = ['#9C27B0', '#673AB7', '#64B5F6'];
                config.constellations.count = 4;
                config.floatingElements.count = 5;
                break;
                
            case 'contact':
                // Contact: Azules y cian
                config.particles.colors = ['#00BCD4', '#4FC3F7', '#64B5F6'];
                config.constellations.count = 3;
                config.floatingElements.count = 4;
                break;
                
            default:
                // Usar configuración por defecto
                break;
        }
        
        return config;
    }
    
    /**
     * Crea contenedor para los efectos de una sección
     */
    createSectionContainer(containerId) {
        let container = document.getElementById(containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'section-effects-container';
            container.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            `;
            
            // Buscar la sección padre y agregar el contenedor
            const section = document.querySelector(`#${containerId.replace('-effects', '')}`);
            if (section) {
                section.style.position = 'relative';
                section.appendChild(container);
            }
        }
        
        return container;
    }
    
    /**
     * Crea partículas para una sección
     */
    createSectionParticles(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        const particles = [];
        
        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'section-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * (config.size.max - config.size.min) + config.size.min}px;
                height: ${Math.random() * (config.size.max - config.size.min) + config.size.min}px;
                background: ${config.colors[Math.floor(Math.random() * config.colors.length)]};
                border-radius: 50%;
                opacity: ${Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min};
                pointer-events: none;
                z-index: 2;
            `;
            
            // Posición aleatoria
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Animación personalizada
            const animationDuration = (Math.random() * (config.speed.max - config.speed.min) + config.speed.min) * 10;
            particle.style.animation = `sectionParticleFloat ${animationDuration}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            container.appendChild(particle);
            particles.push(particle);
        }
        
        return particles;
    }
    
    /**
     * Crea constelaciones para una sección
     */
    createSectionConstellations(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        const constellations = [];
        
        for (let i = 0; i < config.count; i++) {
            const constellation = document.createElement('div');
            constellation.className = 'section-constellation';
            constellation.style.cssText = `
                position: absolute;
                width: ${60 + Math.random() * 40}px;
                height: ${60 + Math.random() * 40}px;
                background: radial-gradient(circle, rgba(100, 181, 246, 0.08) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 3;
            `;
            
            // Posición aleatoria
            constellation.style.left = Math.random() * 80 + 10 + '%';
            constellation.style.top = Math.random() * 80 + 10 + '%';
            
            // Animación
            constellation.style.animation = `sectionConstellationGlow 6s ease-in-out infinite`;
            constellation.style.animationDelay = Math.random() * 3 + 's';
            
            container.appendChild(constellation);
            constellations.push(constellation);
        }
        
        return constellations;
    }
    
    /**
     * Crea estrellas para una sección
     */
    createSectionStars(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        const stars = [];
        
        for (let i = 0; i < config.count; i++) {
            const star = document.createElement('div');
            star.className = 'section-star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * (config.size.max - config.size.min) + config.size.min}px;
                height: ${Math.random() * (config.size.max - config.size.min) + config.size.min}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 4;
            `;
            
            // Posición aleatoria
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // Animación
            const twinkleSpeed = Math.random() * (config.twinkleSpeed.max - config.twinkleSpeed.min) + config.twinkleSpeed.min;
            star.style.animation = `sectionStarTwinkle ${twinkleSpeed}s ease-in-out infinite`;
            star.style.animationDelay = Math.random() * 3 + 's';
            
            container.appendChild(star);
            stars.push(star);
        }
        
        return stars;
    }
    
    /**
     * Crea elementos flotantes para una sección
     */
    createSectionFloatingElements(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        const elements = [];
        
        for (let i = 0; i < config.count; i++) {
            const element = document.createElement('div');
            element.className = 'section-floating-element';
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * (config.size.max - config.size.min) + config.size.min}px;
                height: ${Math.random() * (config.size.max - config.size.min) + config.size.min}px;
                background: rgba(100, 181, 246, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 5;
            `;
            
            // Posición aleatoria
            element.style.left = Math.random() * 80 + 10 + '%';
            element.style.top = Math.random() * 80 + 10 + '%';
            
            // Animación
            element.style.animation = `sectionFloat 8s ease-in-out infinite`;
            element.style.animationDelay = Math.random() * 4 + 's';
            
            container.appendChild(element);
            elements.push(element);
        }
        
        return elements;
    }
    
    /**
     * Limpia efectos de una sección
     */
    cleanupSectionEffects(sectionName) {
        const effects = this.sectionEffects.get(sectionName);
        if (effects) {
            // Limpiar partículas
            if (effects.particles) {
                effects.particles.forEach(particle => particle.remove());
            }
            
            // Limpiar constelaciones
            if (effects.constellations) {
                effects.constellations.forEach(constellation => constellation.remove());
            }
            
            // Limpiar estrellas
            if (effects.stars) {
                effects.stars.forEach(star => star.remove());
            }
            
            // Limpiar elementos flotantes
            if (effects.floatingElements) {
                effects.floatingElements.forEach(element => element.remove());
            }
            
            this.sectionEffects.delete(sectionName);
        }
    }

    // ===== EVENTOS Y ANIMACIÓN =====
    addEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    onScroll() {
        // Implementar efectos de scroll si es necesario
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        if (this.constellationSystem) {
            this.constellationSystem.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // ===== GESTIÓN DE TEMA =====
    updateTheme(theme) {
        this.currentTheme = theme;
        
        // Actualizar tema en todos los sistemas
        if (this.constellationSystem) {
            this.constellationSystem.updateTheme(theme);
        }
        
        // Actualizar efectos de todas las secciones
        this.sectionEffects.forEach((effects, sectionName) => {
            this.updateSectionTheme(sectionName, theme);
        });
    }
    
    updateSectionTheme(sectionName, theme) {
        const effects = this.sectionEffects.get(sectionName);
        if (!effects) return;
        
        // Actualizar colores según el tema
        const isDark = theme === 'dark';
        
        if (effects.particles) {
            effects.particles.forEach(particle => {
                if (isDark) {
                    particle.style.filter = 'brightness(1.2)';
                } else {
                    particle.style.filter = 'brightness(1)';
                }
            });
        }
    }

    // ===== LIMPIEZA =====
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Limpiar efectos de todas las secciones
        this.sectionEffects.forEach((effects, sectionName) => {
            this.cleanupSectionEffects(sectionName);
        });
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

export { VisualEffectsEngine };
