/**
 * Red Neural - Conexiones sinápticas entre neuronas
 * Crea una red interconectada de neuronas con sinapsis visuales
 */

import * as THREE from 'three';
import { Neuron } from './Neuron.js';

export class NeuralNetwork {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            opacity: config.opacity || 0.2,
            neuronCount: config.neuronCount || 8,
            spread: config.spread || 2,
            connectionDensity: config.connectionDensity || 0.4,
            ...config
        };

        this.neurons = [];
        this.synapses = [];
        this.signalParticles = [];

        this.create();
    }

    create() {
        this.createNeurons();
        this.createSynapticConnections();
        this.createSignalParticles();
    }

    createNeurons() {
        const count = this.config.neuronCount;
        const spread = this.config.spread;
        const types = ['pyramidal', 'purkinje', 'motor', 'sensory'];

        for (let i = 0; i < count; i++) {
            // Distribución espacial
            const angle = (i / count) * Math.PI * 2;
            const radius = spread * (0.3 + Math.random() * 0.7);
            const height = (Math.random() - 0.5) * spread * 0.8;

            const position = new THREE.Vector3(
                Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5,
                height,
                Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5
            );

            const neuron = new Neuron({
                color: this.config.color,
                opacity: this.config.opacity + Math.random() * 0.1,
                scale: 0.8 + Math.random() * 0.4,
                position: position,
                type: types[Math.floor(Math.random() * types.length)]
            });

            this.neurons.push(neuron);
            this.group.add(neuron.getMesh());
        }
    }

    createSynapticConnections() {
        // Conectar neuronas cercanas
        const synapseMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.3,
            depthWrite: false
        });

        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                const neuronA = this.neurons[i];
                const neuronB = this.neurons[j];

                const posA = neuronA.config.position;
                const posB = neuronB.config.position;
                const distance = posA.distanceTo(posB);

                // Conectar si están lo suficientemente cerca
                if (distance < this.config.spread * 0.8 && Math.random() < this.config.connectionDensity) {
                    const axonEnd = neuronA.getAxonTerminal();
                    // Punto de dendrita más cercano
                    const dendritePoint = new THREE.Vector3(
                        posB.x + (Math.random() - 0.5) * 0.1,
                        posB.y + 0.1 + Math.random() * 0.1,
                        posB.z + (Math.random() - 0.5) * 0.1
                    );

                    const synapse = this.createSynapse(axonEnd, dendritePoint, synapseMat);
                    this.synapses.push(synapse);
                }
            }
        }
    }

    createSynapse(start, end, material) {
        // Curva suave entre axón terminal y dendrita
        const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
        midPoint.y += 0.1 + Math.random() * 0.1;
        midPoint.x += (Math.random() - 0.5) * 0.15;
        midPoint.z += (Math.random() - 0.5) * 0.15;

        const curve = new THREE.CatmullRomCurve3([
            start,
            midPoint,
            end
        ]);

        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(15));
        const synapse = new THREE.Line(lineGeo, material.clone());

        // Guardar datos para animación
        synapse.userData = {
            curve: curve,
            start: start.clone(),
            end: end.clone()
        };

        this.group.add(synapse);
        return synapse;
    }

    createSignalParticles() {
        // Partículas que viajan por las sinapsis (señales nerviosas)
        const particleMat = new THREE.PointsMaterial({
            color: this.config.color,
            size: 0.03,
            transparent: true,
            opacity: this.config.opacity * 1.5,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const particleCount = Math.min(this.synapses.length * 2, 20);
        const positions = new Float32Array(particleCount * 3);

        // Inicializar posiciones aleatorias a lo largo de sinapsis
        for (let i = 0; i < particleCount; i++) {
            const synapseIndex = i % this.synapses.length;
            if (this.synapses[synapseIndex]?.userData?.curve) {
                const t = Math.random();
                const point = this.synapses[synapseIndex].userData.curve.getPoint(t);
                positions[i * 3] = point.x;
                positions[i * 3 + 1] = point.y;
                positions[i * 3 + 2] = point.z;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        this.signalParticles = new THREE.Points(geometry, particleMat);
        this.signalParticles.userData.speeds = Array(particleCount).fill(0).map(() => 0.3 + Math.random() * 0.4);
        this.signalParticles.userData.progress = Array(particleCount).fill(0).map(() => Math.random());
        this.group.add(this.signalParticles);
    }

    getMesh() {
        return this.group;
    }

    animate(time) {
        // Animar neuronas individuales
        this.neurons.forEach(neuron => neuron.animate(time));

        // Animar señales viajando por sinapsis
        if (this.signalParticles && this.synapses.length > 0) {
            const positions = this.signalParticles.geometry.attributes.position.array;
            const speeds = this.signalParticles.userData.speeds;
            const progress = this.signalParticles.userData.progress;

            for (let i = 0; i < progress.length; i++) {
                const synapseIndex = i % this.synapses.length;
                const synapse = this.synapses[synapseIndex];

                if (synapse?.userData?.curve) {
                    progress[i] += speeds[i] * 0.01;
                    if (progress[i] > 1) {
                        progress[i] = 0;
                    }

                    const point = synapse.userData.curve.getPoint(progress[i]);
                    positions[i * 3] = point.x;
                    positions[i * 3 + 1] = point.y;
                    positions[i * 3 + 2] = point.z;
                }
            }

            this.signalParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Pulso suave en las conexiones sinápticas
        this.synapses.forEach((synapse, i) => {
            if (synapse.material) {
                const pulse = 0.2 + Math.sin(time * 2 + i * 0.5) * 0.1;
                synapse.material.opacity = this.config.opacity * pulse;
            }
        });
    }
}
