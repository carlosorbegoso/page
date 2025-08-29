/**
 * Tech Badges Particles Engine - Sistema de partículas para los tech-badges
 * Crea efectos sutiles y elegantes alrededor de cada badge de tecnología
 */

// Importar Three.js como módulo ES6
import * as THREE from 'three';

class TechBadgesParticlesEngine {
    constructor() {
        this.techBadges = [];
        this.particlesEngines = [];
        this.isActive = false;
        
        // Configuración de partículas para tech-badges - más visibles
        this.config = {
            particlesPerBadge: 8,
            size: { min: 0.2, max: 0.5 },
            speed: { min: 0.05, max: 0.2 },
            opacity: { min: 0.08, max: 0.15 },
            colors: {
                java: 'rgba(255, 69, 0, 0.6)',      // Naranja Java
                spring: 'rgba(108, 194, 74, 0.6)',   // Verde Spring
                quarkus: 'rgba(255, 105, 180, 0.6)', // Rosa Quarkus
                angular: 'rgba(221, 0, 0, 0.6)'      // Rojo Angular
            }
        };
        
        this.init();
    }
    
    init() {
        try {
            this.findTechBadges();
            this.createParticlesEngines();
            this.setupEventListeners();
            this.isActive = true;
            
        } catch (error) {
            console.warn('❌ Error inicializando Tech Badges Particles Engine:', error);
        }
    }
    
    findTechBadges() {
        this.techBadges = document.querySelectorAll('.tech-badge');
    
    }
    
    createParticlesEngines() {
        this.techBadges.forEach((badge, index) => {
            const techType = badge.getAttribute('data-tech');
            const particlesEngine = new TechBadgeParticles(badge, techType, this.config);
            this.particlesEngines.push(particlesEngine);
        });
    }
    
    setupEventListeners() {
        // Escuchar cambios de tema
        this.setupThemeListener();
        
        // Escuchar cambios en el DOM para nuevos badges
        this.setupDOMObserver();
        
        // Efectos de hover para tech-badges
        this.setupHoverEffects();
    }
    
    setupThemeListener() {
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme');
                    this.updateTheme(newTheme === 'dark');
                }
            });
        });
        
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    setupDOMObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Verificar si se agregaron nuevos tech-badges
                    const newBadges = document.querySelectorAll('.tech-badge');
                    if (newBadges.length > this.techBadges.length) {
                        this.refreshBadges();
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    setupHoverEffects() {
        this.techBadges.forEach((badge, index) => {
            badge.addEventListener('mouseenter', () => {
                this.activateBadgeHover(index);
            });
            
            badge.addEventListener('mouseleave', () => {
                this.deactivateBadgeHover(index);
            });
        });
    }
    
    activateBadgeHover(badgeIndex) {
        if (this.particlesEngines[badgeIndex]) {
            const engine = this.particlesEngines[badgeIndex];
            // Activar efectos de hover
            engine.activateHover();
        }
    }
    
    deactivateBadgeHover(badgeIndex) {
        if (this.particlesEngines[badgeIndex]) {
            const engine = this.particlesEngines[badgeIndex];
            // Desactivar efectos de hover
            engine.deactivateHover();
        }
    }
    
    refreshBadges() {
        // Limpiar engines existentes
        this.particlesEngines.forEach(engine => engine.dispose());
        this.particlesEngines = [];
        
        // Recrear con nuevos badges
        this.findTechBadges();
        this.createParticlesEngines();
    }
    
    updateTheme(isDark) {
        this.particlesEngines.forEach(engine => {
            engine.updateTheme(isDark);
        });
    }
    
    dispose() {
        this.isActive = false;
        
        this.particlesEngines.forEach(engine => {
            engine.dispose();
        });
        
        this.particlesEngines = [];
        this.techBadges = [];
    }
}

/**
 * Motor de partículas individual para cada tech-badge
 */
class TechBadgeParticles {
    constructor(badgeElement, techType, config) {
        this.badgeElement = badgeElement;
        this.techType = techType;
        this.config = config;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.animationId = null;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        try {
            this.setupThreeJS();
            this.createParticles();
            this.animate();
            this.isActive = true;
        } catch (error) {
            console.warn(`❌ Error inicializando partículas para ${this.techType}:`, error);
        }
    }
    
