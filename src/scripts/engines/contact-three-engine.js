/**
 * Contact Section Three.js Engine - Neural Mind Edition
 * Elegant network visualization with flowing connections
 * Uses unified neural color palette
 */

import * as THREE from 'three';

export class ContactThreeEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.networkNodes = [];
        this.networkConnections = [];
        this.flowingParticles = null;
        this.ambientStars = null;
        this.floatingOrbs = [];
        this.energyPulses = [];
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        this.time = 0;
        this.isVisible = false;

        // Neural color palette (unified)
        this.neuralColors = {
            primary: new THREE.Color(0x64B5F6),   // --neural-primary
            cyan: new THREE.Color(0x00ffff),      // --neural-cyan
            purple: new THREE.Color(0xaa44ff),    // --neural-purple
            spark: new THREE.Color(0xFF6B35)      // --neural-spark
        };

        // Mobile detection for performance
        this.isMobile = window.innerWidth <= 768;
        this.isLowPower = window.innerWidth <= 480;
        this.particleMultiplier = this.isLowPower ? 0.3 : (this.isMobile ? 0.5 : 1);

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.z = 50;

        // Renderer - optimized for mobile
        this.renderer = new THREE.WebGLRenderer({
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: this.isMobile ? 'low-power' : 'high-performance'
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.pointerEvents = 'none';

        // Create elegant effects
        this.createAmbientStars();
        this.createNetworkVisualization();
        this.createFlowingParticles();
        this.createFloatingOrbs();

        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Intersection observer for performance
        this.setupIntersectionObserver();

        // Start animation
        this.animate();
    }

    createAmbientStars() {
        const count = Math.floor(80 * this.particleMultiplier);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const twinklePhases = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 150;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = -40 - Math.random() * 30;

            sizes[i] = 0.2 + Math.random() * 0.5;
            twinklePhases[i] = Math.random() * Math.PI * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('twinklePhase', new THREE.BufferAttribute(twinklePhases, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                attribute float twinklePhase;
                uniform float time;
                uniform float pixelRatio;
                varying float vTwinkle;

                void main() {
                    vTwinkle = 0.4 + 0.4 * sin(time * 1.2 + twinklePhase);

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * (80.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vTwinkle;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vTwinkle * smoothstep(0.5, 0.0, dist) * 0.5;
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.ambientStars = new THREE.Points(geometry, material);
        this.scene.add(this.ambientStars);
    }

    createNetworkVisualization() {
        // Create elegant network nodes
        const nodePositions = [
            { x: -20, y: 12, z: 0 },
            { x: 20, y: 12, z: 0 },
            { x: 0, y: -8, z: 5 },
            { x: -25, y: -15, z: 3 },
            { x: 25, y: -15, z: 3 },
            { x: 0, y: 22, z: -5 },
            { x: -12, y: 0, z: 8 },
            { x: 12, y: 0, z: 8 },
        ];

        // Create glowing nodes
        nodePositions.forEach((pos, i) => {
            const nodeGroup = new THREE.Group();

            // Core sphere with shader
            const coreGeo = new THREE.SphereGeometry(1, 24, 24);
            const coreMat = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    phase: { value: Math.random() * Math.PI * 2 }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform float phase;
                    varying vec3 vNormal;

                    void main() {
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                        float pulse = 0.6 + 0.3 * sin(time * 2.0 + phase);

                        // Neural colors - mix cyan and primary
                        vec3 neuralCyan = vec3(0.0, 1.0, 1.0);
                        vec3 neuralPrimary = vec3(0.392, 0.71, 0.965);
                        vec3 color = mix(neuralCyan, neuralPrimary, 0.3 + fresnel * 0.3);
                        float alpha = (0.4 + fresnel * 0.5) * pulse;

                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const core = new THREE.Mesh(coreGeo, coreMat);
            nodeGroup.add(core);

            // Outer glow ring
            const ringGeo = new THREE.RingGeometry(1.5, 1.8, 32);
            const ringMat = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    phase: { value: Math.random() * Math.PI * 2 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform float phase;
                    varying vec2 vUv;

                    void main() {
                        float pulse = 0.5 + 0.3 * sin(time * 1.5 + phase);
                        float ring = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

                        // Neural purple accent for rings
                        vec3 neuralPurple = vec3(0.667, 0.267, 1.0);
                        vec3 neuralCyan = vec3(0.0, 1.0, 1.0);
                        vec3 color = mix(neuralCyan, neuralPurple, 0.3);
                        float alpha = ring * pulse * 0.3;

                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeo, ringMat);
            nodeGroup.add(ring);

            nodeGroup.position.set(pos.x, pos.y, pos.z);
            nodeGroup.userData = {
                originalPos: { ...pos },
                pulsePhase: Math.random() * Math.PI * 2,
                floatPhase: Math.random() * Math.PI * 2
            };

            this.networkNodes.push(nodeGroup);
            this.scene.add(nodeGroup);
        });

        // Create elegant connections
        this.createNetworkConnections();
    }

    createNetworkConnections() {
        const connectionPairs = [
            [0, 1], [0, 2], [1, 2], [0, 3], [1, 4],
            [2, 3], [2, 4], [3, 4], [0, 5], [1, 5],
            [5, 2], [6, 7], [6, 0], [7, 1], [6, 2], [7, 2]
        ];

        connectionPairs.forEach(([i, j]) => {
            const nodeA = this.networkNodes[i];
            const nodeB = this.networkNodes[j];

            // Create gradient line
            const points = [];
            const segments = 20;

            for (let s = 0; s <= segments; s++) {
                const t = s / segments;
                points.push(new THREE.Vector3(
                    nodeA.position.x + (nodeB.position.x - nodeA.position.x) * t,
                    nodeA.position.y + (nodeB.position.y - nodeA.position.y) * t,
                    nodeA.position.z + (nodeB.position.z - nodeA.position.z) * t
                ));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    phase: { value: Math.random() * Math.PI * 2 }
                },
                vertexShader: `
                    varying float vProgress;
                    attribute float progress;

                    void main() {
                        vProgress = position.x;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform float phase;

                    void main() {
                        // Neural primary color for connections
                        vec3 neuralPrimary = vec3(0.392, 0.71, 0.965);
                        float pulse = 0.5 + 0.3 * sin(time * 2.0 + phase);
                        float alpha = 0.12 * pulse;

                        gl_FragColor = vec4(neuralPrimary, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const line = new THREE.Line(geometry, material);
            line.userData = { nodeA: i, nodeB: j, phase: Math.random() * Math.PI * 2 };

            this.networkConnections.push(line);
            this.scene.add(line);

            // Create energy pulse traveling along connection
            this.createEnergyPulse(nodeA.position, nodeB.position);
        });
    }

    createEnergyPulse(startPos, endPos) {
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        // Use neural colors for pulses
        const pulseColors = [0x64B5F6, 0x00ffff, 0xaa44ff];
        const material = new THREE.MeshBasicMaterial({
            color: pulseColors[Math.floor(Math.random() * pulseColors.length)],
            transparent: true,
            opacity: 0.8
        });

        const pulse = new THREE.Mesh(geometry, material);
        pulse.userData = {
            startPos: startPos.clone(),
            endPos: endPos.clone(),
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.004,
            direction: Math.random() > 0.5 ? 1 : -1
        };

        this.energyPulses.push(pulse);
        this.scene.add(pulse);
    }

    createFlowingParticles() {
        const count = Math.floor(100 * this.particleMultiplier);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const phases = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;

            // Cyan to blue gradient
            const hue = 0.5 + Math.random() * 0.1;
            const color = new THREE.Color();
            color.setHSL(hue, 0.8, 0.55);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = 0.6 + Math.random() * 1.2;
            phases[i] = Math.random() * Math.PI * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute vec3 color;
                attribute float size;
                attribute float phase;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;

                    vec3 pos = position;
                    pos.x += sin(time * 0.4 + phase) * 3.0;
                    pos.y += cos(time * 0.3 + phase * 0.5) * 2.0;

                    vAlpha = 0.3 + 0.25 * sin(time * 1.5 + phase);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (120.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
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

        this.flowingParticles = new THREE.Points(geometry, material);
        this.scene.add(this.flowingParticles);
    }

    createFloatingOrbs() {
        const count = Math.floor(4 * this.particleMultiplier);

        for (let i = 0; i < count; i++) {
            const size = 2.5 + Math.random() * 3;
            const geometry = new THREE.SphereGeometry(size, 24, 24);

            const hue = 0.5 + Math.random() * 0.1;
            const color = new THREE.Color();
            color.setHSL(hue, 0.75, 0.5);

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: color },
                    phase: { value: Math.random() * Math.PI * 2 }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    uniform float phase;
                    varying vec3 vNormal;

                    void main() {
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
                        float pulse = 0.5 + 0.3 * sin(time * 1.5 + phase);
                        float alpha = fresnel * pulse * 0.3;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.BackSide
            });

            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 25 - 15
            );

            orb.userData = {
                originalPos: orb.position.clone(),
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.2 + Math.random() * 0.2,
                floatAmplitude: 4 + Math.random() * 4
            };

            this.floatingOrbs.push(orb);
            this.scene.add(orb);
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                });
            },
            { threshold: 0.1 }
        );

        const section = document.getElementById('contact');
        if (section) observer.observe(section);
    }

    onMouseMove(event) {
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onResize() {
        if (!this.container) return;

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

        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.04;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.04;

        // Animate ambient stars
        if (this.ambientStars) {
            this.ambientStars.material.uniforms.time.value = this.time;
            this.ambientStars.rotation.y += 0.00008;
        }

        // Animate network nodes
        this.networkNodes.forEach((node, i) => {
            const phase = node.userData.pulsePhase;
            const floatPhase = node.userData.floatPhase;

            // Subtle floating
            node.position.y = node.userData.originalPos.y +
                Math.sin(this.time * 0.5 + floatPhase) * 1.5;

            // Update shader time
            node.children.forEach(child => {
                if (child.material.uniforms) {
                    child.material.uniforms.time.value = this.time;
                }
            });
        });

        // Animate connections
        this.networkConnections.forEach(line => {
            if (line.material.uniforms) {
                line.material.uniforms.time.value = this.time;
            }
        });

        // Animate energy pulses
        this.energyPulses.forEach(pulse => {
            const data = pulse.userData;

            data.progress += data.speed * data.direction;

            if (data.progress > 1) {
                data.progress = 0;
            } else if (data.progress < 0) {
                data.progress = 1;
            }

            // Lerp position
            pulse.position.lerpVectors(data.startPos, data.endPos, data.progress);

            // Pulse opacity
            pulse.material.opacity = 0.3 + Math.sin(data.progress * Math.PI) * 0.5;
        });

        // Animate flowing particles
        if (this.flowingParticles) {
            this.flowingParticles.material.uniforms.time.value = this.time;
        }

        // Animate floating orbs
        this.floatingOrbs.forEach(orb => {
            const ud = orb.userData;
            orb.position.y = ud.originalPos.y +
                Math.sin(this.time * ud.floatSpeed + ud.floatPhase) * ud.floatAmplitude;
            orb.position.x = ud.originalPos.x +
                Math.cos(this.time * ud.floatSpeed * 0.6 + ud.floatPhase) * ud.floatAmplitude * 0.4;
            orb.material.uniforms.time.value = this.time;
        });

        // Camera follows mouse
        this.camera.position.x += (this.mouse.x * 6 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 4 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.ambientStars) {
            this.ambientStars.geometry.dispose();
            this.ambientStars.material.dispose();
        }

        if (this.flowingParticles) {
            this.flowingParticles.geometry.dispose();
            this.flowingParticles.material.dispose();
        }

        this.networkNodes.forEach(node => {
            node.children.forEach(child => {
                child.geometry.dispose();
                child.material.dispose();
            });
        });

        this.networkConnections.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
        });

        this.energyPulses.forEach(pulse => {
            pulse.geometry.dispose();
            pulse.material.dispose();
        });

        this.floatingOrbs.forEach(orb => {
            orb.geometry.dispose();
            orb.material.dispose();
        });

        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('contact-three-container');
    if (container) {
        new ContactThreeEngine('contact-three-container');
    }
});
