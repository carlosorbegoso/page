/**
 * Cuerpo Calloso - Principal conexión entre los dos hemisferios cerebrales
 * La mayor estructura de materia blanca del cerebro
 */

import * as THREE from 'three';

export class CorpusCallosum {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            opacity: config.opacity || 0.14,
            scale: config.scale || 1,
            ...config
        };

        this.create();
    }

    create() {
        this.createMainBody();
        this.createGenu();      // Parte frontal (rodilla)
        this.createSplenium();  // Parte posterior
        this.createFibers();
    }

    createMainBody() {
        // Cuerpo principal del cuerpo calloso
        const shape = new THREE.Shape();

        // Perfil lateral del cuerpo calloso (forma de C alargada)
        shape.moveTo(0.5, 0);
        shape.quadraticCurveTo(0.55, 0.08, 0.45, 0.12);
        shape.quadraticCurveTo(0.2, 0.15, 0, 0.14);
        shape.quadraticCurveTo(-0.2, 0.15, -0.45, 0.1);
        shape.quadraticCurveTo(-0.55, 0.05, -0.5, -0.02);
        shape.quadraticCurveTo(-0.45, -0.08, -0.3, -0.05);
        shape.quadraticCurveTo(0, -0.02, 0.3, -0.05);
        shape.quadraticCurveTo(0.45, -0.08, 0.5, 0);

        const extrudeSettings = {
            steps: 1,
            depth: 0.15,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 3
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        this.group.add(mesh);
    }

    createGenu() {
        // Genu (rodilla) - parte frontal curvada
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.45, 0, 0.05),
            new THREE.Vector3(0.5, -0.05, 0.04),
            new THREE.Vector3(0.52, -0.12, 0),
            new THREE.Vector3(0.48, -0.18, -0.05)
        ]);

        const tubeGeo = new THREE.TubeGeometry(curve, 15, 0.04, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.9,
            depthWrite: false
        });

        this.group.add(new THREE.Mesh(tubeGeo, tubeMat));
    }

    createSplenium() {
        // Splenium - parte posterior más gruesa
        const geometry = new THREE.SphereGeometry(0.08, 12, 10);
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Aplanar y estirar
            y *= 0.5;
            x *= 1.3;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.9,
            depthWrite: false
        });

        const splenium = new THREE.Mesh(geometry, material);
        splenium.position.set(-0.48, 0, 0.03);
        this.group.add(splenium);
    }

    createFibers() {
        // Fibras que cruzan de un hemisferio a otro
        const fiberMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });

        for (let i = 0; i < 15; i++) {
            const z = -0.4 + i * 0.06;
            const height = 0.1 - Math.abs(z) * 0.15;

            const points = [
                new THREE.Vector3(-0.3, -height, z * 0.15),
                new THREE.Vector3(-0.15, 0, z * 0.1),
                new THREE.Vector3(0, 0.02, z * 0.08),
                new THREE.Vector3(0.15, 0, z * 0.1),
                new THREE.Vector3(0.3, -height, z * 0.15)
            ];

            const curve = new THREE.CatmullRomCurve3(points);
            const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(15));
            this.group.add(new THREE.Line(lineGeo, fiberMat.clone()));
        }
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    animate(time) {
        const pulse = 1 + Math.sin(time * 0.25) * 0.003;
        this.group.scale.setScalar(this.config.scale * pulse);
    }
}
