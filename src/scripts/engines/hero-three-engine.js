/**
 * Hero Three.js Engine - Neural Mind Edition
 * Elegant neural-inspired particles with flowing aurora effect
 * Unified "Inside the Mind" visual theme
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

        // Neural color palette (unified)
        this.neuralColors = {
            primary: new THREE.Color(0x64B5F6),   // --neural-primary
            cyan: new THREE.Color(0x00ffff),      // --neural-cyan
            purple: new THREE.Color(0xaa44ff),    // --neural-purple
            spark: new THREE.Color(0xFF6B35)      // --neural-spark (accent)
        };

        this.config = {
            flowingParticles: {
                count: Math.floor(250 * quality), // Slightly reduced for cleaner look
                layers: 3
            },
            aurora: {
                waves: this.isMobile ? 2 : 3,
                segments: Math.floor(60 * quality) // Smoother waves
            },
            orbs: {
                count: Math.floor(5 * quality) // Fewer, more impactful orbs
            },
            nebula: {
                count: Math.floor(30 * quality) // Subtle background
            },
            stars: {
                count: Math.floor(120 * quality) // Elegant star field
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
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const twinklePhases = new Float32Array(count);

        // Star colors - mostly white with subtle neural tints
        const starColors = [
            new THREE.Color(1.0, 1.0, 1.0),           // Pure white
            new THREE.Color(0.9, 0.95, 1.0),          // Slight blue tint
            new THREE.Color(0.85, 0.92, 1.0),         // More blue
            this.neuralColors.primary.clone().multiplyScalar(0.3).addScalar(0.7) // Subtle neural
        ];

        for (let i = 0; i < count; i++) {
            // Distribute stars avoiding center
            const angle = Math.random() * Math.PI * 2;
            const radius = 20 + Math.random() * 80;

            positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = -40 - Math.random() * 60; // Deep background

            // Assign colors
            const starColor = starColors[Math.floor(Math.random() * starColors.length)];
            colors[i * 3] = starColor.r;
            colors[i * 3 + 1] = starColor.g;
            colors[i * 3 + 2] = starColor.b;

            // Varied sizes for depth
            sizes[i] = 0.2 + Math.random() * 0.6;
            twinklePhases[i] = Math.random() * Math.PI * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('twinklePhase', new THREE.BufferAttribute(twinklePhases, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute vec3 color;
                attribute float size;
                attribute float twinklePhase;
                uniform float time;
                uniform float pixelRatio;
                varying float vTwinkle;
                varying vec3 vColor;

                void main() {
                    vColor = color;
                    // Slower, more natural twinkle
                    vTwinkle = 0.4 + 0.6 * sin(time * 1.0 + twinklePhase);

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * (80.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vTwinkle;
                varying vec3 vColor;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Softer glow effect
                    float alpha = vTwinkle * smoothstep(0.5, 0.1, dist) * 0.7;
                    gl_FragColor = vec4(vColor, alpha);
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

        // Neural color palette for particles
        const colorPalette = [
            this.neuralColors.primary,
            this.neuralColors.cyan,
            this.neuralColors.purple
        ];

        for (let i = 0; i < count; i++) {
            // Distribute particles in a more organic pattern - avoiding center
            const angle = Math.random() * Math.PI * 2;
            const radius = 15 + Math.random() * 50; // Min 15 units from center
            const heightVariation = (Math.random() - 0.5) * 70;

            positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = heightVariation;
            positions[i * 3 + 2] = -5 - Math.random() * 35; // Depth layers

            // Use neural color palette
            const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            const colorVariation = 0.1 + Math.random() * 0.2;
            colors[i * 3] = baseColor.r * (1 - colorVariation) + colorVariation;
            colors[i * 3 + 1] = baseColor.g * (1 - colorVariation) + colorVariation;
            colors[i * 3 + 2] = baseColor.b * (1 - colorVariation) + colorVariation;

            // Varied sizes for depth perception
            sizes[i] = 0.8 + Math.random() * 1.8;

            // Gentle flowing velocities - like neural signals
            velocities[i * 3] = (Math.random() - 0.5) * 0.015;
            velocities[i * 3 + 1] = 0.008 + Math.random() * 0.02; // Upward drift
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

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
            // Wider, more subtle waves
            const geometry = new THREE.PlaneGeometry(160, 25, segments, 1);

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

                        // Smoother, more organic wave motion
                        float wave1 = sin(uv.x * 4.0 + time * 0.5 + waveIndex * 1.5) * 3.0;
                        float wave2 = sin(uv.x * 2.5 - time * 0.35 + waveIndex) * 2.0;
                        float wave3 = cos(uv.x * 5.0 + time * 0.8) * 1.0;

                        pos.y += wave1 + wave2 + wave3;
                        pos.z += sin(uv.x * 3.0 + time * 0.25) * 2.0;

                        vWave = (wave1 + wave2 + wave3) / 6.0 + 0.5;

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
                        // Neural palette colors - more cohesive
                        vec3 neuralPrimary = vec3(0.392, 0.71, 0.965); // #64B5F6
                        vec3 neuralCyan = vec3(0.0, 1.0, 1.0);          // #00ffff
                        vec3 neuralPurple = vec3(0.667, 0.267, 1.0);    // #aa44ff

                        float t = vUv.x + sin(time * 0.4) * 0.15;
                        vec3 color = mix(neuralCyan, neuralPrimary, smoothstep(0.0, 0.5, t));
                        color = mix(color, neuralPurple, smoothstep(0.5, 1.0, t));

                        // Smoother vertical fade
                        float verticalFade = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.65, vUv.y);

                        // Wave intensity with subtle breathing
                        float intensity = vWave * 0.4 + 0.6;

                        // Wider edge fade for seamless blend
                        float edgeFade = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);

                        // More subtle alpha for elegance
                        float alpha = verticalFade * intensity * edgeFade * 0.12;
                        alpha *= 1.0 - (waveIndex / totalWaves) * 0.25;

                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });

            const wave = new THREE.Mesh(geometry, material);
            // Position waves higher and spread them out more
            wave.position.set(0, 25 - w * 10, -35 - w * 8);
            wave.rotation.x = -0.25;

            this.auroraWaves.push(wave);
            this.scene.add(wave);
        }
    }

    createFloatingOrbs() {
        const count = this.config.orbs.count;

        // Neural colors for orbs
        const orbColors = [
            this.neuralColors.primary,
            this.neuralColors.cyan,
            this.neuralColors.purple
        ];

        for (let i = 0; i < count; i++) {
            // Smaller, more subtle orbs
            const size = 2 + Math.random() * 2.5;
            const geometry = new THREE.SphereGeometry(size, 24, 24);

            // Use neural color palette
            const color = orbColors[i % orbColors.length].clone();

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
                        // Softer fresnel effect
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);

                        // Slower, more subtle pulsing
                        float pulse = 0.6 + 0.2 * sin(time * 1.0 + phase);

                        // Softer inner glow
                        float innerGlow = exp(-length(vPosition) * 0.25) * 0.4;

                        float alpha = (fresnel * 0.5 + innerGlow) * pulse;

                        gl_FragColor = vec4(color, alpha * 0.3);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.BackSide
            });

            const orb = new THREE.Mesh(geometry, material);

            // Position orbs away from center - distributed around edges
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.8;
            const radiusX = 45 + Math.random() * 25;
            const radiusY = 30 + Math.random() * 15;

            orb.position.set(
                Math.cos(angle) * radiusX,
                Math.sin(angle) * radiusY,
                -30 - Math.random() * 20
            );

            orb.userData = {
                originalPos: orb.position.clone(),
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.2 + Math.random() * 0.2, // Slower floating
                floatAmplitude: 4 + Math.random() * 4
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
            // Position nebula clouds away from center
            const angle = Math.random() * Math.PI * 2;
            const radius = 30 + Math.random() * 50; // Min 30 units from center
            positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * 30;
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
