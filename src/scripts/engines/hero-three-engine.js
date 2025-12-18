/**
 * Hero Three.js Engine - Premium Edition
 * Elegant flowing particles with aurora effect
 */

import * as THREE from 'three';

export class HeroThreeEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.flowingParticles = null;
        this.auroraWaves = [];
        this.floatingOrbs = [];
        this.nebulaClouds = null;
        this.ambientStars = null;
        this.animationId = null;
        this.isInitialized = false;
        this.currentTheme = 'dark';
        this.time = 0;
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);

        // Device detection
        this.isMobile = window.innerWidth <= 768;
        this.isLowPower = window.innerWidth <= 480 ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

        const quality = this.isLowPower ? 0.3 : (this.isMobile ? 0.5 : 1);

        this.config = {
            flowingParticles: {
                count: Math.floor(300 * quality),
                layers: 3
            },
            aurora: {
                waves: this.isMobile ? 2 : 3,
                segments: Math.floor(80 * quality)
            },
            orbs: {
                count: Math.floor(6 * quality)
            },
            nebula: {
                count: Math.floor(40 * quality)
            },
            stars: {
                count: Math.floor(150 * quality)
            }
        };
    }

    async init(containerId = 'hero-particles') {
        try {
            if (typeof THREE === 'undefined') {
                console.warn('Three.js not available');
                return false;
            }

            this.setupScene();
            this.setupCamera();
            this.setupRenderer(containerId);

            // Create premium effects
            this.createAmbientStars();
            this.createFlowingParticles();
            this.createAuroraWaves();
            this.createFloatingOrbs();
            this.createNebulaClouds();

            this.setupEventListeners();
            this.animate();

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Error initializing Hero Three.js Engine:', error);
            return false;
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
    }

    setupRenderer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        this.renderer = new THREE.WebGLRenderer({
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: this.isMobile ? 'low-power' : 'high-performance'
        });

        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.renderer.setClearColor(0x000000, 0);

        container.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '1';
        this.renderer.domElement.style.pointerEvents = 'none';

        this.container = container;
    }

    createAmbientStars() {
        const count = this.config.stars.count;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const twinklePhases = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 2] = -50 - Math.random() * 50;

            sizes[i] = 0.3 + Math.random() * 0.7;
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
                    vTwinkle = 0.5 + 0.5 * sin(time * 1.5 + twinklePhase);

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * (100.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vTwinkle;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vTwinkle * smoothstep(0.5, 0.0, dist) * 0.8;
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

    createFlowingParticles() {
        const count = this.config.flowingParticles.count;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const velocities = new Float32Array(count * 3);
        const phases = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Spread across view with depth variation
            positions[i * 3] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;

            // Cyan to blue gradient colors
            const hue = 0.52 + Math.random() * 0.08;
            const saturation = 0.7 + Math.random() * 0.3;
            const lightness = 0.5 + Math.random() * 0.2;
            const color = new THREE.Color();
            color.setHSL(hue, saturation, lightness);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = 1 + Math.random() * 2;

            // Flow velocities - gentle upward drift
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = 0.01 + Math.random() * 0.03;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

            phases[i] = Math.random() * Math.PI * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

        this.particleVelocities = velocities;

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
                    // Gentle wave motion
                    pos.x += sin(time * 0.5 + phase + position.y * 0.05) * 3.0;
                    pos.z += cos(time * 0.3 + phase) * 2.0;

                    // Pulsing alpha
                    vAlpha = 0.4 + 0.3 * sin(time * 2.0 + phase);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (150.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Soft glow
                    float alpha = vAlpha * smoothstep(0.5, 0.1, dist);
                    vec3 finalColor = vColor + vec3(0.2) * (1.0 - dist * 2.0);

                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.flowingParticles = new THREE.Points(geometry, material);
        this.scene.add(this.flowingParticles);
    }

    createAuroraWaves() {
        const waveCount = this.config.aurora.waves;
        const segments = this.config.aurora.segments;

        for (let w = 0; w < waveCount; w++) {
            const geometry = new THREE.PlaneGeometry(140, 30, segments, 1);

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    waveIndex: { value: w },
                    totalWaves: { value: waveCount }
                },
                vertexShader: `
                    uniform float time;
                    uniform float waveIndex;
                    varying vec2 vUv;
                    varying float vWave;

                    void main() {
                        vUv = uv;

                        vec3 pos = position;

                        // Multiple wave layers
                        float wave1 = sin(uv.x * 6.0 + time * 0.8 + waveIndex * 2.0) * 4.0;
                        float wave2 = sin(uv.x * 3.0 - time * 0.5 + waveIndex) * 2.0;
                        float wave3 = cos(uv.x * 8.0 + time * 1.2) * 1.5;

                        pos.y += wave1 + wave2 + wave3;
                        pos.z += sin(uv.x * 4.0 + time * 0.3) * 3.0;

                        vWave = (wave1 + wave2 + wave3) / 7.5 + 0.5;

                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform float waveIndex;
                    uniform float totalWaves;
                    varying vec2 vUv;
                    varying float vWave;

                    void main() {
                        // Aurora colors - cyan to purple gradient
                        vec3 color1 = vec3(0.0, 0.9, 0.8); // Cyan
                        vec3 color2 = vec3(0.3, 0.5, 1.0); // Blue
                        vec3 color3 = vec3(0.6, 0.2, 0.8); // Purple

                        float t = vUv.x + sin(time * 0.5) * 0.2;
                        vec3 color = mix(color1, color2, smoothstep(0.0, 0.5, t));
                        color = mix(color, color3, smoothstep(0.5, 1.0, t));

                        // Vertical fade
                        float verticalFade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

                        // Wave intensity
                        float intensity = vWave * 0.5 + 0.5;

                        // Edge fade
                        float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);

                        float alpha = verticalFade * intensity * edgeFade * 0.15;
                        alpha *= 1.0 - (waveIndex / totalWaves) * 0.3;

                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });

            const wave = new THREE.Mesh(geometry, material);
            wave.position.set(0, 20 - w * 8, -30 - w * 5);
            wave.rotation.x = -0.3;

            this.auroraWaves.push(wave);
            this.scene.add(wave);
        }
    }

    createFloatingOrbs() {
        const count = this.config.orbs.count;

        for (let i = 0; i < count; i++) {
            const size = 3 + Math.random() * 4;
            const geometry = new THREE.SphereGeometry(size, 32, 32);

            const hue = 0.5 + Math.random() * 0.15;
            const color = new THREE.Color();
            color.setHSL(hue, 0.8, 0.5);

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: color },
                    phase: { value: Math.random() * Math.PI * 2 }
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
                    uniform vec3 color;
                    uniform float phase;
                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {
                        // Fresnel effect for glow
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

                        // Pulsing
                        float pulse = 0.5 + 0.3 * sin(time * 1.5 + phase);

                        // Inner glow
                        float innerGlow = exp(-length(vPosition) * 0.2) * 0.5;

                        float alpha = (fresnel * 0.6 + innerGlow) * pulse;

                        gl_FragColor = vec4(color, alpha * 0.4);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.BackSide
            });

            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 30 - 20
            );

            orb.userData = {
                originalPos: orb.position.clone(),
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.3 + Math.random() * 0.3,
                floatAmplitude: 5 + Math.random() * 5
            };

            this.floatingOrbs.push(orb);
            this.scene.add(orb);
        }
    }

    createNebulaClouds() {
        const count = this.config.nebula.count;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 150;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = -60 - Math.random() * 40;

            // Soft purple/blue colors
            const hue = 0.6 + Math.random() * 0.2;
            const color = new THREE.Color();
            color.setHSL(hue, 0.5, 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = 20 + Math.random() * 40;
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
                attribute vec3 color;
                attribute float size;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;
                    vAlpha = 0.1 + 0.05 * sin(time * 0.5 + position.x * 0.1);

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * (100.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Very soft cloud effect
                    float alpha = vAlpha * smoothstep(0.5, 0.0, dist);

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.nebulaClouds = new THREE.Points(geometry, material);
        this.scene.add(this.nebulaClouds);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());

        // Mouse parallax
        document.addEventListener('mousemove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Touch support
        document.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                this.targetMouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
                this.targetMouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        });
    }

    onWindowResize() {
        if (!this.renderer || !this.camera || !this.container) return;

        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.isInitialized) return;

        this.time += 0.016;

        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Camera parallax
        this.camera.position.x = this.mouse.x * 8;
        this.camera.position.y = this.mouse.y * 5;
        this.camera.lookAt(0, 0, 0);

        // Animate ambient stars
        if (this.ambientStars) {
            this.ambientStars.material.uniforms.time.value = this.time;
            this.ambientStars.rotation.y += 0.0001;
        }

        // Animate flowing particles
        if (this.flowingParticles) {
            this.flowingParticles.material.uniforms.time.value = this.time;

            const positions = this.flowingParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length / 3; i++) {
                // Apply velocities
                positions[i * 3] += this.particleVelocities[i * 3];
                positions[i * 3 + 1] += this.particleVelocities[i * 3 + 1];
                positions[i * 3 + 2] += this.particleVelocities[i * 3 + 2];

                // Wrap around
                if (positions[i * 3 + 1] > 50) {
                    positions[i * 3 + 1] = -50;
                    positions[i * 3] = (Math.random() - 0.5) * 120;
                }
                if (positions[i * 3] > 70) positions[i * 3] = -70;
                if (positions[i * 3] < -70) positions[i * 3] = 70;
            }
            this.flowingParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate aurora waves
        this.auroraWaves.forEach((wave) => {
            wave.material.uniforms.time.value = this.time;
        });

        // Animate floating orbs
        this.floatingOrbs.forEach((orb) => {
            const ud = orb.userData;
            orb.position.y = ud.originalPos.y +
                Math.sin(this.time * ud.floatSpeed + ud.floatPhase) * ud.floatAmplitude;
            orb.position.x = ud.originalPos.x +
                Math.cos(this.time * ud.floatSpeed * 0.7 + ud.floatPhase) * ud.floatAmplitude * 0.5;
            orb.material.uniforms.time.value = this.time;
        });

        // Animate nebula clouds
        if (this.nebulaClouds) {
            this.nebulaClouds.material.uniforms.time.value = this.time;
            this.nebulaClouds.rotation.y += 0.0002;
        }

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        // Theme-based adjustments could be added here
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Dispose geometries and materials
        if (this.flowingParticles) {
            this.flowingParticles.geometry.dispose();
            this.flowingParticles.material.dispose();
        }

        if (this.ambientStars) {
            this.ambientStars.geometry.dispose();
            this.ambientStars.material.dispose();
        }

        if (this.nebulaClouds) {
            this.nebulaClouds.geometry.dispose();
            this.nebulaClouds.material.dispose();
        }

        this.auroraWaves.forEach(wave => {
            wave.geometry.dispose();
            wave.material.dispose();
        });

        this.floatingOrbs.forEach(orb => {
            orb.geometry.dispose();
            orb.material.dispose();
        });

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.flowingParticles = null;
        this.auroraWaves = [];
        this.floatingOrbs = [];
        this.nebulaClouds = null;
        this.ambientStars = null;
        this.isInitialized = false;
    }
}
