/**
 * Button Particles Engine
 * Motor de partículas Three.js para los botones del Hero
 */

export class ButtonParticlesEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.buttons = [];
        this.animationId = null;
        this.isInitialized = false;
        this.currentTheme = 'light';
        
        // Configuración de partículas ultra sutiles y elegantes
        this.config = {
            particlesPerButton: 8,
            size: { min: 0.3, max: 0.8 },
            speed: { min: 0.2, max: 0.6 },
            opacity: { min: 0.06, max: 0.15 },
            colors: {
                primary: {
                    light: 'rgba(255, 255, 255, 0.3)',
                    dark: 'rgba(255, 255, 255, 0.3)'
                },
                outline: {
                    light: 'rgba(255, 255, 255, 0.25)',
                    dark: 'rgba(255, 255, 255, 0.25)'
                }
            }
        };
    }

    async init() {
        try {
            if (typeof THREE === 'undefined') {
                console.warn('Three.js no está disponible para Button Particles');
                return false;
            }

            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.findButtons();
            this.createButtonParticles();
            this.setupEventListeners();
            this.animate();
            
            this.isInitialized = true;
        
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Button Particles Engine:', error);
            return false;
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 10, 50);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.z = 30;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Agregar al body para estar detrás de todo
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
    }

    findButtons() {
        this.buttons = document.querySelectorAll('.btn-hero');

    }

    createButtonParticles() {
        this.buttons.forEach((button, buttonIndex) => {
            const buttonType = button.classList.contains('btn-primary') ? 'primary' : 'outline';
            const buttonRect = button.getBoundingClientRect();
            
            // Crear partículas para este botón
            for (let i = 0; i < this.config.particlesPerButton; i++) {
                const particle = this.createParticle(buttonType, buttonIndex, i);
                this.particles.push(particle);
                this.scene.add(particle);
            }
        });
    }

    createParticle(buttonType, buttonIndex, particleIndex) {
        const geometry = new THREE.BufferGeometry();
        
        // Posición inicial en patrón circular alrededor del botón
        const angle = (particleIndex / this.config.particlesPerButton) * Math.PI * 2;
        const radius = 8 + Math.random() * 4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 6;
        
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([x, y, z]), 3));
        
        // Tamaño y velocidad
        const size = Math.random() * 
            (this.config.size.max - this.config.size.min) + 
            this.config.size.min;
        
        const speed = Math.random() * 
            (this.config.speed.max - this.config.speed.min) + 
            this.config.speed.min;
        
        geometry.setAttribute('size', new THREE.BufferAttribute(new Float32Array([size]), 1));
        geometry.setAttribute('speed', new THREE.BufferAttribute(new Float32Array([speed]), 1));
        
        // Material con shader personalizado
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                theme: { value: this.currentTheme === 'dark' ? 1.0 : 0.0 },
                buttonType: { value: buttonType === 'primary' ? 1.0 : 0.0 }
            },
            vertexShader: `
                attribute float size;
                attribute float speed;
                varying float vSize;
                varying float vSpeed;
                
                void main() {
                    vSize = size;
                    vSpeed = speed;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float theme;
                uniform float buttonType;
                varying float vSize;
                varying float vSpeed;
                
                void main() {
                    // Color base unificado para ambos botones
                    vec3 baseColor = vec3(1.0, 1.0, 1.0);
                    
                    // Efecto de twinkle sutil
                    float twinkle = 0.8 + 0.2 * sin(time * vSpeed * 1.0);
                    
                    // Efecto de respiración suave
                    float breathing = 0.9 + 0.1 * sin(time * 0.3);
                    
                    // Efecto de pulso orbital
                    float pulse = 0.7 + 0.3 * sin(time * 0.5);
                    
                    // Opacidad final ultra sutil y elegante
                    float alpha = twinkle * breathing * pulse * 0.12;
                    
                    gl_FragColor = vec4(baseColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particle = new THREE.Points(geometry, material);
        
        // Guardar información del botón con movimiento orbital
        particle.userData = {
            buttonType: buttonType,
            buttonIndex: buttonIndex,
            particleIndex: particleIndex,
            originalPosition: new THREE.Vector3(x, y, z),
            targetPosition: new THREE.Vector3(x, y, z),
            orbitalRadius: radius,
            orbitalAngle: angle,
            orbitalSpeed: 0.5 + Math.random() * 0.5,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.02
            )
        };
        
        return particle;
    }

    setupEventListeners() {
        // Observar cambios de tema
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme');
                    this.updateTheme(newTheme);
                }
            });
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Mouse move para efectos interactivos
        document.addEventListener('mousemove', (event) => {
            this.updateMouseEffects(event);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    updateMouseEffects(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Mover cámara suavemente
        this.camera.position.x = mouseX * 5;
        this.camera.position.y = mouseY * 3;
        this.camera.lookAt(0, 0, 0);
        
        // Actualizar partículas según posición del mouse de forma elegante
        this.particles.forEach(particle => {
            const rect = this.buttons[particle.userData.buttonIndex]?.getBoundingClientRect();
            if (rect) {
                const centerX = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1;
                const centerY = -(rect.top + rect.height / 2) / window.innerHeight * 2 + 1;
                
                const deltaX = (mouseX - centerX) * 0.05;
                const deltaY = (mouseY - centerY) * 0.05;
                
                // Modificar el radio orbital en lugar de la posición directa
                particle.userData.orbitalRadius = particle.userData.orbitalRadius + (deltaX + deltaY) * 2;
                
                // Mantener el radio dentro de límites razonables
                particle.userData.orbitalRadius = Math.max(6, Math.min(12, particle.userData.orbitalRadius));
            }
        });
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        
        // Actualizar uniformes de tema
        this.particles.forEach(particle => {
            if (particle.material.uniforms) {
                particle.material.uniforms.theme.value = theme === 'dark' ? 1.0 : 0.0;
            }
        });
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.isInitialized) return;
        
        const time = Date.now() * 0.001;
        
        // Animar partículas
        this.particles.forEach(particle => {
            // Actualizar uniforme de tiempo
            if (particle.material.uniforms) {
                particle.material.uniforms.time.value = time;
            }
            
            // Movimiento orbital elegante por defecto
            const orbitalRadius = particle.userData.orbitalRadius;
            const orbitalAngle = particle.userData.orbitalAngle;
            const orbitalSpeed = particle.userData.orbitalSpeed;
            
            // Calcular nueva posición orbital con múltiples capas
            const newAngle = orbitalAngle + time * orbitalSpeed * 0.2;
            const baseX = Math.cos(newAngle) * orbitalRadius;
            const baseY = Math.sin(newAngle) * orbitalRadius;
            
            // Agregar movimiento flotante sutil en múltiples frecuencias
            const floatX = Math.sin(time * particle.userData.velocity.x) * 0.3 + 
                          Math.sin(time * 0.5) * 0.2;
            const floatY = Math.cos(time * particle.userData.velocity.y) * 0.3 + 
                          Math.cos(time * 0.7) * 0.2;
            const floatZ = Math.sin(time * particle.userData.velocity.z) * 0.2 + 
                          Math.sin(time * 0.3) * 0.1;
            
            // Aplicar posición final con transición suave
            particle.position.x += (baseX + floatX - particle.position.x) * 0.015;
            particle.position.y += (baseY + floatY - particle.position.y) * 0.015;
            particle.position.z += (particle.userData.originalPosition.z + floatZ - particle.position.z) * 0.008;
            
            // Rotación muy sutil y orgánica
            particle.rotation.y = time * 0.015;
            particle.rotation.x = time * 0.008;
        });
        
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.buttons = [];
        this.isInitialized = false;
    }
}
