/**
 * Fórnix - Tracto de fibras nerviosas en forma de C
 * Conecta el hipocampo con los cuerpos mamilares
 * Importante para la memoria
 */

import * as THREE from 'three';

export class Fornix {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            opacity: config.opacity || 0.15,
            scale: config.scale || 1,
            ...config
        };

        this.create();
    }

    create() {
        // El fórnix tiene forma de C invertida
        // Conecta el hipocampo (temporal) con los cuerpos mamilares (hipotálamo)

        this.createMainArch();
        this.createColumns();
        this.createCrus();
    }

    createMainArch() {
        // Arco principal del fórnix
        const points = [
            // Pilar izquierdo (desde hipocampo izquierdo)
            new THREE.Vector3(-0.25, -0.2, 0.1),
            new THREE.Vector3(-0.2, 0, 0.15),
            new THREE.Vector3(-0.15, 0.15, 0.12),
            // Cuerpo del fórnix (parte superior)
            new THREE.Vector3(-0.08, 0.22, 0.08),
            new THREE.Vector3(0, 0.25, 0.05),
            new THREE.Vector3(0.08, 0.22, 0.08),
            // Pilar derecho (hacia hipocampo derecho)
            new THREE.Vector3(0.15, 0.15, 0.12),
            new THREE.Vector3(0.2, 0, 0.15),
            new THREE.Vector3(0.25, -0.2, 0.1)
        ];

        const curve = new THREE.CatmullRomCurve3(points);

        // Tubo del fórnix
        const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.025, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity,
            depthWrite: false
        });

        this.group.add(new THREE.Mesh(tubeGeo, tubeMat));

        // Línea central más brillante
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
        const lineMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 1.5,
            depthWrite: false
        });

        this.group.add(new THREE.Line(lineGeo, lineMat));
    }

    createColumns() {
        // Columnas del fórnix (van hacia los cuerpos mamilares)
        const columnPoints = [
            new THREE.Vector3(-0.05, 0.2, 0.06),
            new THREE.Vector3(-0.03, 0.1, 0.08),
            new THREE.Vector3(-0.02, 0, 0.1),
            new THREE.Vector3(0, -0.1, 0.08)
        ];

        const curve = new THREE.CatmullRomCurve3(columnPoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.015, 6, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });

        // Columna izquierda
        const leftColumn = new THREE.Mesh(tubeGeo, tubeMat);
        this.group.add(leftColumn);

        // Columna derecha (espejada)
        const rightColumn = new THREE.Mesh(tubeGeo.clone(), tubeMat.clone());
        rightColumn.scale.x = -1;
        this.group.add(rightColumn);
    }

    createCrus() {
        // Crus del fórnix (brazos que van al hipocampo)
        const crusPoints = [
            new THREE.Vector3(-0.2, 0.05, 0.14),
            new THREE.Vector3(-0.28, -0.05, 0.18),
            new THREE.Vector3(-0.35, -0.15, 0.2),
            new THREE.Vector3(-0.4, -0.22, 0.18)
        ];

        const curve = new THREE.CatmullRomCurve3(crusPoints);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
        const lineMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            depthWrite: false
        });

        // Crus izquierdo
        this.group.add(new THREE.Line(lineGeo, lineMat));

        // Crus derecho (espejado)
        const rightCrusPoints = crusPoints.map(p => new THREE.Vector3(-p.x, p.y, p.z));
        const rightCurve = new THREE.CatmullRomCurve3(rightCrusPoints);
        const rightLineGeo = new THREE.BufferGeometry().setFromPoints(rightCurve.getPoints(20));
        this.group.add(new THREE.Line(rightLineGeo, lineMat.clone()));
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    animate(time) {
        // Pulso muy sutil de las fibras
        const pulse = 1 + Math.sin(time * 0.4 + 2) * 0.003;
        this.group.scale.setScalar(this.config.scale * pulse);
    }
}
