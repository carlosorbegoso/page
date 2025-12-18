/**
 * Lóbulo Temporal - Parte lateral inferior del cerebro (VERSIÓN REALISTA)
 * Responsable de: audición, memoria, lenguaje, reconocimiento
 *
 * Anatomía incluida:
 * - Gyrus temporal superior, medio e inferior
 * - Gyrus de Heschl (corteza auditiva primaria)
 * - Área de Wernicke (comprensión del lenguaje)
 * - Hipocampo (memoria)
 * - Sulcos principales (temporal superior, lateral)
 */

import * as THREE from 'three';

export class TemporalLobe {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            opacity: config.opacity || 0.25,
            scale: config.scale || 1,
            side: config.side || 'left',
            detail: config.detail || 'high',
            ...config
        };

        this.gyri = [];
        this.sulci = [];
        this.neurons = [];

        this.create();
    }

    create() {
        this.createMainStructure();
        this.createGyri();
        this.createSulci();
        this.createHippocampus();
        this.createNeuralActivity();
    }

    createMainStructure() {
        const segments = this.config.detail === 'high' ? 42 : 28;
        const geometry = new THREE.SphereGeometry(0.32, segments, segments);
        const positions = geometry.attributes.position;

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // === FORMA ANATÓMICA DEL LÓBULO TEMPORAL ===

            // Elongación horizontal (forma característica)
            z *= 1.6;
            x *= 1.15;

            // Aplanamiento vertical
            y *= 0.65;

            // Polo temporal (parte anterior, puntiaguda)
            if (z > 0.3) {
                const poleFactor = (z - 0.3) / 0.3;
                z *= 1 + poleFactor * 0.3;
                // Estrechamiento del polo
                x *= 1 - poleFactor * 0.2;
                y *= 1 - poleFactor * 0.15;
            }

            // Curvatura hacia adelante y abajo
            if (z > 0) {
                const curve = Math.pow(z / 0.6, 1.5) * 0.15;
                y -= curve;
            }

            // Fisura lateral (lado interno, entre hemisferios)
            if (x * sideMultiplier < 0) {
                const flattenFactor = Math.abs(x * sideMultiplier) / 0.4;
                x *= 0.3 + flattenFactor * 0.4;
            }

            // Superficie lateral convexa
            if (x * sideMultiplier > 0.1) {
                const lateralBulge = Math.sin((y + 0.2) * Math.PI * 1.5) * 0.05;
                x += lateralBulge * sideMultiplier;
            }

            // Borde superior (fisura de Silvio)
            if (y > 0.1) {
                y = 0.1 + (y - 0.1) * 0.5;
                const sylvian = Math.sin(z * 6) * 0.02;
                y += sylvian;
            }

            // Borde posterior (hacia occipital)
            if (z < -0.35) {
                z *= 0.85;
            }

            // === CIRCUNVOLUCIONES (GYRI) ===

            // Gyrus temporal superior
            const gts = Math.sin(z * 10 + y * 4) * Math.cos(x * 6) * 0.02;

            // Gyrus temporal medio
            const gtm = Math.sin(z * 8 - y * 5) * Math.sin(x * 7) * 0.018;

            // Gyrus temporal inferior
            const gti = Math.cos(z * 12 + x * 5) * Math.sin(y * 10) * 0.015;

            // Gyrus de Heschl (transverso)
            const heschl = Math.sin(x * 15 + z * 3) * Math.cos(y * 8) * 0.012;

            const dist = Math.sqrt(x * x + y * y + z * z);
            const surfaceFactor = Math.max(0, Math.min(1, (dist - 0.18) / 0.18));

            x += (gts * 0.3 + gtm * 0.2) * surfaceFactor * sideMultiplier * 0.5;
            y += (gts + gti * 0.5 + heschl) * surfaceFactor;
            z += (gtm * 0.3 + gts * 0.2) * surfaceFactor;

            // === TEXTURA FINA ===
            const microGyri = Math.sin(x * 40 + y * 32 + z * 28) * 0.006;
            x += microGyri * surfaceFactor;
            y += microGyri * 0.8 * surfaceFactor;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        // Wireframe principal
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(geometry, wireMaterial));

        // Capa sólida
        const solidMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.15,
            side: THREE.BackSide,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(geometry.clone(), solidMaterial));

        // Brillo interior
        const innerGlow = new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.12,
            side: THREE.FrontSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const innerMesh = new THREE.Mesh(geometry.clone(), innerGlow);
        innerMesh.scale.setScalar(0.88);
        this.group.add(innerMesh);
    }

    createGyri() {
        const gyriMaterial = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Gyrus temporal superior
        const gtsPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const z = -0.3 + t * 0.7;
            const y = 0.08 + Math.sin(t * Math.PI) * 0.04;
            const x = sideMultiplier * (0.22 + Math.sin(t * Math.PI * 2) * 0.03);
            gtsPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(gtsPoints, gyriMaterial);

        // Gyrus temporal medio
        const gtmPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const z = -0.25 + t * 0.6;
            const y = -0.02 + Math.sin(t * Math.PI * 1.3) * 0.03;
            const x = sideMultiplier * (0.25 + Math.sin(t * Math.PI * 2.5) * 0.025);
            gtmPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(gtmPoints, gyriMaterial);

        // Gyrus temporal inferior
        const gtiPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const z = -0.2 + t * 0.5;
            const y = -0.12 + Math.sin(t * Math.PI) * 0.025;
            const x = sideMultiplier * (0.2 + Math.sin(t * Math.PI * 2) * 0.02);
            gtiPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(gtiPoints, gyriMaterial);

        // Gyrus de Heschl (transverso temporal)
        const heschlPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const x = sideMultiplier * (0.1 + t * 0.15);
            const y = 0.05 + Math.sin(t * Math.PI) * 0.02;
            const z = 0.05 - t * 0.1;
            heschlPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(heschlPoints, gyriMaterial);
    }

    addGyrusLine(points, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(25));
        const line = new THREE.Line(lineGeo, material.clone());
        this.gyri.push(line);
        this.group.add(line);
    }

    createSulci() {
        const sulciMaterial = new THREE.LineBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Surco temporal superior
        const stsPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const z = -0.28 + t * 0.65;
            const y = 0.03 + Math.sin(t * Math.PI * 1.2) * 0.02;
            const x = sideMultiplier * (0.24 + Math.sin(t * Math.PI * 2.2) * 0.02);
            stsPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(stsPoints, sulciMaterial);

        // Surco temporal inferior
        const itiPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const z = -0.22 + t * 0.55;
            const y = -0.07 + Math.sin(t * Math.PI) * 0.015;
            const x = sideMultiplier * (0.22 + Math.sin(t * Math.PI * 2) * 0.015);
            itiPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(itiPoints, sulciMaterial);

        // Fisura lateral (Silvio) - parte temporal
        const sylvianPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const z = -0.15 + t * 0.45;
            const y = 0.1 + Math.sin(t * Math.PI * 0.5) * 0.03;
            const x = sideMultiplier * (0.28 + t * 0.05);
            sylvianPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(sylvianPoints, sulciMaterial);
    }

    addSulcusLine(points, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
        const line = new THREE.Line(lineGeo, material.clone());
        this.sulci.push(line);
        this.group.add(line);
    }

    createHippocampus() {
        // Representación del hipocampo (estructura de memoria)
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        const hippoPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = -0.1 + t * 0.35;
            const y = -0.08 - Math.sin(t * Math.PI) * 0.04;
            const x = sideMultiplier * (0.08 + Math.sin(t * Math.PI * 1.5) * 0.03);
            hippoPoints.push(new THREE.Vector3(x, y, z));
        }

        const hippoCurve = new THREE.CatmullRomCurve3(hippoPoints);
        const hippoGeo = new THREE.TubeGeometry(hippoCurve, 20, 0.025, 8, false);

        const hippoMat = new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });

        const hippocampus = new THREE.Mesh(hippoGeo, hippoMat);
        hippocampus.userData.isHippocampus = true;
        this.group.add(hippocampus);

        // Glow del hipocampo
        const glowMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.2,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const hippoGlow = new THREE.Mesh(hippoGeo.clone(), glowMat);
        hippoGlow.scale.setScalar(1.3);
        this.group.add(hippoGlow);
    }

    createNeuralActivity() {
        const neuronCount = 22;
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < neuronCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 0.25 + Math.random() * 0.08;

            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);

            // Ajustar para forma temporal
            z *= 1.4;
            y *= 0.6;

            if (x * sideMultiplier < 0) x *= -1;

            const neuronGeo = new THREE.SphereGeometry(0.01, 6, 6);
            const neuronMat = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: 0.35,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const neuron = new THREE.Mesh(neuronGeo, neuronMat);
            neuron.position.set(x, y, z);
            neuron.userData = {
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5,
                baseOpacity: 0.25 + Math.random() * 0.25
            };

            this.neurons.push(neuron);
            this.group.add(neuron);
        }
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    animate(time) {
        const pulse = 1 + Math.sin(time * 0.55 + 1) * 0.008;
        this.group.scale.setScalar(this.config.scale * pulse);

        this.neurons.forEach(neuron => {
            const { phase, speed, baseOpacity } = neuron.userData;
            const wave = Math.sin(time * speed + phase);
            neuron.material.opacity = baseOpacity * (0.5 + wave * 0.5);
            neuron.scale.setScalar(0.8 + wave * 0.4);
        });

        this.gyri.forEach((gyrus, i) => {
            const gyrusPulse = 0.5 + Math.sin(time * 1.5 + i * 0.5) * 0.3;
            gyrus.material.opacity = this.config.opacity * 0.6 * gyrusPulse;
        });
    }
}
