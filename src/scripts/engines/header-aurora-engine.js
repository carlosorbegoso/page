/**
 * Header Aurora Engine
 * Motor Three.js para efectos espaciales y aurora boreal en el header
 */

import * as THREE from 'three';

export class HeaderAuroraEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.auroraPlane = null;
        this.starField = null;
        this.nebulaClouds = [];
        this.shootingStars = [];
        this.animationId = null;
        this.isInitialized = false;
        this.currentTheme = 'dark';
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollProgress = 0;

        this.config = {
            aurora: {
                intensity: 0.6,
                speed: 0.3,
                waveFrequency: 2.0,
                colorShift: 0.5
            },
            stars: {
                count: 150,
                size: { min: 0.5, max: 2.0 },
                twinkleSpeed: { min: 1.0, max: 3.0 }
            },
            nebula: {
                count: 5,
                size: { min: 30, max: 60 },
                opacity: 0.15
            },
            shootingStars: {
                maxCount: 3,
                spawnRate: 0.005,
                speed: { min: 2, max: 4 }
            }
        };
    }

    async init(containerId = 'header-aurora-container') {
        try {
            if (typeof THREE === 'undefined') {
                console.warn('Three.js not available for Header Aurora Engine');
                return false;
            }

            this.setupScene();
            this.setupCamera();
            this.setupRenderer(containerId);
            this.createAuroraPlane();
            this.createStarField();
            this.createNebulaClouds();
            this.setupEventListeners();
            this.animate();

            this.isInitialized = true;
            console.log('Header Aurora Engine initialized');
            return true;
        } catch (error) {
            console.error('Error initializing Header Aurora Engine:', error);
            return false;
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
        this.camera.position.z = 1;
    }

    setupRenderer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            // Create container if it doesn't exist
            const header = document.querySelector('.header');
            if (header) {
                const newContainer = document.createElement('div');
                newContainer.id = containerId;
                newContainer.style.cssText = `
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                    overflow: hidden;
                `;
                header.insertBefore(newContainer, header.firstChild);
                this.container = newContainer;
            } else {
                console.warn('Header not found');
                return;
            }
        } else {
            this.container = container;
        }

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        this.container.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.cssText = `
            position: absolute;
            inset: 0;
            width: 100% !important;
            height: 100% !important;
        `;
    }

    createAuroraPlane() {
        const geometry = new THREE.PlaneGeometry(2, 2);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, 60) },
                mouseX: { value: 0 },
                scrollProgress: { value: 0 },
                theme: { value: this.currentTheme === 'dark' ? 1.0 : 0.0 },
                intensity: { value: this.config.aurora.intensity }
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
                uniform vec2 resolution;
                uniform float mouseX;
                uniform float scrollProgress;
                uniform float theme;
                uniform float intensity;

                varying vec2 vUv;

                // Simplex noise function
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                // Aurora color palette - cosmic colors
                vec3 getAuroraColor(float t, float theme) {
                    // Cyan/Teal
                    vec3 color1 = vec3(0.0, 0.9, 0.9);
                    // Purple/Magenta
                    vec3 color2 = vec3(0.6, 0.2, 0.9);
                    // Green/Emerald
                    vec3 color3 = vec3(0.2, 0.9, 0.5);
                    // Blue
                    vec3 color4 = vec3(0.3, 0.5, 1.0);
                    // Pink
                    vec3 color5 = vec3(1.0, 0.4, 0.7);

                    t = fract(t);

                    if (t < 0.25) {
                        return mix(color1, color2, t * 4.0);
                    } else if (t < 0.5) {
                        return mix(color2, color3, (t - 0.25) * 4.0);
                    } else if (t < 0.75) {
                        return mix(color3, color4, (t - 0.5) * 4.0);
                    } else {
                        return mix(color4, color5, (t - 0.75) * 4.0);
                    }
                }

                void main() {
                    vec2 uv = vUv;

                    // Multiple aurora layers with different frequencies
                    float aurora = 0.0;

                    // Layer 1 - Main aurora wave
                    float wave1 = snoise(vec2(uv.x * 3.0 + time * 0.1 + mouseX * 0.2, uv.y * 2.0 + time * 0.05));
                    aurora += wave1 * 0.5;

                    // Layer 2 - Secondary wave
                    float wave2 = snoise(vec2(uv.x * 5.0 - time * 0.15, uv.y * 3.0 + time * 0.08));
                    aurora += wave2 * 0.3;

                    // Layer 3 - Fine detail
                    float wave3 = snoise(vec2(uv.x * 8.0 + time * 0.2, uv.y * 4.0 - time * 0.1));
                    aurora += wave3 * 0.2;

                    // Vertical gradient - aurora at bottom of header
                    float verticalFade = pow(1.0 - uv.y, 2.0);

                    // Horizontal variation
                    float horizontalVar = 0.7 + 0.3 * sin(uv.x * 6.28 + time * 0.2);

                    // Combine
                    aurora = aurora * verticalFade * horizontalVar;
                    aurora = smoothstep(0.0, 1.0, aurora + 0.3);

                    // Color based on position and time
                    float colorPhase = uv.x * 0.5 + time * 0.05 + aurora * 0.3;
                    vec3 auroraColor = getAuroraColor(colorPhase, theme);

                    // Add glow effect
                    float glow = exp(-pow(uv.y - 0.8, 2.0) * 20.0);
                    vec3 glowColor = vec3(0.3, 0.7, 1.0) * glow * 0.3;

                    // Final color with intensity
                    vec3 finalColor = auroraColor * aurora * intensity + glowColor;

                    // Alpha based on aurora strength
                    float alpha = aurora * intensity * 0.8;
                    alpha = clamp(alpha, 0.0, 0.7);

                    // Add subtle stars effect
                    float starNoise = snoise(uv * 50.0) * snoise(uv * 100.0);
                    if (starNoise > 0.7) {
                        float starBrightness = (starNoise - 0.7) * 3.0;
                        starBrightness *= (0.7 + 0.3 * sin(time * 5.0 + uv.x * 100.0));
                        finalColor += vec3(1.0) * starBrightness * 0.5;
                        alpha = max(alpha, starBrightness * 0.3);
                    }

                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.auroraPlane = new THREE.Mesh(geometry, material);
        this.scene.add(this.auroraPlane);
    }

    createStarField() {
        const geometry = new THREE.BufferGeometry();
        const count = this.config.stars.count;

        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const phases = new Float32Array(count);
        const twinkleSpeeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
            positions[i * 3 + 2] = 0;

            sizes[i] = Math.random() * (this.config.stars.size.max - this.config.stars.size.min) + this.config.stars.size.min;
            phases[i] = Math.random() * Math.PI * 2;
            twinkleSpeeds[i] = Math.random() * (this.config.stars.twinkleSpeed.max - this.config.stars.twinkleSpeed.min) + this.config.stars.twinkleSpeed.min;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute float phase;
                attribute float twinkleSpeed;
                uniform float time;
                uniform float pixelRatio;
                varying float vOpacity;
                varying float vSize;

                void main() {
                    vSize = size;

                    // Twinkle effect
                    vOpacity = 0.3 + 0.7 * (0.5 + 0.5 * sin(time * twinkleSpeed + phase));

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * 2.0;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vOpacity;
                varying float vSize;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Soft circular star
                    float alpha = vOpacity * smoothstep(0.5, 0.0, dist);

                    // White-blue color for stars
                    vec3 color = vec3(0.9, 0.95, 1.0);

                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.starField = new THREE.Points(geometry, material);
        this.scene.add(this.starField);
    }

    createNebulaClouds() {
        for (let i = 0; i < this.config.nebula.count; i++) {
            const size = Math.random() * (this.config.nebula.size.max - this.config.nebula.size.min) + this.config.nebula.size.min;
            const geometry = new THREE.PlaneGeometry(size / 100, size / 200);

            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: color },
                    opacity: { value: this.config.nebula.opacity }
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
                    uniform vec3 color;
                    uniform float opacity;
                    varying vec2 vUv;

                    void main() {
                        vec2 center = vUv - 0.5;
                        float dist = length(center);

                        // Soft circular gradient
                        float alpha = exp(-dist * dist * 8.0) * opacity;

                        // Subtle pulsing
                        alpha *= 0.8 + 0.2 * sin(time * 0.5);

                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const cloud = new THREE.Mesh(geometry, material);
            cloud.position.x = (Math.random() - 0.5) * 2;
            cloud.position.y = (Math.random() - 0.5) * 2;
            cloud.position.z = -0.1;

            cloud.userData = {
                originalX: cloud.position.x,
                originalY: cloud.position.y,
                driftSpeed: 0.01 + Math.random() * 0.02,
                driftPhase: Math.random() * Math.PI * 2
            };

            this.nebulaClouds.push(cloud);
            this.scene.add(cloud);
        }
    }

    createShootingStar() {
        if (this.shootingStars.length >= this.config.shootingStars.maxCount) return;

        const startX = -1 + Math.random() * 0.5;
        const startY = 0.5 + Math.random() * 0.5;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
            startX, startY, 0,
            startX + 0.15, startY - 0.05, 0
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                progress: { value: 0 }
            },
            vertexShader: `
                varying float vProgress;
                uniform float progress;

                void main() {
                    vProgress = position.x < 0.0 ? 0.0 : 1.0;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float progress;
                varying float vProgress;

                void main() {
                    float alpha = (1.0 - vProgress) * (1.0 - progress);
                    vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.5, 0.8, 1.0), vProgress);
                    gl_FragColor = vec4(color, alpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const line = new THREE.Line(geometry, material);
        line.userData = {
            speed: Math.random() * (this.config.shootingStars.speed.max - this.config.shootingStars.speed.min) + this.config.shootingStars.speed.min,
            progress: 0,
            dirX: 0.8 + Math.random() * 0.4,
            dirY: -0.3 - Math.random() * 0.2
        };

        this.shootingStars.push(line);
        this.scene.add(line);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onResize());

        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollProgress = window.scrollY / maxScroll;
        });
    }

    onResize() {
        if (!this.container || !this.renderer) return;

        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.renderer.setSize(width, height);

        if (this.auroraPlane && this.auroraPlane.material.uniforms.resolution) {
            this.auroraPlane.material.uniforms.resolution.value.set(width, height);
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.isInitialized) return;

        const time = Date.now() * 0.001;

        // Update aurora
        if (this.auroraPlane) {
            this.auroraPlane.material.uniforms.time.value = time;
            this.auroraPlane.material.uniforms.mouseX.value = this.mouseX;
            this.auroraPlane.material.uniforms.scrollProgress.value = this.scrollProgress;
        }

        // Update stars
        if (this.starField) {
            this.starField.material.uniforms.time.value = time;
        }

        // Update nebula clouds
        this.nebulaClouds.forEach(cloud => {
            cloud.material.uniforms.time.value = time;

            // Gentle drift
            const ud = cloud.userData;
            cloud.position.x = ud.originalX + Math.sin(time * ud.driftSpeed + ud.driftPhase) * 0.05;
            cloud.position.y = ud.originalY + Math.cos(time * ud.driftSpeed * 0.7 + ud.driftPhase) * 0.02;
        });

        // Spawn shooting stars
        if (Math.random() < this.config.shootingStars.spawnRate) {
            this.createShootingStar();
        }

        // Update shooting stars
        for (let i = this.shootingStars.length - 1; i >= 0; i--) {
            const star = this.shootingStars[i];
            star.userData.progress += 0.02 * star.userData.speed;

            // Move
            star.position.x += star.userData.dirX * 0.02 * star.userData.speed;
            star.position.y += star.userData.dirY * 0.02 * star.userData.speed;

            star.material.uniforms.progress.value = star.userData.progress;

            // Remove when done
            if (star.userData.progress >= 1) {
                this.scene.remove(star);
                star.geometry.dispose();
                star.material.dispose();
                this.shootingStars.splice(i, 1);
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        this.currentTheme = theme;

        if (this.auroraPlane) {
            this.auroraPlane.material.uniforms.theme.value = theme === 'dark' ? 1.0 : 0.0;
            this.auroraPlane.material.uniforms.intensity.value = theme === 'dark' ? 0.7 : 0.4;
        }
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Dispose shooting stars
        this.shootingStars.forEach(star => {
            this.scene.remove(star);
            star.geometry.dispose();
            star.material.dispose();
        });

        // Dispose nebula clouds
        this.nebulaClouds.forEach(cloud => {
            this.scene.remove(cloud);
            cloud.geometry.dispose();
            cloud.material.dispose();
        });

        if (this.auroraPlane) {
            this.scene.remove(this.auroraPlane);
            this.auroraPlane.geometry.dispose();
            this.auroraPlane.material.dispose();
        }

        if (this.starField) {
            this.scene.remove(this.starField);
            this.starField.geometry.dispose();
            this.starField.material.dispose();
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.isInitialized = false;
    }
}
