/**
 * Neural Background Engine
 * Global persistent Three.js background for the entire portfolio
 * Creates a unified "Inside the Mind" visual experience
 */

import * as THREE from 'three';

export class NeuralBackgroundEngine {
    constructor(containerId = 'neural-background-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            // Create container if it doesn't exist
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: -1;
                pointer-events: none;
                overflow: hidden;
            `;
            document.body.prepend(this.container);
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.connections = [];
        this.time = 0;
        this.scrollY = 0;
        this.mouse = new THREE.Vector2(0, 0);
        this.isActive = true;

        // Neural color palette (unified)
        this.colors = {
            primary: 0x64B5F6,   // --neural-primary
            cyan: 0x00ffff,      // --neural-cyan
            purple: 0xaa44ff,    // --neural-purple
            spark: 0xFF6B35     // --neural-spark
        };

        // Performance settings
        this.isMobile = window.innerWidth <= 768;
        this.isLowPower = window.innerWidth <= 480 ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

        this.config = {
            particleCount: this.isLowPower ? 60 : (this.isMobile ? 100 : 180),
            connectionDistance: this.isMobile ? 80 : 120,
            maxConnections: this.isLowPower ? 30 : (this.isMobile ? 50 : 100),
            particleSize: this.isMobile ? 2 : 2.5,
            parallaxStrength: 0.02,
            mouseInfluence: 0.3
        };

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.z = 100;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: this.isMobile ? 'low-power' : 'default'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Create neural network
        this.createNeuralParticles();
        this.createSynapticConnections();

        // Events
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
        });

        // Start animation
        this.animate();
    }

    createNeuralParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.config.particleCount * 3);
        const colors = new Float32Array(this.config.particleCount * 3);
        const sizes = new Float32Array(this.config.particleCount);
        const velocities = new Float32Array(this.config.particleCount * 3);

        const colorPalette = [
            new THREE.Color(this.colors.primary),
            new THREE.Color(this.colors.cyan),
            new THREE.Color(this.colors.purple)
        ];

        for (let i = 0; i < this.config.particleCount; i++) {
            const i3 = i * 3;

            // Spread particles across the viewport
            positions[i3] = (Math.random() - 0.5) * 200;
            positions[i3 + 1] = (Math.random() - 0.5) * 200;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;

            // Velocity for subtle movement
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

            // Color from neural palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Size variation
            sizes[i] = this.config.particleSize + Math.random() * 1.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        // Custom shader material for better glow effect
        const material = new THREE.PointsMaterial({
            size: this.config.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createSynapticConnections() {
        // Create a pool of line geometries for connections
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: this.colors.cyan,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        // Pre-create connection lines (will be updated dynamically)
        for (let i = 0; i < this.config.maxConnections; i++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6); // 2 points * 3 coordinates
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const line = new THREE.Line(geometry, connectionMaterial.clone());
            line.visible = false;
            this.scene.add(line);
            this.connections.push(line);
        }
    }

    updateConnections() {
        if (!this.particles) return;

        const positions = this.particles.geometry.attributes.position.array;
        const particleCount = this.config.particleCount;
        let connectionIndex = 0;

        // Reset all connections
        this.connections.forEach(c => c.visible = false);

        // Find nearby particles and create connections
        for (let i = 0; i < particleCount && connectionIndex < this.config.maxConnections; i++) {
            const x1 = positions[i * 3];
            const y1 = positions[i * 3 + 1];
            const z1 = positions[i * 3 + 2];

            for (let j = i + 1; j < particleCount && connectionIndex < this.config.maxConnections; j++) {
                const x2 = positions[j * 3];
                const y2 = positions[j * 3 + 1];
                const z2 = positions[j * 3 + 2];

                const distance = Math.sqrt(
                    (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
                );

                if (distance < this.config.connectionDistance) {
                    const line = this.connections[connectionIndex];
                    const linePositions = line.geometry.attributes.position.array;

                    linePositions[0] = x1;
                    linePositions[1] = y1;
                    linePositions[2] = z1;
                    linePositions[3] = x2;
                    linePositions[4] = y2;
                    linePositions[5] = z2;

                    line.geometry.attributes.position.needsUpdate = true;

                    // Fade opacity based on distance
                    const opacity = 0.15 * (1 - distance / this.config.connectionDistance);
                    line.material.opacity = opacity;
                    line.visible = true;

                    connectionIndex++;
                }
            }
        }
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    onScroll() {
        this.scrollY = window.scrollY;
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isActive) return;

        this.time += 0.005;

        // Animate particles
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            const velocities = this.particles.geometry.attributes.velocity.array;

            for (let i = 0; i < this.config.particleCount; i++) {
                const i3 = i * 3;

                // Apply velocity
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];

                // Add subtle wave motion
                positions[i3] += Math.sin(this.time + i * 0.1) * 0.02;
                positions[i3 + 1] += Math.cos(this.time + i * 0.1) * 0.02;

                // Wrap around screen edges
                if (positions[i3] > 100) positions[i3] = -100;
                if (positions[i3] < -100) positions[i3] = 100;
                if (positions[i3 + 1] > 100) positions[i3 + 1] = -100;
                if (positions[i3 + 1] < -100) positions[i3 + 1] = 100;
            }

            this.particles.geometry.attributes.position.needsUpdate = true;

            // Subtle overall rotation
            this.particles.rotation.y = this.time * 0.05;
        }

        // Update connections periodically (not every frame for performance)
        if (Math.floor(this.time * 100) % 5 === 0) {
            this.updateConnections();
        }

        // Parallax effect on scroll
        const scrollOffset = this.scrollY * this.config.parallaxStrength;
        this.camera.position.y = -scrollOffset;

        // Mouse influence
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;

        this.renderer.render(this.scene, this.camera);
    }

    // Method to update theme (for consistency with other engines)
    updateTheme(theme) {
        // Neural colors stay the same regardless of theme
        // This maintains visual consistency
    }

    dispose() {
        this.isActive = false;
        if (this.renderer) {
            this.renderer.dispose();
            this.container?.removeChild(this.renderer.domElement);
        }
        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
        this.connections.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
        });
    }
}

// Auto-initialize when DOM is ready - DISABLED: floating squares effect looked out of place
// if (typeof window !== 'undefined') {
//     window.addEventListener('DOMContentLoaded', () => {
//         // Only initialize if not in reduced motion mode
//         const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//         if (!prefersReducedMotion) {
//             window.neuralBackground = new NeuralBackgroundEngine();
//         }
//     });
// }
