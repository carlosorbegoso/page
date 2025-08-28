/**
 * Hero Three.js Engine
 * Motor específico para efectos visuales avanzados del Hero section
 */

export class HeroThreeEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.constellations = [];
        this.stars = [];
        this.animationId = null;
        this.isInitialized = false;
        this.currentTheme = 'light';
        
        // Configuración de efectos
        this.config = {
            particles: {
                count: 150,
                size: { min: 1, max: 3 },
                speed: { min: 0.1, max: 0.3 },
                opacity: { min: 0.3, max: 0.8 }
            },
            constellations: {
                count: 5,
                starsPerConstellation: { min: 4, max: 8 },
                connectionOpacity: 0.4,
                glowIntensity: 0.6
            },
            stars: {
                count: 200,
                size: { min: 0.5, max: 2 },
                twinkleSpeed: { min: 2, max: 5 }
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
            this.setupEventListeners();
            this.animate();
            
            this.isInitialized = true;
            console.log('🎭 Hero Three.js Engine inicializado');
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
            // Posiciones en forma de espiral 3D
            const angle = (i / particleCount) * Math.PI * 4;
            const radius = 20 + (i / particleCount) * 30;
            const height = (i / particleCount) * 40 - 20;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius;

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
                    float alpha = vOpacity * (0.8 + 0.2 * sin(time * 2.0));
                    vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), theme * 0.3);
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

        const stars = [];
        const positions = [];

        // Crear estrellas de la constelación
        for (let i = 0; i < starCount; i++) {
            const star = this.createStar(0.8, 1.2);
            stars.push(star);
            
            const angle = (i / starCount) * Math.PI * 2;
            const radius = 8 + Math.random() * 4;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 10;
            
            star.position.set(x, y, z);
            positions.push(new THREE.Vector3(x, y, z));
            group.add(star);
        }

        // Crear conexiones entre estrellas
        for (let i = 0; i < starCount; i++) {
            for (let j = i + 1; j < starCount; j++) {
                if (Math.random() > 0.5) { // 50% de probabilidad de conexión
                    const connection = this.createConnection(
                        positions[i], 
                        positions[j]
                    );
                    group.add(connection);
                }
            }
        }

        // Posicionar la constelación
        const angle = (index / constellationCount) * Math.PI * 2;
        const radius = 25 + Math.random() * 15;
        group.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.5,
            (Math.random() - 0.5) * 20
        );

        return group;
    }

    createStar(size, intensity) {
        const geometry = new THREE.SphereGeometry(size, 8, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: intensity
        });
        
        const star = new THREE.Mesh(geometry, material);
        
        // Animación de twinkle
        star.userData = {
            originalIntensity: intensity,
            twinkleSpeed: Math.random() * 3 + 2
        };
        
        return star;
    }

    createConnection(start, end) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({
            color: 0x4FC3F7,
            transparent: true,
            opacity: this.config.constellations.connectionOpacity
        });
        
        return new THREE.Line(geometry, material);
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
        
        // Animar partículas
        if (this.particleSystem) {
            this.particleSystem.material.uniforms.time.value = time;
            this.particleSystem.rotation.y = time * 0.1;
            this.particleSystem.rotation.x = time * 0.05;
        }
        
        // Animar constelaciones
        this.constellations.forEach((constellation, index) => {
            constellation.rotation.y = time * (0.1 + index * 0.05);
            constellation.rotation.z = time * (0.05 + index * 0.02);
            
            // Animar estrellas individuales
            constellation.children.forEach((child, childIndex) => {
                if (child.type === 'Mesh') { // Es una estrella
                    const twinkle = Math.sin(time * child.userData.twinkleSpeed) * 0.3 + 0.7;
                    child.material.opacity = child.userData.originalIntensity * twinkle;
                }
            });
        });
        
        // Animar sistema de estrellas
        if (this.starSystem) {
            this.starSystem.material.uniforms.time.value = time;
            this.starSystem.rotation.y = time * 0.02;
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
