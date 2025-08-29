/* ===== PROGRESS BAR THREE.JS ENGINE COMPLETAMENTE ÉPICO ===== */

class CosmicProgressEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.constellationLines = [];
        this.galaxies = [];
        this.cosmicDust = [];
        this.progressElements = [];
        this.progress = 0;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        try {
            // Agregar clase loading al contenedor
            const container = document.getElementById('progress-container');
            if (container) {
                container.classList.add('loading');
            }
            
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.createCosmicElements();
            this.createProgressCounter();
            
            this.isInitialized = true;
            this.animate();
        } catch (error) {
            console.error('Error inicializando ProgressBar:', error);
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 15, 50);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 8;
    }
    
    setupRenderer() {
        const canvas = document.getElementById('progress-canvas');
        
        if (!canvas) {
            console.error('No se encontró el canvas progress-canvas');
            return;
        }
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
        createCosmicElements() {
        this.createVirgoConstellation();
        this.createMiniGalaxies();
        this.createFloatingParticles();
        this.createEnergyRings();
    }
    
    createProgressCounter() {
        try {
            this.createCentralPulse();
            this.createProgressRing();
            this.createFloatingParticles();
        } catch (error) {
            console.error('Error creando ProgressCounter:', error);
        }
    }
    
    createCentralPulse() {
        try {
            // Círculo central con borde neón elegante
            const outerGeometry = new THREE.RingGeometry(1.2, 1.4, 128);
            const outerMaterial = new THREE.MeshBasicMaterial({
                color: 0x00D4FF,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            
            const outer = new THREE.Mesh(outerGeometry, outerMaterial);
            outer.position.z = 2;
            outer.userData = { 
                type: 'outerRing', 
                pulseSpeed: 0.02,
                pulseScale: 1,
                originalScale: 1
            };
            this.scene.add(outer);
            
            // Círculo interior sólido
            const innerGeometry = new THREE.CircleGeometry(1.0, 128);
            const innerMaterial = new THREE.MeshBasicMaterial({
                color: 0x1A1A2E,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            });
            
            const inner = new THREE.Mesh(innerGeometry, innerMaterial);
            inner.position.z = 2.1;
            this.scene.add(inner);
            
            this.progressElements.push(outer);
        } catch (error) {
            console.error('Error creando pulso central:', error);
        }
    }
    
    createProgressRing() {
        try {
            // Anillo de progreso exterior (fondo) muy sutil
            const ringGeometry = new THREE.RingGeometry(2.8, 3.2, 128);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x16213E,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.z = 1;
            this.scene.add(ring);
            
            // Anillo de progreso que se llena con gradiente
            const progressGeometry = new THREE.RingGeometry(2.8, 3.2, 128);
            const progressMaterial = new THREE.MeshBasicMaterial({
                color: 0x00D4FF,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            });
            
            const progressRing = new THREE.Mesh(progressGeometry, progressMaterial);
            progressRing.position.z = 1.1;
            progressRing.userData = { type: 'progressRing', progress: 0 };
            this.scene.add(progressRing);
            
            this.progressElements.push(progressRing);
        } catch (error) {
            console.error('Error creando anillo de progreso:', error);
        }
    }
    
    createProgressStars() {
        try {
            // Crear 5 estrellas de progreso en posiciones específicas
            const starPositions = [
                { x: 0, y: 4, z: 0, progress: 20 },
                { x: 3, y: 2.5, z: 0, progress: 40 },
                { x: 4, y: 0, z: 0, progress: 60 },
                { x: 3, y: -2.5, z: 0, progress: 80 },
                { x: 0, y: -4, z: 0, progress: 100 }
            ];
            
            starPositions.forEach((pos, index) => {
                try {
                    const starGeometry = this.createStarGeometry(0.3);
                    const starMaterial = new THREE.MeshBasicMaterial({
                        color: 0xFFD700,
                        transparent: true,
                        opacity: 0,
                        side: THREE.DoubleSide
                    });
                    
                    const star = new THREE.Mesh(starGeometry, starMaterial);
                    star.position.set(pos.x, pos.y, pos.z);
                    star.userData = { 
                        type: 'progressStar', 
                        progress: pos.progress,
                        active: false,
                        originalScale: 1
                    };
                    
                    this.scene.add(star);
                    this.progressElements.push(star);
                } catch (starError) {
                    console.error('Error creando estrella', index, ':', starError);
                }
            });
        } catch (error) {
            console.error('Error creando ProgressStars:', error);
        }
    }
    
    createStarGeometry(size) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        // Crear forma de estrella de 5 puntas
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const outerRadius = size;
            const innerRadius = size * 0.4;
            
            // Punto exterior
            vertices.push(
                Math.cos(angle) * outerRadius,
                Math.sin(angle) * outerRadius,
                0
            );
            
            // Punto interior
            const innerAngle = angle + Math.PI / 5;
            vertices.push(
                Math.cos(innerAngle) * innerRadius,
                Math.sin(innerAngle) * innerRadius,
                0
            );
        }
        
        // Crear caras triangulares
        const indices = [];
        for (let i = 0; i < 10; i += 2) {
            const next = (i + 2) % 10;
            indices.push(i, i + 1, next);
            indices.push(i + 1, next + 1, next);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        
        return geometry;
    }
    
    createVisualCounter() {
        try {
            // Crear contenedor para el número
            const counterContainer = new THREE.Group();
            counterContainer.position.z = 3;
            
            // Crear fondo circular para el número
            const backgroundGeometry = new THREE.CircleGeometry(0.8, 32);
            const backgroundMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.7
            });
            
            const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
            counterContainer.add(background);
            
            // Crear el número central (placeholder - se actualizará dinámicamente)
            const numberGeometry = new THREE.PlaneGeometry(1.2, 0.8);
            const numberMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFD700,
                transparent: true,
                opacity: 0.9
            });
            
            const numberDisplay = new THREE.Mesh(numberGeometry, numberMaterial);
            numberDisplay.userData = { type: 'numberDisplay', value: 0 };
            counterContainer.add(numberDisplay);
            
            this.scene.add(counterContainer);
            this.progressElements.push(numberDisplay);
            
        } catch (error) {
            console.error('Error creando contador visual:', error);
        }
    }
    
    createVirgoConstellation() {
        // Posiciones de las estrellas principales de Virgo
        const virgoStars = [
            { x: -3, y: 2, z: 0, size: 0.3, color: 0xFFD700 },    // Spica
            { x: -1, y: 1.5, z: 0, size: 0.25, color: 0x00BFFF }, // Porrima
            { x: 1, y: 0.5, z: 0, size: 0.2, color: 0x8A2BE2 },   // Vindemiatrix
            { x: 2, y: -0.5, z: 0, size: 0.18, color: 0xFFD700 },  // Auva
            { x: 0, y: -1, z: 0, size: 0.22, color: 0x00BFFF },    // Heze
            { x: -2, y: -1.5, z: 0, size: 0.2, color: 0x8A2BE2 }   // Zavijava
        ];
        
        // Crear estrellas
        virgoStars.forEach((star, index) => {
            const geometry = new THREE.SphereGeometry(star.size, 16, 16);
            const material = new THREE.MeshBasicMaterial({ 
                color: star.color,
                transparent: true,
                opacity: 0
            });
            
            const starMesh = new THREE.Mesh(geometry, material);
            starMesh.position.set(star.x, star.y, star.z);
            starMesh.userData = { 
                originalColor: star.color,
                targetOpacity: 1,
                delay: index * 0.3
            };
            
            this.scene.add(starMesh);
            this.particles.push(starMesh);
        });
        
        // Crear líneas de conexión entre estrellas
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
            [1, 3], [2, 4], [0, 4]
        ];
        
        connections.forEach((connection, index) => {
            const start = virgoStars[connection[0]];
            const end = virgoStars[connection[1]];
            
            const points = [
                new THREE.Vector3(start.x, start.y, start.z),
                new THREE.Vector3(end.x, end.y, end.z)
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: 0x00BFFF,
                transparent: true,
                opacity: 0
            });
            
            const line = new THREE.Line(geometry, material);
            line.userData = { delay: index * 0.2 };
            this.scene.add(line);
            this.constellationLines.push(line);
        });
    }
    
    createMiniGalaxies() {
        // Crear 3 galaxias en miniatura que giran
        for (let i = 0; i < 3; i++) {
            const galaxy = new THREE.Group();
            
            // Posición aleatoria
            const angle = (i / 3) * Math.PI * 2;
            const radius = 4 + Math.random() * 2;
            galaxy.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                -2 + Math.random() * 4
            );
            
            // Crear partículas de la galaxia
            const particleCount = 50;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            for (let j = 0; j < particleCount; j++) {
                const angle = (j / particleCount) * Math.PI * 2;
                const radius = Math.random() * 2;
                
                positions[j * 3] = Math.cos(angle) * radius;
                positions[j * 3 + 1] = Math.sin(angle) * radius;
                positions[j * 3 + 2] = (Math.random() - 0.5) * 0.5;
                
                const color = new THREE.Color();
                color.setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6);
                colors[j * 3] = color.r;
                colors[j * 3 + 1] = color.g;
                colors[j * 3 + 2] = color.b;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0
            });
            
            const points = new THREE.Points(geometry, material);
            galaxy.add(points);
            galaxy.userData = { 
                rotationSpeed: 0.01 + Math.random() * 0.02,
                delay: i * 0.5,
                targetOpacity: 0.8
            };
            
            this.scene.add(galaxy);
            this.galaxies.push(galaxy);
        }
    }
    
    createFloatingParticles() {
        try {
            // Crear partículas sutiles y elegantes
            const particleCount = 16;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount; i++) {
                // Posición en círculo perfecto
                const angle = (i / particleCount) * Math.PI * 2;
                const radius = 4.0;
                
                positions[i * 3] = Math.cos(angle) * radius;
                positions[i * 3 + 1] = Math.sin(angle) * radius;
                positions[i * 3 + 2] = 0;
                
                // Solo color azul neón sutil
                const color = new THREE.Color(0x00D4FF);
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.04,
                vertexColors: true,
                transparent: true,
                opacity: 0.5,
                sizeAttenuation: true
            });
            
            const particles = new THREE.Points(geometry, material);
            particles.userData = { 
                type: 'orbitingParticles',
                rotationSpeed: 0.008
            };
            this.scene.add(particles);
            this.progressElements.push(particles);
            
        } catch (error) {
            console.error('Error creando partículas orbitales:', error);
        }
    }
    
    createEnergyRings() {
        try {
            // Crear anillos de energía que giran y pulsan
            for (let i = 0; i < 4; i++) {
                const ringGeometry = new THREE.RingGeometry(1.8 + i * 0.4, 1.9 + i * 0.4, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0x8A2BE2,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.z = 0.8 + i * 0.3;
                ring.userData = { 
                    type: 'energyRing',
                    rotationSpeed: 0.015 + i * 0.01,
                    pulseSpeed: 0.02 + i * 0.005,
                    pulseScale: 1,
                    originalScale: 1 + i * 0.1
                };
                
                this.scene.add(ring);
                this.progressElements.push(ring);
            }
        } catch (error) {
            console.error('Error creando anillos de energía:', error);
        }
    }
    
    updateProgress(newProgress) {
        this.progress = newProgress;
        
        // Actualizar elementos de progreso
        this.updateProgressElements(newProgress);
        
        // Actualizar opacidad de estrellas según progreso
        this.particles.forEach((star, index) => {
            const targetOpacity = Math.min(1, (newProgress / 100) * (index + 1) * 0.3);
            star.material.opacity = Math.min(star.material.opacity + 0.02, targetOpacity);
        });
        
        // Actualizar líneas de constelación
        this.constellationLines.forEach((line, index) => {
            const targetOpacity = Math.min(1, (newProgress / 100) * (index + 1) * 0.2);
            line.material.opacity = Math.min(line.material.opacity + 0.015, targetOpacity);
        });
        
        // Actualizar galaxias
        this.galaxies.forEach((galaxy, index) => {
            const targetOpacity = Math.min(0.8, (newProgress / 100) * (index + 1) * 0.3);
            galaxy.children[0].material.opacity = Math.min(
                galaxy.children[0].material.opacity + 0.01, 
                targetOpacity
            );
        });
        
        // Si el progreso está completo, ocultar el ProgressBar
        if (newProgress >= 100) {
            setTimeout(() => {
                this.hideProgressBar();
            }, 2000);
        }
    }
    
    updateProgressElements(progress) {
        this.progressElements.forEach(element => {
            // Validar que el elemento existe y tiene userData
            if (!element || !element.userData || !element.userData.type) {
                return; // Saltar este elemento si no tiene userData.type
            }
            
            if (element.userData.type === 'progressRing') {
                // Actualizar anillo de progreso
                const progressAngle = (progress / 100) * Math.PI * 2;
                
                // Crear nueva geometría con el progreso
                const newGeometry = new THREE.RingGeometry(2.8, 3.2, 128, 0, progressAngle);
                element.geometry.dispose();
                element.geometry = newGeometry;
            }
            
            if (element.userData.type === 'outerRing') {
                // Efecto de pulso suave en el anillo exterior
                element.userData.pulseScale += element.userData.pulseSpeed;
                if (element.userData.pulseScale > 1.05 || element.userData.pulseScale < 0.95) {
                    element.userData.pulseSpeed *= -1;
                }
                
                element.scale.setScalar(element.userData.originalScale * element.userData.pulseScale);
            }
            
            if (element.userData.type === 'orbitingParticles') {
                // Rotar partículas orbitales
                element.rotation.z += element.userData.rotationSpeed;
                
                // Hacer que brillen más según el progreso
                const intensity = progress / 100;
                element.material.opacity = 0.4 + (intensity * 0.4);
            }
        });
    }
    
    hideProgressBar() {
        const container = document.getElementById('progress-container');
        if (container) {
            // Remover clase loading para quitar el blur
            container.classList.remove('loading');
            container.classList.add('hidden');
            
            setTimeout(() => {
                container.style.display = 'none';
                
                // Mostrar el contenido principal cuando se complete el ProgressBar
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.style.opacity = '0';
                    
                    // Fade in del contenido principal
                    let opacity = 0;
                    const fadeIn = setInterval(() => {
                        opacity += 0.05;
                        mainContent.style.opacity = opacity;
                        
                        if (opacity >= 1) {
                            clearInterval(fadeIn);
                        }
                    }, 50);
                }
            }, 1200);
        }
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        if (!this.renderer || !this.scene || !this.camera) return;
        
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotar galaxias
        this.galaxies.forEach(galaxy => {
            galaxy.rotation.z += galaxy.userData.rotationSpeed;
            galaxy.rotation.y += galaxy.userData.rotationSpeed * 0.5;
        });
        
        // Animar partículas orbitales
        this.progressElements.forEach(element => {
            if (element.userData && element.userData.type === 'orbitingParticles') {
                // Las partículas ya rotan en updateProgressElements
                // Aquí solo agregamos un sutil movimiento ondulante
                const positions = element.geometry.attributes.position.array;
                const timeOffset = time * 0.3;
                
                for (let i = 0; i < positions.length; i += 3) {
                    // Movimiento ondulante muy sutil
                    positions[i] += Math.sin(timeOffset + i * 0.2) * 0.0005;
                    positions[i + 1] += Math.cos(timeOffset + i * 0.2) * 0.0005;
                }
                
                element.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        // Rotar cámara suavemente
        this.camera.position.x = Math.sin(time * 0.1) * 2;
        this.camera.position.y = Math.cos(time * 0.15) * 1;
        this.camera.lookAt(0, 0, 0);
        
        try {
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('Error renderizando:', error);
        }
    }
    
    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.scene) {
            this.scene.clear();
        }
        this.isInitialized = false;
    }
}

