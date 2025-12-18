/**
 * Región Sacra - Sección final (S1-S5 + Cóccix)
 * Controla: pelvis, órganos pélvicos, piernas
 * Nota: Aquí solo hay nervios (cauda equina), no médula espinal
 */

import * as THREE from 'three';

export class SacralSpine {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            opacity: config.opacity || 0.14,
            scale: config.scale || 1,
            startPoint: config.startPoint || new THREE.Vector3(0, -8, 0),
            length: config.length || 1.5,
            ...config
        };

        this.endPoint = new THREE.Vector3();
        this.curve = null;
        this.neurons = [];

        this.create();
    }

    create() {
        this.createSacralCanal();
        this.createSacralNerves();
        this.createFilumTerminale();
        this.createCoccyx();
    }

    createSacralCanal() {
        const start = this.config.startPoint;
        const length = this.config.length;

        // El canal sacro tiene forma triangular
        const points = [];
        const segments = 30;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = start.y - t * length;

            // Curvatura sacra (cifosis)
            const curve = Math.sin(t * Math.PI * 0.6) * 0.15;
            const z = start.z + curve;

            const x = start.x;

            points.push(new THREE.Vector3(x, y, z));
        }

        this.curve = new THREE.CatmullRomCurve3(points);
        this.endPoint = points[points.length - 1].clone();

        // Canal sacro - más ancho arriba, más estrecho abajo
        const tubeGeo = new THREE.TubeGeometry(this.curve, 40, 0.04, 6, false);
        const positions = tubeGeo.attributes.position;

        // Adelgazar progresivamente
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            const normalizedY = Math.max(0, Math.min(1, (y - this.endPoint.y) / length));
            const taper = 0.3 + normalizedY * 0.7;

            const x = positions.getX(i);
            const z = positions.getZ(i);

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

        // Línea central (filum terminale)
        const lineGeo = new THREE.BufferGeometry().setFromPoints(this.curve.getPoints(40));
        const lineMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 1.1,
            depthWrite: false
        });
        this.group.add(new THREE.Line(lineGeo, lineMat));
    }

    createSacralNerves() {
        // 5 pares de nervios sacros + nervios coccígeos
        const nerveMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        const nerveCount = 6; // 5 sacros + 1 coccígeo

        for (let i = 0; i < nerveCount; i++) {
            const t = (i + 0.3) / nerveCount;
            const point = this.curve.getPoint(t);

            // Los nervios sacros salen por los forámenes sacros
            for (let side = -1; side <= 1; side += 2) {
                const spread = 0.2 + i * 0.05; // Se abren más hacia abajo

                const nervePoints = [
                    point.clone(),
                    new THREE.Vector3(
                        point.x + side * 0.08,
                        point.y - 0.02,
                        point.z + 0.05
                    ),
                    new THREE.Vector3(
                        point.x + side * spread,
                        point.y - 0.06,
                        point.z + 0.1
                    ),
                    new THREE.Vector3(
                        point.x + side * spread * 1.5,
                        point.y - 0.12,
                        point.z + 0.08
                    )
                ];

                const nerveCurve = new THREE.CatmullRomCurve3(nervePoints);
                const nerveGeo = new THREE.BufferGeometry().setFromPoints(nerveCurve.getPoints(10));
                this.group.add(new THREE.Line(nerveGeo, nerveMat.clone()));
            }
        }
    }

    createFilumTerminale() {
        // Filum terminale - extensión fibrosa que ancla la médula
        const endPoint = this.endPoint;

        const points = [
            endPoint.clone(),
            new THREE.Vector3(endPoint.x, endPoint.y - 0.3, endPoint.z + 0.02),
            new THREE.Vector3(endPoint.x, endPoint.y - 0.6, endPoint.z + 0.01),
            new THREE.Vector3(endPoint.x, endPoint.y - 0.8, endPoint.z)
        ];

        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));

        const lineMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });

        this.group.add(new THREE.Line(lineGeo, lineMat));
    }

    createCoccyx() {
        // Cóccix - hueso vestigial al final de la columna
        const geometry = new THREE.ConeGeometry(0.03, 0.2, 8, 3);

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        const coccyx = new THREE.Mesh(geometry, material);
        coccyx.position.set(
            this.endPoint.x,
            this.endPoint.y - 0.9,
            this.endPoint.z
        );
        coccyx.rotation.x = Math.PI; // Apuntar hacia abajo

        this.group.add(coccyx);
    }

    getMesh() {
        return this.group;
    }

    getEndPoint() {
        return new THREE.Vector3(
            this.endPoint.x,
            this.endPoint.y - 1.1,
            this.endPoint.z
        );
    }

    getCurve() {
        return this.curve;
    }

    animate(time) {
        // Muy sutil - esta zona tiene menos actividad visible
        const pulse = 1 + Math.sin(time * 0.3) * 0.002;
        this.group.scale.setScalar(this.config.scale * pulse);
    }
}
