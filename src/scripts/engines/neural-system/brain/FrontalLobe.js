/**
 * Lóbulo Frontal - Parte anterior del cerebro (VERSIÓN REALISTA)
 * Responsable de: pensamiento, planificación, movimiento voluntario, personalidad
 *
 * Anatomía incluida:
 * - Gyrus frontal superior, medio e inferior
 * - Gyrus precentral (corteza motora primaria)
 * - Sulcos principales (frontal superior, inferior, precentral)
 * - Polo frontal
 */

import * as THREE from 'three';

export class FrontalLobe {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            opacity: config.opacity || 0.25,
            scale: config.scale || 1,
            side: config.side || 'left',
            detail: config.detail || 'high', // 'low', 'medium', 'high'
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
        // Geometría base con más resolución para detalles
        const segments = this.config.detail === 'high' ? 48 : 32;
        const geometry = new THREE.SphereGeometry(0.42, segments, segments);
        const positions = geometry.attributes.position;

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // === FORMA ANATÓMICA DEL LÓBULO FRONTAL ===

            // Polo frontal - más redondeado y prominente
            if (z > 0.2) {
                const poleFactor = Math.pow((z - 0.2) / 0.3, 0.7);
                z *= 1 + poleFactor * 0.4;
                // Curvatura del polo
                const poleRound = Math.sqrt(1 - Math.pow(x / 0.5, 2) - Math.pow(y / 0.5, 2)) * 0.1;
                z += Math.max(0, poleRound);
            }

            // Borde orbital (parte inferior, sobre los ojos)
            if (y < -0.15 && z > 0) {
                y *= 0.85;
                // Curvatura orbital
                const orbitalCurve = Math.sin((z / 0.5) * Math.PI * 0.5) * 0.08;
                y -= orbitalCurve;
            }

            // Fisura longitudinal (lado interno, entre hemisferios)
            if (x * sideMultiplier < 0) {
                const flattenFactor = Math.abs(x * sideMultiplier) / 0.5;
                x *= 0.4 + flattenFactor * 0.3;
            }

            // Borde posterior (donde conecta con parietal)
            if (z < -0.15) {
                z = -0.15 - (z + 0.15) * 0.4;
                // Surco central (límite con parietal)
                const centralSulcus = Math.sin(y * 8) * 0.02;
                z += centralSulcus;
            }

            // Convexidad lateral (superficie externa)
            if (x * sideMultiplier > 0.1) {
                const lateralBulge = Math.sin((y + 0.3) * Math.PI) * 0.05;
                x += lateralBulge * sideMultiplier;
            }

            // === CIRCUNVOLUCIONES PRINCIPALES (GYRI) ===

            // Gyrus frontal superior
            const gfs = Math.sin(z * 12 + y * 3) * Math.cos(x * 8) * 0.025;

            // Gyrus frontal medio
            const gfm = Math.sin(z * 10 - y * 5) * Math.sin(x * 6 + z * 4) * 0.022;

            // Gyrus frontal inferior
            const gfi = Math.cos(z * 14 + x * 7) * Math.sin(y * 9) * 0.018;

            // Gyrus precentral (corteza motora)
            const precentral = Math.sin(y * 16) * Math.cos(z * 4) * 0.015;

            // Aplicar gyri solo en la superficie
            const dist = Math.sqrt(x * x + y * y + z * z);
            const surfaceFactor = Math.max(0, Math.min(1, (dist - 0.25) / 0.2));

            x += (gfs + gfm * 0.5) * surfaceFactor * sideMultiplier * 0.5;
            y += (gfi + precentral) * surfaceFactor;
            z += (gfs * 0.3 + gfm * 0.4) * surfaceFactor;

            // === TEXTURA FINA DE LA CORTEZA ===
            const microGyri1 = Math.sin(x * 35 + y * 28 + z * 22) * 0.008;
            const microGyri2 = Math.cos(y * 32 - z * 25 + x * 18) * 0.006;
            const microGyri3 = Math.sin(z * 38 + x * 30) * 0.005;

