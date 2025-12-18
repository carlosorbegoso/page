/**
 * Hipotálamo - Centro de control autonómico y endocrino
 * Pequeña estructura debajo del tálamo
 *
 * Anatomía incluida:
 * - Núcleos hipotalámicos (supraóptico, paraventricular, arcuato)
 * - Quiasma óptico
 * - Infundíbulo (tallo hipofisario)
 * - Cuerpos mamilares
 * - Conexiones con hipófisis
 */

import * as THREE from 'three';

export class Hypothalamus {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            accentColor: config.accentColor || 0xff00ff,
            opacity: config.opacity || 0.3,
            scale: config.scale || 1,
            ...config
        };

        this.nuclei = [];
        this.connections = [];
        this.hormoneParticles = [];

        this.create();
    }

    create() {
        this.createMainBody();
        this.createNuclei();
        this.createOpticChiasm();
        this.createInfundibulum();
        this.createMammillaryBodies();
        this.createHormoneFlow();
    }

    createMainBody() {
        const segments = 24;
        const geometry = new THREE.SphereGeometry(0.06, segments, segments);
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Forma del hipotálamo: más ancho que alto
            x *= 1.8;  // Extendido lateralmente
            y *= 0.6;  // Aplanado verticalmente
            z *= 1.3;  // Algo extendido anterior-posterior

            // Concavidad inferior (donde va la hipófisis)
            if (y < 0) {
                const concavity = Math.abs(y) / 0.04;
                y -= concavity * 0.015;
            }

            // Textura de núcleos
            const texture = Math.sin(x * 30 + y * 20 + z * 25) * 0.004;
            x += texture;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        const wireMaterial = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.85,
            depthWrite: false
        });

        this.group.add(new THREE.Mesh(geometry, wireMaterial));

        // Glow
        const glowMat = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            transparent: true,
            opacity: this.config.opacity * 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glow = new THREE.Mesh(geometry.clone(), glowMat);
        glow.scale.setScalar(1.2);
        this.group.add(glow);
    }

    createNuclei() {
        // Núcleos hipotalámicos principales
        const nucleiData = [
            { name: 'supraoptic_L', pos: [-0.06, 0, 0.03], size: 0.015 },
            { name: 'supraoptic_R', pos: [0.06, 0, 0.03], size: 0.015 },
            { name: 'paraventricular_L', pos: [-0.04, 0.02, 0], size: 0.012 },
            { name: 'paraventricular_R', pos: [0.04, 0.02, 0], size: 0.012 },
            { name: 'arcuate', pos: [0, -0.02, 0], size: 0.018 },
            { name: 'ventromedial', pos: [0, 0, -0.02], size: 0.015 },
            { name: 'lateral_L', pos: [-0.07, 0, 0], size: 0.012 },
            { name: 'lateral_R', pos: [0.07, 0, 0], size: 0.012 }
        ];

        nucleiData.forEach(nucleus => {
            const geo = new THREE.SphereGeometry(nucleus.size, 8, 8);
            const mat = new THREE.MeshBasicMaterial({
                color: this.config.color,
                transparent: true,
                opacity: this.config.opacity * 0.6,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(...nucleus.pos);
            mesh.userData = {
                name: nucleus.name,
                phase: Math.random() * Math.PI * 2,
                baseOpacity: this.config.opacity * 0.6
            };

            this.nuclei.push(mesh);
            this.group.add(mesh);
        });
    }

    createOpticChiasm() {
        // Quiasma óptico - donde se cruzan los nervios ópticos
        const chiasmMat = new THREE.LineBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        // Nervio óptico izquierdo entrando
        const leftOpticIn = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.15, 0, 0.08),
            new THREE.Vector3(-0.08, 0, 0.06),
            new THREE.Vector3(0, 0, 0.05)
        ]);

        // Nervio óptico derecho entrando
        const rightOpticIn = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.15, 0, 0.08),
            new THREE.Vector3(0.08, 0, 0.06),
            new THREE.Vector3(0, 0, 0.05)
        ]);

        // Tracto óptico izquierdo saliendo (cruzado)
        const leftOpticOut = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0.05),
            new THREE.Vector3(-0.05, -0.01, 0.02),
            new THREE.Vector3(-0.1, -0.02, -0.02)
        ]);

        // Tracto óptico derecho saliendo (cruzado)
        const rightOpticOut = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0.05),
            new THREE.Vector3(0.05, -0.01, 0.02),
            new THREE.Vector3(0.1, -0.02, -0.02)
        ]);

        [leftOpticIn, rightOpticIn, leftOpticOut, rightOpticOut].forEach(curve => {
            const geo = new THREE.TubeGeometry(curve, 12, 0.008, 6, false);
            const mat = new THREE.MeshBasicMaterial({
                color: this.config.secondaryColor,
                wireframe: true,
                transparent: true,
                opacity: this.config.opacity * 0.5,
                depthWrite: false
            });
            this.group.add(new THREE.Mesh(geo, mat));
        });

        // X del quiasma
        const chiasmGeo = new THREE.SphereGeometry(0.015, 8, 8);
        const chiasmMesh = new THREE.Mesh(chiasmGeo, new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        chiasmMesh.position.set(0, 0, 0.05);
        chiasmMesh.scale.set(1.5, 0.5, 1);
        this.group.add(chiasmMesh);
    }

    createInfundibulum() {
        // Tallo hipofisario que conecta con la glándula pituitaria
        const infundibulumCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -0.02, 0),
            new THREE.Vector3(0, -0.05, 0.01),
            new THREE.Vector3(0, -0.08, 0.02),
            new THREE.Vector3(0, -0.1, 0.02)
        ]);

        const infundibulumGeo = new THREE.TubeGeometry(infundibulumCurve, 15, 0.012, 8, false);

        // Hacer que se estreche hacia abajo
        const positions = infundibulumGeo.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            const taper = 1 - (Math.abs(y + 0.02) / 0.08) * 0.4;
            positions.setX(i, positions.getX(i) * Math.max(0.5, taper));
            positions.setZ(i, positions.getZ(i) * Math.max(0.5, taper));
        }
        infundibulumGeo.computeVertexNormals();

        const infundibulumMat = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            depthWrite: false
        });

        this.group.add(new THREE.Mesh(infundibulumGeo, infundibulumMat));

        // Hipófisis (glándula pituitaria) - en la base
        const pituitaryGeo = new THREE.SphereGeometry(0.025, 12, 12);
        const pituitaryMat = new THREE.MeshBasicMaterial({
            color: this.config.accentColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.8,
            depthWrite: false
        });
        const pituitary = new THREE.Mesh(pituitaryGeo, pituitaryMat);
        pituitary.position.set(0, -0.12, 0.02);
        pituitary.scale.set(1.2, 0.7, 1);
        this.group.add(pituitary);

        // Glow de la hipófisis
        const pitGlow = new THREE.Mesh(pituitaryGeo.clone(), new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        pitGlow.position.copy(pituitary.position);
        pitGlow.scale.set(1.5, 1, 1.5);
        pitGlow.userData = { isPituitary: true };
        this.group.add(pitGlow);
    }

    createMammillaryBodies() {
        // Cuerpos mamilares - dos pequeñas protuberancias posteriores
        const mammillaryMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            depthWrite: false
        });

        const mammillaryGeo = new THREE.SphereGeometry(0.015, 8, 8);

        const leftMammillary = new THREE.Mesh(mammillaryGeo, mammillaryMat);
        leftMammillary.position.set(-0.02, -0.02, -0.05);
        this.group.add(leftMammillary);

        const rightMammillary = new THREE.Mesh(mammillaryGeo.clone(), mammillaryMat.clone());
        rightMammillary.position.set(0.02, -0.02, -0.05);
        this.group.add(rightMammillary);

        // Conexión con el fórnix
        const fornixConnection = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.03, -0.02),
            new THREE.Vector3(-0.01, 0, -0.04),
            new THREE.Vector3(-0.02, -0.02, -0.05)
        ]);
        const fornixGeo = new THREE.TubeGeometry(fornixConnection, 10, 0.005, 6, false);
        const fornixMat = new THREE.MeshBasicMaterial({
            color: this.config.secondaryColor,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(fornixGeo, fornixMat));
    }

    createHormoneFlow() {
        // Partículas que representan el flujo hormonal
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const geo = new THREE.SphereGeometry(0.004, 4, 4);
            const mat = new THREE.MeshBasicMaterial({
                color: this.config.accentColor,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const particle = new THREE.Mesh(geo, mat);

            // Posición inicial aleatoria a lo largo del infundíbulo
            const t = Math.random();
            particle.position.set(
                (Math.random() - 0.5) * 0.02,
                -0.02 - t * 0.1,
                0.01
            );

            particle.userData = {
                t: t,
                speed: 0.3 + Math.random() * 0.3,
                phase: Math.random() * Math.PI * 2
            };

            this.hormoneParticles.push(particle);
            this.group.add(particle);
        }
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    animate(time) {
        // Pulso general
        const pulse = 1 + Math.sin(time * 0.7) * 0.015;
        this.group.scale.setScalar(this.config.scale * pulse);

        // Animar núcleos
        this.nuclei.forEach(nucleus => {
            const { phase, baseOpacity } = nucleus.userData;
            const wave = Math.sin(time * 2 + phase);
            nucleus.material.opacity = baseOpacity * (0.7 + wave * 0.3);
        });

        // Animar flujo hormonal (partículas bajando)
        this.hormoneParticles.forEach(particle => {
            const { speed, phase } = particle.userData;

            // Mover hacia abajo
            particle.userData.t += 0.005 * speed;

            // Reset cuando llega al final
            if (particle.userData.t > 1) {
                particle.userData.t = 0;
            }

            const t = particle.userData.t;
            particle.position.y = -0.02 - t * 0.1;
            particle.position.x = Math.sin(time * 3 + phase) * 0.008;

            // Fade in/out
            const fadeIn = Math.min(1, t * 5);
            const fadeOut = Math.min(1, (1 - t) * 5);
            particle.material.opacity = 0.8 * fadeIn * fadeOut;
        });

        // Pulso de la hipófisis
        this.group.children.forEach(child => {
            if (child.userData?.isPituitary) {
                const pitPulse = 1 + Math.sin(time * 1.5) * 0.1;
                child.scale.setScalar(pitPulse);
            }
        });
    }
}
