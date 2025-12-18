/**
 * Tercer Ventrículo - Cavidad central entre los tálamos
 * Conecta los ventrículos laterales con el cuarto ventrículo
 *
 * Anatomía incluida:
 * - Cavidad principal (forma de hendidura)
 * - Foramen de Monro (conexión con laterales)
 * - Acueducto cerebral (conexión con cuarto)
 * - Receso pineal, supraóptico, infundibular
 */

import * as THREE from 'three';

export class ThirdVentricle {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            fluidColor: config.fluidColor || 0x4488ff,
            opacity: config.opacity || 0.3,
            scale: config.scale || 1,
            ...config
        };

        this.csfParticles = [];
        this.foramina = [];

        this.create();
    }

    create() {
        this.createMainCavity();
        this.createForaminaOfMonro();
        this.createAqueduct();
        this.createRecesses();
        this.createCSFFlow();
    }

    createMainCavity() {
        // El tercer ventrículo es una hendidura estrecha y alta
        const segments = 24;
        const geometry = new THREE.SphereGeometry(0.06, segments, segments);
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Forma de hendidura (muy estrecho en X, alto en Y)
            x *= 0.15;   // Muy estrecho
            y *= 1.8;    // Alto
            z *= 0.8;    // Moderado en Z

            // Ensanchamiento en la parte superior
            if (y > 0.05) {
                x *= 1 + (y - 0.05) * 2;
            }

            // Estrechamiento en la parte inferior
            if (y < -0.05) {
                x *= 1 - Math.abs(y + 0.05) * 0.5;
                z *= 1 - Math.abs(y + 0.05) * 0.3;
            }

            // Recesos laterales
            const recess = Math.sin(y * 10) * 0.003;
            x += recess;

            positions.setX(i, x);
            positions.setY(i, y);
            positions.setZ(i, z);
        }

        geometry.computeVertexNormals();

        // Fluido
        const fluidMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.group.add(new THREE.Mesh(geometry, fluidMat));

        // Wireframe
        const wireMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            depthWrite: false
        });

        this.group.add(new THREE.Mesh(geometry.clone(), wireMat));
    }

    createForaminaOfMonro() {
        // Forámenes de Monro - conectan con ventrículos laterales
        const foramenMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Foramen izquierdo
        const leftForamenPoints = [
            new THREE.Vector3(0, 0.06, 0.02),
            new THREE.Vector3(-0.02, 0.07, 0.03),
            new THREE.Vector3(-0.04, 0.08, 0.04)
        ];

        const leftCurve = new THREE.CatmullRomCurve3(leftForamenPoints);
        const leftGeo = new THREE.TubeGeometry(leftCurve, 10, 0.012, 8, false);
        const leftForamen = new THREE.Mesh(leftGeo, foramenMat);
        leftForamen.userData = { name: 'foramen_monro_left' };
        this.foramina.push(leftForamen);
        this.group.add(leftForamen);

        // Foramen derecho
        const rightForamenPoints = [
            new THREE.Vector3(0, 0.06, 0.02),
            new THREE.Vector3(0.02, 0.07, 0.03),
            new THREE.Vector3(0.04, 0.08, 0.04)
        ];

        const rightCurve = new THREE.CatmullRomCurve3(rightForamenPoints);
        const rightGeo = new THREE.TubeGeometry(rightCurve, 10, 0.012, 8, false);
        const rightForamen = new THREE.Mesh(rightGeo, foramenMat.clone());
        rightForamen.userData = { name: 'foramen_monro_right' };
        this.foramina.push(rightForamen);
        this.group.add(rightForamen);

        // Glow en la unión
        const junctionGeo = new THREE.SphereGeometry(0.015, 8, 8);
        const junctionMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const junction = new THREE.Mesh(junctionGeo, junctionMat);
        junction.position.set(0, 0.06, 0.02);
        this.group.add(junction);
    }

    createAqueduct() {
        // Acueducto cerebral (de Silvio) - conecta con cuarto ventrículo
        const aqueductPoints = [
            new THREE.Vector3(0, -0.08, 0),
            new THREE.Vector3(0, -0.12, -0.02),
            new THREE.Vector3(0, -0.16, -0.04),
            new THREE.Vector3(0, -0.2, -0.05)
        ];

        const aqueductCurve = new THREE.CatmullRomCurve3(aqueductPoints);
        const aqueductGeo = new THREE.TubeGeometry(aqueductCurve, 15, 0.008, 8, false);

        const aqueductMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const aqueduct = new THREE.Mesh(aqueductGeo, aqueductMat);
        aqueduct.userData = { isAqueduct: true };
        this.group.add(aqueduct);

        // Wireframe del acueducto
        const aqueductWire = new THREE.MeshBasicMaterial({
            color: this.config.color,
            wireframe: true,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            depthWrite: false
        });
        this.group.add(new THREE.Mesh(aqueductGeo.clone(), aqueductWire));
    }

    createRecesses() {
        const recessMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Receso supraóptico (anterior-inferior)
        const supraopticGeo = new THREE.ConeGeometry(0.015, 0.03, 8);
        const supraoptic = new THREE.Mesh(supraopticGeo, recessMat);
        supraoptic.position.set(0, -0.06, 0.04);
        supraoptic.rotation.x = Math.PI;
        this.group.add(supraoptic);

        // Receso infundibular (hacia hipófisis)
        const infundibularPoints = [
            new THREE.Vector3(0, -0.06, 0.02),
            new THREE.Vector3(0, -0.1, 0.03),
            new THREE.Vector3(0, -0.12, 0.04)
        ];
        const infundibularCurve = new THREE.CatmullRomCurve3(infundibularPoints);
        const infundibularGeo = new THREE.TubeGeometry(infundibularCurve, 10, 0.008, 6, false);
        this.group.add(new THREE.Mesh(infundibularGeo, recessMat.clone()));

        // Receso pineal (posterior-superior)
        const pinealGeo = new THREE.ConeGeometry(0.012, 0.025, 8);
        const pineal = new THREE.Mesh(pinealGeo, recessMat.clone());
        pineal.position.set(0, 0.04, -0.04);
        pineal.rotation.x = -Math.PI * 0.3;
        this.group.add(pineal);
    }

    createCSFFlow() {
        const particleCount = 15;

        for (let i = 0; i < particleCount; i++) {
            const geo = new THREE.SphereGeometry(0.003, 4, 4);
            const mat = new THREE.MeshBasicMaterial({
                color: this.config.fluidColor,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const particle = new THREE.Mesh(geo, mat);

            // Distribuir en la cavidad
            const t = Math.random();
            particle.position.set(
                (Math.random() - 0.5) * 0.01,
                0.08 - t * 0.16,
                (Math.random() - 0.5) * 0.04
            );

            particle.userData = {
                t: t,
                speed: 0.1 + Math.random() * 0.05,
                phase: Math.random() * Math.PI * 2
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
        // Flujo de LCR (de arriba hacia abajo)
        this.csfParticles.forEach(particle => {
            const { speed, phase } = particle.userData;

            particle.userData.t += 0.002 * speed;

            if (particle.userData.t > 1) {
                particle.userData.t = 0;
            }

            const t = particle.userData.t;
            const wave = Math.sin(time * 3 + phase) * 0.003;

            particle.position.set(
                wave,
                0.08 - t * 0.16,
                (Math.sin(time * 2 + phase) * 0.02)
            );

            // Fade
            const fadeIn = Math.min(1, t * 5);
            const fadeOut = Math.min(1, (1 - t) * 5);
            particle.material.opacity = 0.7 * fadeIn * fadeOut;
        });

        // Pulso de los forámenes
        this.foramina.forEach((foramen, i) => {
            const pulse = 1 + Math.sin(time * 1.5 + i) * 0.1;
            foramen.scale.setScalar(pulse);
        });

        // Respiración del ventrículo
        const breath = 1 + Math.sin(time * 0.25) * 0.015;
        this.group.scale.setScalar(this.config.scale * breath);
    }
}
