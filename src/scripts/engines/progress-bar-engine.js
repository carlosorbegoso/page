// Importaciones modernas de Three.js 0.158.0+ con Vite
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';

/*
 * EPIC PROGRESS BAR ENGINE - Versión Revolucionaria
 * 
 * Esta versión usa Three.js 0.158.0+ con módulos ES6 modernos
 * Los efectos avanzados de post-procesamiento están habilitados por defecto
 */

class EpicProgressEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.particles = [];
        this.progressElements = [];
        this.progress = 0;
        this.isInitialized = false;
        this.clock = new THREE.Clock();
        this.uniforms = {};
        this.audioContext = null;
        this.analyser = null;
        
        // Configuración épica y nocturna
        this.config = {
            particleCount: 2000, // Reducido para mejor rendimiento
            maxParticles: 3000,
            particleSize: 0.008, // Partículas más pequeñas y elegantes
            animationSpeed: 1.2, // Movimiento más suave
            bloomIntensity: 2.0,
            chromaticAberration: 0.003,
            enableAudio: true,
            enableHologram: true,
            enableQuantum: true
        };
        
        this.init();
    }
    
    init() {
        try {
            const container = document.getElementById('progress-container');
            if (container) {
                container.classList.add('loading');
            }
            
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupPostProcessing();
            this.setupAudio();
            this.createQuantumParticleSystem();
            this.createHolographicProgress();
            this.createCosmicEffects();
            this.createNeuralNetworks();
            
            this.isInitialized = true;
            this.animate();
        } catch (error) {
            console.error('Error inicializando EpicProgressEngine:', error);
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        
        // Niebla nocturna más densa y misteriosa
        this.scene.fog = new THREE.FogExp2(0x000011, 0.025);
        
        // Sistema de iluminación nocturno
        this.setupNocturnalLighting();
        
        // Background nocturno profundo
        this.scene.background = new THREE.Color(0x000011);
    }
    
    setupNocturnalLighting() {
        // Luz lunar principal (más suave y azulada)
        const moonlight = new THREE.DirectionalLight(0x1E3A8A, 1.2);
        moonlight.position.set(15, 15, 10);
        moonlight.castShadow = true;
        moonlight.shadow.mapSize.width = 2048;
        moonlight.shadow.mapSize.height = 2048;
        moonlight.shadow.camera.near = 0.1;
        moonlight.shadow.camera.far = 100;
        this.scene.add(moonlight);
        
        // Luces estelares (más tenues y elegantes)
        const starlight1 = new THREE.PointLight(0x3B82F6, 1.5, 25);
        starlight1.position.set(-8, 5, 3);
        this.scene.add(starlight1);
        
        const starlight2 = new THREE.PointLight(0x8B5CF6, 1.2, 22);
        starlight2.position.set(8, -3, 4);
        this.scene.add(starlight2);
        
        // Luz de energía cuántica (más sutil)
        const energyLight = new THREE.SpotLight(0x0EA5E9, 2.5, 30, Math.PI / 8, 0.3);
        energyLight.position.set(0, 10, 5);
        energyLight.target.position.set(0, 0, 0);
        this.scene.add(energyLight);
        this.scene.add(energyLight.target);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.01,
            1000
        );
        this.camera.position.set(0, 0, 20);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        // Crear canvas si no existe
        let canvas = document.getElementById('progress-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'progress-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '1000';
            document.body.appendChild(canvas);
        }
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.useLegacyLights = false;
    }
    
    setupPostProcessing() {
        try {
            // Configuración moderna del EffectComposer
            this.composer = new EffectComposer(this.renderer);
            
            // Render pass básico
            const renderPass = new RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);
            
            // Bloom pass con configuración moderna
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.8,  // strength
                0.5,  // radius
                0.85  // threshold
            );
            this.composer.addPass(bloomPass);
            
            // Aberración cromática avanzada usando RGBShift
            const chromaticPass = new ShaderPass(RGBShiftShader);
            chromaticPass.uniforms.amount.value = this.config.chromaticAberration;
            this.composer.addPass(chromaticPass);
            
    
            
        } catch (error) {
            console.error('Error en post-procesamiento, usando renderizado básico:', error);
            this.composer = null;
        }
    }
    

    
    setupAudio() {
        if (!this.config.enableAudio) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
        } catch (error) {
            console.log('Audio no disponible:', error);
        }
    }
    
    createQuantumParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.config.particleCount * 3);
        const velocities = new Float32Array(this.config.particleCount * 3);
        const colors = new Float32Array(this.config.particleCount * 3);
        const sizes = new Float32Array(this.config.particleCount);
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const i3 = i * 3;
            
            // Distribución cuántica en múltiples dimensiones
            const angle = (i / this.config.particleCount) * Math.PI * 12;
            const radius = Math.random() * 30 + 5;
            const height = (Math.random() - 0.5) * 15;
            const spiral = Math.sin(i * 0.1) * 3;
            
            positions[i3] = Math.cos(angle) * (radius + spiral);
            positions[i3 + 1] = height + Math.sin(angle * 2) * 2;
            positions[i3 + 2] = Math.sin(angle) * (radius + spiral);
            
            // Velocidades cuánticas
            velocities[i3] = -Math.sin(angle) * 0.03;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = Math.cos(angle) * 0.03;
            
            // Colores cuánticos
            const hue = (i / this.config.particleCount) + Math.sin(i * 0.1) * 0.3;
            const color = new THREE.Color().setHSL(hue, 0.9, 0.7);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            sizes[i] = Math.random() * this.config.particleSize + 0.008;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Material de partículas nocturnas más elegante
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.012, // Partículas más pequeñas
            vertexColors: true,
            transparent: true,
            opacity: 0.6, // Más sutil
            sizeAttenuation: true,
            map: this.createQuantumParticleTexture(),
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particleSystem = new THREE.Points(geometry, particleMaterial);
        particleSystem.userData = {
            type: 'quantumParticleSystem',
            velocities: velocities,
            originalPositions: positions.slice()
        };
        
        this.scene.add(particleSystem);
        this.progressElements.push(particleSystem);
    }
    
    createHolographicProgress() {
        // Anillo holográfico principal
        this.createHolographicRing();
        
        // Indicadores cuánticos
        this.createQuantumIndicators();
        
        // Contador holográfico
        this.createHolographicCounter();
        
        // Efectos de energía cuántica
        this.createQuantumEnergyEffects();
    }
    
    createHolographicRing() {
        const ringGroup = new THREE.Group();
        
        // Anillo base holográfico (más pequeño y elegante)
        const baseRingGeometry = new THREE.RingGeometry(2.5, 2.6, 128);
        const baseRingMaterial = new THREE.MeshBasicMaterial({
            color: 0x000822,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const baseRing = new THREE.Mesh(baseRingGeometry, baseRingMaterial);
        ringGroup.add(baseRing);
        
        // Anillo de progreso holográfico (más fino)
        const progressRingGeometry = new THREE.RingGeometry(2.5, 2.6, 128);
        const progressRingMaterial = new THREE.MeshBasicMaterial({
            color: 0x0EA5E9,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const progressRing = new THREE.Mesh(progressRingGeometry, progressRingMaterial);
        progressRing.userData = { type: 'holographicProgressRing', progress: 0 };
        ringGroup.add(progressRing);
        
        // Efectos holográficos
        this.createHolographicEffects(ringGroup);
        
        this.scene.add(ringGroup);
        this.progressElements.push(progressRing);
    }
    
    createHolographicEffects(ringGroup) {
        // Líneas holográficas (más finas y elegantes)
        for (let i = 0; i < 12; i++) { // Más líneas para mejor distribución
            const angle = (i / 12) * Math.PI * 2;
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(
                    Math.cos(angle) * 4, // Radio más pequeño
                    Math.sin(angle) * 4,
                    0
                )
            ]);
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x0EA5E9,
                transparent: true,
                opacity: 0.4, // Más sutil
                linewidth: 1 // Líneas más finas
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            line.userData = { type: 'holographicLine', angle: angle };
            ringGroup.add(line);
            this.progressElements.push(line);
        }
        
        // Partículas holográficas orbitales (más pequeñas)
        const hologramParticles = new THREE.Group();
        for (let i = 0; i < 24; i++) { // Menos partículas pero más elegantes
            const angle = (i / 24) * Math.PI * 2;
            const radius = 3.2; // Radio más pequeño
            
            const particleGeometry = new THREE.SphereGeometry(0.005, 6, 6); // Ultra pequeñas
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0x8B5CF6, // Color más nocturno
                transparent: true,
                opacity: 0.4 // Más sutil
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.x = Math.cos(angle) * radius;
            particle.position.y = Math.sin(angle) * radius;
            particle.position.z = 0.1;
            
            particle.userData = {
                angle: angle,
                radius: radius,
                speed: 1.5 + Math.random() * 2, // Movimiento más suave
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            hologramParticles.add(particle);
        }
        
        ringGroup.add(hologramParticles);
        hologramParticles.userData = { type: 'hologramParticles' };
        this.progressElements.push(hologramParticles);
    }
    
    createQuantumIndicators() {
        const indicatorCount = 16; // Más indicadores para mejor distribución
        const indicators = new THREE.Group();
        
        for (let i = 0; i < indicatorCount; i++) {
            const angle = (i / indicatorCount) * Math.PI * 2;
            const radius = 5; // Radio más pequeño
            
            // Geometría cuántica ultra pequeña y elegante
            const quantumGeometry = new THREE.OctahedronGeometry(0.06); // Mucho más pequeño
            const quantumMaterial = new THREE.MeshStandardMaterial({
                color: 0x0EA5E9, // Color más nocturno
                transparent: true,
                opacity: 0,
                emissive: 0x1E3A8A, // Emisión más sutil
                emissiveIntensity: 0.3
            });
            
            const quantum = new THREE.Mesh(quantumGeometry, quantumMaterial);
            quantum.position.x = Math.cos(angle) * radius;
            quantum.position.y = Math.sin(angle) * radius;
            quantum.position.z = 0.6;
            
            quantum.userData = {
                type: 'quantumIndicator',
                angle: angle,
                radius: radius,
                progress: (i / indicatorCount) * 100,
                active: false,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            indicators.add(quantum);
        }
        
        this.scene.add(indicators);
        indicators.userData = { type: 'quantumIndicators' };
        this.progressElements.push(indicators);
    }
    
    createHolographicCounter() {
        const counterGroup = new THREE.Group();
        
        // Fondo holográfico (más pequeño y transparente)
        const backgroundGeometry = new THREE.CircleGeometry(1.2, 32); // Más pequeño y menos detallado
        const backgroundMaterial = new THREE.MeshBasicMaterial({
            color: 0x000822, // Color más nocturno
            transparent: true,
            opacity: 0.15 // Mucho más transparente
        });
        
        const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        counterGroup.add(background);
        
        // Borde holográfico (más fino y sutil)
        const borderGeometry = new THREE.RingGeometry(1.15, 1.25, 32); // Más fino
        const borderMaterial = new THREE.MeshBasicMaterial({
            color: 0x0EA5E9, // Color más nocturno
            transparent: true,
            opacity: 0.3 // Mucho más sutil
        });
        
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        counterGroup.add(border);
        
        // Texto holográfico (más pequeño y transparente)
        const textGeometry = new THREE.PlaneGeometry(1.8, 0.9); // Más pequeño
        const textMaterial = new THREE.MeshBasicMaterial({
            color: 0xE2E8F0, // Color más suave
            transparent: true,
            opacity: 0.4 // Mucho más transparente
        });
        
        const textDisplay = new THREE.Mesh(textGeometry, textMaterial);
        textDisplay.userData = { type: 'holographicText', value: 0 };
        counterGroup.add(textDisplay);
        
        this.scene.add(counterGroup);
        this.progressElements.push(textDisplay);
    }
    
    createQuantumEnergyEffects() {
        // Efectos de energía cuántica (ondas ultra finas y elegantes)
        for (let i = 0; i < 10; i++) { // Más ondas para mejor efecto
            const waveGeometry = new THREE.RingGeometry(1.5 + i * 0.6, 1.52 + i * 0.6, 32); // Ultra finas
            const waveMaterial = new THREE.MeshBasicMaterial({
                color: 0x0EA5E9, // Color más nocturno
                transparent: true,
                opacity: 0.05, // Ultra sutil
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            wave.position.z = i * 0.15; // Más cercanas
            wave.userData = {
                type: 'quantumEnergyWave',
                index: i,
                speed: 0.5 + i * 0.25, // Movimiento más suave
                scale: 1
            };
            
            this.scene.add(wave);
            this.progressElements.push(wave);
        }
    }
    
    createCosmicEffects() {
        // Efectos cósmicos adicionales
        this.createNebulaEffect();
        this.createWormholeEffect();
    }
    
    createNebulaEffect() {
        // Efecto de nebulosa nocturna más sutil
        const nebulaGeometry = new THREE.SphereGeometry(20, 32, 32); // Más pequeña y menos detallada
        const nebulaMaterial = new THREE.MeshBasicMaterial({
            color: 0x0F172A, // Color más nocturno y profundo
            transparent: true,
            opacity: 0.06, // Mucho más sutil
            side: THREE.BackSide
        });
        
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebula.userData = { type: 'nebula', rotationSpeed: 0.0005 }; // Rotación más lenta
        this.scene.add(nebula);
        this.progressElements.push(nebula);
    }
    
    createWormholeEffect() {
        // Efecto de agujero de gusano nocturno más elegante
        const wormholeGeometry = new THREE.CylinderGeometry(0.3, 6, 16, 24, 1, true); // Más pequeño y fino
        const wormholeMaterial = new THREE.MeshBasicMaterial({
            color: 0x7C3AED, // Color más nocturno
            transparent: true,
            opacity: 0.15, // Más sutil
            side: THREE.DoubleSide
        });
        
        const wormhole = new THREE.Mesh(wormholeGeometry, wormholeMaterial);
        wormhole.position.z = -8; // Más cercano
        wormhole.userData = { type: 'wormhole', rotationSpeed: 0.015 }; // Rotación más suave
        this.scene.add(wormhole);
        this.progressElements.push(wormhole);
    }
    
    createNeuralNetworks() {
        // Redes neuronales cuánticas nocturnas más elegantes
        const neuralCount = 6; // Un nodo más para mejor distribución
        for (let i = 0; i < neuralCount; i++) {
            const neuralGeometry = new THREE.SphereGeometry(0.04, 8, 8); // Ultra pequeño y menos detallado
            const neuralMaterial = new THREE.MeshBasicMaterial({
                color: 0x8B5CF6, // Color más nocturno
                transparent: true,
                opacity: 0.3 // Ultra sutil
            });
            
            const neural = new THREE.Mesh(neuralGeometry, neuralMaterial);
            neural.position.set(
                (Math.random() - 0.5) * 15, // Distribución más compacta
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15
            );
            
            neural.userData = {
                type: 'neuralNode',
                connections: [],
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            this.scene.add(neural);
            this.progressElements.push(neural);
        }
        
        // Crear conexiones entre nodos
        this.createNeuralConnections();
    }
    
    createNeuralConnections() {
        const neuralNodes = this.progressElements.filter(el => el.userData.type === 'neuralNode');
        
        neuralNodes.forEach((node, index) => {
            const nextNode = neuralNodes[(index + 1) % neuralNodes.length];
            
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
                node.position,
                nextNode.position
            ]);
            
            const connectionMaterial = new THREE.LineBasicMaterial({
                color: 0x8B5CF6, // Color más nocturno
                transparent: true,
                opacity: 0.25, // Más sutil
                linewidth: 1 // Líneas más finas
            });
            
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            connection.userData = { type: 'neuralConnection' };
            this.scene.add(connection);
            this.progressElements.push(connection);
        });
    }
    
    createQuantumParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Textura cuántica nocturna más sutil
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.3, 'rgba(14, 165, 233, 0.7)'); // Azul nocturno
        gradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.4)'); // Púrpura sutil
        gradient.addColorStop(0.9, 'rgba(30, 58, 138, 0.1)'); // Azul profundo
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)'); // Negro profundo
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        
        // Patrón cuántico nocturno más sutil
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)'; // Azul más sutil
        ctx.lineWidth = 0.5; // Líneas más finas
        for (let i = 0; i < 6; i++) { // Menos líneas
            const angle = (i / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(64, 64);
            ctx.lineTo(
                64 + Math.cos(angle) * 48, // Radio más pequeño
                64 + Math.sin(angle) * 48
            );
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    updateProgress(progress) {
        if (!this.isInitialized) return;
        
        this.currentProgress = Math.min(100, Math.max(0, progress));
        
        // Actualizar contador holográfico
        this.updateHolographicCounter(this.currentProgress);
        
        // Actualizar indicadores cuánticos
        this.updateQuantumIndicators(this.currentProgress);
        
        // Actualizar todos los elementos de progreso
        this.updateProgressElements(this.currentProgress);
        
        // Verificar si el progreso está completo
        if (this.currentProgress >= 100) {
        
            setTimeout(() => {
                this.hideProgressBar();
            }, 1000); // Esperar 1 segundo para mostrar el 100%
        }
    }
    
    updateProgressElements(progress) {
        const time = this.clock.getElapsedTime();
        
        // Sistema de audio disponible para futuras implementaciones
        if (this.analyser && this.audioData) {
            this.analyser.getByteFrequencyData(this.audioData);
            // Los datos de audio están disponibles para efectos futuros
        }
        
        // Actualizar uniformes de tiempo (sin distorsión cuántica por compatibilidad)
        
        this.progressElements.forEach((element) => {
            if (!element || !element.userData) return;
            
            switch (element.userData.type) {
                case 'quantumParticleSystem':
                    this.updateQuantumParticleSystem(element, time, progress);
                    break;
                    
                case 'holographicProgressRing':
                    this.updateHolographicProgressRing(element, progress);
                    break;
                    
                case 'hologramParticles':
                    this.updateHologramParticles(element, time);
                    break;
                    
                case 'quantumIndicator':
                    this.updateQuantumIndicator(element, progress);
                    break;
                    
                case 'quantumEnergyWave':
                    this.updateQuantumEnergyWaves(element, time);
                    break;
                    
                case 'nebula':
                    this.updateNebula(element, time);
                    break;
                    
                case 'wormhole':
                    this.updateWormhole(element, time);
                    break;
                    
                case 'neuralNode':
                    this.updateNeuralNodes(element, time);
                    break;
            }
        });
    }
    
    updateQuantumParticleSystem(particleSystem, time, progress) {
        const positions = particleSystem.geometry.attributes.position.array;
        const velocities = particleSystem.userData.velocities;
        const originalPositions = particleSystem.userData.originalPositions;
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const i3 = i * 3;
            
            // Movimiento cuántico avanzado
            positions[i3] += velocities[i3] * this.config.animationSpeed;
            positions[i3 + 1] += velocities[i3 + 1] * this.config.animationSpeed;
            positions[i3 + 2] += velocities[i3 + 2] * this.config.animationSpeed;
        }
        
        // Efectos cuánticos en el material
        const quantumEffect = Math.sin(time * 0.5) * 0.1;
        const progressInfluence = progress / 100;
        
        // Opacidad dinámica
        particleSystem.material.opacity = 0.3 + progressInfluence * 0.7 + quantumEffect;
        
        // Tamaño dinámico
        particleSystem.material.size = 0.012 * (1 + progressInfluence * 0.5 + quantumEffect * 0.3);
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Rotación cuántica
        particleSystem.rotation.y = time * 0.15;
        particleSystem.rotation.z = time * 0.08;
        particleSystem.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
    
    updateHolographicProgressRing(element, progress) {
        const progressValue = progress / 100;
        element.material.opacity = 0.4 + progressValue * 0.5;
        
        // Efecto holográfico pulsante
        const pulse = Math.sin(this.clock.getElapsedTime() * 6) * 0.1;
        element.scale.setScalar(1 + pulse);
        
        // Cambio de color holográfico nocturno
        const hue = (progressValue * 0.2) + 0.6; // Rango más sutil
        const saturation = 0.8; // Menos saturado
        const lightness = 0.5; // Más oscuro
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        element.material.color = color;
    }
    
    updateHologramParticles(particles, time) {
        particles.children.forEach((particle, index) => {
            const data = particle.userData;
            
            // Movimiento orbital holográfico
            const angle = data.angle + time * data.speed;
            particle.position.x = Math.cos(angle) * data.radius;
            particle.position.y = Math.sin(angle) * data.radius;
            
            // Efecto holográfico
            const hologram = Math.sin(time * 4 + data.pulsePhase) * 0.5 + 0.5;
            particle.material.opacity = 0.6 + hologram * 0.4;
            
            // Escala holográfica
            const scale = 1 + hologram * 0.3;
            particle.scale.setScalar(scale);
            
            // Rotación holográfica
            particle.rotation.z += 0.05;
        });
    }
    
    updateQuantumIndicators(element, progress) {
        const data = element.userData;
        const shouldBeActive = progress >= data.progress;
        
        if (shouldBeActive && !data.active) {
            data.active = true;
            element.material.opacity = 0.9;
            element.material.emissive.setHex(0x008844);
        }
        
        if (data.active) {
            // Efectos cuánticos activos
            const quantumPulse = Math.sin(this.clock.getElapsedTime() * 5 + data.pulsePhase) * 0.4;
            element.material.opacity = 0.7 + quantumPulse;
            
            // Rotación cuántica
            element.rotation.y += 0.03;
            element.rotation.z += 0.02;
            element.rotation.x += 0.01;
            
            // Escala cuántica
            const scale = 1 + quantumPulse * 0.2;
            element.scale.setScalar(scale);
        }
    }
    
    updateQuantumEnergyWaves(wave, time) {
        const data = wave.userData;
        
        // Escala cuántica
        const scale = 1 + Math.sin(time * data.speed) * 0.3;
        wave.scale.setScalar(scale);
        
        // Opacidad cuántica
        const opacity = 0.1 + Math.sin(time * data.speed * 2) * 0.15;
        wave.material.opacity = opacity;
        
        // Rotación cuántica
        wave.rotation.z += 0.015 * data.speed;
        wave.rotation.y += 0.01 * data.speed;
    }
    
    updateNebula(element, time) {
        element.rotation.y += element.userData.rotationSpeed;
        element.rotation.z += element.userData.rotationSpeed * 0.5;
        
        // Efecto de pulso nebuloso
        const nebulaPulse = Math.sin(time * 0.2) * 0.05;
        element.material.opacity = 0.1 + nebulaPulse;
    }
    
    updateWormhole(element, time) {
        element.rotation.z += element.userData.rotationSpeed;
        
        // Efecto de agujero de gusano
        const wormholeEffect = Math.sin(time * 0.3) * 0.2;
        element.material.opacity = 0.3 + wormholeEffect;
        
        // Escala dinámica
        const scale = 1 + Math.sin(time * 0.5) * 0.1;
        element.scale.setScalar(scale);
    }
    
    updateNeuralNodes(element, time) {
        const data = element.userData;
        
        // Pulso neural
        const neuralPulse = Math.sin(time * 3 + data.pulsePhase) * 0.3;
        element.material.opacity = 0.5 + neuralPulse;
        
        // Rotación neural
        element.rotation.y += 0.02;
        element.rotation.z += 0.015;
        
        // Escala neural
        const scale = 1 + neuralPulse * 0.2;
        element.scale.setScalar(scale);
    }
    
    updateHolographicCounter(progress) {
        // Buscar el contador holográfico en la escena
        this.scene.traverse((child) => {
            if (child.userData && child.userData.type === 'holographicText') {
                // Actualizar el valor del progreso
                child.userData.value = Math.round(progress);
                
                // Efecto de pulso cuando cambia
                child.material.opacity = 0.6 + Math.sin(this.clock.getElapsedTime() * 3) * 0.2;
            }
        });
    }
    
    updateQuantumIndicators(progress) {
        // Buscar los indicadores cuánticos en la escena
        this.scene.traverse((child) => {
            if (child.userData && child.userData.type === 'quantumIndicator') {
                this.updateQuantumIndicator(child, progress);
            }
        });
    }
    
    updateQuantumIndicator(element, progress) {
        const data = element.userData;
        const shouldBeActive = progress >= data.progress;
        
        if (shouldBeActive && !data.active) {
            data.active = true;
            element.material.opacity = 0.9;
            if (element.material.emissive) {
                element.material.emissive.setHex(0x008844);
            }
        }
        
        if (data.active) {
            // Efectos cuánticos activos
            const quantumPulse = Math.sin(this.clock.getElapsedTime() * 5 + data.pulsePhase) * 0.4;
            element.material.opacity = 0.7 + quantumPulse;
            
            // Rotación cuántica
            element.rotation.y += 0.03;
            element.rotation.z += 0.02;
            element.rotation.x += 0.01;
            
            // Escala cuántica
            const scale = 1 + quantumPulse * 0.2;
            element.scale.setScalar(scale);
        }
    }
    
    hideProgressBar() {
       
        const container = document.getElementById('progress-container');
        if (container) {
        
            container.classList.remove('loading');
            container.classList.add('hidden');
            
            setTimeout(() => {
                container.style.display = 'none';
               
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.style.opacity = '0';
                    
                    let opacity = 0;
                    const fadeIn = setInterval(() => {
                        opacity += 0.03;
                        mainContent.style.opacity = opacity;
                        
                        if (opacity >= 1) {
                            clearInterval(fadeIn);
                        
                            
                            // Ejecutar main.js después de que el fade-in esté completo
                            this.executeMainScript();
                        }
                    }, 30);
                } else {
                    console.error('No se encontró main-content');
                }
            }, 1500);
        } else {
            console.error('No se encontró progress-container');
        }
    }
    
    executeMainScript() {
        try {
    
            
            // Crear y ejecutar el script main.js
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'src/scripts/main.js';
            
            script.onload = () => {
         
                
                // Ahora necesitamos ejecutar el main.js manualmente
                // Como es un módulo ES6, necesitamos importarlo y ejecutarlo
                this.executeMainModule();
            };
            
            script.onerror = (error) => {
                console.error('❌ Error cargando main.js:', error);
            };
            
            document.head.appendChild(script);
            
        } catch (error) {
            console.error('Error ejecutando main.js:', error);
        }
    }
    
    async executeMainModule() {
        try {
            // Los estilos ya están cargados en index.html
            // Esperar un poco para asegurar que el CSS esté completamente procesado
            await this.delay(300);
            
            // Cargar componentes del portfolio
            await this.loadPortfolioComponents();
        } catch (error) {
            console.error('❌ Error en executeMainModule:', error);
        }
    }

    async loadPortfolioComponents() {
        try {
            // Lista de componentes a cargar
            const components = [
                { name: 'Hero', target: '#main-content' },
                { name: 'About', target: '#main-content' },
                { name: 'Experience', target: '#main-content' },
                { name: 'Skills', target: '#main-content' },
                { name: 'Projects', target: '#main-content' },
                { name: 'Contact', target: '#main-content' },
                { name: 'Footer', target: '#main-content' }
            ];

            // Cargar cada componente secuencialmente
            for (const component of components) {
                await this.loadComponent(component.name, component.target);
                await this.delay(100);
            }

        } catch (error) {
            console.error('❌ Error cargando componentes:', error);
        }
    }

    async loadComponent(componentName, targetSelector) {
        try {
            // Cargar el archivo HTML del componente
            const response = await fetch(`src/components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Error cargando ${componentName}: ${response.status}`);
            }

            const html = await response.text();

            // Crear elemento temporal para procesar el HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html.trim();

            // Obtener el primer elemento hijo
            const component = tempDiv.firstElementChild;
            if (!component) {
                throw new Error(`${componentName} no tiene elementos hijos`);
            }

            // Insertar en el target
            const target = document.querySelector(targetSelector);
            if (target) {
                target.appendChild(component);
            } else {
                throw new Error(`Target no encontrado: ${targetSelector}`);
            }

        } catch (error) {
            console.error(`❌ Error cargando ${componentName}:`, error);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        requestAnimationFrame(() => this.animate());
        
        const time = this.clock.getElapsedTime();
        
        // Actualizar uniformes de tiempo
        this.progressElements.forEach(element => {
            if (element.material && element.material.uniforms) {
                if (element.material.uniforms.time) {
                    element.material.uniforms.time.value = time;
                }
                if (element.material.uniforms.sizeMultiplier) {
                    element.material.uniforms.sizeMultiplier.value = 1.0 + Math.sin(time * 0.5) * 0.1;
                }
            }
        });
        
        // Renderizar con o sin post-procesamiento
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            
            if (this.composer) {
                this.composer.setSize(window.innerWidth, window.innerHeight);
            }
        }
    }
    
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.composer) {
            this.composer.dispose();
        }
        if (this.scene) {
            this.scene.clear();
        }
        this.isInitialized = false;
    }
}

