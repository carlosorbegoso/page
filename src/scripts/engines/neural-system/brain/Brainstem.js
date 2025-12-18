/**
 * Tronco Encefálico - Conecta cerebro con médula espinal (VERSIÓN REALISTA)
 *
 * Anatomía incluida:
 * - Mesencéfalo (Midbrain):
 *   - Colículos superiores e inferiores (tectum)
 *   - Pedúnculos cerebrales
 *   - Sustancia negra
 * - Puente (Pons):
 *   - Protuberancia basilar
 *   - Tegmento pontino
 *   - Núcleos de nervios craneales
 * - Bulbo Raquídeo (Medulla Oblongata):
 *   - Pirámides
 *   - Olivas
 *   - Núcleos vitales (respiración, cardíaco)
 */

import * as THREE from 'three';

export class Brainstem {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            opacity: config.opacity || 0.25,
            scale: config.scale || 1,
            detail: config.detail || 'high',
            ...config
        };

        this.spinalConnectionPoint = new THREE.Vector3(0, -0.85, 0);
        this.neurons = [];
        this.nerves = [];
        this.tracts = [];

        this.create();
    }

    create() {
        this.createMidbrain();
        this.createPons();
        this.createMedullaOblongata();
        this.createCranialNerves();
        this.createNeuralTracts();
        this.createNeuralActivity();
    }

    createMidbrain() {
        // === MESENCÉFALO ===
        const segments = this.config.detail === 'high' ? 28 : 18;
        const geometry = new THREE.SphereGeometry(0.14, segments, segments);
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Forma del mesencéfalo: más ancho que alto
            y *= 0.55;
            x *= 1.25;

            // Tectum (parte posterior - colículos)
            if (z < -0.05) {
                // Colículos superiores e inferiores
                const colliculus = Math.sin(y * 8) * 0.015;
                z -= 0.02;
                z += colliculus;
            }

            // Pedúnculos cerebrales (parte anterior)
            if (z > 0.05) {
                z *= 1.2;
                // Surco interpeduncular
                const interpeduncular = Math.exp(-Math.pow(x * 15, 2)) * 0.02;
                z -= interpeduncular;
            }

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        const material = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.85,
            depthWrite: false
        });

        const midbrain = new THREE.Mesh(geometry, material);
        midbrain.position.set(0, 0.05, -0.08);
        this.group.add(midbrain);

        // Colículos superiores (izquierdo y derecho)
        this.createColliculus(-0.05, 0.08, -0.16, 0.03, 'superior');
        this.createColliculus(0.05, 0.08, -0.16, 0.03, 'superior');

        // Colículos inferiores
        this.createColliculus(-0.045, 0.02, -0.17, 0.025, 'inferior');
        this.createColliculus(0.045, 0.02, -0.17, 0.025, 'inferior');

        // Brillo interior del mesencéfalo
        const innerGlow = new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.12,
            side: THREE.FrontSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const innerMesh = new THREE.Mesh(geometry.clone(), innerGlow);
        innerMesh.position.copy(midbrain.position);
        innerMesh.scale.setScalar(0.85);
        this.group.add(innerMesh);
    }

    createColliculus(x, y, z, radius, type) {
        const collGeo = new THREE.SphereGeometry(radius, 12, 12);
        const collMat = new THREE.MeshBasicMaterial({
            color: type === 'superior' ? this.config.color : this.config.secondaryColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            depthWrite: false
        });

        const coll = new THREE.Mesh(collGeo, collMat);
        coll.position.set(x, y, z);
        this.group.add(coll);
    }

    createPons() {
        // === PUENTE (PONS) ===
        const segments = this.config.detail === 'high' ? 32 : 20;
        const geometry = new THREE.SphereGeometry(0.18, segments, segments);
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Forma característica: muy ancho lateralmente, aplanado verticalmente
            y *= 0.45;
            x *= 1.5;

            // Protuberancia basilar anterior (muy prominente)
            if (z > 0) {
                const basilar = Math.cos(x * 4) * 0.08;
                z *= 1.4 + basilar * 0.5;

                // Surco basilar (medio)
                const basilarSulcus = Math.exp(-Math.pow(x * 12, 2)) * 0.025;
                z -= basilarSulcus;
            }

            // Tegmento pontino (posterior, más plano)
            if (z < 0) {
                z *= 0.7;
            }

            // Fibras transversas (textura horizontal)
            const transverse = Math.sin(y * 30) * 0.008;
            z += transverse;
            x += transverse * 0.3;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.9,
            depthWrite: false
        });

        const pons = new THREE.Mesh(geometry, wireMaterial);
        pons.position.set(0, -0.15, 0.02);
        this.group.add(pons);

        // Capa sólida
        const solidMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.1,
            side: THREE.BackSide,
            depthWrite: false
        });
        const solidPons = new THREE.Mesh(geometry.clone(), solidMaterial);
        solidPons.position.copy(pons.position);
        this.group.add(solidPons);

        // Brillo interior
        const innerGlow = new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.1,
            side: THREE.FrontSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const innerMesh = new THREE.Mesh(geometry.clone(), innerGlow);
        innerMesh.position.copy(pons.position);
        innerMesh.scale.setScalar(0.85);
        this.group.add(innerMesh);

        // Líneas de fibras transversas
        this.createTransverseFibers();
    }

    createTransverseFibers() {
        const fiberMat = new THREE.LineBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });

        for (let i = 0; i < 6; i++) {
            const y = -0.1 - 0.02 + i * 0.02;
            const points = [];

            for (let j = 0; j <= 20; j++) {
                const t = (j / 20 - 0.5) * 2;
                const x = t * 0.25;
                const z = 0.15 + Math.cos(t * Math.PI * 0.5) * 0.05;
                const wave = Math.sin(t * Math.PI * 2) * 0.008;
                points.push(new THREE.Vector3(x, y + wave, z));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
            const line = new THREE.Line(lineGeo, fiberMat.clone());
            this.tracts.push(line);
            this.group.add(line);
        }
    }

    createMedullaOblongata() {
        // === BULBO RAQUÍDEO ===

        // Forma principal del bulbo
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -0.28, 0.02),
            new THREE.Vector3(0, -0.42, 0.03),
            new THREE.Vector3(0, -0.58, 0.025),
            new THREE.Vector3(0, -0.72, 0.015),
            new THREE.Vector3(0, -0.85, 0.01)
        ]);

        const segments = this.config.detail === 'high' ? 28 : 18;
        const tubeGeo = new THREE.TubeGeometry(curve, segments, 0.1, 12, false);
        const positions = tubeGeo.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Calcular posición normalizada a lo largo del eje
            const normalizedY = Math.max(0, Math.min(1, (y + 0.85) / 0.57));

            // Escala variable (más ancho arriba, estrecho abajo)
            const scale = 0.5 + normalizedY * 0.5;
            x *= scale;
            z *= scale;

            // === PIRÁMIDES (anterior) ===
            if (z > 0) {
                // Dos bultos laterales (pirámides)
                const pyramidLeft = Math.exp(-Math.pow((x + 0.04) * 25, 2)) * 0.02 * normalizedY;
                const pyramidRight = Math.exp(-Math.pow((x - 0.04) * 25, 2)) * 0.02 * normalizedY;
                z += pyramidLeft + pyramidRight;

                // Fisura media anterior
                const anteriorFissure = Math.exp(-Math.pow(x * 30, 2)) * 0.015 * normalizedY;
                z -= anteriorFissure;
            }

            // === OLIVAS (laterales) ===
            if (normalizedY > 0.3 && normalizedY < 0.8) {
                const oliveFactor = Math.sin((normalizedY - 0.3) / 0.5 * Math.PI);
                const oliveLeft = Math.exp(-Math.pow((x + 0.08) * 20, 2)) * 0.025 * oliveFactor;
                const oliveRight = Math.exp(-Math.pow((x - 0.08) * 20, 2)) * 0.025 * oliveFactor;
                x += (x < 0 ? oliveLeft : oliveRight) * Math.sign(x);
            }

            // Textura de surcos
            const sulci = Math.sin(y * 25 + x * 10) * 0.005;
            z += sulci;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        tubeGeo.computeVertexNormals();

        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.85,
            depthWrite: false
        });

        this.group.add(new THREE.Mesh(tubeGeo, wireMaterial));

        // Capa sólida
        const solidMaterial = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.08,
            side: THREE.BackSide,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(tubeGeo.clone(), solidMaterial));

        // Crear olivas como estructuras separadas
        this.createOlive(-0.11, -0.45, 0.02);
        this.createOlive(0.11, -0.45, 0.02);

        // Actualizar punto de conexión
        this.spinalConnectionPoint.set(0, -0.85, 0.01);
    }

    createOlive(x, y, z) {
        // Olivas inferiores (núcleos olivares)
        const oliveGeo = new THREE.SphereGeometry(0.035, 10, 10);
        const positions = oliveGeo.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let px = positions.getX(i);
            let py = positions.getY(i);
            let pz = positions.getZ(i);

            // Forma ovalada vertical
            py *= 1.4;
            px *= 0.7;

            positions.setX(i, px);
            positions.setY(i, py);
            positions.setZ(i, pz);
        }

        oliveGeo.computeVertexNormals();

        const oliveMat = new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        const olive = new THREE.Mesh(oliveGeo, oliveMat);
        olive.position.set(x, y, z);
        this.group.add(olive);
    }

    createCranialNerves() {
        // Representación simplificada de nervios craneales principales
        const nerveMat = new THREE.LineBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });

        // Nervio trigémino (V) - desde el puente
        this.createNerve([
            new THREE.Vector3(-0.2, -0.12, 0.08),
            new THREE.Vector3(-0.35, -0.1, 0.15),
            new THREE.Vector3(-0.5, -0.08, 0.2)
        ], nerveMat);

        this.createNerve([
            new THREE.Vector3(0.2, -0.12, 0.08),
            new THREE.Vector3(0.35, -0.1, 0.15),
            new THREE.Vector3(0.5, -0.08, 0.2)
        ], nerveMat);

        // Nervio facial (VII) y vestibulococlear (VIII)
        this.createNerve([
            new THREE.Vector3(-0.18, -0.2, 0.06),
            new THREE.Vector3(-0.3, -0.22, 0.12),
            new THREE.Vector3(-0.4, -0.25, 0.18)
        ], nerveMat);

        this.createNerve([
            new THREE.Vector3(0.18, -0.2, 0.06),
            new THREE.Vector3(0.3, -0.22, 0.12),
            new THREE.Vector3(0.4, -0.25, 0.18)
        ], nerveMat);

        // Nervio vago (X) y glosofaríngeo (IX)
        this.createNerve([
            new THREE.Vector3(-0.1, -0.45, 0.03),
            new THREE.Vector3(-0.2, -0.48, 0.08),
            new THREE.Vector3(-0.32, -0.52, 0.12)
        ], nerveMat);

        this.createNerve([
            new THREE.Vector3(0.1, -0.45, 0.03),
            new THREE.Vector3(0.2, -0.48, 0.08),
            new THREE.Vector3(0.32, -0.52, 0.12)
        ], nerveMat);
    }

    createNerve(points, material) {
        const curve = new THREE.CatmullRomCurve3(points);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(15));
        const nerve = new THREE.Line(lineGeo, material.clone());
        this.nerves.push(nerve);
        this.group.add(nerve);
    }

    createNeuralTracts() {
        // Tractos principales (vías ascendentes y descendentes)
        const tractMat = new THREE.LineBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        // Línea central (tracto corticoespinal)
        const centralTract = [
            new THREE.Vector3(0, 0.12, -0.05),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -0.15, 0.02),
            new THREE.Vector3(0, -0.35, 0.025),
            new THREE.Vector3(0, -0.55, 0.02),
            new THREE.Vector3(0, -0.75, 0.015),
            new THREE.Vector3(0, -0.85, 0.01)
        ];

        const centralCurve = new THREE.CatmullRomCurve3(centralTract);
        const centralGeo = new THREE.BufferGeometry().setFromPoints(centralCurve.getPoints(50));
        const central = new THREE.Line(centralGeo, tractMat.clone());
        central.material.opacity = this.config.opacity * 0.8;
        this.tracts.push(central);
        this.group.add(central);

        // Tractos laterales
        const lateralOffsets = [-0.04, 0.04];
        lateralOffsets.forEach(offset => {
            const lateralPoints = centralTract.map(p =>
                new THREE.Vector3(p.x + offset, p.y, p.z - 0.01)
            );
            const lateralCurve = new THREE.CatmullRomCurve3(lateralPoints);
            const lateralGeo = new THREE.BufferGeometry().setFromPoints(lateralCurve.getPoints(40));
            const lateral = new THREE.Line(lateralGeo, tractMat.clone());
            this.tracts.push(lateral);
            this.group.add(lateral);
        });
    }

    createNeuralActivity() {
        const neuronCount = 20;

        // Posiciones a lo largo del tronco
        const positions = [
            { y: 0.05, radius: 0.12 },   // Mesencéfalo
            { y: -0.15, radius: 0.16 },  // Puente
            { y: -0.4, radius: 0.1 },    // Bulbo superior
            { y: -0.65, radius: 0.07 }   // Bulbo inferior
        ];

        positions.forEach(pos => {
            const count = Math.floor(neuronCount / positions.length);
            for (let i = 0; i < count; i++) {
                const theta = Math.random() * Math.PI * 2;
                const r = pos.radius * (0.8 + Math.random() * 0.2);

                const x = r * Math.cos(theta);
                const z = r * Math.sin(theta) * 0.5 + 0.02;
                const y = pos.y + (Math.random() - 0.5) * 0.1;

                const neuronGeo = new THREE.SphereGeometry(0.008, 6, 6);
                const neuronMat = new THREE.MeshBasicMaterial({
                    color: this.config.color,
                    transparent: true,
                    opacity: 0.35,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });

                const neuron = new THREE.Mesh(neuronGeo, neuronMat);
                neuron.position.set(x, y, z);
                neuron.userData = {
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.6 + Math.random() * 1.0,
                    baseOpacity: 0.25 + Math.random() * 0.2
                };

                this.neurons.push(neuron);
                this.group.add(neuron);
            }
        });
    }

    getMesh() {
        return this.group;
    }

    getSpinalConnectionPoint() {
        return this.spinalConnectionPoint.clone();
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    animate(time) {
        const pulse = 1 + Math.sin(time * 0.35) * 0.005;
        this.group.scale.setScalar(this.config.scale * pulse);

        // Animar neuronas
        this.neurons.forEach(neuron => {
            const { phase, speed, baseOpacity } = neuron.userData;
            const wave = Math.sin(time * speed + phase);
            neuron.material.opacity = baseOpacity * (0.5 + wave * 0.5);
            neuron.scale.setScalar(0.8 + wave * 0.4);
        });

        // Animar nervios (pulso de señal)
        this.nerves.forEach((nerve, i) => {
            const nervePulse = 0.4 + Math.sin(time * 2 + i * 0.8) * 0.3;
            nerve.material.opacity = this.config.opacity * 0.5 * nervePulse;
        });

        // Animar tractos (flujo de información)
        this.tracts.forEach((tract, i) => {
            const tractPulse = 0.5 + Math.sin(time * 1.5 - i * 0.3) * 0.3;
            tract.material.opacity = this.config.opacity * 0.6 * tractPulse;
        });
    }
}
