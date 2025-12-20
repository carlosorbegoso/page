/**
 * Loader Three.js Engine - Neural Mind Awakening
 * Immersive 3D neural network animation for the loading screen
 * Creates a "mind coming online" effect with neurons connecting
 */

import * as THREE from 'three';

export class LoaderThreeEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        this.isActive = true;
        this.time = 0;
        this.progress = 0;

        // Neural network elements
        this.neurons = [];
        this.synapses = [];
        this.energyPulses = [];
        this.particleSystem = null;
        this.centralCore = null;

        // Neural color palette
        this.colors = {
            primary: new THREE.Color(0x64B5F6),
            cyan: new THREE.Color(0x00ffff),
            purple: new THREE.Color(0xaa44ff),
            spark: new THREE.Color(0xFF6B35),
            white: new THREE.Color(0xffffff)
        };

        // Device detection
        this.isMobile = window.innerWidth <= 768;
        this.quality = this.isMobile ? 0.6 : 1;

        this.config = {
            neuronCount: Math.floor(25 * this.quality),
            synapseMaxDistance: 120,
            particleCount: Math.floor(200 * this.quality),
            pulseSpeed: 0.8
        };
    }

    async init(containerId = 'loader-canvas-container') {
        try {
            this.container = document.getElementById(containerId);
            if (!this.container) {
                // Create container if doesn't exist
                this.container = document.createElement('div');
                this.container.id = containerId;
                this.container.style.cssText = `
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                `;
                const loader = document.getElementById('page-loader');
                if (loader) {
                    loader.insertBefore(this.container, loader.firstChild);
                }
            }

            // Scene
            this.scene = new THREE.Scene();

            // Camera
            const aspect = window.innerWidth / window.innerHeight;
            this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
            this.camera.position.z = 150;

            // Renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: !this.isMobile,
                alpha: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
            this.renderer.setClearColor(0x000000, 0);
            this.container.appendChild(this.renderer.domElement);

            // Create elements
            this.createCentralCore();
            this.createNeurons();
            this.createBackgroundParticles();
            this.createEnergyRings();

            // Events
            window.addEventListener('resize', () => this.onResize());

            // Start animation
            this.animate();

            return true;
        } catch (error) {
            console.warn('LoaderThreeEngine: Init failed', error);
            return false;
        }
    }

    createCentralCore() {
        // Central pulsing sphere representing the "mind core"
        const geometry = new THREE.SphereGeometry(8, 32, 32);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                progress: { value: 0 },
                colorPrimary: { value: this.colors.primary },
                colorCyan: { value: this.colors.cyan }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float progress;
                uniform vec3 colorPrimary;
                uniform vec3 colorCyan;
                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    // Fresnel effect for glowing edges
                    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);

                    // Pulsing animation
                    float pulse = 0.6 + 0.4 * sin(time * 2.0);

                    // Color gradient based on progress
                    vec3 color = mix(colorPrimary, colorCyan, progress * 0.5 + sin(time) * 0.2);

                    // Energy waves across surface
                    float wave = sin(vPosition.y * 3.0 + time * 3.0) * 0.5 + 0.5;

                    float alpha = (fresnel * 0.8 + 0.2) * pulse * (0.5 + progress * 0.5);
                    alpha += wave * 0.15 * progress;

                    gl_FragColor = vec4(color, alpha * 0.7);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.centralCore = new THREE.Mesh(geometry, material);
        this.scene.add(this.centralCore);

        // Inner glow sphere
        const innerGeometry = new THREE.SphereGeometry(5, 24, 24);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: this.colors.cyan,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
        this.centralCore.add(innerCore);
    }

    createNeurons() {
        const count = this.config.neuronCount;
        const neuronColors = [this.colors.primary, this.colors.cyan, this.colors.purple];

        for (let i = 0; i < count; i++) {
            // Spherical distribution
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const radius = 40 + Math.random() * 60;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi) * 0.6; // Flatten z for better view

            // Neuron sphere
            const size = 1.5 + Math.random() * 2;
            const geometry = new THREE.SphereGeometry(size, 12, 12);
            const color = neuronColors[Math.floor(Math.random() * neuronColors.length)];

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending
            });

            const neuron = new THREE.Mesh(geometry, material);
            neuron.position.set(x, y, z);

            neuron.userData = {
                originalPos: neuron.position.clone(),
                color: color,
                size: size,
                delay: i * 0.05,
                activated: false,
                pulsePhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.5 + Math.random() * 0.5,
                floatAmplitude: 2 + Math.random() * 3
            };

            this.neurons.push(neuron);
            this.scene.add(neuron);
        }

        // Create synapses (connections) between nearby neurons
        this.createSynapses();
    }

    createSynapses() {
        const material = new THREE.LineBasicMaterial({
            color: this.colors.cyan,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                const distance = this.neurons[i].position.distanceTo(this.neurons[j].position);

                if (distance < this.config.synapseMaxDistance) {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array([
                        this.neurons[i].position.x, this.neurons[i].position.y, this.neurons[i].position.z,
                        this.neurons[j].position.x, this.neurons[j].position.y, this.neurons[j].position.z
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                    const line = new THREE.Line(geometry, material.clone());
                    line.userData = {
                        neuronA: i,
                        neuronB: j,
                        distance: distance,
                        activated: false,
                        delay: Math.max(this.neurons[i].userData.delay, this.neurons[j].userData.delay) + 0.3
                    };

                    this.synapses.push(line);
                    this.scene.add(line);
                }
            }
        }
    }

    createBackgroundParticles() {
        const count = this.config.particleCount;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Spread particles in a larger volume
            positions[i * 3] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
            positions[i * 3 + 2] = -50 - Math.random() * 150;

            // Subtle blue-ish colors
            const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.6, 0.5 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = 0.5 + Math.random() * 1.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                progress: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                uniform float time;
                uniform float progress;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;

                    vec3 pos = position;
                    // Gentle floating motion
                    pos.y += sin(time * 0.5 + position.x * 0.01) * 3.0;
                    pos.x += cos(time * 0.3 + position.z * 0.01) * 2.0;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;

                    // Fade in based on progress
                    vAlpha = min(progress * 2.0, 1.0) * 0.4;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vAlpha * smoothstep(0.5, 0.1, dist);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createEnergyRings() {
        // Concentric energy rings around the core
        const ringCount = 3;
        this.energyRings = [];

        for (let i = 0; i < ringCount; i++) {
            const radius = 15 + i * 12;
            const geometry = new THREE.RingGeometry(radius - 0.5, radius + 0.5, 64);

            const colors = [this.colors.primary, this.colors.cyan, this.colors.purple];
            const material = new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 2;
            ring.userData = {
                rotationSpeed: 0.3 + i * 0.1,
                pulsePhase: i * Math.PI / 3
            };

            this.energyRings.push(ring);
            this.scene.add(ring);
        }
    }

    updateProgress(progress) {
        this.progress = Math.min(progress / 100, 1);
    }

    animate() {
        if (!this.isActive) return;

        requestAnimationFrame(() => this.animate());

        this.time += 0.016;

        // Update central core
        if (this.centralCore) {
            this.centralCore.material.uniforms.time.value = this.time;
            this.centralCore.material.uniforms.progress.value = this.progress;
            this.centralCore.rotation.y += 0.005;

            // Pulse scale based on progress
            const pulseScale = 1 + Math.sin(this.time * 2) * 0.05 * (1 + this.progress);
            this.centralCore.scale.setScalar(pulseScale);
        }

        // Animate neurons - activate based on progress
        this.neurons.forEach((neuron, index) => {
            const activationThreshold = neuron.userData.delay / 2;
            const shouldActivate = this.progress > activationThreshold;

            if (shouldActivate && !neuron.userData.activated) {
                neuron.userData.activated = true;
            }

            if (neuron.userData.activated) {
                // Fade in
                neuron.material.opacity = Math.min(neuron.material.opacity + 0.02, 0.8);

                // Floating animation
                const floatOffset = Math.sin(this.time * neuron.userData.floatSpeed + neuron.userData.pulsePhase);
                neuron.position.y = neuron.userData.originalPos.y + floatOffset * neuron.userData.floatAmplitude;

                // Subtle pulsing
                const pulse = 1 + Math.sin(this.time * 2 + neuron.userData.pulsePhase) * 0.1;
                neuron.scale.setScalar(pulse);
            }
        });

        // Animate synapses
        this.synapses.forEach(synapse => {
            const neuronA = this.neurons[synapse.userData.neuronA];
            const neuronB = this.neurons[synapse.userData.neuronB];

            if (neuronA.userData.activated && neuronB.userData.activated) {
                if (!synapse.userData.activated) {
                    synapse.userData.activated = true;
                }

                // Update positions as neurons move
                const positions = synapse.geometry.attributes.position.array;
                positions[0] = neuronA.position.x;
                positions[1] = neuronA.position.y;
                positions[2] = neuronA.position.z;
                positions[3] = neuronB.position.x;
                positions[4] = neuronB.position.y;
                positions[5] = neuronB.position.z;
                synapse.geometry.attributes.position.needsUpdate = true;

                // Fade in and pulse
                const baseOpacity = 0.15 * (1 - synapse.userData.distance / this.config.synapseMaxDistance);
                const pulse = 0.8 + Math.sin(this.time * 3 + synapse.userData.delay) * 0.2;
                synapse.material.opacity = Math.min(synapse.material.opacity + 0.01, baseOpacity * pulse);
            }
        });

        // Animate energy rings
        if (this.energyRings) {
            this.energyRings.forEach((ring, i) => {
                ring.rotation.z += ring.userData.rotationSpeed * 0.01;

                // Fade in based on progress
                const targetOpacity = this.progress > 0.2 ? 0.2 + Math.sin(this.time + ring.userData.pulsePhase) * 0.1 : 0;
                ring.material.opacity += (targetOpacity - ring.material.opacity) * 0.05;

                // Scale pulse
                const scale = 1 + Math.sin(this.time * 1.5 + ring.userData.pulsePhase) * 0.03;
                ring.scale.setScalar(scale);
            });
        }

        // Animate background particles
        if (this.particleSystem) {
            this.particleSystem.material.uniforms.time.value = this.time;
            this.particleSystem.material.uniforms.progress.value = this.progress;
        }

        // Camera gentle movement
        this.camera.position.x = Math.sin(this.time * 0.2) * 5;
        this.camera.position.y = Math.cos(this.time * 0.15) * 3;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (!this.camera || !this.renderer) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // Explosion effect when loading completes
    async explode() {
        return new Promise(resolve => {
            const duration = 800;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const t = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - t, 3);

                // Expand neurons outward
                this.neurons.forEach(neuron => {
                    const direction = neuron.position.clone().normalize();
                    const explosionDistance = 200 * easeOut;
                    neuron.position.copy(neuron.userData.originalPos.clone().add(direction.multiplyScalar(explosionDistance)));
                    neuron.material.opacity = Math.max(0, 0.8 - t);
                    neuron.scale.setScalar(1 + t * 2);
                });

                // Fade out synapses
                this.synapses.forEach(synapse => {
                    synapse.material.opacity = Math.max(0, synapse.material.opacity - 0.02);
                });

                // Expand core
                if (this.centralCore) {
                    this.centralCore.scale.setScalar(1 + easeOut * 5);
                    this.centralCore.material.uniforms.progress.value = 1 - t;
                }

                // Fade rings
                if (this.energyRings) {
                    this.energyRings.forEach(ring => {
                        ring.material.opacity = Math.max(0, ring.material.opacity - 0.02);
                        ring.scale.setScalar(1 + easeOut * 3);
                    });
                }

                if (t < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            animate();
        });
    }

    dispose() {
        this.isActive = false;

        // Dispose neurons
        this.neurons.forEach(neuron => {
            neuron.geometry.dispose();
            neuron.material.dispose();
            this.scene.remove(neuron);
        });

        // Dispose synapses
        this.synapses.forEach(synapse => {
            synapse.geometry.dispose();
            synapse.material.dispose();
            this.scene.remove(synapse);
        });

        // Dispose central core
        if (this.centralCore) {
            this.centralCore.geometry.dispose();
            this.centralCore.material.dispose();
            this.scene.remove(this.centralCore);
        }

        // Dispose particles
        if (this.particleSystem) {
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
            this.scene.remove(this.particleSystem);
        }

        // Dispose rings
        if (this.energyRings) {
            this.energyRings.forEach(ring => {
                ring.geometry.dispose();
                ring.material.dispose();
                this.scene.remove(ring);
            });
        }

        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
            if (this.container) {
                this.container.removeChild(this.renderer.domElement);
            }
        }

        this.neurons = [];
        this.synapses = [];
        this.energyRings = [];
    }
}
