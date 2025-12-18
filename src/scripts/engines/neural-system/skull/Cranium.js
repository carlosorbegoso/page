/**
 * Cranium - Bóveda craneal y suturas
 * Parte superior del cráneo
 */

import * as THREE from 'three';

export class Cranium {
    constructor(config, group) {
        this.config = config;
        this.group = group;
    }

    create() {
        this.createCranium();
    }

    createCranium() {
        // Bóveda craneal - forma elipsoidal
        const geometry = new THREE.SphereGeometry(0.28, 32, 24);

        // Deformar para forma de cráneo real
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            // Aplanar lateralmente
            const newX = x * 0.85;

            // Elongar hacia atrás
            const newZ = z * (z < 0 ? 1.2 : 0.9);

            // Aplanar arriba ligeramente
            const newY = y * (y > 0.15 ? 0.9 : 1);

            positions.setXYZ(i, newX, newY, newZ);
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity,
            wireframe: this.config.wireframe,
            side: THREE.DoubleSide
        });

        const cranium = new THREE.Mesh(geometry, material);
        cranium.position.set(0, 0.08, -0.02);
        this.group.add(cranium);

        // Líneas de sutura craneal
        this.addSutureLines(cranium);
    }

    addSutureLines(cranium) {
        // Sutura sagital (línea media superior)
        const sagittalPoints = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const z = -0.15 + t * 0.35;
            const y = 0.25 + Math.sin(t * Math.PI) * 0.05;
            sagittalPoints.push(new THREE.Vector3(0, y, z));
        }
        this.addSutureLine(sagittalPoints, cranium.position);

        // Sutura coronal (frontal)
        const coronalPoints = [];
        for (let i = 0; i <= 20; i++) {
            const t = (i / 20) * Math.PI;
            const x = Math.sin(t) * 0.22;
            const y = 0.15 + Math.cos(t) * 0.1;
            coronalPoints.push(new THREE.Vector3(x, y, 0.08));
        }
        this.addSutureLine(coronalPoints, cranium.position);
    }

    addSutureLine(points, offset) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
        const material = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 1.5
        });
        const line = new THREE.Line(geometry, material);
        line.position.copy(offset);
        this.group.add(line);
    }
}
