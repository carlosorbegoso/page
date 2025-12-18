/**
 * NeuralSystemEngine - NAVEGANDO DENTRO DEL CEREBRO
 * Usa todas las partes anatómicas que ya creamos
 * La cámara está DENTRO y las estructuras nos rodean
 */

import * as THREE from 'three';

// Importar todas las partes del cerebro que ya creamos
import { FrontalLobe } from './brain/FrontalLobe.js';
import { ParietalLobe } from './brain/ParietalLobe.js';
import { TemporalLobe } from './brain/TemporalLobe.js';
import { OccipitalLobe } from './brain/OccipitalLobe.js';
import { Cerebellum } from './brain/Cerebellum.js';
import { Brainstem } from './brain/Brainstem.js';
import { CorpusCallosum } from './brain/CorpusCallosum.js';
import { Fornix } from './brain/Fornix.js';
import { Thalamus, Hypothalamus, Amygdala, BasalGanglia } from './brain/subcortical/index.js';
import { LateralVentricles, ThirdVentricle, FourthVentricle } from './brain/ventricles/index.js';

export class NeuralSystemEngine {
    constructor(containerId = 'visual-effects-container') {
        this.containerId = containerId;
        this.container = null;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animationId = null;

        // Todas las partes del cerebro
        this.brainParts = [];
        this.synapticLines = [];
        this.impulses = [];

        // Configuración con colores neón
        this.config = {
            colors: {
                frontal: 0x00ffff,     // Cyan
                parietal: 0xaa44ff,    // Púrpura
                temporal: 0xff44aa,    // Rosa
                occipital: 0x44ff88,   // Verde
                cerebellum: 0xff8844,  // Naranja
                brainstem: 0x4488ff,   // Azul
                ventricles: 0x88ffff,  // Cyan claro
                connections: 0xffff44  // Amarillo
            },
            scale: 30,  // Escala grande para estar DENTRO
            opacity: 0.4
        };

        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.time = 0;

        this.init();
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) return;

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();

        // Crear todas las partes del cerebro distribuidas
        this.createBrainStructure();
        this.createSynapticConnections();
        this.createNeuralImpulses();

        this.setupInteraction();
        this.startAnimation();

