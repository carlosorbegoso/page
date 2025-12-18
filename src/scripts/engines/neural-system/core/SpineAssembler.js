/**
 * SpineAssembler - Ensambla la médula espinal
 * Responsable de: Crear secciones de la columna, conectar con cerebro
 * Máximo 250 líneas
 */

import * as THREE from 'three';

// Spine components
import { CervicalSpine } from '../spine/CervicalSpine.js';
import { ThoracicSpine } from '../spine/ThoracicSpine.js';
import { LumbarSpine } from '../spine/LumbarSpine.js';
import { SacralSpine } from '../spine/SacralSpine.js';

export class SpineAssembler {
    constructor(config) {
        this.config = config;

        // Contenedor de la columna
        this.spineGroup = new THREE.Group();

        // Secciones de la columna
        this.sections = {
            cervical: null,
            thoracic: null,
            lumbar: null,
            sacral: null
        };
    }

    assemble(brainstem) {
        const cfg = {
            color: this.config.color,
            secondaryColor: this.config.secondaryColor,
            opacity: this.config.opacity
        };

        // Obtener punto de conexión del tronco encefálico
        const brainstemConnection = brainstem.getSpinalConnectionPoint();
        const spineStart = new THREE.Vector3(0, brainstemConnection.y - 0.3, brainstemConnection.z);

        // Cervical (C1-C8)
        this.sections.cervical = new CervicalSpine({
            ...cfg,
            startPoint: spineStart
        });
        this.spineGroup.add(this.sections.cervical.getMesh());

        // Torácica (T1-T12)
        const cervicalEnd = this.sections.cervical.getEndPoint();
        this.sections.thoracic = new ThoracicSpine({
            ...cfg,
            startPoint: cervicalEnd
        });
        this.spineGroup.add(this.sections.thoracic.getMesh());

        // Lumbar (L1-L5)
        const thoracicEnd = this.sections.thoracic.getEndPoint();
        this.sections.lumbar = new LumbarSpine({
            ...cfg,
            startPoint: thoracicEnd
        });
        this.spineGroup.add(this.sections.lumbar.getMesh());

        // Sacra (S1-S5 + Cóccix)
        const lumbarEnd = this.sections.lumbar.getEndPoint();
        this.sections.sacral = new SacralSpine({
            ...cfg,
            startPoint: lumbarEnd
        });
        this.spineGroup.add(this.sections.sacral.getMesh());

        return this.spineGroup;
    }

    // Animar todas las secciones
    animateSections(time) {
        Object.values(this.sections).forEach(section => {
            if (section?.animate) section.animate(time);
        });
    }

    // Obtener grupo de la columna
    getGroup() {
        return this.spineGroup;
    }

    // Obtener secciones
    getSections() {
        return this.sections;
    }
}
