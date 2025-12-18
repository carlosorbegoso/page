/**
 * Red Sináptica - Sistema de conexiones animadas entre estructuras cerebrales
 * Crea un efecto de actividad neural realista con señales viajando
 *
 * Características:
 * - Conexiones entre regiones cerebrales
 * - Señales viajando a lo largo de axones
 * - Pulsos sinápticos en terminales
 * - Ondas de activación
 */

import * as THREE from 'three';

export class SynapticNetwork {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            signalColor: config.signalColor || 0x00ff88,
            opacity: config.opacity || 0.3,
            scale: config.scale || 1,
            connectionDensity: config.connectionDensity || 1.0,
            brainPositions: config.brainPositions || null,
            ...config
        };

        this.connections = [];
        this.signals = [];
        this.synapses = [];
        this.waves = [];

        this.create();
    }

    create() {
        this.createMajorConnections();
        this.createSignalParticles();
        this.createSynapticTerminals();
        this.createActivationWaves();
    }

    createMajorConnections() {
        const pos = this.config.brainPositions;

        // Usar posiciones del config si están disponibles, si no usar defaults
        const connectionData = pos ? this.getConnectionsFromPositions(pos) : this.getDefaultConnections();

        const density = this.config.connectionDensity;
        const numConnections = Math.floor(connectionData.length * density);

        for (let i = 0; i < numConnections; i++) {
            const conn = connectionData[i];
            this.createConnection(conn);
        }
    }

    getConnectionsFromPositions(pos) {
        // Conexiones basadas en las posiciones reales del cerebro
        return [
            // Conexiones frontales - parietales (ipsilaterales)
            {
                from: [pos.frontalLobe.left.x, pos.frontalLobe.left.y, pos.frontalLobe.left.z],
                to: [pos.parietalLobe.left.x, pos.parietalLobe.left.y, pos.parietalLobe.left.z],
                strength: 1.0, type: 'cortical'
            },
            {
                from: [pos.frontalLobe.right.x, pos.frontalLobe.right.y, pos.frontalLobe.right.z],
                to: [pos.parietalLobe.right.x, pos.parietalLobe.right.y, pos.parietalLobe.right.z],
                strength: 1.0, type: 'cortical'
            },

            // Conexiones parietales - occipitales
            {
                from: [pos.parietalLobe.left.x, pos.parietalLobe.left.y, pos.parietalLobe.left.z],
                to: [pos.occipitalLobe.left.x, pos.occipitalLobe.left.y, pos.occipitalLobe.left.z],
                strength: 0.9, type: 'cortical'
            },
            {
                from: [pos.parietalLobe.right.x, pos.parietalLobe.right.y, pos.parietalLobe.right.z],
                to: [pos.occipitalLobe.right.x, pos.occipitalLobe.right.y, pos.occipitalLobe.right.z],
                strength: 0.9, type: 'cortical'
            },

            // Conexiones frontales - temporales
            {
                from: [pos.frontalLobe.left.x, pos.frontalLobe.left.y, pos.frontalLobe.left.z],
                to: [pos.temporalLobe.left.x, pos.temporalLobe.left.y, pos.temporalLobe.left.z],
                strength: 0.85, type: 'cortical'
            },
            {
                from: [pos.frontalLobe.right.x, pos.frontalLobe.right.y, pos.frontalLobe.right.z],
                to: [pos.temporalLobe.right.x, pos.temporalLobe.right.y, pos.temporalLobe.right.z],
                strength: 0.85, type: 'cortical'
            },

            // Conexiones interhemisféricas (cuerpo calloso)
            {
                from: [pos.frontalLobe.left.x, pos.frontalLobe.left.y, pos.frontalLobe.left.z],
                to: [pos.frontalLobe.right.x, pos.frontalLobe.right.y, pos.frontalLobe.right.z],
                strength: 1.0, type: 'callosal'
            },
            {
                from: [pos.parietalLobe.left.x, pos.parietalLobe.left.y, pos.parietalLobe.left.z],
                to: [pos.parietalLobe.right.x, pos.parietalLobe.right.y, pos.parietalLobe.right.z],
                strength: 1.0, type: 'callosal'
            },
            {
                from: [pos.occipitalLobe.left.x, pos.occipitalLobe.left.y, pos.occipitalLobe.left.z],
                to: [pos.occipitalLobe.right.x, pos.occipitalLobe.right.y, pos.occipitalLobe.right.z],
                strength: 0.9, type: 'callosal'
            },

            // Conexiones tálamo-corticales
            {
                from: [pos.thalamus.left.x, pos.thalamus.left.y, pos.thalamus.left.z],
                to: [pos.frontalLobe.left.x, pos.frontalLobe.left.y, pos.frontalLobe.left.z],
                strength: 0.9, type: 'thalamic'
            },
            {
                from: [pos.thalamus.right.x, pos.thalamus.right.y, pos.thalamus.right.z],
                to: [pos.frontalLobe.right.x, pos.frontalLobe.right.y, pos.frontalLobe.right.z],
                strength: 0.9, type: 'thalamic'
            },
            {
                from: [pos.thalamus.left.x, pos.thalamus.left.y, pos.thalamus.left.z],
                to: [pos.parietalLobe.left.x, pos.parietalLobe.left.y, pos.parietalLobe.left.z],
                strength: 0.85, type: 'thalamic'
            },
            {
                from: [pos.thalamus.right.x, pos.thalamus.right.y, pos.thalamus.right.z],
                to: [pos.parietalLobe.right.x, pos.parietalLobe.right.y, pos.parietalLobe.right.z],
                strength: 0.85, type: 'thalamic'
            },

            // Conexiones cortico-cerebelosas
            {
                from: [pos.parietalLobe.left.x, pos.parietalLobe.left.y, pos.parietalLobe.left.z],
                to: [pos.cerebellum.center.x, pos.cerebellum.center.y, pos.cerebellum.center.z],
                strength: 0.7, type: 'cerebellar'
            },
            {
                from: [pos.parietalLobe.right.x, pos.parietalLobe.right.y, pos.parietalLobe.right.z],
                to: [pos.cerebellum.center.x, pos.cerebellum.center.y, pos.cerebellum.center.z],
                strength: 0.7, type: 'cerebellar'
            },

            // Conexiones descendentes (corticoespinales)
            {
                from: [pos.frontalLobe.left.x * 0.5, pos.frontalLobe.left.y, pos.frontalLobe.left.z * 0.5],
                to: [pos.brainstem.center.x, pos.brainstem.center.y, pos.brainstem.center.z],
                strength: 1.0, type: 'descending'
            },
            {
                from: [pos.frontalLobe.right.x * 0.5, pos.frontalLobe.right.y, pos.frontalLobe.right.z * 0.5],
                to: [pos.brainstem.center.x, pos.brainstem.center.y, pos.brainstem.center.z],
                strength: 1.0, type: 'descending'
            },

            // Conexiones límbicas (amígdala - frontal)
            {
                from: [pos.amygdala.left.x, pos.amygdala.left.y, pos.amygdala.left.z],
                to: [pos.frontalLobe.left.x, pos.frontalLobe.left.y * 0.5, pos.frontalLobe.left.z],
                strength: 0.8, type: 'limbic'
            },
            {
                from: [pos.amygdala.right.x, pos.amygdala.right.y, pos.amygdala.right.z],
                to: [pos.frontalLobe.right.x, pos.frontalLobe.right.y * 0.5, pos.frontalLobe.right.z],
                strength: 0.8, type: 'limbic'
            },

            // Conexiones hipotalámicas
            {
                from: [pos.hypothalamus.center.x, pos.hypothalamus.center.y, pos.hypothalamus.center.z],
                to: [pos.brainstem.center.x, pos.brainstem.center.y, pos.brainstem.center.z],
                strength: 0.75, type: 'limbic'
            },

            // Conexiones ganglios basales - tálamo
            {
                from: [pos.basalGanglia.left.x, pos.basalGanglia.left.y, pos.basalGanglia.left.z],
                to: [pos.thalamus.left.x, pos.thalamus.left.y, pos.thalamus.left.z],
                strength: 0.85, type: 'thalamic'
            },
            {
                from: [pos.basalGanglia.right.x, pos.basalGanglia.right.y, pos.basalGanglia.right.z],
                to: [pos.thalamus.right.x, pos.thalamus.right.y, pos.thalamus.right.z],
                strength: 0.85, type: 'thalamic'
            }
        ];
    }

    getDefaultConnections() {
        // Conexiones por defecto si no hay posiciones
        return [
            { from: [-0.22, 0.15, 0.25], to: [-0.18, 0.32, -0.05], strength: 1.0, type: 'cortical' },
            { from: [0.22, 0.15, 0.25], to: [0.18, 0.32, -0.05], strength: 1.0, type: 'cortical' },
            { from: [-0.18, 0.32, -0.05], to: [-0.15, 0.12, -0.35], strength: 0.9, type: 'cortical' },
            { from: [0.18, 0.32, -0.05], to: [0.15, 0.12, -0.35], strength: 0.9, type: 'cortical' },
            { from: [-0.22, 0.15, 0.25], to: [0.22, 0.15, 0.25], strength: 1.0, type: 'callosal' },
            { from: [-0.06, 0.02, -0.02], to: [-0.22, 0.15, 0.25], strength: 0.9, type: 'thalamic' },
            { from: [0.06, 0.02, -0.02], to: [0.22, 0.15, 0.25], strength: 0.9, type: 'thalamic' },
            { from: [0, -0.22, -0.32], to: [0, -0.28, -0.08], strength: 0.8, type: 'cerebellar' }
        ];
    }

    createConnection(connData) {
        const { from, to, strength, type } = connData;

        // Crear múltiples fibras por conexión
        const fiberCount = Math.ceil(strength * 3);

        for (let f = 0; f < fiberCount; f++) {
            const points = this.generateFiberPath(from, to, f);
            const curve = new THREE.CatmullRomCurve3(points);

            // Grosor basado en fuerza
            const radius = 0.003 + strength * 0.002;
            const geo = new THREE.TubeGeometry(curve, 20, radius, 6, false);

            // Color basado en tipo
            const color = this.getConnectionColor(type);

            const mat = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: this.config.opacity * 0.3 * strength,
                depthWrite: false
            });

            const fiber = new THREE.Mesh(geo, mat);
            fiber.userData = {
                type: type,
                strength: strength,
                curve: curve,
                phase: Math.random() * Math.PI * 2
            };

            this.connections.push(fiber);
            this.group.add(fiber);
        }
    }

    generateFiberPath(from, to, fiberIndex) {
        const start = new THREE.Vector3(...from);
        const end = new THREE.Vector3(...to);

        // Añadir curvatura natural
        const mid1 = new THREE.Vector3().lerpVectors(start, end, 0.33);
        const mid2 = new THREE.Vector3().lerpVectors(start, end, 0.66);

        // Offset para cada fibra
        const offset = (fiberIndex - 1) * 0.02;
        const perpendicular = new THREE.Vector3()
            .crossVectors(
                new THREE.Vector3().subVectors(end, start).normalize(),
                new THREE.Vector3(0, 1, 0)
            )
            .normalize();

        mid1.add(perpendicular.clone().multiplyScalar(offset));
        mid1.y += Math.sin(fiberIndex) * 0.02;

        mid2.add(perpendicular.clone().multiplyScalar(-offset * 0.5));
        mid2.y += Math.cos(fiberIndex) * 0.015;

        return [start, mid1, mid2, end];
    }

    getConnectionColor(type) {
        const colors = {
            'cortical': this.config.color,
            'callosal': 0xffffff,
            'thalamic': 0xff6600,
            'cerebellar': 0x00ff66,
            'descending': 0xff0066,
            'limbic': 0xff66ff
        };
        return colors[type] || this.config.color;
    }

    createSignalParticles() {
        // Crear señales que viajan por las conexiones
        this.connections.forEach((connection, connIndex) => {
            const signalCount = Math.ceil(connection.userData.strength * 2);

            for (let i = 0; i < signalCount; i++) {
                const geo = new THREE.SphereGeometry(0.008, 6, 6);
                const mat = new THREE.MeshBasicMaterial({
                    color: this.config.signalColor,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                const signal = new THREE.Mesh(geo, mat);
                signal.userData = {
                    connectionIndex: connIndex,
                    curve: connection.userData.curve,
                    t: i / signalCount,
                    speed: 0.3 + Math.random() * 0.2,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    active: true,
                    phase: Math.random() * Math.PI * 2
                };

                this.signals.push(signal);
                this.group.add(signal);
            }
        });
    }

    createSynapticTerminals() {
        // Crear terminales sinápticas en los extremos de las conexiones
        const terminalPositions = new Set();

        this.connections.forEach(connection => {
            const curve = connection.userData.curve;
            const start = curve.getPoint(0);
            const end = curve.getPoint(1);

            // Crear terminal solo si no existe una cerca
            [start, end].forEach(pos => {
                const key = `${pos.x.toFixed(2)},${pos.y.toFixed(2)},${pos.z.toFixed(2)}`;
                if (!terminalPositions.has(key)) {
                    terminalPositions.add(key);
                    this.createSynapticTerminal(pos, connection.userData.type);
                }
            });
        });
    }

    createSynapticTerminal(position, type) {
        // Botón sináptico
        const boutonGeo = new THREE.SphereGeometry(0.012, 8, 8);
        const boutonMat = new THREE.MeshBasicMaterial({
            color: this.config.signalColor,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const bouton = new THREE.Mesh(boutonGeo, boutonMat);
        bouton.position.copy(position);
        bouton.userData = {
            type: type,
            phase: Math.random() * Math.PI * 2,
            baseOpacity: this.config.opacity * 0.5,
            isActive: false
        };

        this.synapses.push(bouton);
        this.group.add(bouton);

        // Glow del terminal
        const glowGeo = new THREE.SphereGeometry(0.018, 6, 6);
        const glowMat = new THREE.MeshBasicMaterial({
            color: this.config.signalColor,
            transparent: true,
            opacity: this.config.opacity * 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.copy(position);
        this.group.add(glow);
    }

    createActivationWaves() {
        // Ondas de activación que se propagan por la red
        for (let i = 0; i < 3; i++) {
            const waveGeo = new THREE.RingGeometry(0.05, 0.06, 32);
            const waveMat = new THREE.MeshBasicMaterial({
                color: this.config.signalColor,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const wave = new THREE.Mesh(waveGeo, waveMat);
            wave.position.set(
                (Math.random() - 0.5) * 0.4,
                0.2 + Math.random() * 0.3,
                (Math.random() - 0.5) * 0.3
            );
            wave.rotation.x = Math.random() * Math.PI;
            wave.rotation.y = Math.random() * Math.PI;

            wave.userData = {
                baseScale: 0.1,
                maxScale: 2,
                phase: i * (Math.PI * 2 / 3),
                speed: 0.5 + Math.random() * 0.3,
                origin: wave.position.clone()
            };

            this.waves.push(wave);
            this.group.add(wave);
        }
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    // Activar una sinapsis específica
    activateSynapse(index) {
        if (this.synapses[index]) {
            this.synapses[index].userData.isActive = true;
        }
    }

    // Disparar una onda de activación desde un punto
    triggerWave(position) {
        if (this.waves.length > 0) {
            const wave = this.waves[Math.floor(Math.random() * this.waves.length)];
            wave.position.copy(position);
            wave.userData.phase = 0;
        }
    }

    animate(time) {
        // Animar conexiones (pulso sutil)
        this.connections.forEach(connection => {
            const { phase, strength } = connection.userData;
            const pulse = 0.8 + Math.sin(time * 1.5 + phase) * 0.2;
            connection.material.opacity = this.config.opacity * 0.3 * strength * pulse;
        });

        // Animar señales viajando
        this.signals.forEach(signal => {
            if (!signal.userData.active) return;

            const { curve, speed, direction, phase } = signal.userData;

            // Mover a lo largo de la curva
            signal.userData.t += 0.005 * speed * direction;

            // Loop o rebote
            if (signal.userData.t > 1) {
                signal.userData.t = 0;
                signal.userData.direction = 1;
            } else if (signal.userData.t < 0) {
                signal.userData.t = 1;
                signal.userData.direction = -1;
            }

            // Actualizar posición
            const point = curve.getPoint(signal.userData.t);
            signal.position.copy(point);

            // Efecto de estela
            const trailIntensity = Math.sin(signal.userData.t * Math.PI);
            signal.material.opacity = 0.8 * trailIntensity;
            signal.scale.setScalar(0.8 + trailIntensity * 0.4);

            // Activar sinapsis cuando llega al final
            if (signal.userData.t > 0.95 || signal.userData.t < 0.05) {
                // Buscar sinapsis cercana y activarla
                const nearestSynapse = this.findNearestSynapse(signal.position);
                if (nearestSynapse) {
                    nearestSynapse.userData.isActive = true;
                }
            }
        });

        // Animar terminales sinápticas
        this.synapses.forEach(synapse => {
            const { phase, baseOpacity, isActive } = synapse.userData;

            if (isActive) {
                // Flash de activación
                synapse.material.opacity = 1;
                synapse.scale.setScalar(1.5);
                synapse.userData.isActive = false;
            } else {
                // Pulso normal
                const pulse = 0.7 + Math.sin(time * 2 + phase) * 0.3;
                synapse.material.opacity = baseOpacity * pulse;
                synapse.scale.setScalar(0.9 + Math.sin(time * 3 + phase) * 0.15);
            }
        });

        // Animar ondas de activación
        this.waves.forEach(wave => {
            const { baseScale, maxScale, phase, speed } = wave.userData;

            // Expansión cíclica
            const cycle = ((time * speed + phase) % (Math.PI * 2)) / (Math.PI * 2);
            const scale = baseScale + cycle * (maxScale - baseScale);

            wave.scale.setScalar(scale);
            wave.material.opacity = 0.4 * (1 - cycle);

            // Rotación lenta
            wave.rotation.z += 0.005;
        });
    }

    findNearestSynapse(position) {
        let nearest = null;
        let minDist = 0.1;

        this.synapses.forEach(synapse => {
            const dist = synapse.position.distanceTo(position);
            if (dist < minDist) {
                minDist = dist;
                nearest = synapse;
            }
        });

        return nearest;
    }
}