        console.log('🧠 Inside the Anatomical Brain - All parts loaded');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050510, 0.006);
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(70, aspect, 0.1, 2000);
        this.camera.position.set(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x030308, 0.98);

        const canvas = this.renderer.domElement;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';

        this.container.appendChild(canvas);
    }

    createBrainStructure() {
        // Distribuir las partes del cerebro en diferentes posiciones Y (scroll)
        // para que vayamos "viajando" por el cerebro

        const sections = [
            // Hero - Lóbulos frontales (pensamiento, planificación)
            { y: 0, parts: [
                { Class: FrontalLobe, config: { side: 'left', color: this.config.colors.frontal }, pos: { x: -40, y: 0, z: -30 } },
                { Class: FrontalLobe, config: { side: 'right', color: this.config.colors.frontal }, pos: { x: 40, y: 0, z: -30 } }
            ]},

            // About - Lóbulos parietales (procesamiento sensorial)
            { y: -100, parts: [
                { Class: ParietalLobe, config: { side: 'left', color: this.config.colors.parietal }, pos: { x: -45, y: -100, z: -25 } },
                { Class: ParietalLobe, config: { side: 'right', color: this.config.colors.parietal }, pos: { x: 45, y: -100, z: -25 } },
                { Class: CorpusCallosum, config: { color: this.config.colors.connections }, pos: { x: 0, y: -100, z: -20 } }
            ]},

            // Experience - Lóbulos temporales (memoria, lenguaje)
            { y: -200, parts: [
                { Class: TemporalLobe, config: { side: 'left', color: this.config.colors.temporal }, pos: { x: -50, y: -200, z: -20 } },
                { Class: TemporalLobe, config: { side: 'right', color: this.config.colors.temporal }, pos: { x: 50, y: -200, z: -20 } },
                { Class: Amygdala, config: { side: 'left', color: 0xff4466 }, pos: { x: -30, y: -200, z: -10 } },
                { Class: Amygdala, config: { side: 'right', color: 0xff4466 }, pos: { x: 30, y: -200, z: -10 } }
            ]},

            // Skills - Lóbulos occipitales (visión) + Tálamo
            { y: -300, parts: [
                { Class: OccipitalLobe, config: { side: 'left', color: this.config.colors.occipital }, pos: { x: -35, y: -300, z: -35 } },
                { Class: OccipitalLobe, config: { side: 'right', color: this.config.colors.occipital }, pos: { x: 35, y: -300, z: -35 } },
                { Class: Thalamus, config: { side: 'left', color: 0xffaa44 }, pos: { x: -15, y: -300, z: -15 } },
                { Class: Thalamus, config: { side: 'right', color: 0xffaa44 }, pos: { x: 15, y: -300, z: -15 } }
            ]},

            // Projects - Cerebelo (coordinación)
            { y: -400, parts: [
                { Class: Cerebellum, config: { color: this.config.colors.cerebellum }, pos: { x: 0, y: -400, z: -40 } },
                { Class: Hypothalamus, config: { color: 0xff66aa }, pos: { x: 0, y: -400, z: -10 } },
                { Class: BasalGanglia, config: { side: 'left', color: 0x66ff88 }, pos: { x: -25, y: -400, z: -20 } },
                { Class: BasalGanglia, config: { side: 'right', color: 0x66ff88 }, pos: { x: 25, y: -400, z: -20 } }
            ]},

            // Contact - Tronco encefálico + Ventrículos
            { y: -500, parts: [
                { Class: Brainstem, config: { color: this.config.colors.brainstem }, pos: { x: 0, y: -500, z: -25 } },
                { Class: LateralVentricles, config: { side: 'left', color: this.config.colors.ventricles }, pos: { x: -20, y: -500, z: -15 } },
                { Class: LateralVentricles, config: { side: 'right', color: this.config.colors.ventricles }, pos: { x: 20, y: -500, z: -15 } },
                { Class: Fornix, config: { color: this.config.colors.connections }, pos: { x: 0, y: -500, z: -20 } }
            ]}
        ];

        sections.forEach((section) => {
            section.parts.forEach((partInfo) => {
                try {
                    const partConfig = {
                        ...partInfo.config,
                        opacity: this.config.opacity,
                        scale: 1
                    };

                    const part = new partInfo.Class(partConfig);
                    const mesh = part.getMesh();

                    // Escalar y posicionar
                    mesh.scale.setScalar(this.config.scale);
                    mesh.position.set(partInfo.pos.x, partInfo.pos.y, partInfo.pos.z);

                    // Aplicar estilo neón con AdditiveBlending
                    this.applyNeonStyle(mesh);

                    // Guardar referencia
                    mesh.userData.partInstance = part;
                    mesh.userData.baseY = partInfo.pos.y;
                    mesh.userData.baseX = partInfo.pos.x;
                    mesh.userData.pulsePhase = Math.random() * Math.PI * 2;

                    this.brainParts.push(mesh);
                    this.scene.add(mesh);

                } catch (error) {
                    console.warn(`Could not create ${partInfo.Class.name}:`, error.message);
                }
            });
        });
    }

    applyNeonStyle(group) {
        group.traverse((child) => {
            if (child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(mat => {
                    mat.transparent = true;
                    mat.depthWrite = false;
                    mat.blending = THREE.AdditiveBlending;
                    if (mat.opacity < 0.3) mat.opacity = 0.3;
                });
            }
        });
    }

    createSynapticConnections() {
        // Crear conexiones entre las partes del cerebro
        const colors = Object.values(this.config.colors);

        for (let i = 0; i < 80; i++) {
            const startY = -Math.random() * 550;
            const endY = startY + (Math.random() - 0.5) * 150;

            const points = [];
            const startX = (Math.random() - 0.5) * 100;
            const endX = (Math.random() - 0.5) * 100;
            const startZ = -50 + Math.random() * 40;
            const endZ = -50 + Math.random() * 40;

            for (let j = 0; j <= 15; j++) {
                const t = j / 15;
                points.push(new THREE.Vector3(
                    startX + (endX - startX) * t + Math.sin(t * Math.PI * 2) * 10,
                    startY + (endY - startY) * t,
                    startZ + (endZ - startZ) * t + Math.cos(t * Math.PI * 2) * 8
                ));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));

            const material = new THREE.LineBasicMaterial({
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
            });

            const line = new THREE.Line(geometry, material);
            line.userData = {
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.3 + Math.random() * 0.5
            };

            this.synapticLines.push(line);
            this.scene.add(line);
        }
    }

    createNeuralImpulses() {
        // Impulsos eléctricos viajando por el cerebro
        const colors = Object.values(this.config.colors);

        for (let i = 0; i < 40; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const impulse = new THREE.Mesh(geometry, material);
            impulse.position.set(
                (Math.random() - 0.5) * 80,
                -Math.random() * 550,
                -50 + Math.random() * 40
            );

            impulse.userData = {
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.5,
                speedZ: (Math.random() - 0.5) * 0.2,
                baseY: impulse.position.y
            };

            this.impulses.push(impulse);
            this.scene.add(impulse);
        }
    }

    setupInteraction() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });

        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollY = (window.scrollY / maxScroll) * 550;
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, { passive: true });
    }

    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            this.time = performance.now() * 0.001;

            // Cámara viaja por el cerebro
            this.camera.position.y = -this.scrollY;
            this.camera.position.x = this.mouse.x * 20;
            this.camera.position.z = 10 + this.mouse.y * 10;
            this.camera.lookAt(0, -this.scrollY - 30, -30);

            this.animateBrainParts();
            this.animateSynapticLines();
            this.animateImpulses();

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    animateBrainParts() {
        this.brainParts.forEach((part) => {
            const { partInstance, pulsePhase, baseX, baseY } = part.userData;

            // Animación interna de la parte
            if (partInstance?.animate) {
                partInstance.animate(this.time);
            }

            // Movimiento flotante sutil
            part.position.x = baseX + Math.sin(this.time * 0.3 + pulsePhase) * 2;
            part.position.y = baseY + Math.cos(this.time * 0.2 + pulsePhase) * 1.5;

            // Rotación muy sutil
            part.rotation.y = Math.sin(this.time * 0.1 + pulsePhase) * 0.05;
            part.rotation.x = Math.cos(this.time * 0.15 + pulsePhase) * 0.03;
        });
    }

    animateSynapticLines() {
        this.synapticLines.forEach((line) => {
            const { pulsePhase, pulseSpeed } = line.userData;
            line.material.opacity = 0.1 + Math.sin(this.time * pulseSpeed + pulsePhase) * 0.15;
        });
    }

    animateImpulses() {
        this.impulses.forEach((impulse) => {
            const { speedX, speedY, speedZ } = impulse.userData;

            impulse.position.x += speedX;
            impulse.position.y += speedY;
            impulse.position.z += speedZ;

            // Reset cuando salen del área
            if (impulse.position.y > 50) impulse.position.y = -550;
            if (impulse.position.y < -600) impulse.position.y = 50;
            if (Math.abs(impulse.position.x) > 60) impulse.userData.speedX *= -1;
            if (impulse.position.z > 10 || impulse.position.z < -80) impulse.userData.speedZ *= -1;

            // Pulso de brillo
            impulse.material.opacity = 0.5 + Math.sin(this.time * 3 + impulse.position.y * 0.01) * 0.4;
        });
    }

    updateTheme() {}

    dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer) {
            this.renderer.dispose();
            this.container?.removeChild(this.renderer.domElement);
        }
        this.scene?.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                Array.isArray(obj.material)
                    ? obj.material.forEach(m => m.dispose())
                    : obj.material.dispose();
            }
        });
    }
}
