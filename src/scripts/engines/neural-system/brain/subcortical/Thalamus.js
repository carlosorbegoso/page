/**
 * Tálamo - Centro de relevo sensorial del cerebro
 * Estructura ovoide en el centro del cerebro
 *
 * Anatomía incluida:
 * - Núcleos talámicos (anterior, medial, lateral, pulvinar)
 * - Lámina medular interna y externa
 * - Núcleo reticular
 * - Conexiones con corteza (radiaciones talámicas)
 */

import * as THREE from 'three';

export class Thalamus {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            accentColor: config.accentColor || 0xff6600,
            opacity: config.opacity || 0.3,
            scale: config.scale || 1,
            side: config.side || 'left',
            ...config
        };

        this.nuclei = [];
        this.radiations = [];
        this.activityPoints = [];

        this.create();
    }

    create() {
        this.createMainBody();
        this.createNuclei();
        this.createMedullaryLaminae();
        this.createRadiations();
        this.createActivityPoints();
    }

    createMainBody() {
        const segments = 28;
        const geometry = new THREE.SphereGeometry(0.12, segments, segments);
        const positions = geometry.attributes.position;

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Forma ovoide característica
            x *= 0.7;  // Más estrecho lateralmente
            y *= 1.0;  // Altura normal
            z *= 1.4;  // Más largo anterior-posterior

            // Aplanar lado medial (hacia el centro)
            if (x * sideMultiplier < 0) {
                x *= 0.5;
            }

            // Polo anterior más puntiagudo
            if (z > 0.1) {
                const anteriorTaper = (z - 0.1) / 0.1;
                x *= 1 - anteriorTaper * 0.3;
                y *= 1 - anteriorTaper * 0.2;
            }

            // Pulvinar (polo posterior, más grande)
            if (z < -0.08) {
                const pulvinar = Math.abs(z + 0.08) / 0.1;
                x *= 1 + pulvinar * 0.15;
                y *= 1 + pulvinar * 0.2;
            }

            // Textura superficial (núcleos)
            const nucleiTexture = Math.sin(x * 20 + y * 15 + z * 25) * 0.008;
            x += nucleiTexture * sideMultiplier;
            y += nucleiTexture * 0.5;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        // Wireframe principal
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.9,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(geometry, wireMaterial);
        this.group.add(mesh);

        // Capa sólida interior
        const solidMaterial = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            transparent: true,
            opacity: this.config.opacity * 0.15,
            side: THREE.BackSide,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(geometry.clone(), solidMaterial));

        // Glow interior
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
        glowMesh.scale.setScalar(0.85);
        this.group.add(glowMesh);
    }

    createNuclei() {
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Núcleos principales del tálamo
        const nucleiData = [
            { name: 'anterior', pos: [0.02, 0.06, 0.08], size: 0.025, color: this.config.color },
            { name: 'medial', pos: [0.01, 0, 0], size: 0.035, color: this.config.secondaryColor },
            { name: 'lateral', pos: [0.06, 0, -0.02], size: 0.03, color: this.config.color },
            { name: 'pulvinar', pos: [0.03, 0, -0.1], size: 0.04, color: this.config.accentColor },
            { name: 'ventral', pos: [0.05, -0.04, 0.02], size: 0.028, color: this.config.secondaryColor }
        ];

        nucleiData.forEach(nucleus => {
            const geo = new THREE.SphereGeometry(nucleus.size, 10, 10);
            const mat = new THREE.MeshBasicMaterial({
                color: nucleus.color,
                transparent: true,
                opacity: this.config.opacity * 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                nucleus.pos[0] * sideMultiplier,
                nucleus.pos[1],
                nucleus.pos[2]
            );
            mesh.userData = {
                name: nucleus.name,
                phase: Math.random() * Math.PI * 2,
                baseOpacity: this.config.opacity * 0.5
            };

            this.nuclei.push(mesh);
            this.group.add(mesh);
        });
    }

    createMedullaryLaminae() {
        // Lámina medular interna (divide núcleos)
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        const laminaPoints = [];
        for (let t = 0; t <= 1; t += 0.1) {
            const z = 0.1 - t * 0.2;
            const y = Math.sin(t * Math.PI) * 0.08;
            const x = sideMultiplier * (0.03 + Math.sin(t * Math.PI) * 0.02);
            laminaPoints.push(new THREE.Vector3(x, y, z));
        }

        const laminaCurve = new THREE.CatmullRomCurve3(laminaPoints);
        const laminaGeo = new THREE.TubeGeometry(laminaCurve, 15, 0.008, 6, false);

        const laminaMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });

        this.group.add(new THREE.Mesh(laminaGeo, laminaMat));
    }

    createRadiations() {
        // Radiaciones talámicas (conexiones con corteza)
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        const radiationData = [
            { start: [0.02, 0.06, 0.08], end: [0.15, 0.25, 0.2], target: 'frontal' },
            { start: [0.06, 0, -0.02], end: [0.2, 0.2, -0.1], target: 'parietal' },
            { start: [0.03, 0, -0.1], end: [0.12, 0.15, -0.25], target: 'occipital' },
            { start: [0.05, -0.04, 0.02], end: [0.25, -0.05, 0.1], target: 'temporal' }
        ];

        const radiationMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });

        radiationData.forEach((rad, index) => {
            const start = new THREE.Vector3(
                rad.start[0] * sideMultiplier,
                rad.start[1],
                rad.start[2]
            );
            const end = new THREE.Vector3(
                rad.end[0] * sideMultiplier,
                rad.end[1],
                rad.end[2]
            );

            // Crear múltiples fibras por cada radiación
            for (let f = 0; f < 3; f++) {
                const points = [];
                const midOffset = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03
                );

                const mid = new THREE.Vector3().lerpVectors(start, end, 0.5).add(midOffset);
                points.push(start.clone(), mid, end.clone());

                const curve = new THREE.CatmullRomCurve3(points);
                const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(15));
                const line = new THREE.Line(geo, radiationMat.clone());

                line.userData = {
                    phase: index + f * 0.3,
                    target: rad.target
                };

                this.radiations.push(line);
                this.group.add(line);
            }
        });
    }

    createActivityPoints() {
        const count = 12;
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 0.08 + Math.random() * 0.03;

            let x = r * Math.sin(phi) * Math.cos(theta) * 0.7;
            let y = r * Math.sin(phi) * Math.sin(theta);
            let z = r * Math.cos(phi) * 1.4;

            if (x * sideMultiplier < 0) x *= 0.5;

            const geo = new THREE.SphereGeometry(0.006, 6, 6);
            const mat = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const point = new THREE.Mesh(geo, mat);
            point.position.set(x, y, z);
            point.userData = {
                phase: Math.random() * Math.PI * 2,
                speed: 1 + Math.random() * 2,
                baseOpacity: 0.4 + Math.random() * 0.3
            };

            this.activityPoints.push(point);
            this.group.add(point);
        }
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    animate(time) {
        // Pulso general
        const pulse = 1 + Math.sin(time * 0.6) * 0.02;
        this.group.scale.setScalar(this.config.scale * pulse);

        // Animar núcleos
        this.nuclei.forEach(nucleus => {
            const { phase, baseOpacity } = nucleus.userData;
            const wave = Math.sin(time * 1.5 + phase);
            nucleus.material.opacity = baseOpacity * (0.7 + wave * 0.3);
            nucleus.scale.setScalar(0.9 + wave * 0.15);
        });

        // Animar radiaciones (señales viajando)
        this.radiations.forEach(radiation => {
            const { phase } = radiation.userData;
            const wave = Math.sin(time * 2 + phase);
            radiation.material.opacity = this.config.opacity * (0.3 + wave * 0.3);
        });

        // Animar puntos de actividad
        this.activityPoints.forEach(point => {
            const { phase, speed, baseOpacity } = point.userData;
            const wave = Math.sin(time * speed + phase);
            point.material.opacity = baseOpacity * (0.5 + wave * 0.5);
            point.scale.setScalar(0.8 + wave * 0.4);
        });
    }
}
