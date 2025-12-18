/**
 * Amígdala - Centro de procesamiento emocional
 * Estructura en forma de almendra en el lóbulo temporal
 *
 * Anatomía incluida:
 * - Núcleo basolateral (procesamiento emocional)
 * - Núcleo central (respuestas autonómicas)
 * - Núcleo medial (procesamiento olfativo)
 * - Conexiones con hipocampo y corteza prefrontal
 */

import * as THREE from 'three';

export class Amygdala {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            accentColor: config.accentColor || 0xff3366,
            opacity: config.opacity || 0.3,
            scale: config.scale || 1,
            side: config.side || 'left',
            ...config
        };

        this.nuclei = [];
        this.connections = [];
        this.emotionalWaves = [];

        this.create();
    }

    create() {
        this.createMainBody();
        this.createNuclei();
        this.createConnections();
        this.createEmotionalActivity();
    }

    createMainBody() {
        // Forma de almendra característica
        const segments = 24;
        const geometry = new THREE.SphereGeometry(0.05, segments, segments);
        const positions = geometry.attributes.position;

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Forma de almendra: puntiaguda en los extremos
            // Elongar en eje Y (vertical)
            y *= 1.5;

            // Aplanar en eje X (lateral)
            x *= 0.7;

            // Puntas en los extremos superior e inferior
            const yNorm = Math.abs(y) / 0.075;
            if (yNorm > 0.5) {
                const taper = 1 - (yNorm - 0.5) * 0.6;
                x *= taper;
                z *= taper;
            }

            // Curvatura característica
            z += Math.sin(y * 8) * 0.008;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        // Wireframe principal con color emocional
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.9,
            depthWrite: false
        });

        this.group.add(new THREE.Mesh(geometry, wireMaterial));

        // Capa sólida
        const solidMaterial = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            transparent: true,
            opacity: this.config.opacity * 0.15,
            side: THREE.BackSide,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(geometry.clone(), solidMaterial));

        // Glow emocional pulsante
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            transparent: true,
            opacity: this.config.opacity * 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
        glowMesh.scale.setScalar(1.3);
        glowMesh.userData = { isGlow: true };
        this.group.add(glowMesh);
    }

    createNuclei() {
        const nucleiData = [
            { name: 'basolateral', pos: [0, 0.02, 0.02], size: 0.02, color: this.config.color },
            { name: 'central', pos: [0, -0.02, 0], size: 0.018, color: this.config.accentColor },
            { name: 'medial', pos: [0.02, 0.01, -0.01], size: 0.015, color: this.config.secondaryColor },
            { name: 'cortical', pos: [0, 0.04, 0.01], size: 0.012, color: this.config.color }
        ];

        nucleiData.forEach(nucleus => {
            const geo = new THREE.SphereGeometry(nucleus.size, 8, 8);
            const mat = new THREE.MeshBasicMaterial({
                color: nucleus.color,
                transparent: true,
                opacity: this.config.opacity * 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(...nucleus.pos);
            mesh.userData = {
                name: nucleus.name,
                phase: Math.random() * Math.PI * 2,
                baseOpacity: this.config.opacity * 0.5,
                intensity: 1
            };

            this.nuclei.push(mesh);
            this.group.add(mesh);
        });
    }

    createConnections() {
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Conexiones principales
        const connectionData = [
            // Conexión con hipocampo (memoria emocional)
            {
                points: [
                    [0, 0, 0],
                    [0.03, -0.02, 0.03],
                    [0.08, -0.04, 0.06]
                ],
                color: this.config.color,
                target: 'hippocampus'
            },
            // Conexión con corteza prefrontal (regulación emocional)
            {
                points: [
                    [0, 0.04, 0],
                    [-0.02, 0.1, 0.05],
                    [-0.05, 0.18, 0.12]
                ],
                color: this.config.secondaryColor,
                target: 'prefrontal'
            },
            // Conexión con hipotálamo (respuestas autonómicas)
            {
                points: [
                    [0, -0.02, 0],
                    [0.02, -0.06, -0.02],
                    [0.04, -0.1, -0.04]
                ],
                color: this.config.accentColor,
                target: 'hypothalamus'
            },
            // Conexión con tronco encefálico (fight or flight)
            {
                points: [
                    [0, -0.04, 0],
                    [0.01, -0.08, -0.03],
                    [0.02, -0.15, -0.06]
                ],
                color: this.config.accentColor,
                target: 'brainstem'
            }
        ];

        connectionData.forEach((conn, index) => {
            const curvePoints = conn.points.map(p =>
                new THREE.Vector3(p[0], p[1], p[2])
            );

            const curve = new THREE.CatmullRomCurve3(curvePoints);
            const geo = new THREE.TubeGeometry(curve, 15, 0.004, 6, false);

            const mat = new THREE.MeshBasicMaterial({
                color: conn.color,
                wireframe: true,
                transparent: true,
                opacity: this.config.opacity * 0.5,
                depthWrite: false
            });

            const connection = new THREE.Mesh(geo, mat);
            connection.userData = {
                target: conn.target,
                phase: index * 0.5,
                signalPosition: 0
            };

            this.connections.push(connection);
            this.group.add(connection);

            // Señal viajando por la conexión
            const signalGeo = new THREE.SphereGeometry(0.006, 6, 6);
            const signalMat = new THREE.MeshBasicMaterial({
                color: conn.color,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const signal = new THREE.Mesh(signalGeo, signalMat);
            signal.userData = {
                curve: curve,
                speed: 0.3 + Math.random() * 0.2,
                t: Math.random()
            };

            this.emotionalWaves.push(signal);
            this.group.add(signal);
        });
    }

    createEmotionalActivity() {
        // Ondas de actividad emocional que pulsan desde el centro
        const waveCount = 3;

        for (let i = 0; i < waveCount; i++) {
            const ringGeo = new THREE.RingGeometry(0.02, 0.025, 16);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.config.accentColor,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.userData = {
                baseScale: 1,
                phase: i * (Math.PI * 2 / waveCount),
                maxScale: 3
            };

            this.emotionalWaves.push(ring);
            this.group.add(ring);
        }
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    // Método para simular respuesta emocional
    triggerEmotionalResponse(intensity = 1) {
        this.nuclei.forEach(nucleus => {
            nucleus.userData.intensity = intensity;
        });
    }

    animate(time) {
        // Pulso general - más intenso que otras estructuras
        const pulse = 1 + Math.sin(time * 0.8) * 0.03;
        this.group.scale.setScalar(this.config.scale * pulse);

        // Animar núcleos con diferentes frecuencias
        this.nuclei.forEach(nucleus => {
            const { phase, baseOpacity, intensity } = nucleus.userData;
            const wave = Math.sin(time * 2.5 + phase);
            nucleus.material.opacity = baseOpacity * intensity * (0.6 + wave * 0.4);
            nucleus.scale.setScalar(0.9 + wave * 0.2 * intensity);
        });

        // Animar glow emocional
        this.group.children.forEach(child => {
            if (child.userData?.isGlow) {
                const glowPulse = 1 + Math.sin(time * 1.5) * 0.15;
                child.scale.setScalar(1.3 * glowPulse);
                child.material.opacity = this.config.opacity * (0.2 + Math.sin(time * 2) * 0.1);
            }
        });

        // Animar conexiones
        this.connections.forEach(conn => {
            const { phase } = conn.userData;
            const wave = Math.sin(time * 2 + phase);
            conn.material.opacity = this.config.opacity * (0.4 + wave * 0.3);
        });

        // Animar señales viajando
        this.emotionalWaves.forEach(wave => {
            if (wave.userData?.curve) {
                // Señal viajando por conexión
                wave.userData.t += 0.01 * wave.userData.speed;
                if (wave.userData.t > 1) wave.userData.t = 0;

                const point = wave.userData.curve.getPoint(wave.userData.t);
                wave.position.copy(point);

                // Fade basado en posición
                wave.material.opacity = 0.8 * Math.sin(wave.userData.t * Math.PI);
            } else if (wave.userData?.maxScale) {
                // Ondas de actividad expandiéndose
                const { phase, maxScale } = wave.userData;
                const cycle = ((time + phase) % 2) / 2;
                const scale = 1 + cycle * (maxScale - 1);

                wave.scale.setScalar(scale);
                wave.material.opacity = 0.4 * (1 - cycle);
            }
        });
    }
}
