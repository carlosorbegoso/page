/**
 * Ventrículos Laterales - Cavidades llenas de líquido cefalorraquídeo
 * Uno en cada hemisferio cerebral
 *
 * Anatomía incluida:
 * - Cuerpo del ventrículo (body)
 * - Cuerno frontal/anterior
 * - Cuerno occipital/posterior
 * - Cuerno temporal/inferior
 * - Atrio/trígono (unión de cuernos)
 * - Plexo coroideo (produce LCR)
 */

import * as THREE from 'three';

export class LateralVentricles {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            fluidColor: config.fluidColor || 0x4488ff,
            opacity: config.opacity || 0.3,
            scale: config.scale || 1,
            side: config.side || 'left',
            ...config
        };

        this.csfParticles = [];
        this.choroidPlexus = [];

        this.create();
    }

    create() {
        this.createVentricleBody();
        this.createFrontalHorn();
        this.createOccipitalHorn();
        this.createTemporalHorn();
        this.createChoroidPlexus();
        this.createCSFFlow();
    }

    createVentricleBody() {
        // Cuerpo principal del ventrículo lateral
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Crear curva del cuerpo principal (forma de C aplanada)
        const bodyPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const angle = t * Math.PI * 0.6 - Math.PI * 0.1;
            const radius = 0.08 + Math.sin(t * Math.PI) * 0.02;

            const x = sideMultiplier * (0.04 + radius * 0.5);
            const y = 0.1 - t * 0.12;
            const z = 0.02 + radius * Math.cos(angle) * 0.3;

            bodyPoints.push(new THREE.Vector3(x, y, z));
        }

        const bodyCurve = new THREE.CatmullRomCurve3(bodyPoints);

        // Crear tubo con sección transversal variable
        const bodyGeo = new THREE.TubeGeometry(bodyCurve, 30, 0.025, 12, false);
        const positions = bodyGeo.attributes.position;

        // Deformar para darle forma más plana
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            // Aplanar verticalmente
            positions.setY(i, y * 0.6);
        }

        bodyGeo.computeVertexNormals();

        // Material de fluido (LCR)
        const fluidMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const body = new THREE.Mesh(bodyGeo, fluidMat);
        this.group.add(body);

        // Contorno del ventrículo
        const outlineMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        const outline = new THREE.Mesh(bodyGeo.clone(), outlineMat);
        outline.scale.setScalar(1.05);
        this.group.add(outline);
    }

    createFrontalHorn() {
        // Cuerno frontal (anterior) - se extiende hacia adelante
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        const frontalPoints = [
            new THREE.Vector3(sideMultiplier * 0.06, 0.08, 0.1),
            new THREE.Vector3(sideMultiplier * 0.08, 0.06, 0.18),
            new THREE.Vector3(sideMultiplier * 0.07, 0.04, 0.25)
        ];

        const frontalCurve = new THREE.CatmullRomCurve3(frontalPoints);
        const frontalGeo = new THREE.TubeGeometry(frontalCurve, 15, 0.02, 8, false);

        // Hacer que se estreche hacia adelante
        const positions = frontalGeo.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const z = positions.getZ(i);
            const taper = 1 - (z - 0.1) / 0.2 * 0.3;
            positions.setX(i, positions.getX(i) * Math.max(0.5, taper));
            positions.setY(i, positions.getY(i) * Math.max(0.5, taper));
        }
        frontalGeo.computeVertexNormals();

        const frontalMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.35,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.group.add(new THREE.Mesh(frontalGeo, frontalMat));

        // Wireframe
        const frontalWire = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(frontalGeo.clone(), frontalWire));
    }

    createOccipitalHorn() {
        // Cuerno occipital (posterior) - se extiende hacia atrás
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        const occipitalPoints = [
            new THREE.Vector3(sideMultiplier * 0.06, 0.02, -0.02),
            new THREE.Vector3(sideMultiplier * 0.08, 0, -0.12),
            new THREE.Vector3(sideMultiplier * 0.06, -0.02, -0.2)
        ];

        const occipitalCurve = new THREE.CatmullRomCurve3(occipitalPoints);
        const occipitalGeo = new THREE.TubeGeometry(occipitalCurve, 15, 0.018, 8, false);

        const occipitalMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.35,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.group.add(new THREE.Mesh(occipitalGeo, occipitalMat));

        // Wireframe
        const occWire = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(occipitalGeo.clone(), occWire));
    }

    createTemporalHorn() {
        // Cuerno temporal (inferior) - se curva hacia abajo y adelante
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        const temporalPoints = [
            new THREE.Vector3(sideMultiplier * 0.06, 0, -0.02),
            new THREE.Vector3(sideMultiplier * 0.1, -0.06, 0.02),
            new THREE.Vector3(sideMultiplier * 0.14, -0.1, 0.08),
            new THREE.Vector3(sideMultiplier * 0.16, -0.12, 0.14)
        ];

        const temporalCurve = new THREE.CatmullRomCurve3(temporalPoints);
        const temporalGeo = new THREE.TubeGeometry(temporalCurve, 20, 0.015, 8, false);

        const temporalMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.35,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.group.add(new THREE.Mesh(temporalGeo, temporalMat));

        // Wireframe
        const tempWire = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(temporalGeo.clone(), tempWire));
    }

    createChoroidPlexus() {
        // Plexo coroideo - produce LCR, línea ondulada en el ventrículo
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        const plexusPoints = [];
        for (let t = 0; t <= 1; t += 0.05) {
            const x = sideMultiplier * (0.05 + t * 0.03 + Math.sin(t * Math.PI * 4) * 0.01);
            const y = 0.06 - t * 0.1;
            const z = 0.02 + t * 0.04 + Math.sin(t * Math.PI * 3) * 0.015;
            plexusPoints.push(new THREE.Vector3(x, y, z));
        }

        const plexusCurve = new THREE.CatmullRomCurve3(plexusPoints);
        const plexusGeo = new THREE.TubeGeometry(plexusCurve, 25, 0.008, 6, false);

        const plexusMat = new THREE.MeshBasicMaterial({
            color: 0xff6688,  // Color rojizo (vascular)
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.7,
            depthWrite: false
        });

        const plexus = new THREE.Mesh(plexusGeo, plexusMat);
        plexus.userData = { isPlexus: true };
        this.choroidPlexus.push(plexus);
        this.group.add(plexus);

        // Glow del plexo
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xff6688,
            transparent: true,
            opacity: this.config.opacity * 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const plexusGlow = new THREE.Mesh(plexusGeo.clone(), glowMat);
        plexusGlow.scale.setScalar(1.5);
        this.group.add(plexusGlow);
    }

    createCSFFlow() {
        // Partículas de LCR fluyendo
        const particleCount = 25;
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        for (let i = 0; i < particleCount; i++) {
            const geo = new THREE.SphereGeometry(0.004, 4, 4);
            const mat = new THREE.MeshBasicMaterial({
                color: this.config.fluidColor,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const particle = new THREE.Mesh(geo, mat);

            // Posición inicial aleatoria en el ventrículo
            const t = Math.random();
            particle.position.set(
                sideMultiplier * (0.05 + Math.random() * 0.04),
                0.1 - t * 0.12,
                0.02 + t * 0.06
            );

            particle.userData = {
                t: t,
                speed: 0.1 + Math.random() * 0.1,
                phase: Math.random() * Math.PI * 2,
                path: Math.random()  // 0 = cuerpo, 1 = hacia cuernos
            };

            this.csfParticles.push(particle);
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
        const sideMultiplier = this.config.side === 'left' ? 1 : -1;

        // Animar flujo de LCR
        this.csfParticles.forEach(particle => {
            const { speed, phase, path } = particle.userData;

            // Mover a lo largo del ventrículo
            particle.userData.t += 0.003 * speed;

            if (particle.userData.t > 1) {
                particle.userData.t = 0;
                particle.userData.path = Math.random();
            }

            const t = particle.userData.t;

            // Movimiento ondulante
            const wave = Math.sin(time * 2 + phase) * 0.005;

            if (path < 0.5) {
                // Movimiento en el cuerpo
                particle.position.set(
                    sideMultiplier * (0.05 + t * 0.03 + wave),
                    0.1 - t * 0.12,
                    0.02 + t * 0.06 + wave
                );
            } else {
                // Movimiento hacia los cuernos
                particle.position.set(
                    sideMultiplier * (0.06 + t * 0.08),
                    0.08 - t * 0.04,
                    0.1 + t * 0.15
                );
            }

            // Fade in/out
            const fadeIn = Math.min(1, t * 4);
            const fadeOut = Math.min(1, (1 - t) * 4);
            particle.material.opacity = 0.6 * fadeIn * fadeOut;
        });

        // Animar plexo coroideo (pulsación de producción)
        this.choroidPlexus.forEach(plexus => {
            const pulse = 1 + Math.sin(time * 2) * 0.1;
            plexus.scale.setScalar(pulse);
        });

        // Pulso general del ventrículo (respiración)
        const ventriclePulse = 1 + Math.sin(time * 0.3) * 0.02;
        this.group.scale.setScalar(this.config.scale * ventriclePulse);
    }
}
