/**
 * Experience Section Three.js Engine
 * Elegant timeline effect with flowing energy and subtle particles
 */

import * as THREE from 'three';

export class ExperienceThreeEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.flowingParticles = null;
        this.timelineEnergy = null;
        this.floatingOrbs = [];
        this.ambientStars = null;
        this.time = 0;
        this.isVisible = false;
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();

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

        // Create elegant effects
        this.createAmbientStars();
        this.createFlowingParticles();
        this.createTimelineEnergy();
        this.createFloatingOrbs();

        // Events
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        this.setupIntersectionObserver();
        this.animate();
    }

    createAmbientStars() {
        const count = Math.floor(100 * this.particleMultiplier);
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

                    float alpha = vTwinkle * smoothstep(0.5, 0.0, dist) * 0.6;
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
        const particleCount = Math.floor(120 * this.particleMultiplier);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = [];
        const phases = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Spread particles across the view
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 100 - 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15;

            // Cyan/blue colors with variation
            const hue = 0.52 + Math.random() * 0.08;
            const color = new THREE.Color();
            color.setHSL(hue, 0.7, 0.55);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = 0.8 + Math.random() * 1.5;
            velocities.push(0.015 + Math.random() * 0.03);
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
                attribute float size;
                attribute vec3 color;
                attribute float phase;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;

                    vec3 pos = position;
                    // Gentle floating motion
                    pos.x += sin(time * 0.4 + phase + position.y * 0.04) * 2.5;
                    pos.z += cos(time * 0.25 + phase) * 1.8;

                    // Pulse alpha based on position
                    vAlpha = 0.35 + 0.25 * sin(time * 1.8 + phase);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (140.0 / -mvPosition.z);
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
                    vec3 glow = vColor + vec3(0.15) * (1.0 - dist * 2.0);
                    gl_FragColor = vec4(glow, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.flowingParticles = new THREE.Points(geometry, material);
        this.particleVelocities = velocities;
        this.scene.add(this.flowingParticles);
    }

    createTimelineEnergy() {
        // Vertical energy beam on the left side (where timeline is)
        const geometry = new THREE.PlaneGeometry(3, 120, 1, 60);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;

                void main() {
                    vUv = uv;

                    vec3 pos = position;
                    // Subtle wave
                    pos.x += sin(uv.y * 8.0 + time * 2.0) * 0.3;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;

                void main() {
                    // Horizontal gradient (fade at edges)
                    float horizFade = exp(-pow(abs(vUv.x - 0.5) * 4.0, 2.0));

                    // Energy pulses moving upward
                    float pulse1 = sin(vUv.y * 20.0 - time * 3.0) * 0.5 + 0.5;
                    float pulse2 = sin(vUv.y * 15.0 - time * 2.0 + 1.5) * 0.5 + 0.5;
                    float energy = pulse1 * 0.6 + pulse2 * 0.4;

                    // Color gradient (cyan to blue)
                    vec3 color1 = vec3(0.0, 0.9, 0.9);
                    vec3 color2 = vec3(0.3, 0.5, 1.0);
                    vec3 color = mix(color1, color2, vUv.y + sin(time * 0.5) * 0.2);

                    float alpha = horizFade * energy * 0.12;

                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        this.timelineEnergy = new THREE.Mesh(geometry, material);
        this.timelineEnergy.position.set(-38, 0, -10);
        this.scene.add(this.timelineEnergy);
    }

    createFloatingOrbs() {
        // Subtle glow orbs that float around
        const count = Math.floor(5 * this.particleMultiplier);

        for (let i = 0; i < count; i++) {
            const size = 2 + Math.random() * 3;
            const geometry = new THREE.SphereGeometry(size, 24, 24);

            const hue = 0.5 + Math.random() * 0.12;
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
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.8);
                        float pulse = 0.5 + 0.3 * sin(time * 1.8 + phase);
                        float alpha = fresnel * pulse * 0.35;
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
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 25 - 15
            );

            orb.userData = {
                originalPos: orb.position.clone(),
                floatPhase: Math.random() * Math.PI * 2,
                floatSpeed: 0.25 + Math.random() * 0.25,
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

        const section = document.getElementById('experience');
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

        // Animate flowing particles
        if (this.flowingParticles) {
            this.flowingParticles.material.uniforms.time.value = this.time;

            const positions = this.flowingParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length / 3; i++) {
                // Rise upward
                positions[i * 3 + 1] += this.particleVelocities[i];

                // Reset when too high
                if (positions[i * 3 + 1] > 50) {
                    positions[i * 3 + 1] = -50;
                    positions[i * 3] = (Math.random() - 0.5) * 100;
                }
            }
            this.flowingParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate timeline energy
        if (this.timelineEnergy) {
            this.timelineEnergy.material.uniforms.time.value = this.time;
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

        // Camera subtle movement based on mouse
        this.camera.position.x += (this.mouse.x * 6 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 4 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.flowingParticles) {
            this.flowingParticles.geometry.dispose();
            this.flowingParticles.material.dispose();
        }

        if (this.ambientStars) {
            this.ambientStars.geometry.dispose();
            this.ambientStars.material.dispose();
        }

        if (this.timelineEnergy) {
            this.timelineEnergy.geometry.dispose();
            this.timelineEnergy.material.dispose();
        }

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

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('experience-three-container');
    if (container) {
        new ExperienceThreeEngine('experience-three-container');
    }
});
