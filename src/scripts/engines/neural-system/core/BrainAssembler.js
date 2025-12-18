/**
 * BrainAssembler - Ensambla todas las partes del cerebro
 * Responsable de: Crear componentes, posicionarlos, configurarlos
 * Máximo 250 líneas
 */

import * as THREE from 'three';

// Brain cortical components
import { FrontalLobe } from '../brain/FrontalLobe.js';
import { ParietalLobe } from '../brain/ParietalLobe.js';
import { TemporalLobe } from '../brain/TemporalLobe.js';
import { OccipitalLobe } from '../brain/OccipitalLobe.js';
import { Cerebellum } from '../brain/Cerebellum.js';
import { Brainstem } from '../brain/Brainstem.js';
import { Fornix } from '../brain/Fornix.js';
import { CorpusCallosum } from '../brain/CorpusCallosum.js';

// Subcortical structures
import { Thalamus, Hypothalamus, Amygdala, BasalGanglia } from '../brain/subcortical/index.js';

// Ventricular system
import { LateralVentricles, ThirdVentricle, FourthVentricle } from '../brain/ventricles/index.js';

// Configuration
import { BRAIN_POSITIONS } from '../brain/config/index.js';

export class BrainAssembler {
    constructor(config) {
        this.config = config;
        this.positions = BRAIN_POSITIONS;

        // Contenedor del cerebro
        this.brainGroup = new THREE.Group();

        // Referencias a componentes
        this.parts = {};
        this.ventricles = {};
    }

    assemble() {
        const cfg = {
            color: this.config.color,
            secondaryColor: this.config.secondaryColor,
            opacity: this.config.opacity,
            detail: 'high'
        };

        this.createCortex(cfg);
        this.createSubcortical(cfg);
        this.createVentricles(cfg);

        return this.brainGroup;
    }

    createCortex(cfg) {
        const pos = this.positions;

        // Lóbulos frontales
        this.parts.frontalLeft = this.createPart(FrontalLobe, {
            ...cfg, side: 'left', scale: pos.frontalLobe.scale
        }, pos.frontalLobe.left);

        this.parts.frontalRight = this.createPart(FrontalLobe, {
            ...cfg, side: 'right', scale: pos.frontalLobe.scale
        }, pos.frontalLobe.right);

        // Lóbulos parietales
        this.parts.parietalLeft = this.createPart(ParietalLobe, {
            ...cfg, side: 'left', scale: pos.parietalLobe.scale
        }, pos.parietalLobe.left);

        this.parts.parietalRight = this.createPart(ParietalLobe, {
            ...cfg, side: 'right', scale: pos.parietalLobe.scale
        }, pos.parietalLobe.right);

        // Lóbulos temporales
        this.parts.temporalLeft = this.createPart(TemporalLobe, {
            ...cfg, side: 'left', scale: pos.temporalLobe.scale
        }, pos.temporalLobe.left);

        this.parts.temporalRight = this.createPart(TemporalLobe, {
            ...cfg, side: 'right', scale: pos.temporalLobe.scale
        }, pos.temporalLobe.right);

        // Lóbulos occipitales
        this.parts.occipitalLeft = this.createPart(OccipitalLobe, {
            ...cfg, side: 'left', scale: pos.occipitalLobe.scale
        }, pos.occipitalLobe.left);

        this.parts.occipitalRight = this.createPart(OccipitalLobe, {
            ...cfg, side: 'right', scale: pos.occipitalLobe.scale
        }, pos.occipitalLobe.right);

        // Cerebelo y tronco
        this.parts.cerebellum = this.createPart(Cerebellum, {
            ...cfg, scale: pos.cerebellum.scale
        }, pos.cerebellum.center);

        this.parts.brainstem = this.createPart(Brainstem, {
            ...cfg, scale: pos.brainstem.scale
        }, pos.brainstem.center);

        // Estructuras de conexión
        this.parts.corpusCallosum = this.createPart(CorpusCallosum, {
            ...cfg, scale: pos.corpusCallosum.scale
        }, pos.corpusCallosum.center);

        this.parts.fornix = this.createPart(Fornix, {
            ...cfg, scale: pos.fornix.scale
        }, pos.fornix.center);
    }

