/**
 * Neural System Engine - Cerebro realista con hemisferios + Médula Espinal conectada
 * Sistema visual global con Three.js
 */

import * as THREE from 'three';

class NeuralSystemEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;

        // Grupo principal que contiene TODO el sistema neural
        this.neuralSystem = null;
        this.brainGroup = null;
        this.spineGroup = null;

        // Elementos
        this.neurons = [];
        this.connections = [];
        this.spineNeurons = [];
        this.pulses = [];

        // Estado
        this.isActive = false;
        this.time = 0;
        this.scrollY = 0;
        this.pageHeight = 0;
        this.mouse = { x: 0, y: 0 };
        this.spineLength = 0;

        // Colores
        this.primaryColor = new THREE.Color(0x64B5F6);
        this.accentColor = new THREE.Color(0x00ffff);

        this.init();
    }

    init() {
        this.createContainer();
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();

        // Crear sistema neural completo (cerebro + médula conectados)
        this.createNeuralSystem();

        // Eventos
        this.setupEvents();

        // Iniciar animación
        this.isActive = true;
        this.animate();

        console.log('[NeuralSystem] Initialized - Brain with hemispheres + connected spine');
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'neural-system-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
            overflow: hidden;
        `;
        document.body.insertBefore(this.container, document.body.firstChild);
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 25);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }

    createNeuralSystem() {
        // Grupo principal que contiene cerebro + médula
        // Este grupo se mueve junto, manteniendo todo conectado
        this.neuralSystem = new THREE.Group();

        // Posicionar el sistema neural a la derecha para no tapar contenido
        this.neuralSystem.position.set(12, 8, -10);

        // Crear cerebro con DOS HEMISFERIOS reales
        this.createBrain();

        // Crear médula espinal CONECTADA al cerebro
        this.createSpinalCord();

        this.scene.add(this.neuralSystem);
    }

    createBrain() {
        this.brainGroup = new THREE.Group();

        // Crear los DOS HEMISFERIOS del cerebro - forma real esférica
        this.createHemispheres();

        // Crear el cuerpo calloso (conexión entre hemisferios)
        this.createCorpusCallosum();

        // Crear cerebelo
        this.createCerebellum();

        // Crear tronco encefálico
        this.createBrainstem();

        // Neuronas brillantes
        this.createBrainNeurons();

        // Conexiones neuronales
        this.createBrainConnections();

        // Glow sutil
        this.addBrainGlow();

        this.neuralSystem.add(this.brainGroup);
    }

    createHemispheres() {
        // Hemisferio IZQUIERDO
        const leftHemisphere = this.createHemisphere(-0.55, 0);
        this.brainGroup.add(leftHemisphere);

        // Hemisferio DERECHO
        const rightHemisphere = this.createHemisphere(0.55, 0);
        this.brainGroup.add(rightHemisphere);
    }

    createHemisphere(offsetX, offsetZ) {
        const group = new THREE.Group();

        // Geometría esférica deformada para parecer un hemisferio cerebral
        const geometry = new THREE.SphereGeometry(1, 32, 24);
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Aplanar ligeramente en el centro (fisura longitudinal)
            const centerFlatten = Math.exp(-Math.pow(x / 0.3, 2)) * 0.3;
            if (offsetX < 0) {
                x = Math.min(x + centerFlatten, 0.1);
            } else {
                x = Math.max(x - centerFlatten, -0.1);
            }

            // Forma más ovalada del cerebro (más largo de frente a atrás)
            z *= 1.15;

            // Ligeramente más bajo en la parte frontal
            if (z > 0.3) {
                y -= (z - 0.3) * 0.15;
            }

            // Circunvoluciones (pliegues cerebrales)
            const gyri1 = Math.sin(x * 15 + y * 12) * 0.03;
            const gyri2 = Math.sin(y * 18 + z * 10) * 0.025;
            const gyri3 = Math.cos(z * 14 + x * 8) * 0.02;

            // Solo aplicar en la superficie externa
            const distFromCenter = Math.sqrt(x*x + y*y + z*z);
            const surfaceFactor = Math.max(0, (distFromCenter - 0.7) / 0.3);

            x += gyri1 * surfaceFactor;
            y += gyri2 * surfaceFactor;
            z += gyri3 * surfaceFactor;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        // Wireframe - sutil y transparente
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.18,
            depthWrite: false
        });
        const wireMesh = new THREE.Mesh(geometry, wireMaterial);
        group.add(wireMesh);

        // Superficie sólida semi-transparente
        const solidMaterial = new THREE.MeshBasicMaterial({
            color: this.primaryColor,
            transparent: true,
            opacity: 0.06,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        group.add(new THREE.Mesh(geometry.clone(), solidMaterial));

        // Posicionar hemisferio
        group.position.set(offsetX, 0.2, offsetZ);

        return group;
    }

    createCorpusCallosum() {
        // Conexión entre los dos hemisferios (en el centro)
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.4, 0.1, 0),
            new THREE.Vector3(-0.2, 0.25, 0.1),
            new THREE.Vector3(0, 0.3, 0.15),
            new THREE.Vector3(0.2, 0.25, 0.1),
            new THREE.Vector3(0.4, 0.1, 0)
        ]);

        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.15, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.12,
            depthWrite: false
        });

        this.brainGroup.add(new THREE.Mesh(tubeGeo, tubeMat));
    }

    createCerebellum() {
        const group = new THREE.Group();

        // Cerebelo - forma más pequeña y arrugada debajo del cerebro
        const geometry = new THREE.SphereGeometry(0.4, 20, 16);
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Aplanar verticalmente
            y *= 0.6;

            // Estirar horizontalmente
            x *= 1.4;

            // Líneas horizontales (folia del cerebelo)
            const folia = Math.sin(y * 25) * 0.03;
            x += folia;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            depthWrite: false
        });
        group.add(new THREE.Mesh(geometry, wireMaterial));

        // Posicionar debajo y detrás del cerebro
        group.position.set(0, -0.7, -0.8);
        this.brainGroup.add(group);
    }

    createBrainstem() {
        // Tronco encefálico - conecta cerebro con médula
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -0.3, -0.5),
            new THREE.Vector3(0, -0.6, -0.4),
            new THREE.Vector3(0, -0.9, -0.2),
            new THREE.Vector3(0, -1.2, 0),
            new THREE.Vector3(0, -1.5, 0.1)
        ]);

        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.12, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.2,
            depthWrite: false
        });

        const brainstem = new THREE.Mesh(tubeGeo, tubeMat);
        this.brainGroup.add(brainstem);

        // Línea central más brillante
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
        const lineMat = new THREE.LineBasicMaterial({
            color: this.accentColor,
            transparent: true,
            opacity: 0.3,
            depthWrite: false
        });
        this.brainGroup.add(new THREE.Line(lineGeo, lineMat));
    }

    createBrainNeurons() {
        const neuronCount = 80;
        const neuronGeo = new THREE.SphereGeometry(0.025, 6, 6);

        for (let i = 0; i < neuronCount; i++) {
            // Distribuir neuronas en forma de cerebro (dos hemisferios)
            const side = Math.random() > 0.5 ? 1 : -1;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 0.7 + Math.random() * 0.35;

            let x = r * Math.sin(phi) * Math.cos(theta) * 0.9 + side * 0.5;
            let y = r * Math.cos(phi) * 0.85 + 0.1;
            let z = r * Math.sin(phi) * Math.sin(theta) * 1.1;

            const color = new THREE.Color();
            color.setHSL(0.52 + Math.random() * 0.08, 1, 0.55 + Math.random() * 0.25);

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.3,
                depthWrite: false
            });

            const neuron = new THREE.Mesh(neuronGeo, material);
            neuron.position.set(x, y, z);

            neuron.userData = {
                originalPos: new THREE.Vector3(x, y, z),
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5,
                baseOpacity: 0.2 + Math.random() * 0.15
            };

            this.neurons.push(neuron);
            this.brainGroup.add(neuron);
        }
    }

    createBrainConnections() {
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: this.accentColor,
            transparent: true,
            opacity: 0.06,
            depthWrite: false
        });

        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                const dist = this.neurons[i].position.distanceTo(this.neurons[j].position);

                if (dist < 0.5 && Math.random() > 0.7) {
                    const points = [
                        this.neurons[i].position.clone(),
                        this.neurons[j].position.clone()
                    ];

                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, connectionMaterial.clone());

                    line.userData = {
                        baseOpacity: 0.04 + Math.random() * 0.04,
                        phase: Math.random() * Math.PI * 2
                    };

                    this.connections.push(line);
                    this.brainGroup.add(line);
                }
            }
        }
    }

    addBrainGlow() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(100, 181, 246, 0.5)');
        gradient.addColorStop(0.4, 'rgba(100, 181, 246, 0.15)');
        gradient.addColorStop(0.7, 'rgba(100, 181, 246, 0.05)');
        gradient.addColorStop(1, 'rgba(100, 181, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);

        const glowTexture = new THREE.CanvasTexture(canvas);
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: this.primaryColor,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.set(4, 3, 1);
        glow.position.set(0, 0, 0);
        this.brainGroup.add(glow);
    }

    createSpinalCord() {
        this.spineGroup = new THREE.Group();

        // Calcular altura de página
        this.pageHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        );

        const viewportUnits = this.pageHeight / window.innerHeight;
        this.spineLength = viewportUnits * 20;

        // La médula empieza DESDE el tronco encefálico (y = -1.5)
        const startY = -1.5;

        // Crear curva serpentina que va por los BORDES
        const curvePoints = [];
        const segments = 400;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = startY - t * this.spineLength;

            // Serpiente suave que va por los bordes
            // Usa funciones sinusoidales para movimiento orgánico
            const mainPhase = t * Math.PI * 3;

            // Amplitud que mantiene la serpiente en los bordes
            const baseAmp = 8;
            const waveAmp = 4;

            // Alternar suavemente entre lados
            const sideWave = Math.sin(t * Math.PI * 1.5);
            const amplitude = baseAmp + Math.abs(Math.sin(mainPhase * 0.6)) * waveAmp;

            // X: serpentea de lado a lado pero siempre lejos del centro
            let x = amplitude * Math.sign(sideWave) * (0.4 + Math.abs(sideWave) * 0.6);

            // Ondulaciones secundarias para más organicidad
            x += Math.sin(t * Math.PI * 10) * 2 * (1 - Math.abs(sideWave) * 0.5);
            x += Math.sin(t * Math.PI * 18) * 0.5;

            // Suavizar si está muy cerca del centro
            if (Math.abs(x) < 6) {
                const push = (6 - Math.abs(x)) / 6;
                const smooth = push * push * (3 - 2 * push);
                x = x > 0 ? x + smooth * 3 : x - smooth * 3;
            }

            // Z: profundidad variable
            const z = -5 + Math.cos(t * Math.PI * 4) * 2;

            curvePoints.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(curvePoints);
        curve.tension = 0.4;

        // Tubo wireframe
        const tubeGeo = new THREE.TubeGeometry(curve, 600, 0.15, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.accentColor,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            depthWrite: false
        });
        this.spineGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

        // Tubo interior
        const innerTubeGeo = new THREE.TubeGeometry(curve, 600, 0.07, 6, false);
        const innerTubeMat = new THREE.MeshBasicMaterial({
            color: this.primaryColor,
            transparent: true,
            opacity: 0.08,
            depthWrite: false
        });
        this.spineGroup.add(new THREE.Mesh(innerTubeGeo, innerTubeMat));

        // Línea central
        const linePoints = curve.getPoints(600);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
            color: this.accentColor,
            transparent: true,
            opacity: 0.25,
            depthWrite: false
        });
        this.spineGroup.add(new THREE.Line(lineGeo, lineMat));

        // Vértebras
        this.createVertebrae(curve);

        // Neuronas en la médula
        this.createSpineNeurons(curve);

        // Nervios
        this.createSpinalNerves(curve);

        this.spineCurve = curve;

        // Añadir al sistema neural (conectado al cerebro)
        this.neuralSystem.add(this.spineGroup);
    }

    createVertebrae(curve) {
        const count = 30;

        for (let i = 0; i < count; i++) {
            const t = i / count;
            const point = curve.getPoint(t);
            const tangent = curve.getTangent(t);

            const ringGeo = new THREE.TorusGeometry(0.15, 0.02, 6, 12);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.accentColor,
                transparent: true,
                opacity: 0.12 * (1 - t * 0.5),
                depthWrite: false
            });

            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.copy(point);

            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
            ring.quaternion.copy(quaternion);

            this.spineGroup.add(ring);
        }
    }

    createSpineNeurons(curve) {
        const neuronGeo = new THREE.SphereGeometry(0.035, 6, 6);
        const count = 60;

        for (let i = 0; i < count; i++) {
            const t = i / count;
            const point = curve.getPoint(t);

            const angle = i * 137.5 * (Math.PI / 180);
            const radius = 0.12 + Math.random() * 0.06;

            const x = point.x + Math.cos(angle) * radius;
            const y = point.y;
            const z = point.z + Math.sin(angle) * radius;

            const color = new THREE.Color();
            color.setHSL(0.5 + t * 0.1, 1, 0.5 + (1 - t) * 0.2);

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: Math.max(0.1, 0.25 - t * 0.15),
                depthWrite: false
            });

            const neuron = new THREE.Mesh(neuronGeo, material);
            neuron.position.set(x, y, z);

            neuron.userData = {
                t: t,
                originalPos: new THREE.Vector3(x, y, z),
                phase: Math.random() * Math.PI * 2,
                baseOpacity: Math.max(0.1, 0.25 - t * 0.15)
            };

            this.spineNeurons.push(neuron);
            this.spineGroup.add(neuron);
        }
    }

    createSpinalNerves(curve) {
        const nerveMaterial = new THREE.LineBasicMaterial({
            color: this.accentColor,
            transparent: true,
            opacity: 0.1,
            depthWrite: false
        });

        const count = 20;

        for (let i = 0; i < count; i++) {
            const t = 0.05 + (i / count) * 0.9;
            const point = curve.getPoint(t);

            for (let side = 0; side < 2; side++) {
                const direction = side === 0 ? 1 : -1;
                const length = 0.4 + Math.random() * 0.3;

                const nervePoints = [
                    point.clone(),
                    new THREE.Vector3(
                        point.x + direction * length * 0.5,
                        point.y - 0.05,
                        point.z + (Math.random() - 0.5) * 0.15
                    ),
                    new THREE.Vector3(
                        point.x + direction * length,
                        point.y - 0.15,
                        point.z + (Math.random() - 0.5) * 0.2
                    )
                ];

                const nerveCurve = new THREE.CatmullRomCurve3(nervePoints);
                const nerveGeo = new THREE.BufferGeometry().setFromPoints(nerveCurve.getPoints(8));
                const nerve = new THREE.Line(nerveGeo, nerveMaterial.clone());

                this.spineGroup.add(nerve);
            }
        }
    }

    setupEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.onResize();
        });

        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
            if (this.isActive) this.animate();
        });
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        if (!this.isActive) return;
        requestAnimationFrame(() => this.animate());

        this.time += 0.016;

        const maxScroll = this.pageHeight - window.innerHeight;
        const scrollProgress = maxScroll > 0 ? this.scrollY / maxScroll : 0;

        this.animateBrain();
        this.animateSpine();

        // Pulsos eléctricos ocasionales
        if (Math.random() > 0.97) {
            this.createElectricPulse();
        }

        this.animatePulses();
        this.updateCamera(scrollProgress);

        this.renderer.render(this.scene, this.camera);
    }

    animateBrain() {
        if (!this.brainGroup) return;

        // Rotación muy suave del cerebro
        this.brainGroup.rotation.y = Math.sin(this.time * 0.08) * 0.1;
        this.brainGroup.rotation.x = Math.sin(this.time * 0.1) * 0.03 + this.mouse.y * 0.02;

        // Respiración muy sutil
        const breathe = 1 + Math.sin(this.time * 0.25) * 0.01;
        this.brainGroup.scale.setScalar(breathe);

        // Animar neuronas
        this.neurons.forEach((neuron) => {
            const { phase, speed, originalPos, baseOpacity } = neuron.userData;

            const pulse = Math.sin(this.time * speed + phase);
            neuron.material.opacity = baseOpacity + pulse * 0.15;

            const microMove = 0.008;
            neuron.position.x = originalPos.x + Math.sin(this.time + phase) * microMove;
            neuron.position.y = originalPos.y + Math.cos(this.time * 0.8 + phase) * microMove;

            const scale = 1 + pulse * 0.15;
            neuron.scale.setScalar(scale);
        });

        // Animar conexiones
        this.connections.forEach((line) => {
            const { baseOpacity, phase } = line.userData;
            line.material.opacity = baseOpacity + Math.sin(this.time * 2 + phase) * 0.02;
        });
    }

    animateSpine() {
        if (!this.spineGroup) return;

        this.spineNeurons.forEach((neuron) => {
            const { t, originalPos, phase, baseOpacity } = neuron.userData;

            const wave = Math.sin(this.time * 2 - t * 10);
            const travelingPulse = Math.sin(this.time * 3 - t * 15);

            neuron.material.opacity = baseOpacity * (0.7 + travelingPulse * 0.3);
            neuron.scale.setScalar(1 + wave * 0.2);

            const sway = Math.sin(this.time + t * 5 + phase) * 0.015;
            neuron.position.x = originalPos.x + sway;
        });
    }

    createElectricPulse() {
        if (!this.spineCurve || this.pulses.length > 10) return;

        const goingDown = Math.random() > 0.3;

        const pulseGeo = new THREE.SphereGeometry(0.06, 6, 6);
        const pulseMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
        });

        const pulse = new THREE.Mesh(pulseGeo, pulseMat);

        const startT = goingDown ? 0 : 1;
        const startPoint = this.spineCurve.getPoint(startT);
        pulse.position.copy(startPoint);

        pulse.userData = {
            t: startT,
            speed: goingDown ? 0.004 : -0.004,
            goingDown: goingDown
        };

        this.pulses.push(pulse);
        this.spineGroup.add(pulse);
    }

    animatePulses() {
        for (let i = this.pulses.length - 1; i >= 0; i--) {
            const pulse = this.pulses[i];
            pulse.userData.t += pulse.userData.speed;

            const t = pulse.userData.t;

            if (t < 0 || t > 1) {
                this.spineGroup.remove(pulse);
                pulse.geometry.dispose();
                pulse.material.dispose();
                this.pulses.splice(i, 1);
                continue;
            }

            const point = this.spineCurve.getPoint(t);
            pulse.position.copy(point);

            // Fade
            const fadeStart = pulse.userData.goingDown ? 0.85 : 0.15;
            const fadeEnd = pulse.userData.goingDown ? 1.0 : 0.0;
            const fadeRange = Math.abs(fadeEnd - fadeStart);
            const fadeProgress = pulse.userData.goingDown
                ? Math.max(0, (t - fadeStart) / fadeRange)
                : Math.max(0, (fadeStart - t) / fadeRange);

            pulse.material.opacity = 0.8 * (1 - fadeProgress);

            const pulseScale = 1 + Math.sin(this.time * 10) * 0.2;
            pulse.scale.setScalar(pulseScale);
        }
    }

    updateCamera(scrollProgress) {
        // La cámara sigue el scroll, viendo el sistema neural
        const cameraY = 8 - scrollProgress * this.spineLength * 0.4;
        this.camera.position.y = cameraY;
        this.camera.position.z = 25;
        this.camera.lookAt(new THREE.Vector3(8, cameraY - 3, -10));
    }

    dispose() {
        this.isActive = false;

        if (this.renderer) {
            this.renderer.dispose();
        }

        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export { NeuralSystemEngine };
