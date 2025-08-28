// ===== MOTOR PRINCIPAL DE EFECTOS VISUALES - ORQUESTADOR =====

// Three.js está disponible globalmente desde el CDN
const THREE = window.THREE;

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
        
        // Inicializar al crear la instancia
        this.init();
    }

    // ===== INICIALIZACIÓN =====
    init() {
        try {
            this.createScene();
            this.createCamera();
            this.createRenderer();
            
            // Inicializar sistemas modulares
            this.backgroundSystem = new BackgroundSystem(this.scene);
            this.particleSystem = new ParticleSystem(this.scene);
            this.constellationSystem = new ConstellationSystem(this.scene);
            this.cursorSystem = new CursorSystem(this.scene, this.camera);
            
            // Configurar eventos
            this.addEventListeners();
            
            // Iniciar animación
            this.animate();
            
            this.isInitialized = true;
            console.log('✅ Motor de efectos visuales inicializado');
            
        } catch (error) {
            console.error('❌ Error inicializando motor visual:', error);
        }
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
        const container = document.getElementById('visual-effects-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    // ===== EVENTOS =====
    addEventListeners() {
        // Resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse move para cursor
        document.addEventListener('mousemove', (e) => {
            if (this.cursorSystem) {
                this.cursorSystem.updatePosition(e.clientX, e.clientY);
            }
        });
        
        // Click para efectos
        document.addEventListener('click', (e) => {
            if (this.cursorSystem) {
                this.cursorSystem.createClickEffect(e.clientX, e.clientY);
            }
        });
    }

    // ===== ANIMACIÓN PRINCIPAL =====
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isInitialized) return;
        
        const time = Date.now() * 0.001;
        
        // Animar sistemas modulares
        if (this.particleSystem) {
            this.particleSystem.animate(time);
        }
        
        if (this.constellationSystem) {
            this.constellationSystem.animate(time);
        }
        
        if (this.cursorSystem) {
            this.cursorSystem.animate(time);
        }
        
        // Renderizar
        this.renderer.render(this.scene, this.camera);
    }

    // ===== GESTIÓN DE TEMAS =====
    updateTheme(theme) {
        this.currentTheme = theme;
        
        // Actualizar todos los sistemas
        if (this.particleSystem) {
            this.particleSystem.updateTheme(theme);
        }
        
        if (this.constellationSystem) {
            this.constellationSystem.updateTheme(theme);
        }
        
        if (this.cursorSystem) {
            this.cursorSystem.updateTheme(theme);
        }
        
        if (this.backgroundSystem) {
            this.backgroundSystem.updateTheme(theme);
        }
    }

    // ===== EFECTOS DE SCROLL =====
    updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrolled / maxScroll;
        
        // Actualizar sistemas con efectos de scroll
        if (this.backgroundSystem) {
            this.backgroundSystem.updateScroll(scrollPercent);
        }
        
        if (this.constellationSystem) {
            this.constellationSystem.updateScroll(scrollPercent);
        }
        
        if (this.particleSystem) {
            this.particleSystem.updateScroll(scrollPercent);
        }
    }

    // ===== UTILIDADES =====
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        // Aplicar a todos los sistemas
        if (this.particleSystem) {
            this.particleSystem.setPerformanceMode(mode);
        }
        
        if (this.constellationSystem) {
            this.constellationSystem.setPerformanceMode(mode);
        }
        
        if (this.cursorSystem) {
            this.cursorSystem.setPerformanceMode(mode);
        }
    }

    // ===== LIMPIEZA =====
    dispose() {
        // Limpiar sistemas modulares
        if (this.particleSystem) {
            this.particleSystem.dispose();
        }
        
        if (this.constellationSystem) {
            this.constellationSystem.dispose();
        }
        
        if (this.cursorSystem) {
            this.cursorSystem.dispose();
        }
        
        if (this.backgroundSystem) {
            this.backgroundSystem.dispose();
        }
        
        // Limpiar renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        this.isInitialized = false;
    }
}

// Exportar para uso global
export default VisualEffectsEngine;
