/**
 * Médula Espinal Lumbar - Sección de la espalda baja (L1-L5)
 * Controla: caderas, piernas, parte del abdomen
 * Nota: La médula espinal termina aproximadamente en L1-L2 (cono medular)
 */

import * as THREE from 'three';

export class LumbarSpine {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            opacity: config.opacity || 0.16,
            scale: config.scale || 1,
            startPoint: config.startPoint || new THREE.Vector3(0, -6, 0),
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
        this.createConusMedullaris(); // Cono medular - donde termina la médula
        this.createVertebrae();
        this.createCaudaEquina(); // Cola de caballo
        this.createNeurons();
    }

    createSpinalCord() {
        const start = this.config.startPoint;
        const length = this.config.length;

        // Curva lumbar - lordosis (cóncava hacia atrás)
        const points = [];
        const segments = 40;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = start.y - t * length;

            // Curvatura lumbar natural (lordosis)
            const curve = -Math.sin(t * Math.PI * 0.8) * 0.2;
            const z = start.z + curve;

            // Muy poca ondulación lateral
            const x = start.x + Math.sin(t * Math.PI * 2) * 0.015;

            points.push(new THREE.Vector3(x, y, z));
        }

        this.curve = new THREE.CatmullRomCurve3(points);
        this.endPoint = points[points.length - 1].clone();

        // Tubo principal - se adelgaza hacia el final
        const tubeGeo = new THREE.TubeGeometry(this.curve, 60, 0.06, 8, false);
        const positions = tubeGeo.attributes.position;

        // Adelgazar el tubo hacia el final (cono medular)
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            const normalizedY = Math.max(0, Math.min(1, (y - this.endPoint.y) / length));
            const taper = 0.5 + normalizedY * 0.5;

            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Mantener la posición Y, solo ajustar X y Z
            const curveT = Math.max(0, Math.min(1, 1 - normalizedY));
            const centerPoint = this.curve.getPoint(curveT);

            positions.setX(i, centerPoint.x + (x - centerPoint.x) * taper);
            positions.setZ(i, centerPoint.z + (z - centerPoint.z) * taper);
        }

        tubeGeo.computeVertexNormals();

        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(tubeGeo, tubeMat));

        // Línea central
        const lineGeo = new THREE.BufferGeometry().setFromPoints(this.curve.getPoints(60));
        const lineMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 1.2,
            depthWrite: false
        });
        this.group.add(new THREE.Line(lineGeo, lineMat));
    }

    createConusMedullaris() {
        // El cono medular es donde termina la médula espinal
        const geometry = new THREE.ConeGeometry(0.05, 0.15, 12, 4);
        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.9,
            depthWrite: false
        });

        const conus = new THREE.Mesh(geometry, material);
        conus.position.copy(this.endPoint);
        conus.rotation.x = Math.PI; // Apuntar hacia abajo
        this.group.add(conus);
    }

    createVertebrae() {
        // 5 vértebras lumbares (L1-L5)
        const vertebraCount = 5;

        for (let i = 0; i < vertebraCount; i++) {
            const t = (i + 0.5) / vertebraCount;
            const point = this.curve.getPoint(t);
            const tangent = this.curve.getTangent(t);

            // Vértebras lumbares son las más grandes
            const ringGeo = new THREE.TorusGeometry(0.09, 0.01, 6, 12);
            const ringMat = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: this.config.opacity * 0.6,
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

    createCaudaEquina() {
        // Cola de caballo - nervios que continúan después del cono medular
        const nerveMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });

        const nerveCount = 10;
        const startY = this.endPoint.y;

        for (let i = 0; i < nerveCount; i++) {
            const angle = (i / nerveCount) * Math.PI * 2;
            const spreadFactor = 0.3 + (i / nerveCount) * 0.4;

            const points = [
                this.endPoint.clone(),
                new THREE.Vector3(
                    this.endPoint.x + Math.cos(angle) * 0.05,
                    startY - 0.3,
                    this.endPoint.z + Math.sin(angle) * 0.05
                ),
                new THREE.Vector3(
                    this.endPoint.x + Math.cos(angle) * spreadFactor * 0.4,
                    startY - 0.8,
                    this.endPoint.z + Math.sin(angle) * spreadFactor * 0.3
                ),
                new THREE.Vector3(
                    this.endPoint.x + Math.cos(angle) * spreadFactor * 0.6,
                    startY - 1.5,
                    this.endPoint.z + Math.sin(angle) * spreadFactor * 0.4
                )
            ];

            const nerveCurve = new THREE.CatmullRomCurve3(points);
            const nerveGeo = new THREE.BufferGeometry().setFromPoints(nerveCurve.getPoints(15));
            this.group.add(new THREE.Line(nerveGeo, nerveMat.clone()));
        }
    }

    createNeurons() {
        const neuronGeo = new THREE.SphereGeometry(0.015, 6, 6);
        const neuronCount = 20;

        for (let i = 0; i < neuronCount; i++) {
            const t = i / neuronCount;
            const point = this.curve.getPoint(t);

            const angle = i * 137.5 * (Math.PI / 180);
            const radius = 0.04 + Math.random() * 0.02;

            const x = point.x + Math.cos(angle) * radius;
            const y = point.y;
            const z = point.z + Math.sin(angle) * radius;

            const color = new THREE.Color();
            color.setHSL(0.48 + t * 0.08, 1, 0.5 + Math.random() * 0.2);

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.2,
                depthWrite: false
            });

            const neuron = new THREE.Mesh(neuronGeo, material);
            neuron.position.set(x, y, z);

            neuron.userData = {
                t: t,
                originalPos: new THREE.Vector3(x, y, z),
                phase: Math.random() * Math.PI * 2,
                baseOpacity: 0.15 + Math.random() * 0.08
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
            const wave = Math.sin(time * 1.5 - t * 12);
            neuron.material.opacity = baseOpacity * (0.7 + wave * 0.3);
            neuron.scale.setScalar(1 + wave * 0.1);
        });
    }
}