            x += microGyri1 * surfaceFactor;
            y += microGyri2 * surfaceFactor;
            z += microGyri3 * surfaceFactor;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        // Capa wireframe principal
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });
        const wireMesh = new THREE.Mesh(geometry, wireMaterial);
        this.group.add(wireMesh);

        // Capa sólida semitransparente (da profundidad)
        const solidMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.15,
            side: THREE.BackSide,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(geometry.clone(), solidMaterial));

        // Capa de brillo interior
        const innerGlow = new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.1,
            side: THREE.FrontSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const innerMesh = new THREE.Mesh(geometry.clone(), innerGlow);
        innerMesh.scale.setScalar(0.92);
        this.group.add(innerMesh);
    }

    createGyri() {
        // Líneas que marcan los principales gyri (circunvoluciones)
        const gyriMaterial = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Gyrus frontal superior
        const gfsPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = -0.1 + t * 0.5;
            const y = 0.25 + Math.sin(t * Math.PI) * 0.08;
            const x = sideMultiplier * (0.15 + Math.sin(t * Math.PI * 2) * 0.03);
            gfsPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(gfsPoints, gyriMaterial);

        // Gyrus frontal medio
        const gfmPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = -0.05 + t * 0.45;
            const y = 0.05 + Math.sin(t * Math.PI * 1.5) * 0.06;
            const x = sideMultiplier * (0.28 + Math.sin(t * Math.PI * 3) * 0.04);
            gfmPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(gfmPoints, gyriMaterial);

        // Gyrus frontal inferior
        const gfiPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = 0 + t * 0.4;
            const y = -0.12 + Math.sin(t * Math.PI) * 0.05;
            const x = sideMultiplier * (0.32 + Math.sin(t * Math.PI * 2.5) * 0.03);
            gfiPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(gfiPoints, gyriMaterial);

        // Gyrus precentral (corteza motora primaria)
        const precentralPoints = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const y = -0.3 + t * 0.6;
            const z = -0.12 + Math.sin(t * Math.PI) * 0.04;
            const x = sideMultiplier * (0.2 + Math.cos(t * Math.PI * 2) * 0.05);
            precentralPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addGyrusLine(precentralPoints, gyriMaterial);
    }

    addGyrusLine(points, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
        const line = new THREE.Line(lineGeo, material.clone());
        this.gyri.push(line);
        this.group.add(line);
    }

    createSulci() {
        // Surcos principales (más oscuros/profundos)
        const sulciMaterial = new THREE.LineBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });

        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Sulco frontal superior
        const sfsPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = -0.08 + t * 0.48;
            const y = 0.15 + Math.sin(t * Math.PI * 1.2) * 0.03;
            const x = sideMultiplier * (0.22 + Math.sin(t * Math.PI * 2.5) * 0.02);
            sfsPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(sfsPoints, sulciMaterial);

        // Sulco frontal inferior
        const sfiPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const z = 0.02 + t * 0.38;
            const y = -0.05 + Math.sin(t * Math.PI * 1.3) * 0.04;
            const x = sideMultiplier * (0.3 + Math.sin(t * Math.PI * 2) * 0.025);
            sfiPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(sfiPoints, sulciMaterial);

        // Sulco precentral
        const precentralSulcus = [];
        for (let t = 0; t <= 1; t += 0.04) {
            const y = -0.25 + t * 0.55;
            const z = -0.08 + Math.sin(t * Math.PI * 0.8) * 0.03;
            const x = sideMultiplier * (0.25 + Math.cos(t * Math.PI * 1.5) * 0.03);
            precentralSulcus.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(precentralSulcus, sulciMaterial);

        // Fisura lateral (Silvio) - parte frontal
        const sylvianPoints = [];
        for (let t = 0; t <= 0.5; t += 0.05) {
            const z = 0.1 + t * 0.3;
            const y = -0.18 - t * 0.1;
            const x = sideMultiplier * (0.35 + t * 0.08);
            sylvianPoints.push(new THREE.Vector3(x, y, z));
        }
        this.addSulcusLine(sylvianPoints, sulciMaterial);
    }

    addSulcusLine(points, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(25));
        const line = new THREE.Line(lineGeo, material.clone());
        this.sulci.push(line);
        this.group.add(line);
    }

    createCorticalLayers() {
        // Representación de las capas corticales (efecto de profundidad)
        const layerCount = 3;

        for (let i = 0; i < layerCount; i++) {
            const scale = 0.85 - i * 0.08;
            const opacity = this.config.opacity * (0.1 - i * 0.02);

            const layerGeo = new THREE.SphereGeometry(0.4 * scale, 20, 20);
            const layerMat = new THREE.MeshBasicMaterial({
                color: this.config.secondaryColor,
                wireframe: true,
                transparent: true,
                opacity: opacity,
                depthWrite: false
            });

            const layer = new THREE.Mesh(layerGeo, layerMat);
            this.group.add(layer);
        }
    }

    createNeuralActivity() {
        // Puntos de actividad neural dispersos
        const neuronCount = 25;
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < neuronCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 0.35 + Math.random() * 0.08;

            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);

            // Solo en el hemisferio correcto y parte frontal
            if (x * sideMultiplier < 0) x *= -1;
            if (z < -0.1) continue;

            const neuronGeo = new THREE.SphereGeometry(0.012, 6, 6);
            const neuronMat = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: 0.4,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const neuron = new THREE.Mesh(neuronGeo, neuronMat);
            neuron.position.set(x, y, z);
            neuron.userData = {
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5,
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
        // Pulso sutil de la estructura principal
        const pulse = 1 + Math.sin(time * 0.5) * 0.008;
        this.group.scale.setScalar(this.config.scale * pulse);

        // Animar actividad neural
        this.neurons.forEach(neuron => {
            const { phase, speed, baseOpacity } = neuron.userData;
            const wave = Math.sin(time * speed + phase);

            neuron.material.opacity = baseOpacity * (0.5 + wave * 0.5);
            neuron.scale.setScalar(0.8 + wave * 0.4);
        });

        // Pulso de los gyri
        this.gyri.forEach((gyrus, i) => {
            const gyrusPulse = 0.5 + Math.sin(time * 1.5 + i * 0.5) * 0.3;
            gyrus.material.opacity = this.config.opacity * 0.6 * gyrusPulse;
        });
    }
}
