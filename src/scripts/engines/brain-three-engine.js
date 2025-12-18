/**
 * Neural Network Engine - Visualización de IA Futurista ÉPICA
 * Red neural GIGANTE que cubre TODA la página
 * Máxima interactividad y colores neón brillantes
 */

import * as THREE from 'three';

class BrainThreeEngine {
    constructor(containerId = 'visual-effects-container') {
        this.containerId = containerId;
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // Elementos de la red neural
        this.neurons = [];
        this.connections = [];
        this.pulses = [];
        this.electricBolts = [];
        this.dataPackets = [];
        this.rings = [];

        // Colores neón MUY brillantes
        this.colors = {
            cyan: 0x00ffff,
            purple: 0xaa00ff,
            green: 0x00ff88,
            pink: 0xff0088,
            blue: 0x0088ff,
            yellow: 0xffff00,
            orange: 0xff8800
        };

        // Estado
        this.isActive = false;
        this.time = 0;
        this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0 };
        this.scrollY = 0;
        this.maxScroll = 1;
        this.hoveredNeuron = null;

        this.start();
    }

    start() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error('[Neural] Container not found');
            return;
        }

        // Calcular altura total de la página
        this.maxScroll = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        ) - window.innerHeight;

        // Scene
        this.scene = new THREE.Scene();

        // Camera - Vista MUY amplia para red neural gigante
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.camera.position.set(0, 0, 150);

        // Renderer - Pantalla completa
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        // Canvas fullscreen como fondo
        const canvas = this.renderer.domElement;
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
        `;

        this.container.appendChild(canvas);

        // Crear la red neural ÉPICA
        this.createMassiveNeuralNetwork();
        this.createElectricBolts();
        this.createFloatingRings();
        this.createAmbientParticles();

        // Eventos con interactividad
        this.setupEvents();

        // Iniciar animación
        this.isActive = true;
        this.animate();

        console.log('[Neural] EPIC Futuristic AI Network initialized!');
    }

    createMassiveNeuralNetwork() {
        // Red neural MASIVA que cubre toda la pantalla vertical
        const neuronGeometry = new THREE.SphereGeometry(1.2, 24, 24);

        // Distribuir neuronas en TODA la altura de la página
        // Más neuronas, más distribuidas
        const totalNeurons = 300;
        const verticalSpread = 400; // Altura total de la red
        const horizontalSpread = 200; // Ancho total

        for (let i = 0; i < totalNeurons; i++) {
            // Distribución aleatoria pero uniforme
            const x = (Math.random() - 0.5) * horizontalSpread;
            const y = (Math.random() - 0.5) * verticalSpread;
            const z = (Math.random() - 0.5) * 80 - 30;

            // Colores aleatorios brillantes
            const colorKeys = Object.keys(this.colors);
            const color = this.colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];

            // Material con brillo intenso
            const neuronMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending
            });

            const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
            neuron.position.set(x, y, z);

            // Glow exterior más grande
            const glowGeo = new THREE.SphereGeometry(2.5, 16, 16);
            const glowMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            neuron.add(glow);

            // Segundo glow más grande y tenue
            const glow2Geo = new THREE.SphereGeometry(4, 12, 12);
            const glow2Mat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            });
            const glow2 = new THREE.Mesh(glow2Geo, glow2Mat);
            neuron.add(glow2);

            neuron.userData = {
                originalPos: new THREE.Vector3(x, y, z),
                phase: Math.random() * Math.PI * 2,
                speed: 0.3 + Math.random() * 1.2,
                color: color,
                baseScale: 0.8 + Math.random() * 0.4,
                pulseSpeed: 1 + Math.random() * 2
            };

            this.neurons.push(neuron);
            this.scene.add(neuron);
        }

        // Crear conexiones dinámicas
        this.createDynamicConnections();
    }

    createDynamicConnections() {
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: this.colors.cyan,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        // Conectar neuronas cercanas
        for (let i = 0; i < this.neurons.length; i++) {
            const neuron1 = this.neurons[i];

            for (let j = i + 1; j < this.neurons.length; j++) {
                const neuron2 = this.neurons[j];
                const dist = neuron1.position.distanceTo(neuron2.position);

                // Conectar si están cerca (ajustar distancia para más/menos conexiones)
                if (dist < 50 && Math.random() > 0.6) {
                    const points = [
                        neuron1.position.clone(),
                        neuron2.position.clone()
                    ];

                    const geometry = new THREE.BufferGeometry().setFromPoints(points);

                    // Color de conexión basado en los colores de las neuronas
                    const connMat = connectionMaterial.clone();
                    connMat.color = new THREE.Color(neuron1.userData.color);

                    const connection = new THREE.Line(geometry, connMat);

                    connection.userData = {
                        startNeuron: i,
                        endNeuron: j,
                        baseOpacity: 0.15 + Math.random() * 0.25,
                        phase: Math.random() * Math.PI * 2,
                        pulseActive: false
                    };

                    this.connections.push(connection);
                    this.scene.add(connection);
                }
            }
        }
    }

    createElectricBolts() {
        // Rayos eléctricos que cruzan la pantalla
        for (let i = 0; i < 15; i++) {
            this.createBolt();
        }
    }

    createBolt() {
        const points = [];
        const segments = 15 + Math.floor(Math.random() * 15);

        // Punto de inicio aleatorio
        let x = (Math.random() - 0.5) * 250;
        let y = (Math.random() - 0.5) * 500;
        const z = -20 - Math.random() * 40;

        // Dirección principal
        const dirX = (Math.random() - 0.5) * 2;
        const dirY = (Math.random() - 0.5) * 2;

        for (let i = 0; i < segments; i++) {
            points.push(new THREE.Vector3(x, y, z));

            // Movimiento con zigzag
            x += dirX * 5 + (Math.random() - 0.5) * 15;
            y += dirY * 5 + (Math.random() - 0.5) * 15;
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const colors = [this.colors.cyan, this.colors.purple, this.colors.pink, this.colors.green];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            linewidth: 2
        });

        const bolt = new THREE.Line(geometry, material);
        bolt.userData = {
            life: 0,
            maxLife: 0.5 + Math.random() * 1,
            color: color
        };

        this.electricBolts.push(bolt);
        this.scene.add(bolt);
    }

    createFloatingRings() {
        // Anillos flotantes decorativos
        for (let i = 0; i < 20; i++) {
            const radius = 10 + Math.random() * 30;
            const geometry = new THREE.RingGeometry(radius, radius + 0.5, 64);

            const colors = [this.colors.cyan, this.colors.purple, this.colors.pink];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.2 + Math.random() * 0.2,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.position.set(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 400,
                -50 - Math.random() * 50
            );
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;

            ring.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                phase: Math.random() * Math.PI * 2
            };

            this.rings.push(ring);
            this.scene.add(ring);
        }
    }

    createAmbientParticles() {
        // MUCHAS partículas flotantes
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const colorOptions = [
            new THREE.Color(this.colors.cyan),
            new THREE.Color(this.colors.purple),
            new THREE.Color(this.colors.green),
            new THREE.Color(this.colors.pink),
            new THREE.Color(this.colors.yellow)
        ];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 300;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 500;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;

            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = 0.3 + Math.random() * 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.ambientParticles = new THREE.Points(geometry, material);
        this.scene.add(this.ambientParticles);
    }

    setupEvents() {
        // Mouse move con tracking de velocidad
        window.addEventListener('mousemove', (e) => {
            this.mouse.prevX = this.mouse.x;
            this.mouse.prevY = this.mouse.y;
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;

            // Crear pulso en la posición del mouse
            if (Math.random() > 0.9) {
                this.createMousePulse(e.clientX, e.clientY);
            }
        }, { passive: true });

        // Scroll para mover la cámara verticalmente
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
            this.maxScroll = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            ) - window.innerHeight;
        }, { passive: true });

        // Click para crear explosión de partículas
        window.addEventListener('click', (e) => {
            this.createClickExplosion(e.clientX, e.clientY);
        }, { passive: true });

        // Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, { passive: true });
    }

    createMousePulse(clientX, clientY) {
        // Convertir coordenadas de pantalla a 3D
        const x = (clientX / window.innerWidth) * 200 - 100;
        const y = -(clientY / window.innerHeight) * 200 + 100;

        const geometry = new THREE.SphereGeometry(2, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: this.colors.cyan,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const pulse = new THREE.Mesh(geometry, material);
        pulse.position.set(x, y, 0);
        pulse.userData = { life: 0, maxLife: 1 };

        this.pulses.push(pulse);
        this.scene.add(pulse);
    }

    createClickExplosion(clientX, clientY) {
        const x = (clientX / window.innerWidth) * 200 - 100;
        const y = -(clientY / window.innerHeight) * 200 + 100;

        // Crear múltiples partículas en explosión
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 8, 8);
            const colors = [this.colors.cyan, this.colors.purple, this.colors.pink, this.colors.green];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 1,
                blending: THREE.AdditiveBlending
            });

            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(x, y, 10);

            const angle = (i / 20) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;

            particle.userData = {
                velocity: new THREE.Vector3(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    (Math.random() - 0.5) * speed
                ),
                life: 0,
                maxLife: 1 + Math.random()
            };

            this.dataPackets.push(particle);
            this.scene.add(particle);
        }

        // Activar pulsos en conexiones cercanas
        this.connections.forEach(conn => {
            const startNeuron = this.neurons[conn.userData.startNeuron];
            const dist = startNeuron.position.distanceTo(new THREE.Vector3(x, y, 0));
            if (dist < 50) {
                conn.userData.pulseActive = true;
                conn.material.opacity = 0.8;
            }
        });
    }

    animate() {
        if (!this.isActive) return;
        requestAnimationFrame(() => this.animate());

        this.time += 0.016;

        // Calcular progreso del scroll (0 a 1)
        const scrollProgress = this.maxScroll > 0 ? this.scrollY / this.maxScroll : 0;

        // Mover cámara basado en scroll - viaja por la red neural
        const targetY = -scrollProgress * 350; // Rango vertical de la cámara
        this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetY, 0.05);

        // Movimiento lateral con mouse
        this.camera.position.x = THREE.MathUtils.lerp(
            this.camera.position.x,
            this.mouse.x * 30,
            0.03
        );

        // Rotación sutil de cámara
        this.camera.rotation.x = THREE.MathUtils.lerp(
            this.camera.rotation.x,
            this.mouse.y * 0.1,
            0.02
        );
        this.camera.rotation.y = THREE.MathUtils.lerp(
            this.camera.rotation.y,
            -this.mouse.x * 0.1,
            0.02
        );

        // Animar todos los elementos
        this.animateNeurons();
        this.animateConnections();
        this.animateElectricBolts();
        this.animateRings();
        this.animateParticles();
        this.animatePulses();
        this.animateDataPackets();

        // Crear nuevos efectos aleatorios
        if (Math.random() > 0.98) {
            this.createRandomPulse();
        }

        if (Math.random() > 0.995) {
            this.createBolt();
        }

        this.renderer.render(this.scene, this.camera);
    }

    animateNeurons() {
        this.neurons.forEach((neuron) => {
            const { phase, speed, originalPos, baseScale, pulseSpeed } = neuron.userData;

            // Pulsación intensa
            const pulse = Math.sin(this.time * pulseSpeed + phase);
            neuron.material.opacity = 0.6 + pulse * 0.4;

            // Escala pulsante
            const scale = baseScale * (1 + pulse * 0.3);
            neuron.scale.setScalar(scale);

            // Movimiento flotante orgánico
            neuron.position.x = originalPos.x + Math.sin(this.time * speed * 0.5 + phase) * 3;
            neuron.position.y = originalPos.y + Math.cos(this.time * speed * 0.3 + phase) * 3;
            neuron.position.z = originalPos.z + Math.sin(this.time * speed * 0.4 + phase * 2) * 2;

            // Actualizar glows
            if (neuron.children[0]) {
                neuron.children[0].material.opacity = 0.2 + pulse * 0.2;
            }
            if (neuron.children[1]) {
                neuron.children[1].material.opacity = 0.05 + pulse * 0.1;
            }

            // Interacción con mouse - neuronas cercanas al cursor brillan más
            const mouseWorld = new THREE.Vector3(
                this.mouse.x * 100,
                -this.mouse.y * 100 + this.camera.position.y,
                0
            );
            const distToMouse = neuron.position.distanceTo(mouseWorld);
            if (distToMouse < 40) {
                const intensity = 1 - (distToMouse / 40);
                neuron.material.opacity = Math.min(1, neuron.material.opacity + intensity * 0.5);
                neuron.scale.setScalar(scale * (1 + intensity * 0.5));
            }
        });
    }

    animateConnections() {
        this.connections.forEach(connection => {
            const { baseOpacity, phase, startNeuron, endNeuron, pulseActive } = connection.userData;

            // Actualizar posiciones
            const positions = connection.geometry.attributes.position.array;
            const start = this.neurons[startNeuron].position;
            const end = this.neurons[endNeuron].position;

            positions[0] = start.x;
            positions[1] = start.y;
            positions[2] = start.z;
            positions[3] = end.x;
            positions[4] = end.y;
            positions[5] = end.z;

            connection.geometry.attributes.position.needsUpdate = true;

            // Pulsación
            const wave = Math.sin(this.time * 2 + phase);

            if (pulseActive) {
                connection.material.opacity = THREE.MathUtils.lerp(
                    connection.material.opacity,
                    baseOpacity,
                    0.02
                );
                if (connection.material.opacity < baseOpacity + 0.1) {
                    connection.userData.pulseActive = false;
                }
            } else {
                connection.material.opacity = baseOpacity + wave * 0.15;
            }
        });
    }

    animateElectricBolts() {
        for (let i = this.electricBolts.length - 1; i >= 0; i--) {
            const bolt = this.electricBolts[i];
            bolt.userData.life += 0.016;

            const lifeRatio = bolt.userData.life / bolt.userData.maxLife;

            // Flash de opacidad
            bolt.material.opacity = Math.sin(lifeRatio * Math.PI) * 0.8;

            if (bolt.userData.life >= bolt.userData.maxLife) {
                this.scene.remove(bolt);
                bolt.geometry.dispose();
                bolt.material.dispose();
                this.electricBolts.splice(i, 1);
            }
        }
    }

    animateRings() {
        this.rings.forEach(ring => {
            ring.rotation.z += ring.userData.rotationSpeed;

            const pulse = Math.sin(this.time + ring.userData.phase);
            ring.material.opacity = 0.15 + pulse * 0.1;
            ring.scale.setScalar(1 + pulse * 0.1);
        });
    }

    animateParticles() {
        if (!this.ambientParticles) return;

        const positions = this.ambientParticles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length / 3; i++) {
            // Movimiento ondulante
            positions[i * 3] += Math.sin(this.time * 0.5 + i * 0.1) * 0.02;
            positions[i * 3 + 1] += Math.cos(this.time * 0.3 + i * 0.1) * 0.02;
        }

        this.ambientParticles.geometry.attributes.position.needsUpdate = true;

        // Rotación lenta del sistema de partículas
        this.ambientParticles.rotation.y = this.time * 0.01;
        this.ambientParticles.rotation.x = Math.sin(this.time * 0.1) * 0.05;
    }

    animatePulses() {
        for (let i = this.pulses.length - 1; i >= 0; i--) {
            const pulse = this.pulses[i];
            pulse.userData.life += 0.02;

            const progress = pulse.userData.life / pulse.userData.maxLife;

            pulse.scale.setScalar(1 + progress * 5);
            pulse.material.opacity = 0.8 * (1 - progress);

            if (pulse.userData.life >= pulse.userData.maxLife) {
                this.scene.remove(pulse);
                pulse.geometry.dispose();
                pulse.material.dispose();
                this.pulses.splice(i, 1);
            }
        }
    }

    animateDataPackets() {
        for (let i = this.dataPackets.length - 1; i >= 0; i--) {
            const packet = this.dataPackets[i];
            packet.userData.life += 0.016;

            // Mover con velocidad
            packet.position.add(packet.userData.velocity);

            // Desacelerar
            packet.userData.velocity.multiplyScalar(0.98);

            const progress = packet.userData.life / packet.userData.maxLife;
            packet.material.opacity = 1 - progress;
            packet.scale.setScalar(1 - progress * 0.5);

            if (packet.userData.life >= packet.userData.maxLife) {
                this.scene.remove(packet);
                packet.geometry.dispose();
                packet.material.dispose();
                this.dataPackets.splice(i, 1);
            }
        }
    }

    createRandomPulse() {
        if (this.neurons.length === 0) return;

        const startNeuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];

        const geometry = new THREE.SphereGeometry(1.5, 12, 12);
        const colors = [this.colors.cyan, this.colors.green, this.colors.pink, this.colors.purple];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });

        const pulse = new THREE.Mesh(geometry, material);
        pulse.position.copy(startNeuron.position);
        pulse.userData = { life: 0, maxLife: 1.5 };

        this.pulses.push(pulse);
        this.scene.add(pulse);
    }

    updateTheme(theme) {
        console.log('[Neural] Theme updated:', theme);
    }

    dispose() {
        this.isActive = false;

        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }

        this.scene?.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

export { BrainThreeEngine };
