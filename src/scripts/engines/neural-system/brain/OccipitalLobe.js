/**
 * Lóbulo Occipital - Parte posterior del cerebro (VERSIÓN REALISTA)
 * Responsable de: procesamiento visual, reconocimiento de formas y colores
 *
 * Anatomía incluida:
 * - Corteza visual primaria (V1/área de Brodmann 17)
 * - Cortezas visuales de asociación (V2-V5)
 * - Sulco calcarino
 * - Polo occipital
 * - Cuneus y gyrus lingual
 */

import * as THREE from 'three';

export class OccipitalLobe {
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
        this.visualCortexLayers = [];

        this.create();
    }

    create() {
        this.createMainStructure();
        this.createGyri();
        this.createSulci();
        this.createVisualCortex();
        this.createNeuralActivity();
    }

    createMainStructure() {
        const segments = this.config.detail === 'high' ? 40 : 26;
        const geometry = new THREE.SphereGeometry(0.28, segments, segments);
        const positions = geometry.attributes.position;

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // === FORMA ANATÓMICA DEL LÓBULO OCCIPITAL ===

            // Polo occipital (parte posterior puntiaguda)
            if (z < -0.15) {
                const poleFactor = Math.abs(z + 0.15) / 0.2;
                z *= 1 + poleFactor * 0.4;
                // Estrechamiento del polo
                x *= 1 - poleFactor * 0.15;
                y *= 1 - poleFactor * 0.1;
            }

            // Forma más redondeada general
            const dist = Math.sqrt(x * x + y * y + z * z);
            if (dist > 0.2) {
                const roundFactor = Math.sin((dist - 0.2) * Math.PI * 2) * 0.03;
                x *= 1 + roundFactor;
                y *= 1 + roundFactor;
            }

            // Fisura longitudinal (entre hemisferios)
            if (x * sideMultiplier < 0) {
                const flattenFactor = Math.abs(x * sideMultiplier) / 0.3;
                x *= 0.3 + flattenFactor * 0.4;
            }

            // Borde anterior (hacia parietal y temporal)
            if (z > 0.1) {
                z = 0.1 + (z - 0.1) * 0.35;
                // Surco parieto-occipital
                const poSulcus = Math.sin(y * 8) * 0.02;
                z -= poSulcus;
            }

            // Cuneus (cuña superior)
            if (y > 0.1 && z < 0) {
                const cuneusBulge = Math.sin((y - 0.1) * Math.PI * 2) * 0.03;
                y += cuneusBulge;
            }

            // Gyrus lingual (inferior)
            if (y < -0.1 && z < 0) {
                const lingualBulge = Math.sin((y + 0.1) * Math.PI * 2) * 0.025;
                y += lingualBulge;
            }

            // Convexidad lateral
            if (x * sideMultiplier > 0.08) {
                const lateralBulge = Math.sin(y * Math.PI) * 0.04;
                x += lateralBulge * sideMultiplier;
            }

            // === CIRCUNVOLUCIONES (GYRI) ===

            // Gyri occipitales (más finos que otros lóbulos)
            const gyri1 = Math.sin(z * 14 + y * 5) * Math.cos(x * 10) * 0.018;
            const gyri2 = Math.sin(y * 12 - z * 6) * Math.sin(x * 8) * 0.015;
            const gyri3 = Math.cos(z * 16 + x * 7) * Math.sin(y * 11) * 0.012;

            const surfaceFactor = Math.max(0, Math.min(1, (dist - 0.15) / 0.15));

            x += (gyri1 * 0.3 + gyri2 * 0.2) * surfaceFactor * sideMultiplier * 0.5;
            y += (gyri1 + gyri3 * 0.5) * surfaceFactor;
            z += (gyri2 * 0.3 + gyri1 * 0.2) * surfaceFactor;

            // === TEXTURA FINA ===
            const microGyri = Math.sin(x * 45 + y * 38 + z * 32) * 0.005;
            x += microGyri * surfaceFactor;
            y += microGyri * 0.8 * surfaceFactor;
            z += microGyri * 0.6 * surfaceFactor;

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

        // Cuneus (cuña)
        const cuneusPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = 0 - t * 0.35;
            const y = 0.15 + Math.sin(t * Math.PI) * 0.05;
            const x = sideMultiplier * (0.08 + Math.sin(t * Math.PI * 1.5) * 0.02);
            cuneusPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(cuneusPoints, gyriMaterial);

        // Gyrus lingual
        const lingualPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = 0 - t * 0.32;
            const y = -0.12 + Math.sin(t * Math.PI) * 0.04;
            const x = sideMultiplier * (0.1 + Math.sin(t * Math.PI * 2) * 0.025);
            lingualPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(lingualPoints, gyriMaterial);

        // Gyrus occipital lateral
        const lateralPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = 0.05 - t * 0.35;
            const y = 0 + Math.sin(t * Math.PI * 1.3) * 0.06;
            const x = sideMultiplier * (0.2 + Math.sin(t * Math.PI * 2) * 0.03);
            lateralPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(lateralPoints, gyriMaterial);
    }

    addGyrusLine(points, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(22));
        const line = new THREE.Line(lineGeo, material.clone());
        this.gyri.push(line);
        this.group.add(line);
    }

    createSulci() {
        const sulciMaterial = new THREE.LineBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Sulco calcarino (muy importante - contiene V1)
        const calcarinePoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const z = 0.05 - t * 0.4;
            const y = 0 + Math.sin(t * Math.PI * 0.8) * 0.02;
            const x = sideMultiplier * (0.05 + Math.sin(t * Math.PI) * 0.02);
            calcarinePoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(calcarinePoints, sulciMaterial);

        // Sulco parieto-occipital
        const poPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const y = -0.1 + t * 0.25;
            const z = 0.08 + Math.sin(t * Math.PI) * 0.03;
            const x = sideMultiplier * (0.08 + t * 0.04);
            poPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(poPoints, sulciMaterial);

        // Sulco occipital lateral
        const latPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = 0 - t * 0.28;
            const y = 0.05 + Math.sin(t * Math.PI * 1.2) * 0.03;
            const x = sideMultiplier * (0.18 + Math.sin(t * Math.PI * 2) * 0.015);
            latPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(latPoints, sulciMaterial);
    }

    addSulcusLine(points, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(18));
        const line = new THREE.Line(lineGeo, material.clone());
        this.sulci.push(line);
        this.group.add(line);
    }

    createVisualCortex() {
        // Representación de las áreas visuales (V1, V2, etc.)
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // V1 - Corteza visual primaria (a lo largo del surco calcarino)
        const v1Points = [];
        for (let t = 0; t <= 1; t += 0.03) {
            const z = -0.05 - t * 0.25;
            const angle = t * Math.PI * 2;
            const radius = 0.03 + Math.sin(t * Math.PI) * 0.02;
            const y = Math.sin(angle) * radius;
            const x = sideMultiplier * (0.05 + Math.cos(angle) * radius * 0.3);
            v1Points.push(new THREE.Vector3(x, y, z));
        }

        const v1Curve = new THREE.CatmullRomCurve3(v1Points);
        const v1Geo = new THREE.TubeGeometry(v1Curve, 30, 0.015, 8, false);

        const v1Mat = new THREE.MeshBasicMaterial({
            color: 0x00ff88, // Verde para V1
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });

        const v1 = new THREE.Mesh(v1Geo, v1Mat);
        this.visualCortexLayers.push(v1);
        this.group.add(v1);

        // Glow de V1
        const v1GlowMat = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: this.config.opacity * 0.15,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const v1Glow = new THREE.Mesh(v1Geo.clone(), v1GlowMat);
        v1Glow.scale.setScalar(1.5);
        this.group.add(v1Glow);

        // Anillos de actividad visual
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.RingGeometry(0.04 + i * 0.02, 0.05 + i * 0.02, 16);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: this.config.opacity * (0.3 - i * 0.08),
                side: THREE.DoubleSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(sideMultiplier * 0.05, 0, -0.2);
            ring.rotation.y = sideMultiplier * Math.PI * 0.1;
            ring.userData = { layer: i, baseOpacity: 0.3 - i * 0.08 };

            this.visualCortexLayers.push(ring);
            this.group.add(ring);
        }
    }

    createNeuralActivity() {
        const neuronCount = 18;
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < neuronCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 0.2 + Math.random() * 0.08;

            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);

            // Solo en parte posterior
            if (z > 0) z *= -1;
            if (x * sideMultiplier < 0) x *= -1;

            const neuronGeo = new THREE.SphereGeometry(0.008, 6, 6);
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
                speed: 0.8 + Math.random() * 2, // Más rápido (visual)
                baseOpacity: 0.3 + Math.random() * 0.3
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
        const pulse = 1 + Math.sin(time * 0.4 + 1.5) * 0.008;
        this.group.scale.setScalar(this.config.scale * pulse);

        // Actividad neural más rápida (procesamiento visual)
        this.neurons.forEach(neuron => {
            const { phase, speed, baseOpacity } = neuron.userData;
            const wave = Math.sin(time * speed + phase);
            neuron.material.opacity = baseOpacity * (0.4 + wave * 0.6);
            neuron.scale.setScalar(0.7 + wave * 0.5);
        });

        // Pulso de gyri
        this.gyri.forEach((gyrus, i) => {
            const gyrusPulse = 0.5 + Math.sin(time * 1.8 + i * 0.4) * 0.3;
            gyrus.material.opacity = this.config.opacity * 0.6 * gyrusPulse;
        });

        // Pulso de las capas visuales (simula procesamiento)
        this.visualCortexLayers.forEach((layer, i) => {
            if (layer.userData?.layer !== undefined) {
                const layerPulse = 0.5 + Math.sin(time * 3 + i * 0.5) * 0.5;
                layer.material.opacity = layer.userData.baseOpacity * layerPulse;
                layer.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
            }
        });
    }
}
