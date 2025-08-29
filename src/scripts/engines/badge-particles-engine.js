/**
 * Badge Particles Engine - Sistema de partículas para el hero-badge
 * Crea efectos sutiles y elegantes alrededor del badge
 */

// Importar Three.js como módulo ES6 con Vite
import * as THREE from 'three';

class BadgeParticlesEngine {
    constructor(badgeElement) {
        this.badgeElement = badgeElement;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.animationId = null;
        this.isActive = false;
        
        // Configuración de partículas ultra sutiles
        this.config = {
            particlesCount: 8,
            size: { min: 0.15, max: 0.4 },
            speed: { min: 0.05, max: 0.2 },
            opacity: { min: 0.02, max: 0.05 },
            colors: {
                primary: 'rgba(100, 181, 246, 0.25)',
                accent: 'rgba(79, 195, 247, 0.25)',
                white: 'rgba(255, 255, 255, 0.2)'
            }
        };
        
        this.init();
    }
    
    init() {
        try {
            this.setupThreeJS();
            this.createParticles();
            this.setupEventListeners();
            this.animate();
            this.isActive = true;
        } catch (error) {
            console.warn('❌ Error inicializando Badge Particles Engine:', error);
        }
    }
    
    setupThreeJS() {
        // Crear escena
        this.scene = new THREE.Scene();
        
        // Crear cámara ortográfica para 2D
        const aspect = 1;
        const frustumSize = 2;
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
        this.renderer.setSize(200, 200);
        this.renderer.setClearColor(0x000000, 0);
        
        // Crear contenedor para el renderer
        this.particlesContainer = document.createElement('div');
        this.particlesContainer.className = 'badge-particles-container';
        this.particlesContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
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
        
        for (let i = 0; i < this.config.particlesCount; i++) {
            // Posición en círculo alrededor del badge
            const angle = (i / this.config.particlesCount) * Math.PI * 2;
            const radius = 0.8 + Math.random() * 0.4;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 0.1;
            
            positions.push(x, y, z);
            
            // Color aleatorio entre las opciones
            const colorKeys = Object.keys(this.config.colors);
            const randomColor = this.config.colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
            const color = new THREE.Color(randomColor);
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
                    vOpacity = 0.6;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (100.0 / -mvPosition.z);
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
                    // Efecto de twinkle ultra sutil
                    float twinkle = 0.85 + 0.15 * sin(time * 1.5);
                    
                    // Efecto de respiración ultra sutil
                    float breathing = 0.9 + 0.1 * sin(time * 0.6);
                    
                    // Opacidad final ultra sutil
                    float alpha = twinkle * breathing * vOpacity * 0.8;
                    
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
    
    setupEventListeners() {
        // Efectos sutiles al hacer hover (solo informativo)
        this.badgeElement.addEventListener('mouseenter', () => {
            this.activateSubtleEffects();
        });
        
        this.badgeElement.addEventListener('mouseleave', () => {
            this.deactivateSubtleEffects();
        });
    }
    
    activateSubtleEffects() {
        if (this.particles && this.particles.material) {
            // Efecto sutil: solo cambiar opacidad y rotación
            this.particles.material.uniforms.theme.value = 1;
            this.particles.scale.setScalar(1.05);
            
            // Rotación más suave
            this.particles.rotation.z += 0.1;
        }
    }
    
    deactivateSubtleEffects() {
        if (this.particles && this.particles.material) {
            // Volver al estado normal suavemente
            this.particles.material.uniforms.theme.value = 0;
            this.particles.scale.setScalar(1.0);
        }
    }
    
    // Método createClickEffect eliminado ya que el badge no es clickeable
    
    animate() {
        if (!this.isActive) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        if (this.particles && this.particles.material) {
            this.particles.material.uniforms.time.value = time;
            
            // Rotación ultra sutil de las partículas
            this.particles.rotation.z = time * 0.05;
            
            // Movimiento orbital ultra sutil
            this.particles.position.x = Math.sin(time * 0.2) * 0.02;
            this.particles.position.y = Math.cos(time * 0.2) * 0.02;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateTheme(isDark) {
        if (this.particles && this.particles.material) {
            this.particles.material.uniforms.theme.value = isDark ? 0 : 1;
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
window.BadgeParticlesEngine = BadgeParticlesEngine;
export { BadgeParticlesEngine };
