// ===== EFECTOS 3D CON THREE.JS =====

import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';

class ThreeEffects {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.animationId = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // Solo inicializar si el navegador soporta WebGL
        if (!this.checkWebGLSupport()) {
            console.log('WebGL no soportado, usando fallback');
            return;
        }

        this.createScene();
        this.createParticles();
        this.createLights();
        this.addEventListeners();
        this.animate();
        
        this.isInitialized = true;
        console.log('Three.js effects inicializados');
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    createScene() {
        // Crear escena
        this.scene = new THREE.Scene();
        
        // Crear cámara
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Agregar al DOM
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.appendChild(this.renderer.domElement);
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.zIndex = '1';
            this.renderer.domElement.style.pointerEvents = 'none';
        }
    }

    createParticles() {
        // Crear geometría de partículas
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Colores del tema
        const themeColors = {
            primary: new THREE.Color(0x2C5AA0),
            secondary: new THREE.Color(0xFF6B35),
            accent: new THREE.Color(0x4285F4)
        };

        for (let i = 0; i < particleCount; i++) {
            // Posiciones aleatorias
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            // Colores aleatorios del tema
            const colorKeys = Object.keys(themeColors);
            const randomColor = themeColors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
            colors[i * 3] = randomColor.r;
            colors[i * 3 + 1] = randomColor.g;
            colors[i * 3 + 2] = randomColor.b;

            // Tamaños aleatorios
            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Material de partículas
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        // Crear sistema de partículas
        this.particles = new THREE.Points(geometry, particleMaterial);
        this.scene.add(this.particles);
    }

    createLights() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Luz direccional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    addEventListeners() {
        // Mouse move para interacción
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Resize del navegador
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Cambio de tema
        window.addEventListener('themeChanged', () => {
            this.updateThemeColors();
        });
    }

    updateThemeColors() {
        if (!this.particles) return;

        const currentTheme = document.documentElement.getAttribute('data-theme');
        const themeColors = currentTheme === 'dark' 
            ? {
                primary: new THREE.Color(0x64B5F6),
                secondary: new THREE.Color(0xFF8A65),
                accent: new THREE.Color(0x81C784)
              }
            : {
                primary: new THREE.Color(0x2C5AA0),
                secondary: new THREE.Color(0xFF6B35),
                accent: new THREE.Color(0x4285F4)
              };

        const colors = this.particles.geometry.attributes.color.array;
        const particleCount = colors.length / 3;

        for (let i = 0; i < particleCount; i++) {
            const colorKeys = Object.keys(themeColors);
            const randomColor = themeColors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
            
            colors[i * 3] = randomColor.r;
            colors[i * 3 + 1] = randomColor.g;
            colors[i * 3 + 2] = randomColor.b;
        }

        this.particles.geometry.attributes.color.needsUpdate = true;
    }

    animate() {
        if (!this.isInitialized) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotar partículas
        if (this.particles) {
            this.particles.rotation.x += 0.001;
            this.particles.rotation.y += 0.002;

            // Mover partículas con el mouse
            this.particles.rotation.x += this.mouseY * 0.0005;
            this.particles.rotation.y += this.mouseX * 0.0005;
        }

        // Renderizar escena
        this.renderer.render(this.scene, this.camera);
    }

    // Efecto de cursor 3D
    createCursorEffect() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-3d';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-trail"></div>';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animación suave del cursor
        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(animateCursor);
        };

        animateCursor();
    }

    // Efecto de cards 3D
    create3DCards() {
        const cards = document.querySelectorAll('.project-card, .skill-category, .timeline-item');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // Efecto de ondas en el fondo
    createWaveEffect() {
        const waveGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
        const waveMaterial = new THREE.MeshPhongMaterial({
            color: 0x2C5AA0,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });

        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.rotation.x = -Math.PI / 2;
        wave.position.y = -5;
        this.scene.add(wave);

        // Animación de ondas
        const animateWave = () => {
            const time = Date.now() * 0.001;
            const vertices = wave.geometry.attributes.position.array;
            
            for (let i = 0; i < vertices.length; i += 3) {
                vertices[i + 2] = Math.sin(time + vertices[i] * 0.5) * 0.5;
            }
            
            wave.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animateWave);
        };

        animateWave();
    }

    // Limpiar recursos
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
    }
}

export default ThreeEffects;
