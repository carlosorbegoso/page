/**
 * Loader Three.js Engine
 * Renders animated hexagon, orbiting particles, and loading effects
 * Replaces CSS animations in Layout.astro loader
 */

import * as THREE from 'three';

export class LoaderThreeEngine {
    constructor() {
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.hexagon = null;
        this.orbits = [];
        this.particles = [];
        this.codeSymbol = null;
        this.progress = 0;
        this.targetProgress = 0;
        this.animationId = null;
        this.clock = new THREE.Clock();
        this.onProgressUpdate = null;
        this.isComplete = false;
    }

    async init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Loader container #${containerId} not found`);
            return false;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createHexagon();
        this.createOrbits();
        this.createParticles();
        this.createBackgroundGlow();
        this.animate();

        return true;
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 15;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }

    createHexagon() {
        // Create hexagon shape
        const hexShape = new THREE.Shape();
        const size = 3;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3 - Math.PI / 2;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) {
                hexShape.moveTo(x, y);
            } else {
                hexShape.lineTo(x, y);
            }
        }
        hexShape.closePath();

        // Create hexagon outline with shader
        const points = hexShape.getPoints(6);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Close the hexagon
        const positions = geometry.attributes.position.array;
        const closedPositions = new Float32Array(positions.length + 3);
        closedPositions.set(positions);
        closedPositions[positions.length] = positions[0];
        closedPositions[positions.length + 1] = positions[1];
        closedPositions[positions.length + 2] = positions[2];

        const closedGeometry = new THREE.BufferGeometry();
        closedGeometry.setAttribute('position', new THREE.BufferAttribute(closedPositions, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 },
                uColor1: { value: new THREE.Color(0x64B5F6) },
                uColor2: { value: new THREE.Color(0x00FFFF) },
                uColor3: { value: new THREE.Color(0xFF6B35) }
            },
            vertexShader: `
                varying float vLineProgress;
                attribute float lineProgress;

                void main() {
                    vLineProgress = position.x * 0.5 + 0.5;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform float uProgress;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform vec3 uColor3;
                varying float vLineProgress;

                void main() {
                    float t = uTime * 0.5;
                    vec3 color = mix(uColor1, uColor2, sin(t) * 0.5 + 0.5);
                    color = mix(color, uColor3, sin(t * 0.7 + 2.0) * 0.3 + 0.3);

                    float alpha = 0.8 + sin(uTime * 2.0 + vLineProgress * 6.28) * 0.2;
                    alpha *= smoothstep(0.0, 0.1, uProgress);

                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.hexagon = new THREE.Line(closedGeometry, material);
        this.scene.add(this.hexagon);

        // Add inner glow
        const glowGeometry = new THREE.CircleGeometry(2.5, 6);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0x64B5F6) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor;
                varying vec2 vUv;

                void main() {
                    float dist = length(vUv - 0.5) * 2.0;
                    float alpha = (1.0 - dist) * 0.15;
                    alpha *= 0.8 + sin(uTime) * 0.2;
                    gl_FragColor = vec4(uColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.z = Math.PI / 6;
        this.hexagonGlow = glow;
        this.scene.add(glow);
    }

    createOrbits() {
        const orbitConfigs = [
            { radius: 4.5, speed: 1.0, particleCount: 2, color: 0x64B5F6 },
            { radius: 3.5, speed: -0.8, particleCount: 2, color: 0x00FFFF }
        ];

        orbitConfigs.forEach((config) => {
            const orbitGroup = new THREE.Group();

            // Create orbit ring (invisible path indicator)
            const ringGeometry = new THREE.RingGeometry(config.radius - 0.02, config.radius + 0.02, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            orbitGroup.add(ring);

            // Create orbiting particles
            for (let i = 0; i < config.particleCount; i++) {
                const angle = (i / config.particleCount) * Math.PI * 2;

                // Main particle
                const particleGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                const particleMaterial = new THREE.MeshBasicMaterial({
                    color: config.color,
                    transparent: true,
                    opacity: 0.9
                });
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                particle.position.x = Math.cos(angle) * config.radius;
                particle.position.y = Math.sin(angle) * config.radius;

                // Particle glow
                const glowGeometry = new THREE.SphereGeometry(0.35, 16, 16);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: config.color,
                    transparent: true,
                    opacity: 0.4
                });
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                particle.add(glow);

                particle.userData = {
                    angle: angle,
                    radius: config.radius,
                    speed: config.speed
                };

                this.particles.push(particle);
                orbitGroup.add(particle);
            }

            this.orbits.push(orbitGroup);
            this.scene.add(orbitGroup);
        });
    }

    createParticles() {
        const particleCount = 30;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const colorPalette = [
            new THREE.Color(0x64B5F6),
            new THREE.Color(0x00FFFF),
            new THREE.Color(0xFF6B35)
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 3;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = (Math.random() - 0.5) * 2;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 0.15 + 0.05;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float uTime;
                uniform float uPixelRatio;

                void main() {
                    vColor = color;
                    vec3 pos = position;

                    float angle = atan(pos.y, pos.x) + uTime * 0.2;
                    float radius = length(pos.xy);
                    pos.x = cos(angle) * radius;
                    pos.y = sin(angle) * radius;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * uPixelRatio * (150.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        this.backgroundParticles = new THREE.Points(geometry, material);
        this.scene.add(this.backgroundParticles);
    }

    createBackgroundGlow() {
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                varying vec2 vUv;

                void main() {
                    vec2 center = vUv - 0.5;
                    float dist = length(center);

                    vec3 color1 = vec3(0.392, 0.71, 0.965); // 64B5F6
                    vec3 color2 = vec3(1.0, 0.42, 0.21);    // FF6B35

                    float angle = atan(center.y, center.x) + uTime * 0.1;
                    float wave = sin(angle * 2.0 + uTime) * 0.5 + 0.5;

                    vec3 color = mix(color1, color2, wave);
                    float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * 0.08;
                    alpha *= 0.8 + sin(uTime * 0.5) * 0.2;

                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const bgGlow = new THREE.Mesh(geometry, material);
        bgGlow.position.z = -5;
        this.backgroundGlow = bgGlow;
        this.scene.add(bgGlow);
    }

    setProgress(progress) {
        this.targetProgress = Math.min(progress, 100) / 100;
    }

    setProgressCallback(callback) {
        this.onProgressUpdate = callback;
    }

    animate() {
        if (this.isComplete) {
            return;
        }

        this.animationId = requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Smooth progress animation
        this.progress += (this.targetProgress - this.progress) * 0.05;

        // Update hexagon
        if (this.hexagon) {
            this.hexagon.material.uniforms.uTime.value = time;
            this.hexagon.material.uniforms.uProgress.value = this.progress;
            this.hexagon.rotation.z = time * 0.1;

            // Scale pulse
            const scale = 1 + Math.sin(time * 2) * 0.02;
            this.hexagon.scale.set(scale, scale, 1);
        }

        if (this.hexagonGlow) {
            this.hexagonGlow.material.uniforms.uTime.value = time;
            this.hexagonGlow.rotation.z = this.hexagon.rotation.z;
        }

        // Update orbiting particles
        this.particles.forEach((particle) => {
            const { angle, radius, speed } = particle.userData;
            const currentAngle = angle + time * speed;
            particle.position.x = Math.cos(currentAngle) * radius;
            particle.position.y = Math.sin(currentAngle) * radius;
        });

        // Update background particles
        if (this.backgroundParticles) {
            this.backgroundParticles.material.uniforms.uTime.value = time;
        }

        // Update background glow
        if (this.backgroundGlow) {
            this.backgroundGlow.material.uniforms.uTime.value = time;
        }

        // Callback for progress updates
        if (this.onProgressUpdate) {
            this.onProgressUpdate(Math.round(this.progress * 100));
        }

        this.renderer.render(this.scene, this.camera);
    }

    complete() {
        this.isComplete = true;
        this.targetProgress = 1;

        // Final animation before dispose
        const fadeOut = () => {
            if (this.scene) {
                this.scene.traverse((child) => {
                    if (child.material && child.material.opacity !== undefined) {
                        child.material.opacity *= 0.95;
                    }
                });
                this.renderer.render(this.scene, this.camera);

                if (this.scene.children[0]?.material?.opacity > 0.01) {
                    requestAnimationFrame(fadeOut);
                } else {
                    this.dispose();
                }
            }
        };

        setTimeout(fadeOut, 300);
    }

    handleResize() {
        if (!this.container || !this.renderer) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.hexagon) {
            this.hexagon.geometry.dispose();
            this.hexagon.material.dispose();
        }

        if (this.hexagonGlow) {
            this.hexagonGlow.geometry.dispose();
            this.hexagonGlow.material.dispose();
        }

        this.orbits.forEach(orbit => {
            orbit.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });

        if (this.backgroundParticles) {
            this.backgroundParticles.geometry.dispose();
            this.backgroundParticles.material.dispose();
        }

        if (this.backgroundGlow) {
            this.backgroundGlow.geometry.dispose();
            this.backgroundGlow.material.dispose();
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement.parentNode === this.container) {
                this.container.removeChild(this.renderer.domElement);
            }
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }
}
