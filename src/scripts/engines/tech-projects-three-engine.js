/**
 * Tech Projects Section Three.js Engine - Neural Mind Edition
 * Holographic data visualization with floating code particles
 * Uses unified neural color palette
 */

import * as THREE from 'three';

export class TechProjectsThreeEngine {
    constructor(containerId = 'tech-three-container') {
        this.containerId = containerId;
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.time = 0;
        this.isVisible = false;
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);

        // Neural color palette (unified)
        this.neuralColors = {
            primary: new THREE.Color(0x64B5F6),   // --neural-primary
            cyan: new THREE.Color(0x00ffff),      // --neural-cyan
            purple: new THREE.Color(0xaa44ff),    // --neural-purple
            spark: new THREE.Color(0xFF6B35)      // --neural-spark
        };

        // Effects
        this.codeParticles = null;
        this.dataNodes = [];
        this.connectionLines = [];
        this.hologramCube = null;
        this.energyRings = [];
        this.floatingSymbols = [];
        this.neuralNetwork = null;

        // Mobile detection
        this.isMobile = window.innerWidth <= 768;
        this.isLowPower = window.innerWidth <= 480;
        this.particleMultiplier = this.isLowPower ? 0.25 : (this.isMobile ? 0.4 : 1);
    }

    async init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.warn(`Container ${this.containerId} not found`);
            return false;
        }

        try {
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();

            // Create all visual effects
            this.createCodeParticles();
            this.createDataNodes();
            this.createNeuralNetwork();
            this.createHologramCube();
            this.createEnergyRings();
            this.createFloatingSymbols();
            this.createAmbientParticles();

            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.animate();

            return true;
        } catch (error) {
            console.error('TechProjectsThreeEngine init error:', error);
            return false;
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.008);
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 50);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: this.isMobile ? 'low-power' : 'high-performance'
        });

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.renderer.setClearColor(0x000000, 0);

        this.container.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.pointerEvents = 'none';
    }

    createCodeParticles() {
        const count = Math.floor(300 * this.particleMultiplier);
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Spread particles in a wide area
            positions[i * 3] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;

            // Cyan to magenta colors
            const t = Math.random();
            if (t < 0.5) {
                // Cyan
                colors[i * 3] = 0;
                colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
                colors[i * 3 + 2] = 1;
            } else {
                // Magenta
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 0;
                colors[i * 3 + 2] = 1;
            }

            sizes[i] = 0.5 + Math.random() * 1.5;

            // Random velocities
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = 0.01 + Math.random() * 0.03; // Upward bias
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;

                    vec3 pos = position;

                    // Floating motion
                    pos.y += sin(time * 0.5 + position.x * 0.1) * 2.0;
                    pos.x += cos(time * 0.3 + position.y * 0.1) * 1.5;

                    // Pulse alpha
                    vAlpha = 0.4 + 0.4 * sin(time * 2.0 + position.z * 0.5);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vAlpha * smoothstep(0.5, 0.0, dist);
                    vec3 glow = vColor + vec3(0.2);

                    gl_FragColor = vec4(glow, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.codeParticles = new THREE.Points(geometry, material);
        this.codeParticlesVelocities = velocities;
        this.scene.add(this.codeParticles);
    }

    createDataNodes() {
        const nodeCount = Math.floor(15 * this.particleMultiplier);

        for (let i = 0; i < nodeCount; i++) {
            const group = new THREE.Group();

            // Core sphere
            const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
            const coreMat = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00ffff : 0xaa44ff, // cyan / neural purple
                transparent: true,
                opacity: 0.8,
                wireframe: true
            });
            const core = new THREE.Mesh(coreGeo, coreMat);
            group.add(core);

            // Outer ring
            const ringGeo = new THREE.TorusGeometry(1.5, 0.05, 8, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00ffff : 0xaa44ff, // cyan / neural purple
                transparent: true,
                opacity: 0.4
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);

            // Position randomly
            group.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 30 - 15
            );

            group.userData = {
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.01
                ),
                floatPhase: Math.random() * Math.PI * 2,
                originalY: group.position.y,
                pulsePhase: Math.random() * Math.PI * 2
            };

            this.dataNodes.push(group);
            this.scene.add(group);
        }

        // Create connections between nearby nodes
        this.createNodeConnections();
    }

    createNodeConnections() {
        const maxDistance = 25;

        for (let i = 0; i < this.dataNodes.length; i++) {
            for (let j = i + 1; j < this.dataNodes.length; j++) {
                const dist = this.dataNodes[i].position.distanceTo(this.dataNodes[j].position);

                if (dist < maxDistance && Math.random() > 0.5) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        this.dataNodes[i].position,
                        this.dataNodes[j].position
                    ]);

                    const material = new THREE.LineBasicMaterial({
                        color: 0x64B5F6, // neural primary for connections
                        transparent: true,
                        opacity: 0.15
                    });

                    const line = new THREE.Line(geometry, material);
                    line.userData = {
                        nodeA: this.dataNodes[i],
                        nodeB: this.dataNodes[j],
                        baseOpacity: 0.15
                    };

                    this.connectionLines.push(line);
                    this.scene.add(line);
                }
            }
        }
    }

    createNeuralNetwork() {
        const layers = [5, 8, 8, 5];
        const layerSpacing = 12;
        const nodeSpacing = 5;
        const neurons = [];

        // Create neurons
        layers.forEach((count, layerIndex) => {
            const layerNeurons = [];
            const layerX = (layerIndex - (layers.length - 1) / 2) * layerSpacing;

            for (let i = 0; i < count; i++) {
                const y = (i - (count - 1) / 2) * nodeSpacing;

                const geometry = new THREE.SphereGeometry(0.3, 8, 8);
                // Alternate colors from neural palette
                const neuronColors = [0x64B5F6, 0x00ffff, 0xaa44ff];
                const material = new THREE.MeshBasicMaterial({
                    color: neuronColors[layerIndex % neuronColors.length],
                    transparent: true,
                    opacity: 0.6
                });

                const neuron = new THREE.Mesh(geometry, material);
                neuron.position.set(layerX + 35, y - 20, -20);
                neuron.userData = {
                    activationPhase: Math.random() * Math.PI * 2,
                    layerIndex,
                    nodeIndex: i
                };

                this.scene.add(neuron);
                layerNeurons.push(neuron);
            }
            neurons.push(layerNeurons);
        });

        // Create connections between layers
        for (let l = 0; l < neurons.length - 1; l++) {
            const currentLayer = neurons[l];
            const nextLayer = neurons[l + 1];

            currentLayer.forEach(neuronA => {
                nextLayer.forEach(neuronB => {
                    if (Math.random() > 0.3) {
                        const geometry = new THREE.BufferGeometry().setFromPoints([
                            neuronA.position,
                            neuronB.position
                        ]);

                        const material = new THREE.LineBasicMaterial({
                            color: 0x00ffff,
                            transparent: true,
                            opacity: 0.08
                        });

                        const connection = new THREE.Line(geometry, material);
                        connection.userData = {
                            neuronA,
                            neuronB,
                            pulseProgress: Math.random()
                        };

                        this.scene.add(connection);
                    }
                });
            });
        }

        this.neuralNetwork = neurons;
    }

    createHologramCube() {
        const group = new THREE.Group();

        // Wireframe cube
        const cubeGeo = new THREE.BoxGeometry(8, 8, 8);
        const edges = new THREE.EdgesGeometry(cubeGeo);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.4
        });
        const wireframe = new THREE.LineSegments(edges, lineMat);
        group.add(wireframe);

        // Inner rotating cube
        const innerCubeGeo = new THREE.BoxGeometry(4, 4, 4);
        const innerEdges = new THREE.EdgesGeometry(innerCubeGeo);
        const innerLineMat = new THREE.LineBasicMaterial({
            color: 0xaa44ff, // neural purple
            transparent: true,
            opacity: 0.6
        });
        const innerWireframe = new THREE.LineSegments(innerEdges, innerLineMat);
        group.add(innerWireframe);

        // Core glow
        const coreGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        group.position.set(-35, 0, -10);
        group.userData = {
            innerCube: innerWireframe,
            core
        };

        this.hologramCube = group;
        this.scene.add(group);
    }

    createEnergyRings() {
        const ringCount = 4;

        for (let i = 0; i < ringCount; i++) {
            const radius = 15 + i * 8;
            const geometry = new THREE.TorusGeometry(radius, 0.08, 8, 128);
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00ffff : 0xaa44ff, // cyan / neural purple
                transparent: true,
                opacity: 0.12
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = -25;
            ring.userData = {
                rotationSpeed: 0.003 * (i % 2 === 0 ? 1 : -1),
                pulsePhase: i * Math.PI / 2
            };

            this.energyRings.push(ring);
            this.scene.add(ring);
        }
    }

    createFloatingSymbols() {
        const symbols = ['<>', '{}', '()', '[]', '//', '/*', '#', '@', '&&', '||', '=>', '::'];
        const count = Math.floor(20 * this.particleMultiplier);

        // Create canvas textures for each symbol
        symbols.forEach((symbol, idx) => {
            for (let i = 0; i < count / symbols.length; i++) {
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = idx % 2 === 0 ? '#00ffff' : '#ff00ff';
                ctx.font = 'bold 32px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(symbol, 32, 32);

                const texture = new THREE.CanvasTexture(canvas);
                const material = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0.4,
                    blending: THREE.AdditiveBlending
                });

                const sprite = new THREE.Sprite(material);
                sprite.position.set(
                    (Math.random() - 0.5) * 100,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 40 - 20
                );
                sprite.scale.set(3, 3, 1);
                sprite.userData = {
                    floatPhase: Math.random() * Math.PI * 2,
                    floatSpeed: 0.5 + Math.random() * 0.5,
                    rotationSpeed: (Math.random() - 0.5) * 0.01,
                    originalY: sprite.position.y
                };

                this.floatingSymbols.push(sprite);
                this.scene.add(sprite);
            }
        });
    }

    createAmbientParticles() {
        const count = Math.floor(100 * this.particleMultiplier);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 150;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.ambientParticles = particles;
        this.scene.add(particles);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onResize());

        document.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                });
            },
            { threshold: 0.05 }
        );

        const section = document.getElementById('tech');
        if (section) observer.observe(section);
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isVisible) return;

        this.time += 0.016;

        // Smooth mouse following
        this.mouse.lerp(this.targetMouse, 0.05);

        // Animate code particles
        if (this.codeParticles) {
            this.codeParticles.material.uniforms.time.value = this.time;

            const positions = this.codeParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length / 3; i++) {
                // Rise upward
                positions[i * 3 + 1] += this.codeParticlesVelocities[i * 3 + 1];

                // Reset when too high
                if (positions[i * 3 + 1] > 50) {
                    positions[i * 3 + 1] = -50;
                    positions[i * 3] = (Math.random() - 0.5) * 120;
                }
            }
            this.codeParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate data nodes
        this.dataNodes.forEach(node => {
            const ud = node.userData;

            // Rotation
            node.rotation.x += ud.rotationSpeed.x;
            node.rotation.y += ud.rotationSpeed.y;
            node.rotation.z += ud.rotationSpeed.z;

            // Floating
            node.position.y = ud.originalY + Math.sin(this.time + ud.floatPhase) * 3;

            // Pulse scale
            const pulse = 1 + Math.sin(this.time * 2 + ud.pulsePhase) * 0.1;
            node.scale.setScalar(pulse);
        });

        // Update connection lines
        this.connectionLines.forEach(line => {
            const { nodeA, nodeB, baseOpacity } = line.userData;

            line.geometry.setFromPoints([nodeA.position, nodeB.position]);
            line.geometry.attributes.position.needsUpdate = true;

            // Pulse opacity
            line.material.opacity = baseOpacity + Math.sin(this.time * 3) * 0.05;
        });

        // Animate neural network
        if (this.neuralNetwork) {
            this.neuralNetwork.forEach(layer => {
                layer.forEach(neuron => {
                    const activation = Math.sin(this.time * 3 + neuron.userData.activationPhase);
                    neuron.material.opacity = 0.3 + activation * 0.4;
                    neuron.scale.setScalar(0.8 + activation * 0.3);
                });
            });
        }

        // Animate hologram cube
        if (this.hologramCube) {
            this.hologramCube.rotation.y += 0.005;
            this.hologramCube.rotation.x = Math.sin(this.time * 0.5) * 0.2;

            this.hologramCube.userData.innerCube.rotation.y -= 0.01;
            this.hologramCube.userData.innerCube.rotation.z += 0.008;

            // Pulse core
            const coreScale = 1 + Math.sin(this.time * 2) * 0.2;
            this.hologramCube.userData.core.scale.setScalar(coreScale);
        }

        // Animate energy rings
        this.energyRings.forEach(ring => {
            ring.rotation.z += ring.userData.rotationSpeed;
            ring.material.opacity = 0.08 + Math.sin(this.time + ring.userData.pulsePhase) * 0.06;
        });

        // Animate floating symbols
        this.floatingSymbols.forEach(sprite => {
            const ud = sprite.userData;
            sprite.position.y = ud.originalY + Math.sin(this.time * ud.floatSpeed + ud.floatPhase) * 5;
            sprite.material.rotation += ud.rotationSpeed;
            sprite.material.opacity = 0.2 + Math.sin(this.time * 2 + ud.floatPhase) * 0.2;
        });

        // Rotate ambient particles slowly
        if (this.ambientParticles) {
            this.ambientParticles.rotation.y += 0.0002;
        }

        // Camera movement based on mouse
        this.camera.position.x += (this.mouse.x * 8 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('tech-three-container');
    if (container) {
        const engine = new TechProjectsThreeEngine('tech-three-container');
        engine.init();
    }
});
