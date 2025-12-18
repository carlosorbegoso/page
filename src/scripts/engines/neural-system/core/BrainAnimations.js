/**
 * BrainAnimations - Animaciones avanzadas para el cerebro
 * Efectos de pulso, ondas, partículas neurales
 * Máximo 250 líneas
 */

import * as THREE from 'three';

export class BrainAnimations {
    constructor(neuralGroup, config) {
        this.neuralGroup = neuralGroup;
        this.config = config;

        // Partículas de sinapsis
        this.synapseParticles = null;
        this.particleCount = 150;

        // Ondas de energía
        this.energyWaves = [];

        // Estado de animación
        this.time = 0;
        this.pulsePhase = 0;
    }

    init() {
        this.createSynapseParticles();
        this.createEnergyWaves();
    }

    createSynapseParticles() {
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const velocities = [];

        const color1 = new THREE.Color(this.config.color);
        const color2 = new THREE.Color(this.config.secondaryColor);
        const color3 = new THREE.Color(this.config.accentColor);

        for (let i = 0; i < this.particleCount; i++) {
            // Posición aleatoria dentro del cerebro
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 0.15 + Math.random() * 0.15;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + 0.05;
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Color aleatorio entre los 3 colores futuristas
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.4) color = color1;
            else if (colorChoice < 0.7) color = color2;
            else color = color3;

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = 0.003 + Math.random() * 0.006;

            // Velocidad para movimiento
            velocities.push({
                x: (Math.random() - 0.5) * 0.002,
                y: (Math.random() - 0.5) * 0.002,
                z: (Math.random() - 0.5) * 0.002,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5
            });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.008,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.synapseParticles = new THREE.Points(geometry, material);
        this.synapseParticles.userData.velocities = velocities;
        this.neuralGroup.add(this.synapseParticles);
    }

    createEnergyWaves() {
        // 3 ondas de energía concéntricas
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.RingGeometry(0.1 + i * 0.08, 0.12 + i * 0.08, 32);
            const material = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: 0.3 - i * 0.08,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });

            const wave = new THREE.Mesh(geometry, material);
            wave.position.set(0, 0.05, 0);
            wave.rotation.x = Math.PI / 2;
            wave.userData = {
                baseScale: 1 + i * 0.3,
                phase: i * 0.7,
                speed: 0.8 + i * 0.2
            };

            this.energyWaves.push(wave);
            this.neuralGroup.add(wave);
        }
    }

    update(time) {
        this.time = time;
        this.animateSynapseParticles(time);
        this.animateEnergyWaves(time);
    }

    animateSynapseParticles(time) {
        if (!this.synapseParticles) return;

        const positions = this.synapseParticles.geometry.attributes.position.array;
        const velocities = this.synapseParticles.userData.velocities;

        for (let i = 0; i < velocities.length; i++) {
            const vel = velocities[i];

            // Movimiento orbital con ruido
            const angle = time * vel.speed + vel.phase;

            positions[i * 3] += Math.sin(angle) * 0.0008;
            positions[i * 3 + 1] += Math.cos(time * 0.5 + vel.phase) * 0.0005;
            positions[i * 3 + 2] += Math.cos(angle) * 0.0008;

            // Mantener dentro de límites esféricos
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];
            const dist = Math.sqrt(x * x + y * y + z * z);

            if (dist > 0.32) {
                positions[i * 3] *= 0.98;
                positions[i * 3 + 1] *= 0.98;
                positions[i * 3 + 2] *= 0.98;
            } else if (dist < 0.08) {
                positions[i * 3] *= 1.02;
                positions[i * 3 + 1] *= 1.02;
                positions[i * 3 + 2] *= 1.02;
            }
        }

        this.synapseParticles.geometry.attributes.position.needsUpdate = true;

        // Pulso de opacidad
        this.synapseParticles.material.opacity = 0.7 + Math.sin(time * 2) * 0.2;
    }

    animateEnergyWaves(time) {
        this.energyWaves.forEach((wave, index) => {
            const { baseScale, phase, speed } = wave.userData;

            // Expansión y contracción
            const scale = baseScale + Math.sin(time * speed + phase) * 0.3;
            wave.scale.setScalar(scale);

            // Rotación lenta
            wave.rotation.z = time * 0.1 * (index % 2 === 0 ? 1 : -1);

            // Pulso de opacidad
            wave.material.opacity = 0.15 + Math.sin(time * speed + phase) * 0.1;
        });
    }

    // Efecto de activación cuando cambia de sección
    triggerSectionPulse() {
        // Pulso rápido en las partículas
        if (this.synapseParticles) {
            const originalOpacity = this.synapseParticles.material.opacity;
            this.synapseParticles.material.opacity = 1;

            setTimeout(() => {
                this.synapseParticles.material.opacity = originalOpacity;
            }, 200);
        }
    }

    dispose() {
        if (this.synapseParticles) {
            this.synapseParticles.geometry.dispose();
            this.synapseParticles.material.dispose();
        }

        this.energyWaves.forEach(wave => {
            wave.geometry.dispose();
            wave.material.dispose();
        });
    }
}