    setupThreeJS() {
        // Crear escena
        this.scene = new THREE.Scene();
        
        // Crear cámara ortográfica para 2D
        const aspect = 1;
        const frustumSize = 1.5;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        this.camera.position.z = 1;
        
        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(150, 150);
        this.renderer.setClearColor(0x000000, 0);
        
        // Crear contenedor para el renderer
        this.particlesContainer = document.createElement('div');
        this.particlesContainer.className = 'tech-badge-particles-container';
        this.particlesContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150px;
            height: 150px;
            pointer-events: none;
            z-index: 1;
        `;
        this.particlesContainer.appendChild(this.renderer.domElement);
        this.badgeElement.appendChild(this.particlesContainer);
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const speeds = [];
        
        const techColor = this.config.colors[this.techType] || this.config.colors.java;
        const color = new THREE.Color(techColor);
        
        for (let i = 0; i < this.config.particlesPerBadge; i++) {
            // Posición en círculo alrededor del badge
            const angle = (i / this.config.particlesPerBadge) * Math.PI * 2;
            const radius = 0.6 + Math.random() * 0.3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 0.05;
            
            positions.push(x, y, z);
            colors.push(color.r, color.g, color.b);
            
            // Tamaño y velocidad aleatorios
            const size = this.config.size.min + Math.random() * (this.config.size.max - this.config.size.min);
            const speed = this.config.speed.min + Math.random() * (this.config.speed.max - this.config.speed.min);
            
            sizes.push(size);
            speeds.push(speed);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1));
        
        // Shader material personalizado
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                theme: { value: 0 } // 0 = dark, 1 = light
            },
            vertexShader: `
                attribute float size;
                attribute float speed;
                attribute vec3 color;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    vOpacity = 0.4;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (75.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                precision mediump float;
                uniform float time;
                uniform float theme;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    // Efecto de twinkle sutil
                    float twinkle = 0.8 + 0.2 * sin(time * 1.5);
                    
                    // Efecto de respiración sutil
                    float breathing = 0.9 + 0.1 * sin(time * 0.8);
                    
                    // Efecto de energía cuando está en hover
                    float energy = 1.0;
                    if (theme > 0.5) {
                        energy = 1.0 + 0.3 * sin(time * 4.0) + 0.2 * sin(time * 2.0);
                    }
                    
                    // Opacidad final con efectos de energía
                    float alpha = twinkle * breathing * energy * vOpacity * 1.2;
                    
                    // Color con efecto de energía
                    vec3 finalColor = vColor;
                    if (theme > 0.5) {
                        // Añadir brillo de energía
                        float glow = 0.3 * sin(time * 3.0);
                        finalColor = mix(vColor, vec3(1.0), glow * 0.2);
                    }
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        if (this.particles && this.particles.material) {
            this.particles.material.uniforms.time.value = time;
            
            // Rotación base
            const baseRotation = time * 0.08;
            
            // Efectos de hover avanzados
            if (this.particles.userData.isHovered) {
                // Modo de energía activado
                this.particles.rotation.z = baseRotation * 2; // Rotación más rápida
                
                // Movimiento orbital más dinámico
                const energyMultiplier = 1 + Math.sin(time * 3) * 0.3;
                this.particles.position.x = Math.sin(time * 0.6) * 0.05 * energyMultiplier;
                this.particles.position.y = Math.cos(time * 0.6) * 0.05 * energyMultiplier;
                
                // Efecto de pulso de energía
                const pulse = 1 + Math.sin(time * 4) * 0.1;
                this.particles.scale.setScalar(
                    this.particles.scale.x * pulse
                );
            } else {
                // Modo normal
                this.particles.rotation.z = baseRotation;
                
                // Movimiento orbital sutil
                this.particles.position.x = Math.sin(time * 0.3) * 0.03;
                this.particles.position.y = Math.cos(time * 0.3) * 0.03;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateTheme(isDark) {
        if (this.particles && this.particles.material) {
            this.particles.material.uniforms.theme.value = isDark ? 0 : 1;
        }
    }
    
    activateHover() {
        if (this.particles) {
            // Efecto de hover sofisticado y suave
            this.particles.userData.isHovered = true;
            
            // Escalar partículas suavemente (con fallback si GSAP no está disponible)
            if (typeof gsap !== 'undefined') {
                gsap.to(this.particles.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    duration: 0.8,
                    ease: "power2.out"
                });
                
                gsap.to(this.particles.material.uniforms, {
                    theme: { value: 1 },
                    duration: 0.6,
                    ease: "power2.out"
                });
            } else {
                // Fallback sin GSAP
                this.particles.scale.setScalar(1.4);
                this.particles.material.uniforms.theme.value = 1;
            }
            
            // Activar modo de energía
            this.particles.userData.energyMode = true;
            
            // Crear efecto de partículas adicionales
            this.createHoverParticles();
        }
    }
    
    deactivateHover() {
        if (this.particles) {
            // Efecto de desactivación suave
            this.particles.userData.isHovered = false;
            
            // Volver al tamaño normal suavemente (con fallback si GSAP no está disponible)
            if (typeof gsap !== 'undefined') {
                gsap.to(this.particles.scale, {
                    x: 1.0,
                    y: 1.0,
                    z: 1.0,
                    duration: 1.2,
                    ease: "power3.out"
                });
                
                gsap.to(this.particles.material.uniforms, {
                    theme: { value: 0 },
                    duration: 0.8,
                    ease: "power2.out"
                });
            } else {
                // Fallback sin GSAP
                this.particles.scale.setScalar(1.0);
                this.particles.material.uniforms.theme.value = 0;
            }
            
            // Desactivar modo de energía
            this.particles.userData.energyMode = false;
            
            // Limpiar partículas de hover
            this.cleanupHoverParticles();
        }
    }
    
    createHoverParticles() {
        // Crear partículas adicionales para el efecto de hover
        if (!this.hoverParticles) {
            this.hoverParticles = [];
            
            for (let i = 0; i < 4; i++) {
                const particle = document.createElement('div');
                particle.className = 'hover-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: var(--primary-color);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10;
                    opacity: 0;
                    animation: hoverParticleFloat 2s ease-out forwards;
                `;
                
                // Posición aleatoria alrededor del badge
                const angle = (i / 4) * Math.PI * 2;
                const radius = 60 + Math.random() * 20;
                particle.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
                particle.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;
                
                this.badgeElement.appendChild(particle);
                this.hoverParticles.push(particle);
            }
        }
    }
    
    cleanupHoverParticles() {
        if (this.hoverParticles) {
            this.hoverParticles.forEach(particle => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            });
            this.hoverParticles = [];
        }
    }
    
    dispose() {
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.particlesContainer && this.particlesContainer.parentNode) {
            this.particlesContainer.parentNode.removeChild(this.particlesContainer);
        }
        
        if (this.scene) {
            this.scene.clear();
        }
    }
}

// Exportar para uso global y como módulo
window.TechBadgesParticlesEngine = TechBadgesParticlesEngine;
export { TechBadgesParticlesEngine };
