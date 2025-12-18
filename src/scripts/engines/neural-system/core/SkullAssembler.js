/**
 * SkullAssembler - Ensambla el cráneo y vértebras cervicales
 * Da contexto anatómico al cerebro
 * Máximo 250 líneas
 */

import * as THREE from 'three';

// Skull components
import { Skull } from '../skull/Skull.js';
import { CervicalVertebrae } from '../skull/CervicalVertebrae.js';

export class SkullAssembler {
    constructor(config) {
        this.config = config;

        // Contenedor del cráneo
        this.skullGroup = new THREE.Group();

        // Referencias a componentes
        this.skull = null;
        this.cervicalVertebrae = null;
    }

    assemble() {
        const cfg = {
            color: this.config.color,
            opacity: this.config.opacity * 0.3,  // Más transparente que el cerebro
            wireframe: true
        };

        // Crear cráneo
        this.skull = new Skull({
            ...cfg,
            scale: 1
        });
        this.skullGroup.add(this.skull.getMesh());

        // Crear vértebras cervicales
        this.cervicalVertebrae = new CervicalVertebrae({
            ...cfg,
            opacity: cfg.opacity * 0.8,
            startY: -0.32
        });
        this.skullGroup.add(this.cervicalVertebrae.getMesh());

        return this.skullGroup;
    }

    // Animar componentes
    animateParts(time) {
        if (this.skull?.animate) {
            this.skull.animate(time);
        }
        if (this.cervicalVertebrae?.animate) {
            this.cervicalVertebrae.animate(time);
        }
    }

    // Obtener grupo del cráneo
    getGroup() {
        return this.skullGroup;
    }
}
