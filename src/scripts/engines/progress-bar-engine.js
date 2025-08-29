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
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createCosmicElements();
        this.createProgressCounter();
        this.animate();
        
        this.isInitialized = true;
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
        // Crear constelación de Virgo
        this.createVirgoConstellation();
        
        // Crear galaxias en miniatura
        this.createMiniGalaxies();
        
        // Crear polvo cósmico
        this.createCosmicDust();
        
        // Crear ondas de energía
        this.createEnergyWaves();
    }
    
    createProgressCounter() {
        // Crear anillo de progreso principal
        this.createProgressRing();
        
        // Crear contador central
        this.createCentralCounter();
        
        // Crear estrellas de progreso
        this.createProgressStars();
        
        // Crear anillos decorativos
        this.createDecorativeRings();
    }
    
    createProgressRing() {
        // Anillo exterior de progreso
        const ringGeometry = new THREE.RingGeometry(2.5, 3, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x00BFFF,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const progressRing = new THREE.Mesh(ringGeometry, ringMaterial);
        progressRing.position.z = 1;
        this.scene.add(progressRing);
        
        // Anillo de progreso que se llena
        const fillGeometry = new THREE.RingGeometry(2.5, 3, 64);
        const fillMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const fillRing = new THREE.Mesh(fillGeometry, fillMaterial);
        fillRing.position.z = 1.1;
        fillRing.userData = { type: 'progressFill', progress: 0 };
        this.scene.add(fillRing);
        
        this.progressElements.push({ ring: progressRing, fill: fillRing });
    }
    
    createCentralCounter() {
        // Crear geometría para el número central
        const loader = new THREE.FontLoader();
        
        // Por ahora usamos un plano con textura para el número
        const counterGeometry = new THREE.PlaneGeometry(1, 1);
        const counterMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.9
        });
        
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.z = 2;
        counter.userData = { type: 'counter', value: 0 };
        this.scene.add(counter);
        
        this.progressElements.push(counter);
    }
    
    createProgressStars() {
        // Crear 5 estrellas de progreso en posiciones específicas
        const starPositions = [
            { x: 0, y: 4, z: 0, progress: 20 },
            { x: 3, y: 2.5, z: 0, progress: 40 },
            { x: 4, y: 0, z: 0, progress: 60 },
            { x: 3, y: -2.5, z: 0, progress: 80 },
            { x: 0, y: -4, z: 0, progress: 100 }
        ];
        
        starPositions.forEach((pos, index) => {
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
        });
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
    
    createDecorativeRings() {
        // Crear anillos decorativos que giran
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(1.5 + i * 0.5, 1.6 + i * 0.5, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x8A2BE2,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.z = 0.5 + i * 0.2;
            ring.userData = { 
                type: 'decorativeRing',
                rotationSpeed: 0.02 + i * 0.01,
                direction: i % 2 === 0 ? 1 : -1
            };
            
            this.scene.add(ring);
            this.progressElements.push(ring);
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
    
    createCosmicDust() {
        // Crear partículas de polvo cósmico que fluyen
        const dustCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(dustCount * 3);
        const velocities = new Float32Array(dustCount * 3);
        const colors = new Float32Array(dustCount * 3);
        
        for (let i = 0; i < dustCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
            
            velocities[i * 3] = (Math.random() - 0.5) * 0.03;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
            
            // Colores más brillantes para fondo negro
            const color = new THREE.Color();
            color.setHSL(0.6 + Math.random() * 0.3, 0.9, 0.7);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const dust = new THREE.Points(geometry, material);
        dust.userData = { velocities: velocities };
        this.scene.add(dust);
        this.cosmicDust.push(dust);
    }
    
    createEnergyWaves() {
        // Crear ondas de energía que se expanden
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.RingGeometry(0.5 + i * 0.5, 0.6 + i * 0.5, 32);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00BFFF,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(ring, material);
            wave.userData = { 
                scale: 1,
                maxScale: 12 + i * 3,
                speed: 0.025 + i * 0.015,
                delay: i * 0.5
            };
            
            this.scene.add(wave);
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
            if (element.userData.type === 'progressFill') {
                // Actualizar anillo de progreso
                const fillRing = element.fill;
                const progressAngle = (progress / 100) * Math.PI * 2;
                
                // Crear nueva geometría con el progreso
                const newGeometry = new THREE.RingGeometry(2.5, 3, 64, 0, progressAngle);
                fillRing.geometry.dispose();
                fillRing.geometry = newGeometry;
            }
            
            if (element.userData.type === 'progressStar') {
                // Activar estrellas según progreso
                if (progress >= element.userData.progress && !element.userData.active) {
                    element.userData.active = true;
                    element.material.opacity = 1;
                    element.scale.setScalar(1.5);
                    
                    // Animación de entrada
                    gsap.to(element.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 0.5,
                        ease: "back.out(1.7)"
                    });
                }
            }
            
            if (element.userData.type === 'decorativeRing') {
                // Rotar anillos decorativos
                element.rotation.z += element.userData.rotationSpeed * element.userData.direction;
            }
        });
    }
    
    hideProgressBar() {
        const container = document.getElementById('progress-container');
        if (container) {
            container.classList.add('hidden');
            setTimeout(() => {
                container.style.display = 'none';
            }, 1200);
        }
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotar galaxias
        this.galaxies.forEach(galaxy => {
            galaxy.rotation.z += galaxy.userData.rotationSpeed;
            galaxy.rotation.y += galaxy.userData.rotationSpeed * 0.5;
        });
        
        // Mover polvo cósmico
        this.cosmicDust.forEach(dust => {
            const positions = dust.geometry.attributes.position.array;
            const velocities = dust.userData.velocities;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // Resetear partículas que salen del área visible
                if (Math.abs(positions[i]) > 12.5 || 
                    Math.abs(positions[i + 1]) > 12.5 || 
                    Math.abs(positions[i + 2]) > 12.5) {
                    positions[i] = (Math.random() - 0.5) * 25;
                    positions[i + 1] = (Math.random() - 0.5) * 25;
                    positions[i + 2] = (Math.random() - 0.5) * 25;
                }
            }
            
            dust.geometry.attributes.position.needsUpdate = true;
        });
        
        // Animar ondas de energía
        this.scene.children.forEach(child => {
            if (child.userData && child.userData.maxScale) {
                child.userData.scale += child.userData.speed;
                if (child.userData.scale < child.userData.maxScale) {
                    child.scale.setScalar(child.userData.scale);
                    child.material.opacity = Math.max(0, 0.2 - (child.userData.scale / child.userData.maxScale) * 0.2);
                } else {
                    child.userData.scale = 1;
                    child.scale.setScalar(1);
                    child.material.opacity = 0.2;
                }
            }
        });
        
        // Rotar cámara suavemente
        this.camera.position.x = Math.sin(time * 0.1) * 2;
        this.camera.position.y = Math.cos(time * 0.15) * 1;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
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

document.addEventListener('DOMContentLoaded', () => {
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
});

// Exportar para uso global
window.CosmicProgressEngine = CosmicProgressEngine;
