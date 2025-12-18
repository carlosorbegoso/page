/**
 * Experience Section Three.js Engine
 * Holographic Timeline with Rising Particles
 */

import * as THREE from 'three';

export class ExperienceThreeEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.dataStreams = [];
        this.hologramRings = [];
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
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 30;

        // Renderer - optimized for mobile
        this.renderer = new THREE.WebGLRenderer({
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: this.isMobile ? 'low-power' : 'default'
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.container.appendChild(this.renderer.domElement);

        // Create effects
        this.createRisingParticles();
        this.createDataStreams();
        this.createHologramRings();
        this.createGridFloor();

        // Events
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        this.setupIntersectionObserver();
        this.animate();
    }

    createRisingParticles() {
        const particleCount = Math.floor(200 * this.particleMultiplier);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Position along a vertical column
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = Math.random() * 80 - 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            velocities[i] = 0.02 + Math.random() * 0.05;

            // Cyan to purple gradient
            const t = Math.random();
            colors[i * 3] = t * 0.5;           // R
            colors[i * 3 + 1] = 1 - t * 0.3;   // G
            colors[i * 3 + 2] = 1;             // B
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createDataStreams() {
        // Vertical data streams like Matrix but more subtle
        const streamCount = 8;

        for (let i = 0; i < streamCount; i++) {
            const geometry = new THREE.BufferGeometry();
            const points = [];
            const segmentCount = 20;

            const xPos = (i - streamCount / 2) * 8;

            for (let j = 0; j < segmentCount; j++) {
                points.push(new THREE.Vector3(
                    xPos + (Math.random() - 0.5) * 2,
                    j * 3 - 30,
                    (Math.random() - 0.5) * 10
                ));
            }

            geometry.setFromPoints(points);

            const material = new THREE.LineBasicMaterial({
                color: i % 2 === 0 ? 0x00ffff : 0xff00ff,
                transparent: true,
                opacity: 0.2
            });

            const line = new THREE.Line(geometry, material);
            line.userData = {
                originalPoints: points.map(p => p.clone()),
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5
            };

            this.scene.add(line);
            this.dataStreams.push(line);
        }
    }

    createHologramRings() {
        // Horizontal hologram rings at different heights
        const ringPositions = [-20, -5, 10, 25];

        ringPositions.forEach((y, i) => {
            const geometry = new THREE.TorusGeometry(15 + i * 3, 0.1, 8, 64);
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00ffff : 0xff00ff,
                transparent: true,
                opacity: 0.15,
                wireframe: true
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.position.y = y;
            ring.rotation.x = Math.PI / 2;
            ring.userData = {
                rotationSpeed: 0.002 * (i % 2 === 0 ? 1 : -1),
                pulsePhase: i * 0.5
            };

            this.scene.add(ring);
            this.hologramRings.push(ring);
        });
    }

    createGridFloor() {
        // Perspective grid floor
        const gridHelper = new THREE.GridHelper(100, 50, 0x00ffff, 0x00ffff);
        gridHelper.position.y = -35;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.1;
        this.scene.add(gridHelper);

        // Secondary grid for depth
        const gridHelper2 = new THREE.GridHelper(100, 25, 0xff00ff, 0xff00ff);
        gridHelper2.position.y = -35;
        gridHelper2.material.transparent = true;
        gridHelper2.material.opacity = 0.05;
        this.scene.add(gridHelper2);
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

        this.time += 0.01;

        // Animate rising particles
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            const velocities = this.particles.geometry.attributes.velocity.array;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3 + 1] += velocities[i];

                // Reset when reaching top
                if (positions[i * 3 + 1] > 40) {
                    positions[i * 3 + 1] = -40;
                    positions[i * 3] = (Math.random() - 0.5) * 60;
                }

                // Slight horizontal drift
                positions[i * 3] += Math.sin(this.time + i) * 0.01;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate data streams
        this.dataStreams.forEach((stream, i) => {
            const positions = stream.geometry.attributes.position.array;
            const { originalPoints, phase, speed } = stream.userData;

            for (let j = 0; j < originalPoints.length; j++) {
                const idx = j * 3;
                positions[idx] = originalPoints[j].x + Math.sin(this.time * speed + j * 0.5 + phase) * 2;
                positions[idx + 2] = originalPoints[j].z + Math.cos(this.time * speed + j * 0.3 + phase) * 1;
            }

            stream.geometry.attributes.position.needsUpdate = true;

            // Pulse opacity
            stream.material.opacity = 0.1 + Math.sin(this.time + i) * 0.1;
        });

        // Animate hologram rings
        this.hologramRings.forEach((ring, i) => {
            ring.rotation.z += ring.userData.rotationSpeed;

            // Pulse effect
            const pulse = 1 + Math.sin(this.time * 2 + ring.userData.pulsePhase) * 0.1;
            ring.scale.setScalar(pulse);

            ring.material.opacity = 0.1 + Math.sin(this.time + i) * 0.08;
        });

        // Camera subtle movement
        this.camera.position.x += (this.mouse.x * 3 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.02;
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

// Auto-initialize - DISABLED: floating squares effect looked out of place
// document.addEventListener('DOMContentLoaded', () => {
//     const container = document.getElementById('experience-three-container');
//     if (container) {
//         new ExperienceThreeEngine('experience-three-container');
//     }
// });
