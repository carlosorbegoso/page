/**
 * About Three.js Engine - Efectos visuales profesionales para la sección About
 */

// Importar Three.js como módulo ES6 con Vite
import * as THREE from 'three';

class AboutThreeEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.constellations = null;
        this.avatarParticles = null;
        this.statsParticles = null;
        this.specialtyParticles = null;
        this.techParticles = null;
        this.valuesParticles = null;
        this.isActive = false;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.theme = 'dark';
        this.contextLostCount = 0;
        this.maxContextLostRetries = 3;
        this.retryDelay = 2000;
        this.isRetrying = false;
        this.performanceMode = 'high';
        this.frameCount = 0;
        this.lastTime = 0;
        this.fps = 60;
        this.cssMode = false;
        
        // TEMPORALMENTE DESHABILITADO - Forzar modo CSS
        console.warn('⚠️ Three.js temporalmente deshabilitado por problemas de shader');
        this.fallbackToCSS();
        
        // Código original comentado:
        // if (this.checkWebGLCompatibility()) {
        //     this.init();
        // } else {
        //     console.warn('⚠️ WebGL no es compatible, usando modo CSS');
        //     this.fallbackToCSS();
        // }
    }
    
    checkWebGLCompatibility() {
        try {
            // Verificar que WebGL esté disponible
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                console.warn('⚠️ WebGL no está disponible en este navegador');
                return false;
            }
            
            // Verificar extensiones importantes
            const extensions = gl.getSupportedExtensions();
            if (!extensions.includes('OES_standard_derivatives')) {
                console.warn('⚠️ WebGL no soporta extensiones necesarias');
                return false;
            }
            
            // Verificar límites de WebGL
            const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            if (maxTextureSize < 1024) {
                console.warn('⚠️ WebGL tiene límites muy bajos');
                return false;
            }
            
            // Verificar si hay problemas de contexto
            const isContextLost = gl.isContextLost();
            if (isContextLost) {
                console.warn('⚠️ WebGL context ya está perdido');
                return false;
            }
            
       
            return true;
        } catch (error) {
            console.warn('⚠️ Error verificando compatibilidad WebGL:', error);
            return false;
        }
    }
    
    fallbackToCSS() {
        try {
            // Activar modo CSS como fallback
            document.body.classList.add('webgl-fallback');
            
            // Limpiar cualquier contenedor de Three.js
            const threeContainers = document.querySelectorAll('.about-threejs-containers, .about-particles, .about-constellations');
            threeContainers.forEach(container => {
                if (container) {
                    container.style.display = 'none';
                    container.style.visibility = 'hidden';
                }
            });
            
            // Ocultar elementos que puedan causar problemas
            const particlesContainers = document.querySelectorAll('[id*="particles"], [id*="constellations"]');
            particlesContainers.forEach(container => {
                if (container) {
                    container.style.display = 'none';
                    container.style.visibility = 'hidden';
                }
            });
            
            // Activar animaciones CSS alternativas
            this.activateCSSAnimations();
            
            // Marcar que estamos en modo CSS
            this.isActive = false;
            this.cssMode = true;
            ß
        } catch (error) {
            console.warn('⚠️ Error activando modo CSS:', error);
            // Fallback más básico
            this.activateBasicCSS();
        }
    }
    
    activateBasicCSS() {
        try {
            // Activar solo las animaciones básicas
            const elements = document.querySelectorAll('.about-card, .stat-item, .specialty-inline-item, .tech-tag-compact, .value-inline-item');
            elements.forEach((element, index) => {
                element.style.animationDelay = `${index * 0.1}s`;
                element.classList.add('animate-fade-in-up');
            });
            
        
        } catch (error) {
            console.warn('⚠️ Error activando animaciones CSS básicas:', error);
        }
    }
    
    activateCSSAnimations() {
        try {
            // Activar animaciones CSS para elementos del About
            const elements = document.querySelectorAll('.about-card, .stat-item, .specialty-inline-item, .tech-tag-compact, .value-inline-item');
            
            elements.forEach((element, index) => {
                element.style.animationDelay = `${index * 0.1}s`;
                element.classList.add('animate-fade-in-up');
            });
            
            // Activar contadores CSS
            this.activateCSSCounters();
            
            // Activar efectos especiales CSS
            this.activateSpecialCSSEffects();
            
        
        } catch (error) {
            console.warn('⚠️ Error activando animaciones CSS:', error);
        }
    }
    
    activateSpecialCSSEffects() {
        // Efectos especiales para el avatar
        const avatarContainer = document.querySelector('.avatar-container');
        if (avatarContainer) {
            avatarContainer.classList.add('avatar-css-mode');
        }
        
        // Efectos para las estadísticas
        const statItems = document.querySelectorAll('.stat-main-item');
        statItems.forEach((item, index) => {
            item.classList.add('stat-css-mode');
            item.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Efectos para especialidades
        const specialtyItems = document.querySelectorAll('.specialty-inline-item');
        specialtyItems.forEach((item, index) => {
            item.classList.add('specialty-css-mode');
            item.style.animationDelay = `${index * 0.15}s`;
        });
        
        // Efectos para tech tags
        const techTags = document.querySelectorAll('.tech-tag-compact');
        techTags.forEach((tag, index) => {
            tag.classList.add('tech-css-mode');
            tag.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Efectos para valores
        const valueItems = document.querySelectorAll('.value-inline-item');
        valueItems.forEach((item, index) => {
            item.classList.add('value-css-mode');
            item.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    activateCSSCounters() {
        const statNumbers = document.querySelectorAll('.stat-main-number');
        
        statNumbers.forEach((statNumber, index) => {
            setTimeout(() => {
                statNumber.style.animation = 'counterPulse 1s ease-out';
                statNumber.style.color = 'var(--primary-color)';
                statNumber.style.textShadow = '0 0 20px rgba(100, 181, 246, 0.5)';
            }, index * 200);
        });
    }
    
    init() {
        try {
            // Verificar compatibilidad antes de continuar
            if (!this.checkWebGLCompatibility()) {
                console.warn('⚠️ WebGL no es compatible, usando modo CSS');
                this.fallbackToCSS();
                return;
            }
            
            this.setupThreeJS();
            this.createParticleSystems();
            this.createConstellationSystem();
            this.createAvatarEffects();
            this.createStatsEffects();
            this.createSpecialtyEffects();
            this.createTechEffects();
            this.createValuesEffects();
            this.setupEventListeners();
            this.animate();
            this.isActive = true;
            
        
        } catch (error) {
            console.error('❌ Error inicializando About Three.js Engine:', error);
    
            this.fallbackToCSS();
        }
    }
    
    setupThreeJS() {
        try {
            // Escena
            this.scene = new THREE.Scene();
            
            // Cámara ortográfica para mejor control
            const aspect = window.innerWidth / window.innerHeight;
            this.camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);
            this.camera.position.z = 5;
            
            // Intentar diferentes configuraciones de renderer
            let rendererOptions = [
                {
                    alpha: true,
                    antialias: false,
                    powerPreference: "default",
                    preserveDrawingBuffer: false,
                    failIfMajorPerformanceCaveat: false,
                    stencil: false,
                    depth: false
                },
                {
                    alpha: true,
                    antialias: false,
                    powerPreference: "default",
                    preserveDrawingBuffer: false,
                    failIfMajorPerformanceCaveat: false,
                    stencil: false,
                    depth: true
                },
                {
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false,
                    failIfMajorPerformanceCaveat: false,
                    stencil: false,
                    depth: true
                }
            ];
            
            let renderer = null;
            let rendererIndex = 0;
            
            while (!renderer && rendererIndex < rendererOptions.length) {
                try {
                    renderer = new THREE.WebGLRenderer(rendererOptions[rendererIndex]);
                    
                } catch (error) {
                    console.warn(`⚠️ Configuración ${rendererIndex + 1} falló:`, error);
                    rendererIndex++;
                }
            }
            
            if (!renderer) {
                throw new Error('No se pudo crear ningún renderer WebGL');
            }
            
            this.renderer = renderer;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(1); // Usar pixel ratio fijo para mayor compatibilidad
            this.renderer.setClearColor(0x000000, 0);
            
            // Manejar context lost
            this.renderer.domElement.addEventListener('webglcontextlost', (event) => {
                console.warn('⚠️ WebGL Context Lost - Reintentando...');
                event.preventDefault();
                this.handleContextLost();
            });
            
            this.renderer.domElement.addEventListener('webglcontextrestored', () => {
               
                this.handleContextRestored();
            });
            
            // Verificar que el renderer funcione
            try {
                this.renderer.render(this.scene, this.camera);
            } catch (renderError) {
                console.error('❌ Error en render inicial:', renderError);
                throw new Error('Renderer no funciona correctamente');
            }
            
            // Contenedor principal
            const container = document.getElementById('about-particles');
            if (container) {
                container.appendChild(this.renderer.domElement);
            }
            
       
        } catch (error) {
            console.error('❌ Error en setupThreeJS:', error);
            throw error;
        }
    }
    
    createParticleSystems() {
        // Sistema de partículas ambientales
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const speeds = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Posiciones en espiral 3D
            const angle = (i / particleCount) * Math.PI * 4;
            const radius = 0.5 + (i / particleCount) * 2;
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = (i / particleCount) * 4 - 2;
            
            // Colores basados en el tema
            const color = new THREE.Color();
            if (this.theme === 'dark') {
                color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.6 + Math.random() * 0.4);
            } else {
                color.setHSL(0.1 + Math.random() * 0.1, 0.6, 0.7 + Math.random() * 0.3);
            }
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            sizes[i] = 0.02 + Math.random() * 0.03;
            speeds[i] = 0.001 + Math.random() * 0.002;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 3));
        geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 3));
        
        // Material con shader personalizado CORREGIDO
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                theme: { value: this.theme === 'dark' ? 0 : 1 }
            },
            vertexShader: `
                attribute vec3 position;
                attribute vec3 color;
                attribute float size;
                attribute float speed;
                
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    vOpacity = 0.8;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                precision mediump float;
                uniform float time;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    float twinkle = 0.7 + 0.3 * sin(time * 2.0 + gl_PointCoord.x * 10.0);
                    float breathing = 0.8 + 0.2 * sin(time * 1.5);
                    float alpha = twinkle * breathing * vOpacity;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createConstellationSystem() {
        // Sistema de constelaciones conectadas
        const constellationCount = 6;
        const starsPerConstellation = 4;
        
        for (let c = 0; c < constellationCount; c++) {
            const constellation = new THREE.Group();
            const stars = [];
            
            // Crear estrellas para esta constelación
            for (let s = 0; s < starsPerConstellation; s++) {
                const starGeometry = new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 8, 6);
                const starMaterial = new THREE.MeshBasicMaterial({
                    color: this.theme === 'dark' ? 0x64B5F6 : 0x4FC3F7,
                    transparent: true,
                    opacity: 0.8
                });
                
                const star = new THREE.Mesh(starGeometry, starMaterial);
                star.position.set(
                    (Math.random() - 0.5) * 3,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
                
                constellation.add(star);
                stars.push(star);
            }
            
            // Crear conexiones entre estrellas
            for (let i = 0; i < stars.length - 1; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    if (Math.random() > 0.5) {
                        const connection = this.createConnection(stars[i].position, stars[j].position);
                        constellation.add(connection);
                    }
                }
            }
            
            this.scene.add(constellation);
            if (!this.constellations) this.constellations = [];
            this.constellations.push(constellation);
        }
    }
    
    createConnection(start, end) {
        const points = [];
        points.push(start);
        points.push(end);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: this.theme === 'dark' ? 0x64B5F6 : 0x4FC3F7,
            transparent: true,
            opacity: 0.3
        });
        
        return new THREE.Line(geometry, material);
    }
    
    createAvatarEffects() {
        // Crear partículas para el avatar con efectos más profesionales
        const container = document.getElementById('avatar-particles-container');
        if (!container) return;
        
        // Crear sistema de partículas orbitales alrededor del avatar
        const avatarParticles = new THREE.Group();
        
        // Partículas principales en órbita
        for (let i = 0; i < 30; i++) {
            const particle = this.createOrbitalParticle(i, 30);
            avatarParticles.add(particle);
        }
        
        // Partículas de aura
        for (let i = 0; i < 20; i++) {
            const auraParticle = this.createAuraParticle(i, 20);
            avatarParticles.add(auraParticle);
        }
        
        this.avatarParticles = avatarParticles;
        this.scene.add(avatarParticles);
        
        // Posicionar cerca del avatar
        avatarParticles.position.set(0, 0, 0);
    }
    
    createOrbitalParticle(index, total) {
        const geometry = new THREE.SphereGeometry(0.008 + Math.random() * 0.012, 6, 4);
        const material = new THREE.MeshBasicMaterial({
            color: this.theme === 'dark' ? 0x64B5F6 : 0x4FC3F7,
            transparent: true,
            opacity: 0.6 + Math.random() * 0.4
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Posición orbital
        const angle = (index / total) * Math.PI * 2;
        const radius = 0.8 + Math.random() * 0.4;
        particle.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.5,
            (Math.random() - 0.5) * 0.3
        );
        
        // Datos para animación
        particle.userData = {
            baseAngle: angle,
            radius: radius,
            speed: 0.5 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2
        };
        
        return particle;
    }
    
    createAuraParticle(index, total) {
        const geometry = new THREE.SphereGeometry(0.005 + Math.random() * 0.008, 4, 3);
        const material = new THREE.MeshBasicMaterial({
            color: this.theme === 'dark' ? 0x4FC3F7 : 0x64B5F6,
            transparent: true,
            opacity: 0.3 + Math.random() * 0.3
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Posición en aura
        const angle = (index / total) * Math.PI * 2;
        const radius = 1.2 + Math.random() * 0.6;
        particle.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.3,
            (Math.random() - 0.5) * 0.2
        );
        
        // Datos para animación
        particle.userData = {
            baseAngle: angle,
            radius: radius,
            speed: 0.3 + Math.random() * 0.7,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: 1 + Math.random() * 2
        };
        
        return particle;
    }
    
    createStatsEffects() {
        // Efectos para las estadísticas
        const statsContainer = document.getElementById('stat-main-exp-particles');
        if (statsContainer) {
            this.statsParticles = this.createParticleContainer(statsContainer, 30, 0.6);
        }
    }
    
    createSpecialtyEffects() {
        // Efectos para las especialidades
        const specialtyItems = document.querySelectorAll('.specialty-inline-item');
        specialtyItems.forEach((item, index) => {
            const container = document.createElement('div');
            container.className = 'specialty-particles-container';
            container.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px;
                height: 100px;
                pointer-events: none;
                z-index: 1;
            `;
            item.style.position = 'relative';
            item.appendChild(container);
            
            setTimeout(() => {
                this.createParticleContainer(container, 20, 0.5);
            }, index * 200);
        });
    }
    
    createTechEffects() {
        // Efectos para los tech tags
        const techTags = document.querySelectorAll('.tech-tag-compact');
        techTags.forEach((tag, index) => {
            tag.style.position = 'relative';
            
            setTimeout(() => {
                const container = document.createElement('div');
                container.className = 'tech-particles-container';
                container.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80px;
                    height: 80px;
                    pointer-events: none;
                    z-index: 1;
                `;
                tag.appendChild(container);
                
                this.createParticleContainer(container, 15, 0.4);
            }, index * 100);
        });
    }
    
    createValuesEffects() {
        // Efectos para los valores
        const valueItems = document.querySelectorAll('.value-inline-item');
        valueItems.forEach((item, index) => {
            const container = document.createElement('div');
            container.className = 'value-particles-container';
            container.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 120px;
                height: 120px;
                pointer-events: none;
                z-index: 1;
            `;
            item.style.position = 'relative';
            item.appendChild(container);
            
            setTimeout(() => {
                this.createParticleContainer(container, 25, 0.6);
            }, index * 300);
        });
    }
    
    createParticleContainer(container, count, opacity) {
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(100, 100);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2;
            positions[i3 + 1] = (Math.random() - 0.5) * 2;
            positions[i3 + 2] = 0;
            
            const color = new THREE.Color();
            color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.6 + Math.random() * 0.4);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x64B5F6,
            size: 0.03,
            transparent: true,
            opacity: opacity,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        // Animación
        const animate = () => {
            particles.rotation.z += 0.01;
            particles.position.x = Math.sin(Date.now() * 0.001) * 0.1;
            particles.position.y = Math.cos(Date.now() * 0.001) * 0.1;
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        
        animate();
        
        return { scene, camera, renderer, particles, animate };
    }
    
    setupEventListeners() {
        // Mouse move para efectos interactivos
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Theme change
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.updateTheme();
            });
        }
    }
    
    handleResize() {
        if (this.camera && this.renderer) {
            const aspect = window.innerWidth / window.innerHeight;
            this.camera.left = -aspect;
            this.camera.right = aspect;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    updateTheme() {
        this.theme = document.documentElement.getAttribute('data-theme') || 'dark';
        
        if (this.particles && this.particles.material) {
            this.particles.material.uniforms.theme.value = this.theme === 'dark' ? 0 : 1;
        }
        
        // Actualizar colores de constelaciones
        if (this.constellations) {
            this.constellations.forEach(constellation => {
                constellation.children.forEach(child => {
                    if (child.material) {
                        child.material.color.setHex(this.theme === 'dark' ? 0x64B5F6 : 0x4FC3F7);
                    }
                });
            });
        }
    }
    
    // Métodos para efectos de hover
    activateHoverEffect(element, type) {
        try {
            // Activar efectos de partículas según el tipo
            switch (type) {
                case 'specialty':
                    this.activateSpecialtyHover(element);
                    break;
                case 'tech':
                    this.activateTechHover(element);
                    break;
                case 'value':
                    this.activateValueHover(element);
                    break;
            }
        } catch (error) {
            console.warn('⚠️ Error activando hover effect:', error);
        }
    }
    
    deactivateHoverEffect(element, type) {
        try {
            // Desactivar efectos de partículas según el tipo
            switch (type) {
                case 'specialty':
                    this.deactivateSpecialtyHover(element);
                    break;
                case 'tech':
                    this.deactivateTechHover(element);
                    break;
                case 'value':
                    this.deactivateValueHover(element);
                    break;
            }
        } catch (error) {
            console.warn('⚠️ Error desactivando hover effect:', error);
        }
    }
    
    activateSpecialtyHover(element) {
        // Activar partículas especiales para especialidades
        const container = element.querySelector('.specialty-particles-container');
        if (container) {
            container.style.opacity = '1';
            container.style.transform = 'translate(-50%, -50%) scale(1.2)';
        }
    }
    
    deactivateSpecialtyHover(element) {
        // Desactivar partículas especiales para especialidades
        const container = element.querySelector('.specialty-particles-container');
        if (container) {
            container.style.opacity = '0.5';
            container.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }
    
    activateTechHover(element) {
        // Activar partículas especiales para tech tags
        const container = element.querySelector('.tech-particles-container');
        if (container) {
            container.style.opacity = '1';
            container.style.transform = 'translate(-50%, -50%) scale(1.3)';
        }
    }
    
    deactivateTechHover(element) {
        // Desactivar partículas especiales para tech tags
        const container = element.querySelector('.tech-particles-container');
        if (container) {
            container.style.opacity = '0.5';
            container.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }
    
    activateValueHover(element) {
        // Activar partículas especiales para valores
        const container = element.querySelector('.value-particles-container');
        if (container) {
            container.style.opacity = '1';
            container.style.transform = 'translate(-50%, -50%) scale(1.1)';
        }
    }
    
    deactivateValueHover(element) {
        // Desactivar partículas especiales para valores
        const container = element.querySelector('.value-particles-container');
        if (container) {
            container.style.opacity = '0.5';
            container.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }
    
    // Manejo de context lost
    handleContextLost() {
        this.isActive = false;
        this.contextLostCount++;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Limpiar recursos
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.warn(`⚠️ WebGL Context Lost (${this.contextLostCount}/${this.maxContextLostRetries}) - Recursos limpiados`);
        
        // Intentar recuperar automáticamente
        if (this.contextLostCount <= this.maxContextLostRetries && !this.isRetrying) {
            this.scheduleRetry();
        } else if (this.contextLostCount > this.maxContextLostRetries) {
            console.error('❌ Demasiados context lost, cambiando a modo CSS');
            this.fallbackToCSS();
        }
    }
    
    scheduleRetry() {
        if (this.isRetrying) return;
        
        this.isRetrying = true;
        const delay = this.retryDelay * this.contextLostCount; // Delay progresivo

        
        setTimeout(() => {
            this.isRetrying = false;
            this.attemptRecovery();
        }, delay);
    }
    
    attemptRecovery() {
        try {
        
            
            // Verificar si WebGL está disponible
            if (!this.checkWebGLCompatibility()) {
                console.warn('⚠️ WebGL ya no es compatible, usando CSS');
                this.fallbackToCSS();
                return;
            }
            
            // Recrear el sistema
            this.setupThreeJS();
            this.createParticleSystems();
            this.createConstellationSystem();
            this.createAvatarEffects();
            this.createStatsEffects();
            this.createSpecialtyEffects();
            this.createTechEffects();
            this.createValuesEffects();
            
            // Reactivar
            this.isActive = true;
            this.animate();
            
    
            this.contextLostCount = 0; // Reset contador
            
        } catch (error) {
            console.error('❌ Error en recuperación:', error);
            this.contextLostCount++;
            
            if (this.contextLostCount <= this.maxContextLostRetries) {
                this.scheduleRetry();
            } else {
                console.error('❌ Fallo en recuperación, usando CSS');
                this.fallbackToCSS();
            }
        }
    }
    
    handleContextRestored() {
        try {
            // Recrear el renderer
            this.setupThreeJS();
            
            // Recrear las partículas y constelaciones
            this.createParticleSystems();
            this.createConstellationSystem();
            
            // Reactivar la animación
            this.isActive = true;
            this.animate();
            
         
        } catch (error) {
            console.error('❌ Error restaurando WebGL Context:', error);
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        try {
            this.animationId = requestAnimationFrame(() => this.animate());
            
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            // Calcular FPS
            this.frameCount++;
            if (this.frameCount % 60 === 0) {
                this.fps = Math.round(1000 / deltaTime);
                
                // Ajustar performance automáticamente
                if (this.fps < 30 && this.performanceMode === 'high') {
                    this.setPerformanceMode('medium');
                } else if (this.fps > 55 && this.performanceMode === 'medium') {
                    this.setPerformanceMode('high');
                }
            }
            
            const time = currentTime * 0.001;
            
            // Animar partículas principales
            if (this.particles && this.particles.material) {
                this.particles.material.uniforms.time.value = time;
                this.particles.rotation.z += 0.001;
                
                // Efecto de respiración
                this.particles.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
            }
            
            // Animar constelaciones
            if (this.constellations) {
                this.constellations.forEach((constellation, index) => {
                    constellation.rotation.z += 0.002 * (index + 1);
                    constellation.position.x = Math.sin(time * 0.3 + index) * 0.1;
                    constellation.position.y = Math.cos(time * 0.3 + index) * 0.1;
                });
            }
            
            // Efectos de mouse
            if (this.particles) {
                this.particles.position.x = this.mouse.x * 0.1;
                this.particles.position.y = this.mouse.y * 0.1;
            }
            
            // Animar partículas del avatar
            if (this.avatarParticles) {
                this.avatarParticles.children.forEach((particle, index) => {
                    if (particle.userData.baseAngle !== undefined) {
                        // Partículas orbitales
                        const newAngle = particle.userData.baseAngle + time * particle.userData.speed;
                        particle.position.x = Math.cos(newAngle) * particle.userData.radius;
                        particle.position.y = Math.sin(newAngle) * particle.userData.radius * 0.5;
                        
                        // Efecto de respiración
                        const pulse = 1 + Math.sin(time * particle.userData.pulseSpeed) * 0.2;
                        particle.scale.setScalar(pulse);
                        
                        // Rotación suave
                        particle.rotation.z += 0.01;
                    }
                });
            }
            
            // Verificar que el renderer esté funcionando
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            console.error('❌ Error en animate:', error);
            this.isActive = false;
            
            // Intentar recuperar
            setTimeout(() => {
                this.handleContextLost();
            }, 1000);
        }
    }
    
    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        switch (mode) {
            case 'high':
                if (this.renderer) {
                    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                }
                break;
            case 'medium':
                if (this.renderer) {
                    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                }
                break;
            case 'low':
                if (this.renderer) {
                    this.renderer.setPixelRatio(1);
                }
                break;
        }
        
    
    }
    
    dispose() {
        try {
            this.isActive = false;
            
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            
            // Limpiar partículas
            if (this.particles) {
                if (this.particles.geometry) this.particles.geometry.dispose();
                if (this.particles.material) this.particles.material.dispose();
                this.particles = null;
            }
            
            // Limpiar constelaciones
            if (this.constellations) {
                this.constellations.forEach(constellation => {
                    constellation.children.forEach(child => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) child.material.dispose();
                    });
                    constellation.clear();
                });
                this.constellations = null;
            }
            
            // Limpiar renderer
            if (this.renderer) {
                this.renderer.dispose();
                this.renderer = null;
            }
            
            // Limpiar escena
            if (this.scene) {
                this.scene.clear();
                this.scene = null;
            }
            
            // Limpiar cámara
            if (this.camera) {
                this.camera = null;
            }
            
            // Reset contadores
            this.contextLostCount = 0;
            this.isRetrying = false;
            
        
        } catch (error) {
            console.error('❌ Error limpiando About Three.js Engine:', error);
        }
    }
}

// Exportar para uso en otros módulos
export { AboutThreeEngine };