// Inicialización épica
let epicEngine = null;

function initEpicProgressBar() {
    try {
        epicEngine = new EpicProgressEngine();
        
        // Inicializar progress bar
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(progressInterval);
                epicEngine.updateProgress(currentProgress);
            } else {
                epicEngine.updateProgress(currentProgress);
            }
        }, 200);
        
        // Manejar redimensionamiento
        window.addEventListener('resize', () => {
            if (epicEngine) {
                epicEngine.onWindowResize();
            }
        });
    } catch (error) {
        console.error('Error iniciando EpicProgressEngine:', error);
    }
}

// Fallback épico
function initEpicSimpleProgressBar() {
    const container = document.getElementById('progress-container');
    if (!container) return;
    
    container.classList.add('loading');
    
    // Barra de progreso épica
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        width: 500px;
        height: 15px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 8px;
        overflow: hidden;
        margin: 40px 0;
        border: 2px solid rgba(0, 255, 255, 0.5);
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        position: relative;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #00FFFF, #FF00FF, #00FF88, #FF8800);
        border-radius: 8px;
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.8);
        position: relative;
    `;
    
    // Efecto de brillo
    const shine = document.createElement('div');
    shine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shine 2s infinite;
    `;
    
    progressFill.appendChild(shine);
    progressContainer.appendChild(progressFill);
    container.appendChild(progressContainer);
    
    // Animación de brillo
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
    
    // Progreso épico
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                container.classList.remove('loading');
                container.classList.add('hidden');
                setTimeout(() => {
                    container.style.display = 'none';
                    
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.style.display = 'block';
                        mainContent.style.opacity = '0';
                        
                        let opacity = 0;
                        const fadeIn = setInterval(() => {
                            opacity += 0.02;
                            mainContent.style.opacity = opacity;
                            if (opacity >= 1) {
                                clearInterval(fadeIn);
                            }
                        }, 25);
                    }
                }, 1500);
            }, 1500);
        }
        
        progressFill.style.width = progress + '%';
    }, 200);
}

// Función principal épica
function initProgressBar() {
    if (typeof THREE === 'undefined') {
        initEpicSimpleProgressBar();
        return;
    }
    
    initEpicProgressBar();
}

// Exportar para uso global épico
window.EpicProgressEngine = EpicProgressEngine;
window.initProgressBar = initProgressBar;
window.initEpicSimpleProgressBar = initEpicSimpleProgressBar;

// Exportaciones del módulo ES6
export { EpicProgressEngine, initProgressBar, initEpicSimpleProgressBar };
