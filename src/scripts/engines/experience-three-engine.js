/**
 * Experience Section Three.js Engine
 * Subtle rising particles and timeline glow effects
 */

import * as THREE from 'three';

export class ExperienceThreeEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.risingParticles = null;
        this.glowSpheres = [];
        this.timelineBeam = null;
        this.ambientStars = null;
        this.time = 0;
        this.isVisible = false;
        this.mouse = new THREE.Vector2();

        // Mobile detection for performance
        this.isMobile = window.innerWidth <= 768;
        this.isLowPower = window.innerWidth <= 480;
        this.particleMultiplier = this.isLowPower ? 0.3 : (this.isMobile ? 0.5 : 1);

        this.init();
    }

    init() {
        // Scene
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

        // Create subtle effects
        this.createRisingParticles();
        this.createGlowSpheres();
        this.createTimelineBeam();
        this.createAmbientStars();

        // Events
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        this.setupIntersectionObserver();
        this.animate();
    }

    createRisingParticles() {
        const particleCount = Math.floor(150 * this.particleMultiplier);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            // Spread particles across the view
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 100 - 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 20;

            // Cyan/blue colors with variation
            const hue = 0.5 + Math.random() * 0.1; // Cyan range
            const color = new THREE.Color();
            color.setHSL(hue, 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = 0.5 + Math.random() * 1.5;
            velocities.push(0.02 + Math.random() * 0.04);
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
                    // Gentle floating motion
                    pos.x += sin(time * 0.3 + position.y * 0.05) * 2.0;
                    pos.z += cos(time * 0.2 + position.x * 0.03) * 1.5;

                    // Pulse alpha based on position
                    vAlpha = 0.3 + 0.3 * sin(time * 1.5 + position.y * 0.1);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (180.0 / -mvPosition.z);
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
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.risingParticles = new THREE.Points(geometry, material);
        this.particleVelocities = velocities;
        this.scene.add(this.risingParticles);
    }

    createGlowSpheres() {
        // Subtle glow spheres that float around
        const count = Math.floor(8 * this.particleMultiplier);

        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(2 + Math.random() * 3, 16, 16);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(i % 2 === 0 ? 0x00ffff : 0x4488ff) }
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
                    varying vec3 vNormal;

                    void main() {
                        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
                        float pulse = 0.5 + 0.3 * sin(time * 2.0);
                        gl_FragColor = vec4(color, intensity * pulse * 0.3);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.BackSide
            });

            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 30 - 15
            );

            sphere.userData = {
                originalY: sphere.position.y,
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.3 + Math.random() * 0.3,
                driftX: (Math.random() - 0.5) * 0.02,
                driftZ: (Math.random() - 0.5) * 0.01
            };

            this.glowSpheres.push(sphere);
            this.scene.add(sphere);
        }
    }

    createTimelineBeam() {
        // Vertical beam of light on the left side (where timeline is)
        const geometry = new THREE.PlaneGeometry(0.5, 100);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
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
                varying vec2 vUv;

                void main() {
                    float dist = abs(vUv.x - 0.5) * 2.0;
                    float beam = exp(-dist * 8.0);

                    // Moving glow effect
                    float wave = sin(vUv.y * 10.0 - time * 2.0) * 0.5 + 0.5;
                    beam *= 0.3 + wave * 0.4;

                    vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(0.3, 0.6, 1.0), vUv.y);
                    gl_FragColor = vec4(color, beam * 0.15);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.timelineBeam = new THREE.Mesh(geometry, material);
        this.timelineBeam.position.set(-35, 0, -10);
        this.scene.add(this.timelineBeam);
    }

    createAmbientStars() {
        const count = Math.floor(80 * this.particleMultiplier);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = -30 - Math.random() * 20;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.3,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        this.ambientStars = new THREE.Points(geometry, material);
        this.scene.add(this.ambientStars);
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

        const section = document.getElementById('experience');
        if (section) observer.observe(section);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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

        // Animate rising particles
        if (this.risingParticles) {
            this.risingParticles.material.uniforms.time.value = this.time;

            const positions = this.risingParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length / 3; i++) {
                // Rise upward
                positions[i * 3 + 1] += this.particleVelocities[i];

                // Reset when too high
                if (positions[i * 3 + 1] > 50) {
                    positions[i * 3 + 1] = -50;
                    positions[i * 3] = (Math.random() - 0.5) * 100;
                }
            }
            this.risingParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate glow spheres
        this.glowSpheres.forEach(sphere => {
            const ud = sphere.userData;

            // Float up and down
            sphere.position.y = ud.originalY + Math.sin(this.time * ud.floatSpeed + ud.floatPhase) * 5;

            // Drift slowly
            sphere.position.x += ud.driftX;
            sphere.position.z += ud.driftZ;

            // Wrap around
            if (sphere.position.x > 50) sphere.position.x = -50;
            if (sphere.position.x < -50) sphere.position.x = 50;

            // Update shader time
            sphere.material.uniforms.time.value = this.time;
        });

        // Animate timeline beam
        if (this.timelineBeam) {
            this.timelineBeam.material.uniforms.time.value = this.time;
        }

        // Rotate ambient stars slowly
        if (this.ambientStars) {
            this.ambientStars.rotation.y += 0.0002;
            this.ambientStars.rotation.x += 0.0001;
        }

        // Camera subtle movement based on mouse
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 3 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('experience-three-container');
    if (container) {
        new ExperienceThreeEngine('experience-three-container');
    }
});
