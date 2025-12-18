/**
 * Contact Section Three.js Engine
 * Neural Network Particle System - Particles flowing between contact nodes
 */

import * as THREE from 'three';

export class ContactThreeEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.connections = [];
        this.nodes = [];
        this.flowingParticles = [];
        this.mouse = new THREE.Vector2();
        this.time = 0;
        this.isVisible = false;

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.z = 50;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Create elements
        this.createNeuralNetwork();
        this.createFlowingParticles();
        this.createAmbientParticles();

        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Intersection observer for performance
        this.setupIntersectionObserver();

        // Start animation
        this.animate();
    }

    createNeuralNetwork() {
        // Create nodes at strategic positions
        const nodePositions = [
            { x: -25, y: 15, z: 0 },   // Email
            { x: 25, y: 15, z: 0 },    // LinkedIn
            { x: 0, y: -10, z: 0 },    // GitHub
            { x: -20, y: -20, z: 5 },  // Extra node
            { x: 20, y: -20, z: 5 },   // Extra node
            { x: 0, y: 25, z: -5 },    // Center top
        ];

        // Node geometry
        const nodeGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
        });

        // Create nodes
        nodePositions.forEach((pos, i) => {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            node.position.set(pos.x, pos.y, pos.z);
            node.userData = {
                originalPos: { ...pos },
                pulsePhase: Math.random() * Math.PI * 2
            };
            this.scene.add(node);
            this.nodes.push(node);

            // Add glow ring
            const ringGeometry = new THREE.RingGeometry(1.2, 1.5, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(node.position);
            ring.userData = { parent: node };
            this.scene.add(ring);
        });

        // Create connections between nodes
        this.createConnections();
    }

    createConnections() {
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.15
        });

        // Connect nodes in a network pattern
        const connectionPairs = [
            [0, 1], [0, 2], [1, 2], [0, 3], [1, 4],
            [2, 3], [2, 4], [3, 4], [0, 5], [1, 5], [5, 2]
        ];

        connectionPairs.forEach(([i, j]) => {
            const geometry = new THREE.BufferGeometry();
            const points = [
                this.nodes[i].position.clone(),
                this.nodes[j].position.clone()
            ];
            geometry.setFromPoints(points);

            const line = new THREE.Line(geometry, connectionMaterial.clone());
            line.userData = { nodeA: i, nodeB: j };
            this.scene.add(line);
            this.connections.push(line);
        });
    }

    createFlowingParticles() {
        // Particles that flow along connections
        const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);

        this.connections.forEach((connection, idx) => {
            // Create multiple particles per connection
            for (let i = 0; i < 3; i++) {
                const particleMaterial = new THREE.MeshBasicMaterial({
                    color: idx % 2 === 0 ? 0x00ffff : 0xff00ff,
                    transparent: true,
                    opacity: 0.8
                });

                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                particle.userData = {
                    connectionIndex: idx,
                    progress: Math.random(),
                    speed: 0.002 + Math.random() * 0.003,
                    direction: Math.random() > 0.5 ? 1 : -1
                };

                this.scene.add(particle);
                this.flowingParticles.push(particle);
            }
        });
    }

    createAmbientParticles() {
        // Background floating particles
        const particleCount = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            // Cyan to magenta gradient
            const t = Math.random();
            colors[i * 3] = t < 0.5 ? 0 : 1;
            colors[i * 3 + 1] = t < 0.5 ? 1 : 0;
            colors[i * 3 + 2] = 1;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
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

        const section = document.getElementById('contact');
        if (section) observer.observe(section);
    }

    onMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
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

        // Animate nodes (pulse effect)
        this.nodes.forEach((node, i) => {
            const phase = node.userData.pulsePhase;
            const scale = 1 + Math.sin(this.time * 2 + phase) * 0.2;
            node.scale.setScalar(scale);

            // Subtle floating
            node.position.y = node.userData.originalPos.y + Math.sin(this.time + i) * 0.5;
        });

        // Animate flowing particles along connections
        this.flowingParticles.forEach(particle => {
            const data = particle.userData;
            const connection = this.connections[data.connectionIndex];

            if (connection) {
                const nodeA = this.nodes[connection.userData.nodeA];
                const nodeB = this.nodes[connection.userData.nodeB];

                data.progress += data.speed * data.direction;

                if (data.progress > 1) {
                    data.progress = 0;
                    data.direction = 1;
                } else if (data.progress < 0) {
                    data.progress = 1;
                    data.direction = -1;
                }

                // Lerp position
                particle.position.lerpVectors(nodeA.position, nodeB.position, data.progress);

                // Pulse opacity based on position
                particle.material.opacity = 0.3 + Math.sin(data.progress * Math.PI) * 0.7;
            }
        });

        // Animate connection opacity
        this.connections.forEach((line, i) => {
            line.material.opacity = 0.1 + Math.sin(this.time + i * 0.5) * 0.1;
        });

        // Animate ambient particles
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(this.time + positions[i] * 0.1) * 0.02;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.rotation.y = this.time * 0.05;
        }

        // Camera follows mouse slightly
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

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('contact-three-container');
    if (container) {
        new ContactThreeEngine('contact-three-container');
    }
});
