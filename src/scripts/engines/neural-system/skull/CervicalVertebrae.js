/**
 * CervicalVertebrae - Vértebras cervicales visibles (C1-C7)
 * Conecta el cráneo con la columna vertebral
 */

import * as THREE from 'three';

export class CervicalVertebrae {
    constructor(config = {}) {
        this.config = {
            color: config.color || 0x4488ff,
            opacity: config.opacity || 0.12,
            scale: config.scale || 1,
            startY: config.startY || -0.32
        };

        this.group = new THREE.Group();
        this.vertebrae = [];
        this.create();
    }

    create() {
        // 7 vértebras cervicales (C1-C7)
        const vertebraHeight = 0.035;
        const startY = this.config.startY;

        for (let i = 0; i < 7; i++) {
            const y = startY - (i * vertebraHeight);
            const scale = 1 - (i * 0.02); // Disminuyen ligeramente hacia abajo

            // C1 (Atlas) y C2 (Axis) son especiales
            if (i === 0) {
                this.createAtlas(y);
            } else if (i === 1) {
                this.createAxis(y);
            } else {
                this.createVertebra(y, scale, i);
            }
        }

        // Conectar vértebras con discos intervertebrales
        this.createDiscs();
    }

    createAtlas(y) {
        // C1 - Atlas: forma de anillo
        const geometry = new THREE.TorusGeometry(0.025, 0.006, 8, 16);
        const material = this.createMaterial(1.2);

        const atlas = new THREE.Mesh(geometry, material);
        atlas.position.set(0, y, -0.08);
        atlas.rotation.x = Math.PI / 2;

        this.group.add(atlas);
        this.vertebrae.push(atlas);

        // Masas laterales del atlas
        this.addLateralMass(-0.03, y, -0.08);
        this.addLateralMass(0.03, y, -0.08);
    }

    addLateralMass(x, y, z) {
        const geometry = new THREE.SphereGeometry(0.008, 8, 8);
        const material = this.createMaterial(1);
        const mass = new THREE.Mesh(geometry, material);
        mass.position.set(x, y, z);
        this.group.add(mass);
    }

    createAxis(y) {
        // C2 - Axis: tiene el proceso odontoides
        const geometry = new THREE.TorusGeometry(0.023, 0.006, 8, 16);
        const material = this.createMaterial(1.1);

        const axis = new THREE.Mesh(geometry, material);
        axis.position.set(0, y, -0.08);
        axis.rotation.x = Math.PI / 2;

        this.group.add(axis);
        this.vertebrae.push(axis);

        // Proceso odontoides (dens)
        const densGeometry = new THREE.CylinderGeometry(0.005, 0.006, 0.025, 8);
        const dens = new THREE.Mesh(densGeometry, material);
        dens.position.set(0, y + 0.02, -0.08);
        this.group.add(dens);
    }

    createVertebra(y, scale, index) {
        // Cuerpo vertebral
        const bodyGeometry = new THREE.CylinderGeometry(
            0.018 * scale,
            0.020 * scale,
            0.02,
            12
        );
        const material = this.createMaterial(1);

        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.set(0, y, -0.06);

        this.group.add(body);
        this.vertebrae.push(body);

        // Arco vertebral
        this.createVertebralArch(y, scale);

        // Procesos transversos
        this.createTransverseProcess(-0.025 * scale, y, -0.08, scale);
        this.createTransverseProcess(0.025 * scale, y, -0.08, scale);

        // Proceso espinoso
        this.createSpinousProcess(y, scale, index);
    }

    createVertebralArch(y, scale) {
        const archPoints = [
            new THREE.Vector3(-0.015 * scale, 0, -0.06),
            new THREE.Vector3(-0.018 * scale, 0, -0.08),
            new THREE.Vector3(0, 0, -0.10),
            new THREE.Vector3(0.018 * scale, 0, -0.08),
            new THREE.Vector3(0.015 * scale, 0, -0.06)
        ];

        const curve = new THREE.CatmullRomCurve3(archPoints);
        const geometry = new THREE.TubeGeometry(curve, 20, 0.003, 6, false);
        const material = this.createMaterial(0.8);

        const arch = new THREE.Mesh(geometry, material);
        arch.position.y = y;
        this.group.add(arch);
    }

    createTransverseProcess(x, y, z, scale) {
        const geometry = new THREE.CylinderGeometry(0.003, 0.004, 0.02 * scale, 6);
        const material = this.createMaterial(0.9);

        const process = new THREE.Mesh(geometry, material);
        process.position.set(x, y, z);
        process.rotation.z = Math.PI / 2;
        process.rotation.y = x > 0 ? 0.3 : -0.3;

        this.group.add(process);
    }

    createSpinousProcess(y, scale, index) {
        // Los procesos espinosos cervicales son bifurcados (excepto C7)
        const length = 0.025 + (index * 0.003);

        const geometry = new THREE.ConeGeometry(0.004, length * scale, 6);
        const material = this.createMaterial(0.9);

        const process = new THREE.Mesh(geometry, material);
        process.position.set(0, y, -0.10 - length * 0.3);
        process.rotation.x = Math.PI / 2;

        this.group.add(process);
    }

    createDiscs() {
        // Discos intervertebrales entre cada vértebra
        const discHeight = 0.035;
        const startY = this.config.startY - 0.017;

        for (let i = 0; i < 6; i++) {
            const y = startY - (i * discHeight);

            const geometry = new THREE.CylinderGeometry(0.015, 0.015, 0.008, 12);
            const material = new THREE.MeshBasicMaterial({
                color: 0x66aaff,
                transparent: true,
                opacity: this.config.opacity * 0.5
            });

            const disc = new THREE.Mesh(geometry, material);
            disc.position.set(0, y, -0.06);
            this.group.add(disc);
        }
    }

    createMaterial(opacityMultiplier = 1) {
        return new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * opacityMultiplier,
            wireframe: true
        });
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    animate(time) {
        // Animación sutil
        this.vertebrae.forEach((v, i) => {
            const offset = Math.sin(time * 0.8 + i * 0.3) * 0.001;
            v.position.z += offset * 0.1;
        });
    }
}
