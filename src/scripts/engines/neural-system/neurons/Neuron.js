/**
 * Neurona completa - Unidad funcional del sistema nervioso
 * Incluye: soma (cuerpo celular), núcleo, axón, dendritas, terminales sinápticos
 */

import * as THREE from 'three';

export class Neuron {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            opacity: config.opacity || 0.3,
            scale: config.scale || 1,
            position: config.position || new THREE.Vector3(0, 0, 0),
            type: config.type || 'pyramidal', // pyramidal, purkinje, motor, sensory
            ...config
        };

        this.soma = null;
        this.nucleus = null;
        this.axon = null;
        this.dendrites = [];
        this.synapticTerminals = [];
        this.axonTerminalPoint = new THREE.Vector3();

        this.create();
    }

    create() {
        this.createSoma();
        this.createNucleus();
        this.createDendrites();
        this.createAxonHillock();
        this.createAxon();
        this.createSynapticTerminals();

        this.group.position.copy(this.config.position);
        this.group.scale.setScalar(this.config.scale);
    }

    createSoma() {
        // Cuerpo celular - forma ligeramente irregular
        const geometry = new THREE.SphereGeometry(0.08, 16, 14);
        const positions = geometry.attributes.position;

        // Hacer el soma ligeramente irregular (forma orgánica)
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            const noise = 1 + Math.sin(x * 8 + y * 6) * 0.08 + Math.cos(z * 7) * 0.06;

            positions.setX(i, x * noise);
            positions.setY(i, y * noise);
            positions.setZ(i, z * noise);
        }

        geometry.computeVertexNormals();

        // Material wireframe para el soma
        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity,
            depthWrite: false
        });

        this.soma = new THREE.Mesh(geometry, material);
        this.group.add(this.soma);

        // Membrana celular semitransparente
        const membraneGeo = new THREE.SphereGeometry(0.085, 12, 10);
        const membraneMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.2,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const membrane = new THREE.Mesh(membraneGeo, membraneMat);
        this.group.add(membrane);
    }

    createNucleus() {
        // Núcleo dentro del soma
        const geometry = new THREE.SphereGeometry(0.035, 10, 8);

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 1.2,
            depthWrite: false
        });

        this.nucleus = new THREE.Mesh(geometry, material);
        this.nucleus.position.set(0, 0.01, 0);
        this.group.add(this.nucleus);

        // Nucleolo
        const nucleolusGeo = new THREE.SphereGeometry(0.012, 6, 6);
        const nucleolusMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });
        const nucleolus = new THREE.Mesh(nucleolusGeo, nucleolusMat);
        nucleolus.position.set(0, 0.015, 0);
        this.group.add(nucleolus);
    }

    createDendrites() {
        // Múltiples dendritas ramificadas
        const dendriteCount = this.config.type === 'purkinje' ? 8 : 5;

        const dendriteMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            depthWrite: false
        });

        for (let i = 0; i < dendriteCount; i++) {
            const angle = (i / dendriteCount) * Math.PI * 2 + Math.random() * 0.3;
            const elevation = Math.random() * 0.6 + 0.2; // Hacia arriba

            this.createDendriteBranch(angle, elevation, dendriteMat, 0);
        }
    }

    createDendriteBranch(angle, elevation, material, depth) {
        if (depth > 3) return; // Máximo 3 niveles de ramificación

        const startPoint = depth === 0
            ? new THREE.Vector3(0, 0.06, 0)
            : this.dendrites[this.dendrites.length - 1]?.endPoint || new THREE.Vector3(0, 0.06, 0);

        const length = 0.15 - depth * 0.03;
        const segments = 8;
        const points = [startPoint.clone()];

        let currentPoint = startPoint.clone();

        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const spread = 0.03 + depth * 0.02;

            currentPoint = new THREE.Vector3(
                startPoint.x + Math.cos(angle) * t * length + (Math.random() - 0.5) * spread,
                startPoint.y + elevation * t * length,
                startPoint.z + Math.sin(angle) * t * length + (Math.random() - 0.5) * spread
            );
            points.push(currentPoint);
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(15));
        const dendrite = new THREE.Line(lineGeo, material.clone());
        this.group.add(dendrite);

        const dendriteData = {
            line: dendrite,
            endPoint: currentPoint.clone(),
            depth: depth
        };
        this.dendrites.push(dendriteData);

        // Espinas dendríticas (pequeñas protuberancias)
        if (depth < 2) {
            this.createDendriticSpines(points, material);
        }

        // Ramificaciones
        if (depth < 3 && Math.random() > 0.4) {
            const branchAngle1 = angle + (Math.random() - 0.5) * 1.2;
            const branchAngle2 = angle + (Math.random() - 0.5) * 1.2;

            // Mover punto de inicio para las ramas
            const branchStart = points[Math.floor(points.length * 0.6)];
            this.dendrites[this.dendrites.length - 1].endPoint = branchStart;

            this.createDendriteBranch(branchAngle1, elevation * 0.8, material, depth + 1);
            if (Math.random() > 0.5) {
                this.createDendriteBranch(branchAngle2, elevation * 0.8, material, depth + 1);
            }
        }
    }

    createDendriticSpines(points, material) {
        // Pequeñas espinas donde se forman sinapsis
        const spineMat = new THREE.PointsMaterial({
            color: this.config.color,
            size: 0.008,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });

        const spinePositions = [];
        for (let i = 2; i < points.length - 1; i += 2) {
            const point = points[i];
            for (let j = 0; j < 2; j++) {
                spinePositions.push(
                    point.x + (Math.random() - 0.5) * 0.02,
                    point.y + (Math.random() - 0.5) * 0.02,
                    point.z + (Math.random() - 0.5) * 0.02
                );
            }
        }

        if (spinePositions.length > 0) {
            const spineGeo = new THREE.BufferGeometry();
            spineGeo.setAttribute('position', new THREE.Float32BufferAttribute(spinePositions, 3));
            const spines = new THREE.Points(spineGeo, spineMat);
            this.group.add(spines);
        }
    }

    createAxonHillock() {
        // Cono axónico - donde nace el axón
        const geometry = new THREE.ConeGeometry(0.025, 0.04, 8);

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.9,
            depthWrite: false
        });

        const hillock = new THREE.Mesh(geometry, material);
        hillock.position.set(0, -0.08, 0);
        hillock.rotation.x = Math.PI;
        this.group.add(hillock);
    }

    createAxon() {
        // Axón largo con nodos de Ranvier y vaina de mielina
        const axonLength = this.config.type === 'motor' ? 0.8 : 0.5;
        const segments = 40;
        const points = [];

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = -0.1 - t * axonLength;
            // Ligera curvatura natural
            const x = Math.sin(t * Math.PI * 2) * 0.02;
            const z = Math.cos(t * Math.PI * 3) * 0.015;

            points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        this.axonTerminalPoint = points[points.length - 1].clone();

        // Axón principal
        const tubeGeo = new THREE.TubeGeometry(curve, 30, 0.008, 6, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        this.axon = new THREE.Mesh(tubeGeo, tubeMat);
        this.group.add(this.axon);

        // Vaina de mielina (segmentos)
        this.createMyelinSheath(curve, axonLength);
    }

    createMyelinSheath(curve, length) {
        // Segmentos de mielina separados por nodos de Ranvier
        const myelinMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.15,
            depthWrite: false
        });

        const nodeMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });

        const segmentCount = 5;
        const segmentLength = 0.12;
        const gapLength = 0.02;

        for (let i = 0; i < segmentCount; i++) {
            const t = (i + 0.5) / segmentCount;
            const point = curve.getPoint(t);
            const tangent = curve.getTangent(t);

            // Segmento de mielina
            const myelinGeo = new THREE.CylinderGeometry(0.018, 0.018, segmentLength, 8);
            const myelin = new THREE.Mesh(myelinGeo, myelinMat);
            myelin.position.copy(point);
            myelin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
            this.group.add(myelin);

            // Nodo de Ranvier (entre segmentos)
            if (i < segmentCount - 1) {
                const nodeT = (i + 1) / segmentCount;
                const nodePoint = curve.getPoint(nodeT);
                const nodeGeo = new THREE.TorusGeometry(0.012, 0.003, 6, 8);
                const node = new THREE.Mesh(nodeGeo, nodeMat);
                node.position.copy(nodePoint);
                node.rotation.x = Math.PI / 2;
                this.group.add(node);
            }
        }
    }

    createSynapticTerminals() {
        // Terminales sinápticos (botones)
        const terminalCount = 4;
        const terminalMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            depthWrite: false
        });

        for (let i = 0; i < terminalCount; i++) {
            const angle = (i / terminalCount) * Math.PI * 2;
            const spread = 0.06;

            const terminalGeo = new THREE.SphereGeometry(0.015, 8, 6);
            const terminal = new THREE.Mesh(terminalGeo, terminalMat);

            terminal.position.set(
                this.axonTerminalPoint.x + Math.cos(angle) * spread,
                this.axonTerminalPoint.y - 0.03,
                this.axonTerminalPoint.z + Math.sin(angle) * spread
            );

            this.synapticTerminals.push(terminal);
            this.group.add(terminal);

            // Línea conectando al axón terminal
            const linePoints = [
                this.axonTerminalPoint.clone(),
                terminal.position.clone()
            ];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
            const lineMat = new THREE.LineBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: this.config.opacity * 0.4,
                depthWrite: false
            });
            this.group.add(new THREE.Line(lineGeo, lineMat));
        }
    }

    getMesh() {
        return this.group;
    }

    getAxonTerminal() {
        return this.axonTerminalPoint.clone().add(this.config.position);
    }

    getSynapticPoints() {
        return this.synapticTerminals.map(t =>
            t.position.clone().add(this.config.position)
        );
    }

    animate(time) {
        // Pulso del soma (potencial de acción)
        const pulse = 1 + Math.sin(time * 2 + this.config.position.x * 3) * 0.05;
        if (this.soma) {
            this.soma.scale.setScalar(pulse);
        }

        // Pulso del núcleo
        const nucleusPulse = 1 + Math.sin(time * 1.5) * 0.08;
        if (this.nucleus) {
            this.nucleus.scale.setScalar(nucleusPulse);
        }

        // Animación de terminales sinápticos (liberación de neurotransmisores)
        this.synapticTerminals.forEach((terminal, i) => {
            const terminalPulse = 1 + Math.sin(time * 3 + i) * 0.15;
            terminal.scale.setScalar(terminalPulse);
        });
    }
}