// Inicializar el motor cuando se carga la página
let cosmicEngine = null;

// El ProgressBar se ejecuta automáticamente desde index.html

// ProgressBar simple como fallback
function initSimpleProgressBar() {
    const container = document.getElementById('progress-container');
    if (!container) {
        console.error('No se encontró el contenedor del ProgressBar');
        return;
    }
    
    // Agregar clase loading
    container.classList.add('loading');
    
    // Crear barra de progreso simple
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 300px;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin: 20px 0;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #FFD700, #00BFFF);
        border-radius: 4px;
        transition: width 0.3s ease;
    `;
    
    progressBar.appendChild(progressFill);
    container.appendChild(progressBar);
    
    // Simular progreso
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Ocultar ProgressBar
            setTimeout(() => {
                container.classList.remove('loading');
                container.classList.add('hidden');
                setTimeout(() => {
                    container.style.display = 'none';
                    
                    // Mostrar contenido principal
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.style.display = 'block';
                        mainContent.style.opacity = '0';
                        
                        let opacity = 0;
                        const fadeIn = setInterval(() => {
                            opacity += 0.05;
                            mainContent.style.opacity = opacity;
                            if (opacity >= 1) {
                                clearInterval(fadeIn);
                            }
                        }, 50);
                    }
                }, 1200);
            }, 1000);
        }
        
        progressFill.style.width = progress + '%';
    }, 200);
}

// Función principal para inicializar el ProgressBar
function initProgressBar() {
    // Verificar que Three.js esté disponible
    if (typeof THREE === 'undefined') {
        console.error('Three.js no está disponible, usando ProgressBar simple');
        initSimpleProgressBar();
        return;
    }
    
    try {
        cosmicEngine = new CosmicProgressEngine();
        
        // Simular progreso de carga
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 12;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            cosmicEngine.updateProgress(progress);
        }, 300);
        
        // Manejar redimensionamiento de ventana
        window.addEventListener('resize', () => {
            if (cosmicEngine) {
                cosmicEngine.onWindowResize();
            }
        });
    } catch (error) {
        console.error('Error iniciando ProgressBar Three.js, usando versión simple:', error);
        initSimpleProgressBar();
    }
}

// Exportar para uso global
window.CosmicProgressEngine = CosmicProgressEngine;
window.initProgressBar = initProgressBar;
window.initSimpleProgressBar = initSimpleProgressBar;
