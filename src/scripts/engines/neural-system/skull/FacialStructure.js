/**
 * FacialStructure - Estructura facial del cráneo
 * Órbitas, nariz, mandíbula, pómulos
 */

import * as THREE from 'three';

export class FacialStructure {
    constructor(config, group) {
        this.config = config;
        this.group = group;
    }

    create() {
        this.createFace();
        this.createJaw();
        this.createOrbits();
        this.createNasalCavity();
    }

    createFace() {
        // Puntos para la estructura facial
        const vertices = new Float32Array([
            // Arco superciliar izquierdo
            -0.12, 0.02, 0.22,  -0.08, 0.05, 0.24,  -0.04, 0.06, 0.25,
            // Arco superciliar derecho
            0.04, 0.06, 0.25,   0.08, 0.05, 0.24,   0.12, 0.02, 0.22,
            // Pómulo izquierdo
            -0.18, -0.02, 0.18, -0.15, -0.05, 0.20, -0.12, -0.08, 0.18,
            // Pómulo derecho
            0.12, -0.08, 0.18,  0.15, -0.05, 0.20,  0.18, -0.02, 0.18,
        ]);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
            color: this.config.color,
            size: 0.015,
            transparent: true,
            opacity: this.config.opacity * 2
        });

        const points = new THREE.Points(geometry, material);
        this.group.add(points);

        this.createFacialContours();
    }

    createFacialContours() {
        // Contorno del pómulo izquierdo
        this.createContourLine([
            new THREE.Vector3(-0.18, -0.02, 0.18),
            new THREE.Vector3(-0.20, -0.08, 0.15),
            new THREE.Vector3(-0.18, -0.15, 0.12),
            new THREE.Vector3(-0.15, -0.20, 0.10)
        ]);

        // Contorno del pómulo derecho
        this.createContourLine([
            new THREE.Vector3(0.18, -0.02, 0.18),
            new THREE.Vector3(0.20, -0.08, 0.15),
            new THREE.Vector3(0.18, -0.15, 0.12),
            new THREE.Vector3(0.15, -0.20, 0.10)
        ]);
    }

    createContourLine(points) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
        const material = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 1.2
        });
        this.group.add(new THREE.Line(geometry, material));
    }

    createJaw() {
        // Curva de la mandíbula
        const jawPoints = [];
        for (let i = 0; i <= 30; i++) {
            const t = (i / 30) * Math.PI;
            const x = Math.sin(t) * 0.15;
            const y = -0.28 + Math.cos(t) * 0.08;
            const z = 0.08 + Math.sin(t * 0.5) * 0.05;
            jawPoints.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(jawPoints);
        const geometry = new THREE.TubeGeometry(curve, 30, 0.012, 8, false);

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            wireframe: true
        });

        this.group.add(new THREE.Mesh(geometry, material));

        // Rama de la mandíbula
        this.createJawRamus(-0.15);
        this.createJawRamus(0.15);
    }

    createJawRamus(xOffset) {
        const points = [
            new THREE.Vector3(xOffset, -0.20, 0.10),
            new THREE.Vector3(xOffset * 1.1, -0.12, 0.05),
            new THREE.Vector3(xOffset * 1.05, -0.05, 0.02)
        ];

        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 15, 0.008, 6, false);

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            wireframe: true
        });

        this.group.add(new THREE.Mesh(geometry, material));
    }

    createOrbits() {
        this.createOrbit(-0.08, 0.02, 0.20);  // Izquierda
        this.createOrbit(0.08, 0.02, 0.20);   // Derecha
    }

    createOrbit(x, y, z) {
        const geometry = new THREE.TorusGeometry(0.045, 0.005, 8, 24);
        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 1.5
        });

        const orbit = new THREE.Mesh(geometry, material);
        orbit.position.set(x, y, z);
        orbit.rotation.y = Math.PI * 0.1;
        this.group.add(orbit);
    }

    createNasalCavity() {
        // Puente nasal
        const bridgePoints = [
            new THREE.Vector3(0, 0.04, 0.24),
            new THREE.Vector3(0, 0, 0.25),
            new THREE.Vector3(0, -0.06, 0.22)
        ];

        const curve = new THREE.CatmullRomCurve3(bridgePoints);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(15));
        const material = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 1.3
        });

        this.group.add(new THREE.Line(geometry, material));

        // Apertura nasal
        const apertureGeometry = new THREE.RingGeometry(0.015, 0.025, 6);
        const apertureMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity,
            side: THREE.DoubleSide
        });

        const aperture = new THREE.Mesh(apertureGeometry, apertureMaterial);
        aperture.position.set(0, -0.05, 0.22);
        aperture.rotation.x = -Math.PI * 0.1;
        this.group.add(aperture);
    }
}
