/**
 * Skull - Cráneo transparente estilo rayos X
 * Orquesta las partes: Cranium + FacialStructure
 */

import * as THREE from 'three';
import { Cranium } from './Cranium.js';
import { FacialStructure } from './FacialStructure.js';

export class Skull {
    constructor(config = {}) {
        this.config = {
            color: config.color || 0x4488ff,
            opacity: config.opacity || 0.15,
            scale: config.scale || 1,
            wireframe: config.wireframe ?? true
        };

        this.group = new THREE.Group();
        this.cranium = null;
        this.facialStructure = null;

        this.create();
    }

    create() {
        // Bóveda craneal
        this.cranium = new Cranium(this.config, this.group);
        this.cranium.create();

        // Estructura facial
        this.facialStructure = new FacialStructure(this.config, this.group);
        this.facialStructure.create();
    }

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    setScale(scale) {
        this.group.scale.setScalar(scale);
    }

    animate(time) {
        // Animación sutil del cráneo (pulso muy leve)
        const pulse = 1 + Math.sin(time * 0.5) * 0.005;
        this.group.scale.setScalar(this.config.scale * pulse);
    }
}
