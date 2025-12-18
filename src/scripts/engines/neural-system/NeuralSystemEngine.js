/**
 * NeuralSystemEngine - NAVEGANDO DENTRO DEL CEREBRO
 * Versión MINIMALISTA - Solo contornos y líneas
 * Estilo holograma/esquema, no bolas sólidas
 */

import * as THREE from 'three';

export class NeuralSystemEngine {
    constructor(containerId = 'visual-effects-container') {
        this.containerId = containerId;
        this.container = null;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animationId = null;

        // Elementos
        this.brainOutlines = [];
        this.neuralPaths = [];
        this.electricBolts = [];
        this.nodes = [];

        // Colores neón
        this.colors = {
            cyan: 0x00ffff,
            purple: 0xaa44ff,
            pink: 0xff44aa,
            green: 0x44ff88,
            orange: 0xff8844,
            blue: 0x4488ff,
            yellow: 0xffff44
        };

        // Cámara
        this.cameraState = {
            targetX: 0,
            targetY: 0,
            targetZ: 80,
            currentX: 0,
            currentY: 0,
            currentZ: 80
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

        // Crear elementos minimalistas
        this.createBrainOutlines();
        this.createNeuralPaths();
        this.createElectricBolts();
        this.createFloatingNodes();

        this.setupInteraction();
        this.startAnimation();

        console.log('🧠 Neural System - Holographic Mode');
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 80);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        const canvas = this.renderer.domElement;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';

        this.container.appendChild(canvas);
    }

    createBrainOutlines() {
        // Crear CONTORNOS simples de estructuras cerebrales
        // Solo líneas, no superficies sólidas

        const structures = [
            // HERO - Lóbulos frontales (contorno simple)
            { y: 0, color: this.colors.cyan, type: 'frontal', x: -35 },
            { y: 0, color: this.colors.cyan, type: 'frontal', x: 35 },

            // ABOUT - Lóbulos parietales
            { y: -100, color: this.colors.purple, type: 'parietal', x: -40 },
            { y: -100, color: this.colors.purple, type: 'parietal', x: 40 },

            // EXPERIENCE - Lóbulos temporales
            { y: -200, color: this.colors.pink, type: 'temporal', x: -45 },
            { y: -200, color: this.colors.pink, type: 'temporal', x: 45 },

            // SKILLS - Lóbulos occipitales
            { y: -300, color: this.colors.green, type: 'occipital', x: -35 },
            { y: -300, color: this.colors.green, type: 'occipital', x: 35 },

            // PROJECTS - Cerebelo
            { y: -400, color: this.colors.orange, type: 'cerebellum', x: 0 },

            // CONTACT - Tronco encefálico
            { y: -500, color: this.colors.blue, type: 'brainstem', x: 0 }
        ];

        structures.forEach(struct => {
            const outline = this.createStructureOutline(struct);
            this.brainOutlines.push(outline);
            this.scene.add(outline.group);
        });
    }

    createStructureOutline(config) {
        const group = new THREE.Group();
        const { type, color, x, y } = config;

        // Crear solo LÍNEAS de contorno según el tipo
        let curves = [];

        switch (type) {
            case 'frontal':
                curves = this.createFrontalOutline();
                break;
            case 'parietal':
                curves = this.createParietalOutline();
                break;
            case 'temporal':
                curves = this.createTemporalOutline();
                break;
            case 'occipital':
                curves = this.createOccipitalOutline();
                break;
            case 'cerebellum':
                curves = this.createCerebellumOutline();
                break;
            case 'brainstem':
                curves = this.createBrainstemOutline();
                break;
        }

        // Material de línea neón
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        curves.forEach(curvePoints => {
            const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
            const line = new THREE.Line(geometry, material.clone());
            group.add(line);
        });

        group.position.set(x, y, -40);
        group.scale.setScalar(8);

        return {
            group,
            baseY: y,
            baseX: x,
            color,
            phase: Math.random() * Math.PI * 2
        };
    }

