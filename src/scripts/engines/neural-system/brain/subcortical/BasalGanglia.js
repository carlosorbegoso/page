/**
 * Ganglios Basales - Control motor y aprendizaje
 * Conjunto de núcleos subcorticales
 *
 * Anatomía incluida:
 * - Núcleo caudado (forma de C)
 * - Putamen
 * - Globo pálido (interno y externo)
 * - Núcleo subtalámico
 * - Sustancia negra
 * - Conexiones (vías directa e indirecta)
 */

import * as THREE from 'three';

export class BasalGanglia {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            accentColor: config.accentColor || 0x88ff00,
            opacity: config.opacity || 0.3,
            scale: config.scale || 1,
            side: config.side || 'left',
            ...config
        };

        this.structures = [];
        this.pathways = [];
        this.signals = [];

        this.create();
    }

    create() {
        this.createCaudate();
        this.createPutamen();
        this.createGlobusPallidus();
        this.createSubthalamicNucleus();
        this.createSubstantiaNigra();
        this.createPathways();
        this.createSignals();
    }

    createCaudate() {
        // Núcleo caudado - forma de C característica
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Crear la curva en forma de C
        const caudatePoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const angle = t * Math.PI * 1.3 - Math.PI * 0.2;
            const radius = 0.12 - t * 0.03;

            const x = sideMultiplier * (0.05 + radius * Math.cos(angle));
            const y = 0.08 - t * 0.12;
            const z = 0.02 + radius * Math.sin(angle) * 0.5;

            caudatePoints.push(new THREE.Vector3(x, y, z));
        }

        const caudateCurve = new THREE.CatmullRomCurve3(caudatePoints);

        // Radio variable (cabeza más grande, cola más delgada)
        const caudateGeo = new THREE.TubeGeometry(caudateCurve, 40, 0.025, 12, false);
        const positions = caudateGeo.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            // Encontrar posición a lo largo de la curva
            const normalizedPos = (y - (-0.04)) / 0.12;
            const taper = 0.5 + (1 - normalizedPos) * 0.5;

            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Encontrar centro aproximado y escalar
            const centerX = sideMultiplier * 0.08;
            positions.setX(i, centerX + (x - centerX) * taper);
            positions.setZ(i, 0.04 + (z - 0.04) * taper);
        }

        caudateGeo.computeVertexNormals();

        const caudateMat = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });

        const caudate = new THREE.Mesh(caudateGeo, caudateMat);
        caudate.userData = { name: 'caudate', phase: 0 };
        this.structures.push(caudate);
        this.group.add(caudate);

        // Glow del caudado
        const glowMat = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            transparent: true,
            opacity: this.config.opacity * 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const caudateGlow = new THREE.Mesh(caudateGeo.clone(), glowMat);
        caudateGlow.scale.setScalar(1.15);
        this.group.add(caudateGlow);
    }

    createPutamen() {
        // Putamen - lateral al globo pálido
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;
        const segments = 24;

        const geometry = new THREE.SphereGeometry(0.05, segments, segments);
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Forma lenticular (como una lenteja)
            x *= 0.6;  // Aplanar medial-lateral
            y *= 1.5;  // Elongar verticalmente
            z *= 1.2;  // Algo extendido anterior-posterior

            // Curvatura
            x += Math.sin(y * 5) * 0.01 * sideMultiplier;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        const putamenMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.75,
            depthWrite: false
        });

        const putamen = new THREE.Mesh(geometry, putamenMat);
        putamen.position.set(sideMultiplier * 0.1, -0.02, 0.02);
        putamen.userData = { name: 'putamen', phase: 0.5 };
        this.structures.push(putamen);
        this.group.add(putamen);

        // Capa sólida
        const solidMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.1,
            side: THREE.BackSide,
            depthWrite: false
        });
        const putamenSolid = new THREE.Mesh(geometry.clone(), solidMat);
        putamenSolid.position.copy(putamen.position);
        this.group.add(putamenSolid);
    }

    createGlobusPallidus() {
        // Globo pálido - medial al putamen
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Segmento externo (GPe)
        const gpeGeo = new THREE.SphereGeometry(0.03, 16, 16);
        const positions = gpeGeo.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            x *= 0.5;
            y *= 1.3;
            z *= 1.1;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }
        gpeGeo.computeVertexNormals();

        const gpMat = new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            depthWrite: false
        });

        const gpe = new THREE.Mesh(gpeGeo, gpMat);
        gpe.position.set(sideMultiplier * 0.06, -0.02, 0.01);
        gpe.userData = { name: 'gpe', phase: 1 };
        this.structures.push(gpe);
        this.group.add(gpe);

        // Segmento interno (GPi)
        const gpiGeo = gpeGeo.clone();
        const gpi = new THREE.Mesh(gpiGeo, gpMat.clone());
        gpi.scale.setScalar(0.8);
        gpi.position.set(sideMultiplier * 0.04, -0.02, 0);
        gpi.userData = { name: 'gpi', phase: 1.5 };
        this.structures.push(gpi);
        this.group.add(gpi);
    }

    createSubthalamicNucleus() {
        // Núcleo subtalámico - pequeño pero importante
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        const stnGeo = new THREE.SphereGeometry(0.015, 12, 12);
        const positions = stnGeo.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Forma biconvexa
            x *= 1.5;
            y *= 0.6;
            z *= 1.2;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }
        stnGeo.computeVertexNormals();

        const stnMat = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.9,
            depthWrite: false
        });

        const stn = new THREE.Mesh(stnGeo, stnMat);
        stn.position.set(sideMultiplier * 0.04, -0.06, -0.02);
        stn.userData = { name: 'stn', phase: 2 };
        this.structures.push(stn);
        this.group.add(stn);

        // Glow del STN (importante para control motor)
        const stnGlow = new THREE.Mesh(stnGeo.clone(), new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: this.config.opacity * 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        stnGlow.position.copy(stn.position);
        stnGlow.scale.setScalar(1.5);
        this.group.add(stnGlow);
    }

    createSubstantiaNigra() {
        // Sustancia negra - en el mesencéfalo
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Pars compacta (dopamina)
        const snPoints = [];
        for (let t = 0; t <= 1; t += 0.1) {
            const x = sideMultiplier * (0.02 + t * 0.04);
            const y = -0.1 - t * 0.02;
            const z = -0.04 + Math.sin(t * Math.PI) * 0.01;
            snPoints.push(new THREE.Vector3(x, y, z));
        }

        const snCurve = new THREE.CatmullRomCurve3(snPoints);
        const snGeo = new THREE.TubeGeometry(snCurve, 15, 0.012, 8, false);

        const snMat = new THREE.MeshBasicMaterial({
            color: 0x222222,  // Color oscuro (sustancia "negra")
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });

        const sn = new THREE.Mesh(snGeo, snMat);
        sn.userData = { name: 'substantia_nigra', phase: 2.5 };
        this.structures.push(sn);
        this.group.add(sn);

        // Glow dopaminérgico
        const dopamineGlow = new THREE.Mesh(snGeo.clone(), new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: this.config.opacity * 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        dopamineGlow.scale.setScalar(1.3);
        dopamineGlow.userData = { isDopamine: true };
        this.group.add(dopamineGlow);
    }

    createPathways() {
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Vía directa (facilitación del movimiento)
        const directPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(sideMultiplier * 0.1, -0.02, 0.02),   // Putamen
            new THREE.Vector3(sideMultiplier * 0.06, -0.03, 0.01),  // GPi
            new THREE.Vector3(sideMultiplier * 0.04, -0.04, 0)      // Tálamo
        ]);

        const directGeo = new THREE.TubeGeometry(directPath, 15, 0.004, 6, false);
        const directMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,  // Verde = facilitación
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });

        const direct = new THREE.Mesh(directGeo, directMat);
        direct.userData = { name: 'direct_pathway', type: 'facilitation' };
        this.pathways.push(direct);
        this.group.add(direct);

        // Vía indirecta (inhibición del movimiento)
        const indirectPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(sideMultiplier * 0.1, -0.02, 0.02),   // Putamen
            new THREE.Vector3(sideMultiplier * 0.06, -0.02, 0.01),  // GPe
            new THREE.Vector3(sideMultiplier * 0.04, -0.06, -0.02), // STN
            new THREE.Vector3(sideMultiplier * 0.04, -0.03, 0)      // GPi
        ]);

        const indirectGeo = new THREE.TubeGeometry(indirectPath, 20, 0.004, 6, false);
        const indirectMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,  // Rojo = inhibición
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });

        const indirect = new THREE.Mesh(indirectGeo, indirectMat);
        indirect.userData = { name: 'indirect_pathway', type: 'inhibition' };
        this.pathways.push(indirect);
        this.group.add(indirect);

        // Vía nigroestriatal (dopamina)
        const dopaminePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(sideMultiplier * 0.04, -0.11, -0.04), // SN
            new THREE.Vector3(sideMultiplier * 0.06, -0.08, -0.01),
            new THREE.Vector3(sideMultiplier * 0.1, -0.02, 0.02)    // Putamen
        ]);

        const dopamineGeo = new THREE.TubeGeometry(dopaminePath, 15, 0.003, 6, false);
        const dopamineMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });

        const dopamine = new THREE.Mesh(dopamineGeo, dopamineMat);
        dopamine.userData = { name: 'nigrostriatal', type: 'dopamine' };
        this.pathways.push(dopamine);
        this.group.add(dopamine);
    }

    createSignals() {
        // Señales viajando por las vías
        this.pathways.forEach((pathway, index) => {
            for (let i = 0; i < 3; i++) {
                const signalGeo = new THREE.SphereGeometry(0.005, 6, 6);
                const color = pathway.userData.type === 'facilitation' ? 0x00ff00 :
                             pathway.userData.type === 'inhibition' ? 0xff0000 : 0x00ff00;

                const signalMat = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.8,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                const signal = new THREE.Mesh(signalGeo, signalMat);
                signal.userData = {
                    pathwayIndex: index,
                    t: i / 3,
                    speed: 0.2 + Math.random() * 0.1
                };

                this.signals.push(signal);
                this.group.add(signal);
            }
        });
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    animate(time) {
        // Pulso general
        const pulse = 1 + Math.sin(time * 0.5) * 0.02;
        this.group.scale.setScalar(this.config.scale * pulse);

        // Animar estructuras
        this.structures.forEach(structure => {
            const { phase } = structure.userData;
            const wave = Math.sin(time * 1.5 + phase);
            structure.material.opacity = this.config.opacity * (0.6 + wave * 0.2);
        });

        // Animar vías
        this.pathways.forEach(pathway => {
            const wave = Math.sin(time * 2);
            pathway.material.opacity = this.config.opacity * (0.4 + wave * 0.2);
        });

        // Animar señales viajando
        this.signals.forEach(signal => {
            const { t, speed, pathwayIndex } = signal.userData;

            // Actualizar posición a lo largo de la vía
            signal.userData.t += 0.005 * speed;
            if (signal.userData.t > 1) signal.userData.t = 0;

            // Obtener posición en la curva de la vía correspondiente
            const pathway = this.pathways[pathwayIndex];
            if (pathway?.geometry?.parameters?.path) {
                const point = pathway.geometry.parameters.path.getPoint(signal.userData.t);
                signal.position.copy(point);
            }

            // Fade basado en posición
            signal.material.opacity = 0.8 * Math.sin(signal.userData.t * Math.PI);
        });

        // Pulso dopaminérgico
        this.group.children.forEach(child => {
            if (child.userData?.isDopamine) {
                const dopPulse = 1 + Math.sin(time * 2) * 0.2;
                child.scale.setScalar(1.3 * dopPulse);
                child.material.opacity = this.config.opacity * (0.15 + Math.sin(time * 3) * 0.1);
            }
        });
    }
}
