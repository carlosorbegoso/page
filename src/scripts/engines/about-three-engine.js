/**
 * About Three.js Engine
 * Renders animated profile rings, floating particles, and glow effects
 * Replaces CSS animations in About.astro
 */

import * as THREE from 'three';

export class AboutThreeEngine {
    constructor() {
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.rings = [];
        this.particles = null;
        this.glowSphere = null;
        this.floatingIcons = [];
        this.mouse = { x: 0, y: 0 };
        this.isVisible = false;
        this.animationId = null;
        this.clock = new THREE.Clock();
    }

    async init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`About container #${containerId} not found`);
            return false;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createProfileRings();
        this.createGlowSphere();
        this.createFloatingParticles();
        this.createFloatingOrbs();
        this.setupEventListeners();
        this.setupIntersectionObserver();

        return true;
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.z = 25;
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

    createProfileRings() {
        const ringConfigs = [
            { radius: 5, tubeRadius: 0.08, color: 0x64B5F6, speed: 0.5, rotationAxis: 'x' },
            { radius: 5.5, tubeRadius: 0.06, color: 0xFF6B35, speed: -0.3, rotationAxis: 'y' },
            { radius: 6, tubeRadius: 0.04, color: 0x00FFFF, speed: 0.4, rotationAxis: 'z' }
        ];

        const ringGroup = new THREE.Group();
        ringGroup.position.set(-8, 0, 0);

        ringConfigs.forEach((config, index) => {
            const geometry = new THREE.TorusGeometry(config.radius, config.tubeRadius, 16, 100);

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color(config.color) },
                    uOpacity: { value: 0.6 }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    varying vec3 vNormal;

                    void main() {
                        vPosition = position;
                        vNormal = normal;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float uTime;
                    uniform vec3 uColor;
                    uniform float uOpacity;
                    varying vec3 vPosition;
                    varying vec3 vNormal;

                    void main() {
                        float angle = atan(vPosition.y, vPosition.x);
                        float wave = sin(angle * 8.0 + uTime * 2.0) * 0.5 + 0.5;
                        float alpha = uOpacity * (0.5 + wave * 0.5);

                        vec3 finalColor = uColor * (0.8 + wave * 0.4);
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const ring = new THREE.Mesh(geometry, material);

            // Initial rotation
            ring.rotation.x = index * 0.3;
            ring.rotation.y = index * 0.2;

            ring.userData = {
                speed: config.speed,
                rotationAxis: config.rotationAxis,
                phase: index * Math.PI / 3
            };

            this.rings.push(ring);
            ringGroup.add(ring);
        });

        this.scene.add(ringGroup);
        this.ringGroup = ringGroup;
    }

    createGlowSphere() {
        const geometry = new THREE.SphereGeometry(4, 32, 32);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color(0x64B5F6) },
                uColor2: { value: new THREE.Color(0xFF6B35) }
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
                uniform float uTime;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                    float pulse = 0.7 + 0.3 * sin(uTime * 0.8);

                    vec3 color = mix(uColor1, uColor2, fresnel);
                    float alpha = fresnel * 0.4 * pulse;

                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.glowSphere = new THREE.Mesh(geometry, material);
        this.glowSphere.position.set(-8, 0, 0);
        this.scene.add(this.glowSphere);
    }

    createFloatingParticles() {
        const particleCount = 80;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = [];

        const colorPalette = [
            new THREE.Color(0x64B5F6),
            new THREE.Color(0xFF6B35),
            new THREE.Color(0x00FFFF),
            new THREE.Color(0xAA44FF)
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Distribute particles around the profile area
            const angle = Math.random() * Math.PI * 2;
            const radius = 7 + Math.random() * 8;

            positions[i3] = Math.cos(angle) * radius - 8;
            positions[i3 + 1] = (Math.random() - 0.5) * 15;
            positions[i3 + 2] = Math.sin(angle) * radius * 0.3 - 5;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 0.4 + 0.1;

            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.01
            });
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

                    // Floating animation
                    pos.y += sin(uTime + position.x * 0.5) * 0.3;
                    pos.x += cos(uTime * 0.7 + position.y * 0.3) * 0.2;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
                    alpha *= 0.7;

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.particles.userData.velocities = velocities;
        this.scene.add(this.particles);
    }

    createFloatingOrbs() {
        const orbConfigs = [
            { position: { x: 10, y: 5, z: -5 }, color: 0x64B5F6, size: 1 },
            { position: { x: 12, y: -3, z: -3 }, color: 0xFF6B35, size: 0.8 },
            { position: { x: 8, y: -6, z: -4 }, color: 0x00FFFF, size: 0.6 }
        ];

        orbConfigs.forEach((config, index) => {
            const geometry = new THREE.SphereGeometry(config.size, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.5
            });

            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(config.position.x, config.position.y, config.position.z);
            orb.userData = {
                originalPosition: { ...config.position },
                phase: index * Math.PI * 0.66
            };

            // Add glow
            const glowGeometry = new THREE.SphereGeometry(config.size * 2, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.15,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            orb.add(glow);

            this.floatingIcons.push(orb);
            this.scene.add(orb);
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible && !this.animationId) {
                    this.animate();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(this.container);
    }

    handleResize() {
        if (!this.container) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        if (!this.isVisible) {
            this.animationId = null;
            return;
        }

        this.animationId = requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Animate rings
        this.rings.forEach((ring) => {
            const { speed, rotationAxis, phase } = ring.userData;

            switch (rotationAxis) {
                case 'x':
                    ring.rotation.x += speed * 0.01;
                    break;
                case 'y':
                    ring.rotation.y += speed * 0.01;
                    break;
                case 'z':
                    ring.rotation.z += speed * 0.01;
                    break;
            }

            ring.material.uniforms.uTime.value = time;
        });

        // Animate glow sphere
        if (this.glowSphere) {
            this.glowSphere.material.uniforms.uTime.value = time;
            this.glowSphere.rotation.y = time * 0.1;
        }

        // Animate particles
        if (this.particles) {
            this.particles.material.uniforms.uTime.value = time;
        }

        // Animate floating orbs
        this.floatingIcons.forEach((orb) => {
            const { originalPosition, phase } = orb.userData;
            orb.position.y = originalPosition.y + Math.sin(time + phase) * 0.5;
            orb.position.x = originalPosition.x + Math.cos(time * 0.5 + phase) * 0.3;
        });

        // Subtle ring group rotation based on mouse
        if (this.ringGroup) {
            this.ringGroup.rotation.y += (this.mouse.x * 0.1 - this.ringGroup.rotation.y) * 0.02;
            this.ringGroup.rotation.x += (this.mouse.y * 0.1 - this.ringGroup.rotation.x) * 0.02;
        }

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        const isDark = theme === 'dark';
        const primaryColor = isDark ? 0x64B5F6 : 0x2196F3;
        const accentColor = isDark ? 0xFF6B35 : 0xFF5722;

        if (this.glowSphere) {
            this.glowSphere.material.uniforms.uColor1.value.setHex(primaryColor);
            this.glowSphere.material.uniforms.uColor2.value.setHex(accentColor);
        }
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.rings.forEach(ring => {
            ring.geometry.dispose();
            ring.material.dispose();
        });

        if (this.glowSphere) {
            this.glowSphere.geometry.dispose();
            this.glowSphere.material.dispose();
        }

        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }

        this.floatingIcons.forEach(orb => {
            orb.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });

        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }
}
