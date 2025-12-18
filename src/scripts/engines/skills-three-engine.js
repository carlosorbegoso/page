/**
 * Skills Three.js Engine
 * Renders floating orbs, glowing particles, and orbital effects
 * Replaces CSS animations in Skills.astro
 */

import * as THREE from 'three';

export class SkillsThreeEngine {
    constructor() {
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.orbs = [];
        this.particles = null;
        this.orbitalRings = [];
        this.glowMeshes = [];
        this.mouse = { x: 0, y: 0 };
        this.isVisible = false;
        this.animationId = null;
        this.clock = new THREE.Clock();
    }

    async init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Skills container #${containerId} not found`);
            return false;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createOrbs();
        this.createParticles();
        this.createOrbitalRings();
        this.setupEventListeners();
        this.setupIntersectionObserver();

        return true;
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.z = 30;
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

    createOrbs() {
        const orbConfigs = [
            { color: 0x64B5F6, size: 8, position: { x: -15, y: 10, z: -10 }, speed: 0.3 },
            { color: 0xFF6B35, size: 6, position: { x: 15, y: -8, z: -15 }, speed: 0.4 },
            { color: 0xAA44FF, size: 4, position: { x: 0, y: 0, z: -20 }, speed: 0.5 }
        ];

        orbConfigs.forEach((config, index) => {
            // Create orb with glow effect using custom shader
            const orbGeometry = new THREE.SphereGeometry(config.size, 32, 32);

            const orbMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color(config.color) },
                    uOpacity: { value: 0.15 }
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
                    uniform vec3 uColor;
                    uniform float uOpacity;
                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        float pulse = 0.8 + 0.2 * sin(uTime * 0.5);
                        gl_FragColor = vec4(uColor, uOpacity * intensity * pulse);
                    }
                `,
                transparent: true,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(config.position.x, config.position.y, config.position.z);
            orb.userData = {
                originalPosition: { ...config.position },
                speed: config.speed,
                phase: index * Math.PI * 0.66
            };

            this.orbs.push(orb);
            this.scene.add(orb);
        });
    }

    createParticles() {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const colorPalette = [
            new THREE.Color(0x64B5F6),
            new THREE.Color(0xFF6B35),
            new THREE.Color(0xAA44FF),
            new THREE.Color(0x00FFFF)
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 60;
            positions[i3 + 1] = (Math.random() - 0.5) * 40;
            positions[i3 + 2] = (Math.random() - 0.5) * 30 - 15;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 0.5 + 0.2;
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
                    pos.y += sin(uTime * 0.5 + position.x * 0.1) * 0.5;
                    pos.x += cos(uTime * 0.3 + position.y * 0.1) * 0.3;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha *= 0.6;

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createOrbitalRings() {
        const ringConfigs = [
            { radius: 3, color: 0x64B5F6, speed: 1.0, position: { x: -12, y: 5, z: 0 } },
            { radius: 2.5, color: 0x00FFFF, speed: -0.8, position: { x: 12, y: -5, z: 0 } }
        ];

        ringConfigs.forEach((config, index) => {
            const group = new THREE.Group();
            group.position.set(config.position.x, config.position.y, config.position.z);

            // Dashed ring
            const ringGeometry = new THREE.RingGeometry(config.radius - 0.05, config.radius + 0.05, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            group.add(ring);

            // Orbiting dot
            const dotGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const dotMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.9
            });
            const dot = new THREE.Mesh(dotGeometry, dotMaterial);
            dot.position.x = config.radius;
            dot.userData = {
                radius: config.radius,
                speed: config.speed,
                angle: index * Math.PI
            };
            group.add(dot);

            // Glow for dot
            const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(dot.position);
            dot.userData.glow = glow;
            group.add(glow);

            this.orbitalRings.push({ group, dot, ring });
            this.scene.add(group);
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

        // Animate orbs
        this.orbs.forEach((orb) => {
            const { originalPosition, speed, phase } = orb.userData;
            orb.position.x = originalPosition.x + Math.sin(time * speed + phase) * 3;
            orb.position.y = originalPosition.y + Math.cos(time * speed * 0.7 + phase) * 2;
            orb.position.z = originalPosition.z + Math.sin(time * speed * 0.5 + phase) * 1;
            orb.material.uniforms.uTime.value = time;
        });

        // Animate particles
        if (this.particles) {
            this.particles.material.uniforms.uTime.value = time;
            this.particles.rotation.y = time * 0.02;
        }

        // Animate orbital rings
        this.orbitalRings.forEach(({ dot }) => {
            const { radius, speed, angle, glow } = dot.userData;
            const currentAngle = angle + time * speed;
            dot.position.x = Math.cos(currentAngle) * radius;
            dot.position.y = Math.sin(currentAngle) * radius;
            if (glow) {
                glow.position.copy(dot.position);
            }
        });

        // Subtle camera movement based on mouse
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(theme) {
        const isDark = theme === 'dark';
        const primaryColor = isDark ? 0x64B5F6 : 0x2196F3;

        this.orbs.forEach((orb, index) => {
            const colors = [primaryColor, 0xFF6B35, 0xAA44FF];
            orb.material.uniforms.uColor.value.setHex(colors[index % colors.length]);
        });
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.orbs.forEach(orb => {
            orb.geometry.dispose();
            orb.material.dispose();
        });

        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }

        this.orbitalRings.forEach(({ group }) => {
            group.traverse(child => {
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