    createFrontalOutline() {
        // Contorno del lóbulo frontal - forma de "C" invertida
        const curves = [];

        // Contorno principal
        const mainCurve = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const angle = t * Math.PI * 1.5 - Math.PI * 0.25;
            const r = 2 + Math.sin(t * Math.PI) * 0.5;
            mainCurve.push(new THREE.Vector3(
                Math.cos(angle) * r,
                Math.sin(angle) * r * 0.8,
                Math.sin(t * Math.PI * 2) * 0.3
            ));
        }
        curves.push(mainCurve);

        // Surcos (2-3 líneas internas)
        for (let i = 0; i < 3; i++) {
            const sulcus = [];
            const offset = (i - 1) * 0.6;
            for (let t = 0; t <= 1; t += 0.1) {
                sulcus.push(new THREE.Vector3(
                    -1.5 + t * 3,
                    offset + Math.sin(t * Math.PI * 2) * 0.2,
                    0.1
                ));
            }
            curves.push(sulcus);
        }

        return curves;
    }

    createParietalOutline() {
        const curves = [];

        // Contorno ovalado
        const mainCurve = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const angle = t * Math.PI * 2;
            mainCurve.push(new THREE.Vector3(
                Math.cos(angle) * 2.2,
                Math.sin(angle) * 1.5,
                Math.sin(t * Math.PI) * 0.2
            ));
        }
        curves.push(mainCurve);

        // Líneas internas
        for (let i = 0; i < 2; i++) {
            const line = [];
            for (let t = 0; t <= 1; t += 0.1) {
                line.push(new THREE.Vector3(
                    -1.8 + t * 3.6,
                    (i - 0.5) * 0.8,
                    0
                ));
            }
            curves.push(line);
        }

        return curves;
    }

    createTemporalOutline() {
        const curves = [];

        // Forma alargada horizontal
        const mainCurve = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const angle = t * Math.PI * 2;
            mainCurve.push(new THREE.Vector3(
                Math.cos(angle) * 2.5,
                Math.sin(angle) * 1.2,
                0
            ));
        }
        curves.push(mainCurve);

        // Espiral interna (hipocampo)
        const spiral = [];
        for (let t = 0; t <= 2; t += 0.1) {
            const r = 0.3 + t * 0.3;
            spiral.push(new THREE.Vector3(
                Math.cos(t * Math.PI) * r - 0.5,
                Math.sin(t * Math.PI) * r * 0.5,
                0.1
            ));
        }
        curves.push(spiral);

        return curves;
    }

    createOccipitalOutline() {
        const curves = [];

        // Forma triangular redondeada
        const mainCurve = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const angle = t * Math.PI * 2;
            const r = 1.8 + Math.cos(angle * 3) * 0.3;
            mainCurve.push(new THREE.Vector3(
                Math.cos(angle) * r,
                Math.sin(angle) * r * 0.9,
                0
            ));
        }
        curves.push(mainCurve);

        // Patrón visual (radiado)
        for (let i = 0; i < 4; i++) {
            const ray = [];
            const baseAngle = (i / 4) * Math.PI * 2;
            for (let t = 0; t <= 1; t += 0.2) {
                ray.push(new THREE.Vector3(
                    Math.cos(baseAngle) * t * 1.2,
                    Math.sin(baseAngle) * t * 1.2,
                    0
                ));
            }
            curves.push(ray);
        }

        return curves;
    }

    createCerebellumOutline() {
        const curves = [];

        // Forma con "pliegues"
        const mainCurve = [];
        for (let t = 0; t <= 1; t += 0.03) {
            const angle = t * Math.PI * 2;
            const r = 2.5 + Math.sin(angle * 8) * 0.3; // Pliegues
            mainCurve.push(new THREE.Vector3(
                Math.cos(angle) * r,
                Math.sin(angle) * r * 0.6,
                0
            ));
        }
        curves.push(mainCurve);

        // Líneas horizontales (folias)
        for (let i = 0; i < 5; i++) {
            const folia = [];
            const yPos = -1 + i * 0.4;
            for (let t = 0; t <= 1; t += 0.1) {
                folia.push(new THREE.Vector3(
                    -2 + t * 4,
                    yPos,
                    0
                ));
            }
            curves.push(folia);
        }

        return curves;
    }

    createBrainstemOutline() {
        const curves = [];

        // Forma alargada vertical
        const mainCurve = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const y = -2 + t * 4;
            const width = 1 + Math.sin(t * Math.PI) * 0.5;
            mainCurve.push(new THREE.Vector3(width, y, 0));
        }
        // Cerrar
        for (let t = 1; t >= 0; t -= 0.05) {
            const y = -2 + t * 4;
            const width = 1 + Math.sin(t * Math.PI) * 0.5;
            mainCurve.push(new THREE.Vector3(-width, y, 0));
        }
        mainCurve.push(mainCurve[0].clone());
        curves.push(mainCurve);

        // Línea central
        const central = [];
        for (let t = 0; t <= 1; t += 0.1) {
            central.push(new THREE.Vector3(0, -2 + t * 4, 0.1));
        }
        curves.push(central);

        return curves;
    }

    createNeuralPaths() {
        // Líneas curvas que conectan las estructuras
        const pathCount = 40;

        for (let i = 0; i < pathCount; i++) {
            const startY = -Math.random() * 550;
            const endY = startY + (Math.random() - 0.5) * 150;

            const points = [];
            const startX = (Math.random() - 0.5) * 80;
            const endX = (Math.random() - 0.5) * 80;

            for (let t = 0; t <= 1; t += 0.1) {
                points.push(new THREE.Vector3(
                    startX + (endX - startX) * t + Math.sin(t * Math.PI * 2) * 10,
                    startY + (endY - startY) * t,
                    -50 + Math.random() * 20
                ));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));

            const colors = Object.values(this.colors);
            const material = new THREE.LineBasicMaterial({
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            });

            const line = new THREE.Line(geometry, material);
            line.userData = {
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random()
            };

            this.neuralPaths.push(line);
            this.scene.add(line);
        }
    }

    createElectricBolts() {
        // Rayos eléctricos que aparecen y desaparecen
        for (let i = 0; i < 30; i++) {
            const bolt = this.createBolt();
            this.electricBolts.push(bolt);
            this.scene.add(bolt.line);
        }
    }

    createBolt() {
        const startY = -Math.random() * 550;
        const startX = (Math.random() - 0.5) * 100;

        const points = [];
        let x = startX;
        let y = startY;

        const segments = 6 + Math.floor(Math.random() * 6);
        const length = 20 + Math.random() * 40;

        for (let i = 0; i <= segments; i++) {
            points.push(new THREE.Vector3(x, y, -45));
            x += (Math.random() - 0.5) * 20;
            y += length / segments;
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const colors = Object.values(this.colors);
        const material = new THREE.LineBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });

        const line = new THREE.Line(geometry, material);

        return {
            line,
            active: false,
            activeTime: 0,
            nextActivation: Math.random() * 8
        };
    }

    createFloatingNodes() {
        // Pequeños puntos brillantes flotando con MOVIMIENTO
        const colors = Object.values(this.colors);

        for (let i = 0; i < 100; i++) {
            const geometry = new THREE.SphereGeometry(0.25 + Math.random() * 0.3, 6, 6);
            const material = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });

            const node = new THREE.Mesh(geometry, material);
            const startX = (Math.random() - 0.5) * 150;
            const startY = -Math.random() * 600;
            const startZ = -70 + Math.random() * 40;

            node.position.set(startX, startY, startZ);

            // Datos para movimiento orbital/flotante
            node.userData = {
                phase: Math.random() * Math.PI * 2,
                speed: 1 + Math.random() * 2,
                // Movimiento
                baseX: startX,
                baseY: startY,
                baseZ: startZ,
                orbitRadius: 3 + Math.random() * 8,
                orbitSpeed: 0.2 + Math.random() * 0.5,
                floatAmplitude: 2 + Math.random() * 5,
                floatSpeed: 0.3 + Math.random() * 0.4,
                // Dirección de drift
                driftX: (Math.random() - 0.5) * 0.1,
                driftY: (Math.random() - 0.5) * 0.05
            };

            this.nodes.push(node);
            this.scene.add(node);
        }
    }

    setupInteraction() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }, { passive: true });

        window.addEventListener('wheel', (e) => {
            this.cameraState.targetZ = THREE.MathUtils.clamp(
                this.cameraState.targetZ + e.deltaY * 0.05,
                40,
                150
            );
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

            this.updateCamera();
            this.animateOutlines();
            this.animatePaths();
            this.animateBolts();
            this.animateNodes();

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    updateCamera() {
        const lerp = 0.05;

        this.cameraState.targetY = -this.scrollY;
        this.cameraState.targetX = this.mouse.x * 20;

        this.cameraState.currentX += (this.cameraState.targetX - this.cameraState.currentX) * lerp;
        this.cameraState.currentY += (this.cameraState.targetY - this.cameraState.currentY) * lerp;
        this.cameraState.currentZ += (this.cameraState.targetZ - this.cameraState.currentZ) * lerp;

        this.camera.position.set(
            this.cameraState.currentX,
            this.cameraState.currentY,
            this.cameraState.currentZ
        );

        this.camera.lookAt(0, this.cameraState.currentY, -50);
    }

    animateOutlines() {
        this.brainOutlines.forEach(outline => {
            const { group, baseX, baseY, phase } = outline;

            // Flotación sutil
            group.position.x = baseX + Math.sin(this.time * 0.3 + phase) * 2;
            group.position.y = baseY + Math.cos(this.time * 0.25 + phase) * 1.5;

            // Rotación muy lenta
            group.rotation.y = Math.sin(this.time * 0.1 + phase) * 0.1;
            group.rotation.z = Math.cos(this.time * 0.15 + phase) * 0.05;

            // Pulso de opacidad
            group.traverse(child => {
                if (child.material) {
                    child.material.opacity = 0.4 + Math.sin(this.time * 0.5 + phase) * 0.2;
                }
            });
        });
    }

    animatePaths() {
        this.neuralPaths.forEach(path => {
            const { phase, speed } = path.userData;
            path.material.opacity = 0.1 + Math.sin(this.time * speed + phase) * 0.08;
        });
    }

    animateBolts() {
        this.electricBolts.forEach(bolt => {
            bolt.nextActivation -= 0.016;

            if (bolt.nextActivation <= 0 && !bolt.active) {
                bolt.active = true;
                bolt.activeTime = 0;
                bolt.nextActivation = 3 + Math.random() * 8;
            }

            if (bolt.active) {
                bolt.activeTime += 0.016;

                if (bolt.activeTime < 0.12) {
                    // Flash rápido
                    bolt.line.material.opacity = Math.sin(bolt.activeTime * 80) * 0.8;

                    // Mover puntos del rayo
                    const positions = bolt.line.geometry.attributes.position.array;
                    for (let i = 3; i < positions.length - 3; i += 3) {
                        positions[i] += (Math.random() - 0.5) * 2;
                    }
                    bolt.line.geometry.attributes.position.needsUpdate = true;
                } else {
                    bolt.active = false;
                    bolt.line.material.opacity = 0;
                }
            }
        });
    }

    animateNodes() {
        this.nodes.forEach(node => {
            const {
                phase, speed, baseX, baseY, baseZ,
                orbitRadius, orbitSpeed, floatAmplitude, floatSpeed,
                driftX, driftY
            } = node.userData;

            // Movimiento orbital + flotación
            const orbitAngle = this.time * orbitSpeed + phase;
            const floatOffset = Math.sin(this.time * floatSpeed + phase) * floatAmplitude;

            // Actualizar base con drift lento
            node.userData.baseX += driftX;
            node.userData.baseY += driftY;

            // Reset si sale del área
            if (node.userData.baseX > 80) node.userData.baseX = -80;
            if (node.userData.baseX < -80) node.userData.baseX = 80;
            if (node.userData.baseY > 50) node.userData.baseY = -600;
            if (node.userData.baseY < -650) node.userData.baseY = 50;

            // Posición final con órbita y flotación
            node.position.x = node.userData.baseX + Math.cos(orbitAngle) * orbitRadius;
            node.position.y = node.userData.baseY + floatOffset;
            node.position.z = baseZ + Math.sin(orbitAngle * 0.7) * (orbitRadius * 0.5);

            // Pulso de brillo
            const pulse = Math.sin(this.time * speed + phase);
            node.material.opacity = 0.4 + pulse * 0.4;
            node.scale.setScalar(0.7 + pulse * 0.5);
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
