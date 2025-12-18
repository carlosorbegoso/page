/**
 * Cuarto Ventrículo - Cavidad entre cerebelo y tronco encefálico
 * Forma de tienda con techo puntiagudo (fastigium)
 *
 * Anatomía incluida:
 * - Techo (cerebelo)
 * - Piso (puente y bulbo)
 * - Foramen de Magendie (medial)
 * - Forámenes de Luschka (laterales)
 * - Recesos laterales
 */

import * as THREE from 'three';

export class FourthVentricle {
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
        this.createLateralRecesses();
        this.createForamina();
        this.createCSFFlow();
    }

    createMainCavity() {
        // Forma de tienda/diamante romboidal
        const shape = new THREE.Shape();

        // Crear forma romboidal desde arriba
        shape.moveTo(0, 0.08);      // Punta superior (fastigium)
        shape.lineTo(0.06, 0);      // Lado derecho
        shape.lineTo(0, -0.06);     // Punta inferior
        shape.lineTo(-0.06, 0);     // Lado izquierdo
        shape.lineTo(0, 0.08);      // Cerrar

        const extrudeSettings = {
            depth: 0.04,
            bevelEnabled: true,
            bevelThickness: 0.005,
            bevelSize: 0.005,
            bevelSegments: 3
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Centrar y rotar
        geometry.translate(0, 0, -0.02);

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

        // Fastigium (pico superior) - punto brillante
        const fastigiumGeo = new THREE.SphereGeometry(0.01, 8, 8);
        const fastigiumMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const fastigium = new THREE.Mesh(fastigiumGeo, fastigiumMat);
        fastigium.position.set(0, 0.08, 0);
        this.group.add(fastigium);
    }

    createLateralRecesses() {
        // Recesos laterales que se extienden hacia los lados
        const recessMat = new THREE.MeshBasicMaterial({
            color: this.config.fluidColor,
            transparent: true,
            opacity: this.config.opacity * 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Receso izquierdo
        const leftPoints = [
            new THREE.Vector3(-0.05, 0, 0),
            new THREE.Vector3(-0.1, 0.01, 0.01),
            new THREE.Vector3(-0.14, 0.02, 0.02)
        ];

        const leftCurve = new THREE.CatmullRomCurve3(leftPoints);
        const leftGeo = new THREE.TubeGeometry(leftCurve, 12, 0.015, 8, false);
        this.group.add(new THREE.Mesh(leftGeo, recessMat));

        // Receso derecho
        const rightPoints = leftPoints.map(p => new THREE.Vector3(-p.x, p.y, p.z));
        const rightCurve = new THREE.CatmullRomCurve3(rightPoints);
        const rightGeo = new THREE.TubeGeometry(rightCurve, 12, 0.015, 8, false);
        this.group.add(new THREE.Mesh(rightGeo, recessMat.clone()));
    }

    createForamina() {
        const foramenMat = new THREE.MeshBasicMaterial({
            color: this.config.color,
            transparent: true,
            opacity: this.config.opacity * 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        // Foramen de Magendie (medial, inferior)
        const magendieGeo = new THREE.TorusGeometry(0.015, 0.004, 8, 16);
        const magendie = new THREE.Mesh(magendieGeo, foramenMat);
        magendie.position.set(0, -0.06, 0.02);
        magendie.rotation.x = Math.PI / 2;
        magendie.userData = { name: 'magendie' };
        this.foramina.push(magendie);
        this.group.add(magendie);

        // Foramen de Luschka izquierdo
        const luschkaGeo = new THREE.TorusGeometry(0.01, 0.003, 8, 12);
        const luschkaLeft = new THREE.Mesh(luschkaGeo, foramenMat.clone());
        luschkaLeft.position.set(-0.14, 0.02, 0.02);
        luschkaLeft.rotation.y = Math.PI / 2;
        luschkaLeft.userData = { name: 'luschka_left' };
        this.foramina.push(luschkaLeft);
        this.group.add(luschkaLeft);

        // Foramen de Luschka derecho
        const luschkaRight = new THREE.Mesh(luschkaGeo.clone(), foramenMat.clone());
        luschkaRight.position.set(0.14, 0.02, 0.02);
        luschkaRight.rotation.y = -Math.PI / 2;
        luschkaRight.userData = { name: 'luschka_right' };
        this.foramina.push(luschkaRight);
        this.group.add(luschkaRight);

        // Indicadores de flujo saliendo por forámenes
        this.foramina.forEach(foramen => {
            const flowGeo = new THREE.ConeGeometry(0.008, 0.02, 6);
            const flowMat = new THREE.MeshBasicMaterial({
                color: this.config.fluidColor,
                transparent: true,
                opacity: this.config.opacity * 0.3,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const flow = new THREE.Mesh(flowGeo, flowMat);
            flow.position.copy(foramen.position);

            if (foramen.userData.name === 'magendie') {
                flow.position.y -= 0.015;
                flow.rotation.x = Math.PI;
            } else {
                const dir = foramen.position.x > 0 ? 1 : -1;
                flow.position.x += dir * 0.015;
                flow.rotation.z = dir * Math.PI / 2;
            }

            flow.userData = { isFlowIndicator: true, phase: Math.random() * Math.PI * 2 };
            this.group.add(flow);
        });
    }

    createCSFFlow() {
        const particleCount = 20;

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

            // Distribuir en el rombo
            const t = Math.random();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.04;

            particle.position.set(
                radius * Math.cos(angle),
                0.06 - t * 0.12,
                radius * Math.sin(angle) * 0.5
            );

            particle.userData = {
                t: t,
                angle: angle,
                speed: 0.08 + Math.random() * 0.05,
                phase: Math.random() * Math.PI * 2,
                exitPath: Math.random()  // 0 = Magendie, 0.5+ = Luschka
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
        // Flujo de LCR
        this.csfParticles.forEach(particle => {
            const { speed, phase, exitPath, angle } = particle.userData;

            particle.userData.t += 0.003 * speed;

            if (particle.userData.t > 1) {
                particle.userData.t = 0;
                particle.userData.exitPath = Math.random();
                particle.userData.angle = Math.random() * Math.PI * 2;
            }

            const t = particle.userData.t;
            const wave = Math.sin(time * 2 + phase) * 0.003;

            if (t < 0.7) {
                // Dentro del ventrículo
                const radius = 0.04 * (1 - t / 0.7);
                particle.position.set(
                    radius * Math.cos(angle + t * 2) + wave,
                    0.06 - t * 0.12,
                    radius * Math.sin(angle + t * 2) * 0.5
                );
            } else {
                // Saliendo por forámenes
                const exitT = (t - 0.7) / 0.3;

                if (exitPath < 0.4) {
                    // Salir por Magendie
                    particle.position.set(
                        wave,
                        -0.06 - exitT * 0.04,
                        0.02 + exitT * 0.02
                    );
                } else if (exitPath < 0.7) {
                    // Salir por Luschka izquierdo
                    particle.position.set(
                        -0.14 - exitT * 0.03,
                        0.02,
                        0.02 + exitT * 0.02
                    );
                } else {
                    // Salir por Luschka derecho
                    particle.position.set(
                        0.14 + exitT * 0.03,
                        0.02,
                        0.02 + exitT * 0.02
                    );
                }
            }

            // Fade
            const fadeIn = Math.min(1, t * 5);
            const fadeOut = t > 0.8 ? (1 - t) / 0.2 : 1;
            particle.material.opacity = 0.7 * fadeIn * fadeOut;
        });

        // Animar forámenes (pulsación)
        this.foramina.forEach((foramen, i) => {
            const pulse = 1 + Math.sin(time * 1.5 + i) * 0.15;
            foramen.scale.setScalar(pulse);
        });

        // Animar indicadores de flujo
        this.group.children.forEach(child => {
            if (child.userData?.isFlowIndicator) {
                const flowPulse = 0.8 + Math.sin(time * 3 + child.userData.phase) * 0.3;
                child.scale.setScalar(flowPulse);
                child.material.opacity = this.config.opacity * (0.2 + Math.sin(time * 2 + child.userData.phase) * 0.15);
            }
        });

        // Respiración
        const breath = 1 + Math.sin(time * 0.3) * 0.02;
        this.group.scale.setScalar(this.config.scale * breath);
    }
}
