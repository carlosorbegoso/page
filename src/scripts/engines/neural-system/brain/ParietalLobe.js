/**
 * Lóbulo Parietal - Parte superior central del cerebro (VERSIÓN REALISTA)
 * Responsable de: sensaciones táctiles, percepción espacial, integración sensorial
 *
 * Anatomía incluida:
 * - Gyrus postcentral (corteza somatosensorial primaria)
 * - Lobulillo parietal superior e inferior
 * - Gyrus supramarginal y angular
 * - Sulcos principales (postcentral, intraparietal)
 */

import * as THREE from 'three';

export class ParietalLobe {
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
        this.createCorticalLayers();
        this.createNeuralActivity();
    }

    createMainStructure() {
        const segments = this.config.detail === 'high' ? 44 : 28;
        const geometry = new THREE.SphereGeometry(0.38, segments, segments);
        const positions = geometry.attributes.position;

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // === FORMA ANATÓMICA DEL LÓBULO PARIETAL ===

            // Elevación superior (parte más alta del cerebro)
            if (y > 0.1) {
                y *= 1.25;
                // Corona redondeada
                const crown = Math.sqrt(Math.max(0, 1 - Math.pow(x / 0.4, 2) - Math.pow(z / 0.4, 2))) * 0.08;
                y += crown;
            }

            // Aplanamiento superior para forma más realista
            if (y > 0.35) {
                y = 0.35 + (y - 0.35) * 0.5;
            }

            // Fisura longitudinal (entre hemisferios)
            if (x * sideMultiplier < 0) {
                const flattenFactor = Math.abs(x * sideMultiplier) / 0.4;
                x *= 0.35 + flattenFactor * 0.35;
            }

            // Borde anterior (donde conecta con frontal - surco central)
            if (z > 0.15) {
                z = 0.15 + (z - 0.15) * 0.4;
                const centralSulcus = Math.sin(y * 10) * 0.025;
                z -= centralSulcus;
            }

            // Borde posterior (hacia occipital)
            if (z < -0.2) {
                z *= 0.85;
                // Surco parieto-occipital
                const poSulcus = Math.sin(y * 6) * 0.02;
                z += poSulcus;
            }

            // Borde inferior (hacia temporal)
            if (y < -0.15) {
                y *= 0.8;
                // Fisura lateral (Silvio)
                const sylvian = Math.sin(z * 8) * 0.015;
                y -= sylvian;
            }

            // Convexidad lateral
            if (x * sideMultiplier > 0.1) {
                const lateralBulge = Math.sin(y * Math.PI) * 0.06;
                x += lateralBulge * sideMultiplier;
            }

            // === CIRCUNVOLUCIONES (GYRI) ===

            // Gyrus postcentral (somatosensorial)
            const postcentral = Math.sin(y * 14) * Math.cos(z * 5) * 0.02;

            // Lobulillo parietal superior
            const spl = Math.sin(z * 10 + y * 4) * Math.cos(x * 7) * 0.022;

            // Lobulillo parietal inferior
            const ipl = Math.cos(z * 12 - x * 6) * Math.sin(y * 8) * 0.018;

            // Gyrus supramarginal
            const supramarginal = Math.sin(y * 11 + z * 9) * 0.015;

            const dist = Math.sqrt(x * x + y * y + z * z);
            const surfaceFactor = Math.max(0, Math.min(1, (dist - 0.22) / 0.18));

            x += (spl * 0.4 + ipl * 0.3) * surfaceFactor * sideMultiplier * 0.6;
            y += (postcentral + supramarginal * 0.5) * surfaceFactor;
            z += (spl * 0.3 + postcentral * 0.2) * surfaceFactor;

            // === TEXTURA FINA ===
            const microGyri1 = Math.sin(x * 38 + y * 30 + z * 25) * 0.007;
            const microGyri2 = Math.cos(y * 35 - z * 28 + x * 20) * 0.005;

            x += microGyri1 * surfaceFactor;
            y += microGyri2 * surfaceFactor;
            z += microGyri1 * 0.5 * surfaceFactor;

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
            opacity: this.config.opacity * 0.1,
            side: THREE.FrontSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const innerMesh = new THREE.Mesh(geometry.clone(), innerGlow);
        innerMesh.scale.setScalar(0.9);
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

        // Gyrus postcentral
        const postcentralPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const y = -0.25 + t * 0.55;
            const z = 0.1 + Math.sin(t * Math.PI) * 0.05;
            const x = sideMultiplier * (0.18 + Math.cos(t * Math.PI * 2) * 0.04);
            postcentralPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(postcentralPoints, gyriMaterial);

        // Lobulillo parietal superior
        const splPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = 0 - t * 0.35;
            const y = 0.28 + Math.sin(t * Math.PI) * 0.06;
            const x = sideMultiplier * (0.12 + Math.sin(t * Math.PI * 2) * 0.03);
            splPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(splPoints, gyriMaterial);

        // Gyrus supramarginal
        const supramarginalPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = -0.08 + t * 0.25;
            const y = -0.1 + Math.sin(t * Math.PI * 1.5) * 0.08;
            const x = sideMultiplier * (0.3 + Math.sin(t * Math.PI * 2) * 0.04);
            supramarginalPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(supramarginalPoints, gyriMaterial);

        // Gyrus angular
        const angularPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = -0.18 + t * 0.2;
            const y = -0.05 + Math.sin(t * Math.PI) * 0.05;
            const x = sideMultiplier * (0.28 + Math.cos(t * Math.PI * 1.5) * 0.03);
            angularPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(angularPoints, gyriMaterial);
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

        // Sulco postcentral
        const postcentralSulcus = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const y = -0.2 + t * 0.5;
            const z = 0.05 + Math.sin(t * Math.PI * 0.8) * 0.04;
            const x = sideMultiplier * (0.22 + Math.cos(t * Math.PI * 1.5) * 0.025);
            postcentralSulcus.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(postcentralSulcus, sulciMaterial);

        // Sulco intraparietal
        const ips = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = 0.02 - t * 0.32;
            const y = 0.08 + Math.sin(t * Math.PI) * 0.03;
            const x = sideMultiplier * (0.2 + Math.sin(t * Math.PI * 2) * 0.025);
            ips.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(ips, sulciMaterial);

        // Surco parieto-occipital (borde posterior)
        const pos = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const y = -0.15 + t * 0.4;
            const z = -0.22 + Math.sin(t * Math.PI) * 0.03;
            const x = sideMultiplier * (0.1 + t * 0.05);
            pos.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(pos, sulciMaterial);
    }

    addSulcusLine(points, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
        const line = new THREE.Line(lineGeo, material.clone());
        this.sulci.push(line);
        this.group.add(line);
    }

    createCorticalLayers() {
        for (let i = 0; i < 3; i++) {
            const scale = 0.85 - i * 0.1;
            const opacity = this.config.opacity * (0.08 - i * 0.02);

            const layerGeo = new THREE.SphereGeometry(0.35 * scale, 18, 18);
            const layerMat = new THREE.MeshBasicMaterial({
                color: this.config.secondaryColor,
                wireframe: true,
                transparent: true,
                opacity: opacity,
                depthWrite: false
            });

            this.group.add(new THREE.Mesh(layerGeo, layerMat));
        }
    }

    createNeuralActivity() {
        const neuronCount = 20;
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < neuronCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 0.3 + Math.random() * 0.08;

            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);

            if (x * sideMultiplier < 0) x *= -1;
            if (y < -0.15) continue;

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
        const pulse = 1 + Math.sin(time * 0.45 + 0.5) * 0.008;
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
