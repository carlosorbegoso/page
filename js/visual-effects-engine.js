// ===== SISTEMA UNIFICADO DE EFECTOS VISUALES CON THREE.JS =====

class VisualEffectsEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.constellations = [];
        this.cursor = null;
        this.background = null;
        this.isInitialized = false;
        this.currentTheme = 'light';
        this.performanceMode = 'high';
        
        this.init();
    }
    
    init() {
        try {
            this.createScene();
            this.createCamera();
            this.createRenderer();
            this.createBackground();
            this.createCursor();
            this.createParticleSystem();
            this.createConstellationSystem();
            this.addEventListeners();
            this.animate();
            
            this.isInitialized = true;
            console.log('✨ Visual Effects Engine initialized successfully!');
            
        } catch (error) {
            console.error('❌ Error initializing Visual Effects Engine:', error);
        }
    }
    
    // ===== CREACIÓN DE ESCENA =====
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 100, 1000);
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            2000
        );
        this.camera.position.z = 500;
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Insertar canvas al inicio del body
        document.body.insertBefore(this.renderer.domElement, document.body.firstChild);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1';
        this.renderer.domElement.style.pointerEvents = 'none';
    }
    
    // ===== SISTEMA DE FONDO DINÁMICO =====
    createBackground() {
        // Crear estrellas de fondo
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.1 + 0.6, 0.8, Math.random() * 0.3 + 0.7);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 3 + 1;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.background = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.background);
    }
    
    // ===== SISTEMA DE CURSOR ELEGANTE =====
    createCursor() {
        const cursorGeometry = new THREE.SphereGeometry(8, 16, 16);
        const cursorMaterial = new THREE.MeshBasicMaterial({
            color: 0x64B5F6,
            transparent: true,
            opacity: 0.8
        });
        
        this.cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
        this.scene.add(this.cursor);
        
        // Trail de partículas
        this.cursorTrail = [];
        for (let i = 0; i < 10; i++) {
            const trailParticle = new THREE.Mesh(
                new THREE.SphereGeometry(4, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: 0x64B5F6,
                    transparent: true,
                    opacity: 0.3
                })
            );
            this.cursorTrail.push(trailParticle);
            this.scene.add(trailParticle);
        }
    }
    
    // ===== SISTEMA DE PARTÍCULAS INTELIGENTE =====
    createParticleSystem() {
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                mesh: new THREE.Mesh(
                    new THREE.SphereGeometry(2, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 0.8, 0.7),
                        transparent: true,
                        opacity: 0.6
                    })
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                ),
                life: Math.random() * 100 + 50,
                maxLife: Math.random() * 100 + 50
            };
            
            particle.mesh.position.set(
                (Math.random() - 0.5) * 1000,
                (Math.random() - 0.5) * 1000,
                (Math.random() - 0.5) * 1000
            );
            
            this.particles.push(particle);
            this.scene.add(particle.mesh);
        }
    }
    
    // ===== SISTEMA DE CONSTELACIONES INTERACTIVO =====
    createConstellationSystem() {
        const sectionCount = 6; // Hero, About, Experience, Skills, Projects, Contact
        
        for (let i = 0; i < sectionCount; i++) {
            const constellation = {
                stars: [],
                connections: [],
                center: new THREE.Vector3(
                    (Math.random() - 0.5) * 800,
                    (Math.random() - 0.5) * 800,
                    (Math.random() - 0.5) * 800
                )
            };
            
            // Crear estrellas para cada sección
            const starCount = Math.floor(Math.random() * 8) + 5;
            for (let j = 0; j < starCount; j++) {
                const star = new THREE.Mesh(
                    new THREE.SphereGeometry(3, 8, 8),
                    new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(0.6, 0.8, 0.7),
                        transparent: true,
                        opacity: 0.8
                    })
                );
                
                star.position.copy(constellation.center);
                star.position.add(new THREE.Vector3(
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200,
                    (Math.random() - 0.5) * 200
                ));
                
                constellation.stars.push(star);
                this.scene.add(star);
            }
            
            // Crear conexiones entre estrellas
            for (let j = 0; j < constellation.stars.length - 1; j++) {
                const connection = this.createConnection(
                    constellation.stars[j].position,
                    constellation.stars[j + 1].position
                );
                constellation.connections.push(connection);
                this.scene.add(connection);
            }
            
            this.constellations.push(constellation);
        }
    }
    
    createConnection(start, end) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({
            color: 0x64B5F6,
            transparent: true,
            opacity: 0.4
        });
        
        return new THREE.Line(geometry, material);
    }
    
    // ===== EVENTOS Y INTERACTIVIDAD =====
    addEventListeners() {
        // Mouse move para cursor
        document.addEventListener('mousemove', (event) => {
            if (this.cursor) {
                const mouse = new THREE.Vector2();
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                
                const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
                vector.unproject(this.camera);
                const dir = vector.sub(this.camera.position).normalize();
                const distance = -this.camera.position.z / dir.z;
                const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
                
                this.cursor.position.copy(pos);
                
                // Actualizar trail
                this.updateCursorTrail(pos);
            }
        });
        
        // Click para efectos
        document.addEventListener('click', (event) => {
            this.createClickEffect(event.clientX, event.clientY);
        });
        
        // Scroll para parallax
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Tema
        window.addEventListener('themeChanged', (event) => {
            this.updateTheme(event.detail.theme);
        });
    }
    
    updateCursorTrail(cursorPos) {
        this.cursorTrail.forEach((particle, index) => {
            const delay = index * 0.1;
            const targetPos = cursorPos.clone();
            targetPos.add(new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                0
            ));
            
            particle.position.lerp(targetPos, 0.1);
            particle.material.opacity = 0.3 * (1 - index / this.cursorTrail.length);
        });
    }
    
    createClickEffect(x, y) {
        const mouse = new THREE.Vector2();
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(this.camera);
        const dir = vector.sub(this.camera.position).normalize();
        const distance = -this.camera.position.z / dir.z;
        const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        
        // Crear explosión de partículas
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(2, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 0.8, 0.7),
                    transparent: true,
                    opacity: 0.8
                })
            );
            
            particle.position.copy(pos);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            particle.life = 60;
            
            this.scene.add(particle);
            
            // Remover después de un tiempo
            setTimeout(() => {
                this.scene.remove(particle);
            }, 1000);
        }
    }
    
    updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = scrolled / maxScroll;
        
        // Parallax en estrellas de fondo
        if (this.background) {
            this.background.rotation.y = scrollPercent * Math.PI * 2;
        }
        
        // Efectos en constelaciones
        this.constellations.forEach((constellation, index) => {
            const section = document.querySelectorAll('section')[index];
            if (section) {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    constellation.stars.forEach(star => {
                        star.material.opacity = 0.8;
                        star.scale.setScalar(1.2);
                    });
                } else {
                    constellation.stars.forEach(star => {
                        star.material.opacity = 0.4;
                        star.scale.setScalar(1);
                    });
                }
            }
        });
    }
    
    // ===== GESTIÓN DE TEMAS =====
    updateTheme(theme) {
        this.currentTheme = theme;
        const isDark = theme === 'dark';
        
        // Actualizar colores del cursor
        if (this.cursor) {
            this.cursor.material.color.setHex(isDark ? 0x64B5F6 : 0x1976D2);
        }
        
        // Actualizar colores de partículas
        this.particles.forEach(particle => {
            const hue = isDark ? 0.6 : 0.5;
            particle.mesh.material.color.setHSL(hue, 0.8, 0.7);
        });
        
        // Actualizar constelaciones
        this.constellations.forEach(constellation => {
            constellation.stars.forEach(star => {
                const hue = isDark ? 0.6 : 0.5;
                star.material.color.setHSL(hue, 0.8, 0.7);
            });
        });
    }
    
    // ===== ANIMACIÓN PRINCIPAL =====
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isInitialized) return;
        
        // Animar partículas
        this.particles.forEach(particle => {
            particle.mesh.position.add(particle.velocity);
            particle.life--;
            
            if (particle.life <= 0) {
                particle.life = particle.maxLife;
                particle.mesh.position.set(
                    (Math.random() - 0.5) * 1000,
                    (Math.random() - 0.5) * 1000,
                    (Math.random() - 0.5) * 1000
                );
            }
            
            // Efecto de respiración
            const scale = 1 + Math.sin(Date.now() * 0.001 + particle.life) * 0.1;
            particle.mesh.scale.setScalar(scale);
        });
        
        // Animar constelaciones
        this.constellations.forEach(constellation => {
            constellation.stars.forEach((star, index) => {
                const time = Date.now() * 0.001;
                const offset = index * 0.5;
                
                star.position.y += Math.sin(time + offset) * 0.5;
                star.rotation.z += 0.01;
            });
        });
        
        // Animar cursor
        if (this.cursor) {
            this.cursor.rotation.y += 0.02;
            this.cursor.material.opacity = 0.6 + Math.sin(Date.now() * 0.003) * 0.2;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // ===== UTILIDADES =====
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    setPerformanceMode(mode) {
        this.performanceMode = mode;
        
        if (mode === 'low') {
            this.particles.forEach(particle => {
                particle.mesh.visible = false;
            });
            this.constellations.forEach(constellation => {
                constellation.stars.forEach(star => {
                    star.visible = false;
                });
            });
        } else {
            this.particles.forEach(particle => {
                particle.mesh.visible = true;
            });
            this.constellations.forEach(constellation => {
                constellation.stars.forEach(star => {
                    star.visible = true;
                });
            });
        }
    }
    
    // ===== LIMPIEZA =====
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.isInitialized = false;
    }
}

// Exportar para uso global
export default VisualEffectsEngine;
