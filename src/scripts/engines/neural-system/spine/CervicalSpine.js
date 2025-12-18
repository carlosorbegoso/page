/**
 * Médula Espinal Cervical - Sección del cuello (C1-C8)
 * Controla: cuello, hombros, brazos, manos, diafragma
 */

import * as THREE from 'three';

export class CervicalSpine {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            opacity: config.opacity || 0.2,
            scale: config.scale || 1,
            startPoint: config.startPoint || new THREE.Vector3(0, 0, 0),
            length: config.length || 2,
            ...config
        };

        this.endPoint = new THREE.Vector3();
        this.curve = null;
        this.neurons = [];

        this.create();
    }

    create() {
        this.createSpinalCord();
        this.createVertebrae();
        this.createNerveRoots();
        this.createNeurons();
    }

    createSpinalCord() {
        const start = this.config.startPoint;
        const length = this.config.length;

        // Curva cervical - ligera curvatura lordótica (cóncava hacia atrás)
        const points = [];
        const segments = 30;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = start.y - t * length;

            // Curvatura cervical natural
            const curve = Math.sin(t * Math.PI * 0.5) * 0.15;
            const z = start.z - curve;

            // Pequeña ondulación lateral
            const x = start.x + Math.sin(t * Math.PI * 2) * 0.03;

            points.push(new THREE.Vector3(x, y, z));
        }

        this.curve = new THREE.CatmullRomCurve3(points);
        this.endPoint = points[points.length - 1].clone();

        // Tubo principal
        const tubeGeo = new THREE.TubeGeometry(this.curve, 50, 0.08, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(tubeGeo, tubeMat));

        // Línea central
        const lineGeo = new THREE.BufferGeometry().setFromPoints(this.curve.getPoints(50));
        const lineMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 1.3,
            depthWrite: false
        });
        this.group.add(new THREE.Line(lineGeo, lineMat));
    }

    createVertebrae() {
        // 7 vértebras cervicales (C1-C7)
        const vertebraCount = 7;

        for (let i = 0; i < vertebraCount; i++) {
            const t = (i + 0.5) / vertebraCount;
            const point = this.curve.getPoint(t);
            const tangent = this.curve.getTangent(t);

            // Anillo vertebral
            const ringGeo = new THREE.TorusGeometry(0.12, 0.015, 6, 16);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: this.config.opacity * 0.7,
                depthWrite: false
            });

            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.copy(point);

            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
            ring.quaternion.copy(quaternion);

            this.group.add(ring);
        }
    }

    createNerveRoots() {
        // 8 pares de nervios cervicales
        const nerveCount = 8;
        const nerveMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        for (let i = 0; i < nerveCount; i++) {
            const t = (i + 0.3) / nerveCount;
            const point = this.curve.getPoint(t);

            // Nervios a ambos lados
            for (let side = -1; side <= 1; side += 2) {
                const nervePoints = [
                    point.clone(),
                    new THREE.Vector3(
                        point.x + side * 0.15,
                        point.y - 0.03,
                        point.z + 0.02
                    ),
                    new THREE.Vector3(
                        point.x + side * 0.3,
                        point.y - 0.08,
                        point.z + 0.05
                    ),
                    new THREE.Vector3(
                        point.x + side * 0.5,
                        point.y - 0.15,
                        point.z + 0.03
                    )
                ];

                const nerveCurve = new THREE.CatmullRomCurve3(nervePoints);
                const nerveGeo = new THREE.BufferGeometry().setFromPoints(nerveCurve.getPoints(12));
                this.group.add(new THREE.Line(nerveGeo, nerveMat.clone()));
            }
        }
    }

    createNeurons() {
        const neuronGeo = new THREE.SphereGeometry(0.02, 6, 6);
        const neuronCount = 20;

        for (let i = 0; i < neuronCount; i++) {
            const t = i / neuronCount;
            const point = this.curve.getPoint(t);

            const angle = i * 137.5 * (Math.PI / 180);
            const radius = 0.06 + Math.random() * 0.03;

            const x = point.x + Math.cos(angle) * radius;
            const y = point.y;
            const z = point.z + Math.sin(angle) * radius;

            const color = new THREE.Color();
            color.setHSL(0.52, 1, 0.55 + Math.random() * 0.2);

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.25,
                depthWrite: false
            });

            const neuron = new THREE.Mesh(neuronGeo, material);
            neuron.position.set(x, y, z);

            neuron.userData = {
                t: t,
                originalPos: new THREE.Vector3(x, y, z),
                phase: Math.random() * Math.PI * 2,
                baseOpacity: 0.2 + Math.random() * 0.1
            };

            this.neurons.push(neuron);
            this.group.add(neuron);
        }
    }

    getMesh() {
        return this.group;
    }

    getEndPoint() {
        return this.endPoint.clone();
    }

    getCurve() {
        return this.curve;
    }

    getNeurons() {
        return this.neurons;
    }

    animate(time) {
        this.neurons.forEach((neuron) => {
            const { t, originalPos, phase, baseOpacity } = neuron.userData;
            const wave = Math.sin(time * 2 - t * 8);
            neuron.material.opacity = baseOpacity * (0.7 + wave * 0.3);
            neuron.scale.setScalar(1 + wave * 0.15);
        });
    }
}
