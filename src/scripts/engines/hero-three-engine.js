/**
 * Hero Three.js Engine
 * Motor específico para efectos visuales avanzados del Hero section
 */

// Importar Three.js como módulo ES6 con Vite
import * as THREE from 'three';

export class HeroThreeEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.constellations = [];
        this.stars = [];
        this.titleParticles = null;
        this.titleGlow = null;
        this.animationId = null;
        this.isInitialized = false;
        this.currentTheme = 'light';

        // Detectar dispositivo móvil
        this.isMobile = window.innerWidth <= 768;
        this.isLowPower = window.innerWidth <= 480 ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

        // Configuración de efectos - reducida en mobile para mejor performance
        const mobileMultiplier = this.isLowPower ? 0.3 : (this.isMobile ? 0.5 : 1);

        this.config = {
            particles: {
                count: Math.floor(80 * mobileMultiplier),
                size: { min: 0.3, max: 0.8 },
                speed: { min: 0.1, max: 0.3 },
                opacity: { min: 0.2, max: 0.5 }
            },
            constellations: {
                count: Math.floor(12 * mobileMultiplier),
                starsPerConstellation: { min: 3, max: this.isMobile ? 4 : 5 },
                starSize: 0.15,
                connectionOpacity: 0.12,
                connectionWidth: 1
            },
            stars: {
                count: Math.floor(100 * mobileMultiplier),
                size: { min: 0.2, max: 0.6 },
                twinkleSpeed: { min: 2, max: 5 }
            },
            titleEffect: {
                particleCount: Math.floor(150 * mobileMultiplier),
                orbitRadius: 25,
                orbitSpeed: 0.3,
                particleSize: { min: 0.15, max: 0.5 }
            }
        };
    }

    async init(containerId = 'hero-particles') {
        try {
            if (typeof THREE === 'undefined') {
                console.warn('Three.js no está disponible');
                return false;
            }

            this.setupScene();
            this.setupCamera();
            this.setupRenderer(containerId);
            this.createParticleSystem();
            this.createConstellationSystem();
            this.createStarSystem();
            this.createTitleEffect();
            this.setupEventListeners();
            this.animate();
            
            this.isInitialized = true;
        
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Hero Three.js Engine:', error);
            return false;
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 50, 200);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
        this.camera.position.y = 0;
    }

    setupRenderer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Contenedor ${containerId} no encontrado`);
            return;
        }

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1';
    }

    createParticleSystem() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = this.config.particles.count;
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const speeds = new Float32Array(particleCount);
        const opacities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Posiciones aleatorias distribuidas en el espacio
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20;

            // Colores basados en el tema
            const color = this.currentTheme === 'dark' 
                ? new THREE.Color(0x4FC3F7) 
                : new THREE.Color(0x64B5F6);
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 
                (this.config.particles.size.max - this.config.particles.size.min) + 
                this.config.particles.size.min;
            
            speeds[i] = Math.random() * 
                (this.config.particles.speed.max - this.config.particles.speed.min) + 
                this.config.particles.speed.min;
            
            opacities[i] = Math.random() * 
                (this.config.particles.opacity.max - this.config.particles.opacity.min) + 
                this.config.particles.opacity.min;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        particleGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
        particleGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                theme: { value: this.currentTheme === 'dark' ? 1.0 : 0.0 }
            },
            vertexShader: `
                attribute vec3 color;
                attribute float size;
                attribute float speed;
                attribute float opacity;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    vOpacity = opacity;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float theme;
                varying float vOpacity;
                varying vec3 vColor;

                void main() {
                    // Crear forma circular suave
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Brillo suave con efecto de twinkle lento
                    float twinkle = 0.7 + 0.3 * sin(time * 1.5);
                    float alpha = vOpacity * twinkle;
                    alpha *= smoothstep(0.5, 0.0, dist);
                    vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), 0.2);
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    createConstellationSystem() {
        const constellationCount = this.config.constellations.count;
        
        for (let i = 0; i < constellationCount; i++) {
            const constellation = this.createConstellation(i, constellationCount);
            this.constellations.push(constellation);
            this.scene.add(constellation);
        }
    }

    createConstellation(index, constellationCount) {
        const group = new THREE.Group();
        const starCount = Math.floor(Math.random() *
            (this.config.constellations.starsPerConstellation.max -
             this.config.constellations.starsPerConstellation.min) +
            this.config.constellations.starsPerConstellation.min);

        const positions = [];
        const starSize = this.config.constellations.starSize;

        // Crear estrellas pequeñas y delicadas
        for (let i = 0; i < starCount; i++) {
            const star = this.createStar(starSize, 0.6);

            // Distribución más compacta para constelación más pequeña
            const angle = (i / starCount) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 2 + Math.random() * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 1;

            star.position.set(x, y, z);
            positions.push(new THREE.Vector3(x, y, z));
            group.add(star);
        }

        // Crear conexiones finas entre estrellas
        for (let i = 0; i < starCount; i++) {
            for (let j = i + 1; j < starCount; j++) {
                if (Math.random() > 0.3) {
                    const connection = this.createConnection(positions[i], positions[j]);
                    group.add(connection);
                }
            }
        }

        // Posición inicial - distribuida ampliamente
        group.position.set(
            (Math.random() - 0.5) * 120,
            (Math.random() - 0.5) * 70,
            -15 + Math.random() * 10
        );

        // Velocidades claras para movimiento visible
        const velX = (0.08 + Math.random() * 0.12) * (Math.random() > 0.5 ? 1 : -1);
        const velY = (0.04 + Math.random() * 0.08) * (Math.random() > 0.5 ? 1 : -1);

        group.userData = {
            velocity: { x: velX, y: velY, z: 0 },
            rotationSpeed: (Math.random() - 0.5) * 0.003,
            pulsePhase: Math.random() * Math.PI * 2,
            originalScale: 1.0
        };

        return group;
    }

    createStar(size, intensity) {
        // Estrellas muy pequeñas y delicadas
        const geometry = new THREE.SphereGeometry(size, 6, 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: intensity * 0.8
        });

        const star = new THREE.Mesh(geometry, material);

        star.userData = {
            originalIntensity: intensity * 0.8,
            twinkleSpeed: Math.random() * 2 + 1
        };

        return star;
    }

    createConnection(start, end) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({
            color: 0x88CCFF,
            transparent: true,
            opacity: this.config.constellations.connectionOpacity
        });

        const line = new THREE.Line(geometry, material);
        line.userData = { baseOpacity: this.config.constellations.connectionOpacity };
        return line;
    }

    createTitleEffect() {
        // Crear partículas que orbitan alrededor del área del título
        const particleCount = this.config.titleEffect.particleCount;
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const phases = new Float32Array(particleCount);
        const speeds = new Float32Array(particleCount);
        const radiuses = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Distribuir en un toroide alrededor del centro
            const angle = (i / particleCount) * Math.PI * 2 * 3; // 3 vueltas
            const radius = this.config.titleEffect.orbitRadius + (Math.random() - 0.5) * 15;
            const height = (Math.random() - 0.5) * 12;

            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius * 0.3; // Más plano en Z

            // Colores cyan/azul
            const hue = 0.52 + Math.random() * 0.08;
            const color = new THREE.Color();
            color.setHSL(hue, 1, 0.6 + Math.random() * 0.2);

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() *
                (this.config.titleEffect.particleSize.max - this.config.titleEffect.particleSize.min) +
                this.config.titleEffect.particleSize.min;

            phases[i] = Math.random() * Math.PI * 2;
            speeds[i] = 0.2 + Math.random() * 0.4;
            radiuses[i] = radius;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
        geometry.setAttribute('radius', new THREE.BufferAttribute(radiuses, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute vec3 color;
                attribute float size;
                attribute float phase;
                attribute float speed;
                attribute float radius;
                uniform float time;
                varying vec3 vColor;
                varying float vOpacity;

                void main() {
                    vColor = color;

                    // Orbitar alrededor del centro
                    float angle = phase + time * speed;
                    vec3 pos = position;
                    pos.x = cos(angle) * radius;
                    pos.z = sin(angle) * radius * 0.3;

                    // Movimiento vertical suave
                    pos.y += sin(time * 2.0 + phase) * 1.5;

                    // Pulso de opacidad
                    vOpacity = 0.4 + 0.4 * sin(time * 3.0 + phase);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vOpacity;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vOpacity * smoothstep(0.5, 0.0, dist);
                    vec3 finalColor = mix(vColor, vec3(1.0), 0.3);

                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.titleParticles = new THREE.Points(geometry, material);
        this.scene.add(this.titleParticles);

        // Crear un glow central
        const glowGeometry = new THREE.PlaneGeometry(60, 20);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;

                void main() {
                    vec2 center = vUv - 0.5;
                    float dist = length(center * vec2(1.0, 2.0));

                    // Glow pulsante
                    float pulse = 0.5 + 0.3 * sin(time * 2.0);
                    float glow = exp(-dist * 4.0) * pulse;

                    vec3 color = mix(vec3(0.4, 0.7, 1.0), vec3(0.0, 1.0, 1.0), sin(time) * 0.5 + 0.5);

                    gl_FragColor = vec4(color, glow * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.titleGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.titleGlow.position.z = -5;
        this.scene.add(this.titleGlow);
    }

    createStarSystem() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = this.config.stars.count;
        
        const positions = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        const twinkleSpeeds = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            // Distribuir estrellas en el cielo
            const phi = Math.acos(-1 + (2 * i) / starCount);
            const theta = Math.sqrt(starCount * Math.PI) * phi;
            
            const radius = 80 + Math.random() * 20;
            positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            sizes[i] = Math.random() * 
                (this.config.stars.size.max - this.config.stars.size.min) + 
                this.config.stars.size.min;
            
            twinkleSpeeds[i] = Math.random() * 
                (this.config.stars.twinkleSpeed.max - this.config.stars.twinkleSpeed.min) + 
                this.config.stars.twinkleSpeed.min;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        starGeometry.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));

        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                varying float vSize;
                
                void main() {
                    vSize = size;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float time;
                varying float vSize;
                
                void main() {
                    float twinkle = 0.8 + 0.2 * sin(time * 2.0);
                    float alpha = twinkle * (0.6 + 0.4 * (vSize / 2.0));
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.starSystem = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starSystem);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse move para efecto parallax
        document.addEventListener('mousemove', (event) => {
            if (!this.isInitialized) return;
            
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.camera.position.x = mouseX * 5;
            this.camera.position.y = mouseY * 3;
            this.camera.lookAt(0, 0, 0);
        });

        // Scroll para efecto parallax
        window.addEventListener('scroll', () => {
            if (!this.isInitialized) return;
            
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1;
            
            this.particleSystem.position.y = rate;
            this.starSystem.position.y = rate * 0.5;
        });
    }

    onWindowResize() {
        if (!this.renderer || !this.camera) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.isInitialized) return;
        
        const time = Date.now() * 0.001;
        
        // Animar partículas - solo efecto de brillo, sin rotación
        if (this.particleSystem) {
            this.particleSystem.material.uniforms.time.value = time;
        }

        // Animar constelaciones - movimiento continuo cruzando la pantalla
        this.constellations.forEach((constellation) => {
            const ud = constellation.userData;

            // Mover la constelación
            constellation.position.x += ud.velocity.x;
            constellation.position.y += ud.velocity.y;

            // Wrap around con límites amplios
            const limitX = 70;
            const limitY = 45;

            if (constellation.position.x > limitX) constellation.position.x = -limitX;
            if (constellation.position.x < -limitX) constellation.position.x = limitX;
            if (constellation.position.y > limitY) constellation.position.y = -limitY;
            if (constellation.position.y < -limitY) constellation.position.y = limitY;

            // Rotación muy suave
            constellation.rotation.z += ud.rotationSpeed;

            // Animar cada elemento de la constelación
            constellation.children.forEach((child) => {
                if (child.type === 'Mesh' && child.userData.twinkleSpeed) {
                    // Twinkle de estrellas
                    const twinkle = Math.sin(time * child.userData.twinkleSpeed + ud.pulsePhase) * 0.25 + 0.75;
                    child.material.opacity = child.userData.originalIntensity * twinkle;
                } else if (child.type === 'Line' && child.userData.baseOpacity) {
                    // Pulso suave de las líneas
                    const linePulse = Math.sin(time * 0.8 + ud.pulsePhase) * 0.03 + 1;
                    child.material.opacity = child.userData.baseOpacity * linePulse;
                }
            });
        });

        // Animar sistema de estrellas - solo efecto twinkle
        if (this.starSystem) {
            this.starSystem.material.uniforms.time.value = time;
        }

        // Animar efecto del título
        if (this.titleParticles) {
            this.titleParticles.material.uniforms.time.value = time;
        }
        if (this.titleGlow) {
            this.titleGlow.material.uniforms.time.value = time;
        }

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        
        if (this.particleSystem && this.particleSystem.material.uniforms) {
            this.particleSystem.material.uniforms.theme.value = theme === 'dark' ? 1.0 : 0.0;
        }
        
        // Actualizar colores de las constelaciones
        this.constellations.forEach(constellation => {
            constellation.children.forEach(child => {
                if (child.type === 'Line') { // Es una conexión
                    child.material.color.setHex(theme === 'dark' ? 0x4FC3F7 : 0x64B5F6);
                }
            });
        });
    }

    setPerformanceMode(highPerformance = true) {
        if (!this.renderer) return;
        
        if (highPerformance) {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        } else {
            this.renderer.setPixelRatio(1);
        }
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
        this.constellations = [];
        this.stars = [];
        this.isInitialized = false;
    }
}