    createSubcortical(cfg) {
        const pos = this.positions;

        // Tálamo
        this.parts.thalamusLeft = this.createPart(Thalamus, {
            ...cfg, side: 'left', accentColor: 0xff6600, scale: pos.thalamus.scale
        }, pos.thalamus.left);

        this.parts.thalamusRight = this.createPart(Thalamus, {
            ...cfg, side: 'right', accentColor: 0xff6600, scale: pos.thalamus.scale
        }, pos.thalamus.right);

        // Hipotálamo
        this.parts.hypothalamus = this.createPart(Hypothalamus, {
            ...cfg, accentColor: 0xff00ff, scale: pos.hypothalamus.scale
        }, pos.hypothalamus.center);

        // Amígdala
        this.parts.amygdalaLeft = this.createPart(Amygdala, {
            ...cfg, side: 'left', accentColor: 0xff3366, scale: pos.amygdala.scale
        }, pos.amygdala.left);

        this.parts.amygdalaRight = this.createPart(Amygdala, {
            ...cfg, side: 'right', accentColor: 0xff3366, scale: pos.amygdala.scale
        }, pos.amygdala.right);

        // Ganglios basales
        this.parts.basalGangliaLeft = this.createPart(BasalGanglia, {
            ...cfg, side: 'left', accentColor: 0x88ff00, scale: pos.basalGanglia.scale
        }, pos.basalGanglia.left);

        this.parts.basalGangliaRight = this.createPart(BasalGanglia, {
            ...cfg, side: 'right', accentColor: 0x88ff00, scale: pos.basalGanglia.scale
        }, pos.basalGanglia.right);
    }

    createVentricles(cfg) {
        const pos = this.positions;
        const ventricleGroup = new THREE.Group();

        this.ventricles.lateralLeft = this.createPart(LateralVentricles, {
            ...cfg, side: 'left', fluidColor: 0x4488ff, scale: pos.lateralVentricles.scale
        }, pos.lateralVentricles.left, ventricleGroup);

        this.ventricles.lateralRight = this.createPart(LateralVentricles, {
            ...cfg, side: 'right', fluidColor: 0x4488ff, scale: pos.lateralVentricles.scale
        }, pos.lateralVentricles.right, ventricleGroup);

        this.ventricles.third = this.createPart(ThirdVentricle, {
            ...cfg, fluidColor: 0x4488ff, scale: pos.thirdVentricle.scale
        }, pos.thirdVentricle.center, ventricleGroup);

        this.ventricles.fourth = this.createPart(FourthVentricle, {
            ...cfg, fluidColor: 0x4488ff, scale: pos.fourthVentricle.scale
        }, pos.fourthVentricle.center, ventricleGroup);

        this.brainGroup.add(ventricleGroup);
    }

    createPart(ComponentClass, config, position, parent = this.brainGroup) {
        const component = new ComponentClass(config);
        component.setPosition(position.x, position.y, position.z);
        parent.add(component.getMesh());
        return component;
    }

    // Animar todas las partes
    animateParts(time) {
        Object.values(this.parts).forEach(part => {
            if (part?.animate) part.animate(time);
        });

        Object.values(this.ventricles).forEach(ventricle => {
            if (ventricle?.animate) ventricle.animate(time);
        });
    }

    // Obtener todas las partes
    getParts() {
        return this.parts;
    }

    // Obtener grupo del cerebro
    getGroup() {
        return this.brainGroup;
    }

    // Obtener brainstem para conexión de médula
    getBrainstem() {
        return this.parts.brainstem;
    }
}
