/**
 * Cerebelo - "Pequeño cerebro" en la parte posterior-inferior (VERSIÓN REALISTA)
 * Responsable de: coordinación motora, equilibrio, postura, aprendizaje motor
 *
 * Anatomía incluida:
 * - Hemisferios cerebelosos (izquierdo y derecho)
 * - Vermis (parte central, "gusano")
 * - Folia cerebelosas (pliegues horizontales característicos)
 * - Fisuras principales (primaria, horizontal, posterolateral)
 * - Pedúnculos cerebelosos (conexiones con tronco)
 * - Núcleos profundos (dentado, emboliforme, globoso, fastigio)
 */

import * as THREE from 'three';

// ==========================================
// CONSTANTES DE CONFIGURACIÓN
// ==========================================

// Escalas del hemisferio
const HEMISPHERE = {
    RADIUS: 0.28,
    VERTICAL_SCALE: 0.45,
    HORIZONTAL_SCALE: 1.4,
    POSTERIOR_SCALE: 1.3,
    INTERNAL_FLATTEN: 0.35,
    X_OFFSET: 0.22
};

// Frecuencias de las folia
const FOLIA = {
    MAJOR_FREQUENCY: 45,
    MAJOR_AMPLITUDE: 0.022,
    MINOR_FREQUENCY: 90,
    MINOR_AMPLITUDE: 0.008,
    TERTIARY_FREQUENCY: 140,
    TERTIARY_AMPLITUDE: 0.004,
    LINE_COUNT: 12,
    LINE_Y_START: -0.1,
    LINE_Y_STEP: 0.018
};

// Fisuras
const FISSURES = {
    PRIMARY_Y: -0.02,
    PRIMARY_SHARPNESS: 20,
    PRIMARY_DEPTH: 0.015,
    HORIZONTAL_Y: -0.06,
    HORIZONTAL_SHARPNESS: 25,
    HORIZONTAL_DEPTH: 0.01
};

// Vermis
const VERMIS = {
    RADIUS: 0.06,
    FOLIA_FREQUENCY_Z: 50,
    FOLIA_FREQUENCY_Y: 30,
    FOLIA_AMPLITUDE: 0.008
};

// Pedúnculos
const PEDUNCLES = {
    SUPERIOR_RADIUS: 0.025,
    MIDDLE_RADIUS: 0.03
};

// Núcleos
const NUCLEI = {
    DENTATE_RADIUS: 0.04,
    DENTATE_X_OFFSET: 0.12,
    FASTIGIAL_RADIUS: 0.025
};

// Neuronas
const NEURONS = {
    COUNT: 18,
    RADIUS: 0.008,
    MIN_DISTANCE: 0.22,
    MAX_DISTANCE: 0.30,
    BASE_OPACITY_MIN: 0.25,
    BASE_OPACITY_MAX: 0.45,
    SPEED_MIN: 0.8,
    SPEED_MAX: 2.0
};

// Animación
const ANIMATION = {
    PULSE_SPEED: 0.4,
    PULSE_AMPLITUDE: 0.006,
    FOLIA_SPEED: 2,
    PEDUNCLE_SPEED: 1.5
};

// LOD distances
const LOD_DISTANCES = {
    HIGH: 0,
    MEDIUM: 3,
    LOW: 6
};

export class Cerebellum {
    constructor(config = {}) {
        this.group = new THREE.Group();
        this.config = {
            color: config.color || 0x00ffff,
            secondaryColor: config.secondaryColor || 0x0088ff,
            opacity: config.opacity || 0.25,
            scale: config.scale || 1,
            detail: config.detail || 'high',
            useLOD: config.useLOD || false,
            ...config
        };

        this.folia = [];
        this.neurons = [];
        this.peduncles = [];
        this.nuclei = [];
        this.hemispheres = [];

        // Cache de materiales reutilizables
        this.materials = {};

        // Callbacks para eventos
        this.callbacks = {
            onNeuronActivated: [],
            onPulse: []
        };

        // Cache para animaciones
        this.animationCache = {
            lastTime: 0,
            sinValues: {}
        };

        this.createMaterials();
        this.create();
    }

    // ==========================================
    // CREACIÓN DE MATERIALES REUTILIZABLES
    // ==========================================

    createMaterials() {
        const { color, secondaryColor, opacity } = this.config;

        this.materials = {
            wireframe: new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: opacity * 0.8,
                depthWrite: false
            }),
            solid: new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity * 0.12,
                side: THREE.BackSide,
                depthWrite: false
            }),
            innerGlow: new THREE.MeshBasicMaterial({
                color: secondaryColor,
                transparent: true,
                opacity: opacity * 0.1,
                side: THREE.FrontSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            }),
            folia: new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity * 0.5,
                depthWrite: false
            }),
            peduncle: new THREE.MeshBasicMaterial({
                color: secondaryColor,
                wireframe: true,
                transparent: true,
                opacity: opacity * 0.6,
                depthWrite: false
            }),
            nuclei: new THREE.MeshBasicMaterial({
                color: secondaryColor,
                transparent: true,
                opacity: opacity * 0.3,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            }),
            neuron: new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.35,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            }),
            vermisLine: new THREE.LineBasicMaterial({
                color: secondaryColor,
                transparent: true,
                opacity: opacity * 0.5,
                depthWrite: false
            })
        };
    }

    // ==========================================
    // CREACIÓN PRINCIPAL
    // ==========================================

    create() {
        if (this.config.useLOD) {
            this.createWithLOD();
        } else {
            this.createStandard();
        }
    }

    createStandard() {
        this.createHemisphere('left');
        this.createHemisphere('right');
        this.createVermis();
        this.createFoliaLines();
        this.createPeduncles();
        this.createDeepNuclei();
        this.createNeuralActivity();
    }

    createWithLOD() {
        this.lod = new THREE.LOD();

        // Nivel alto de detalle
        const highDetail = new THREE.Group();
        this.createHemisphereForGroup(highDetail, 'left', 36);
        this.createHemisphereForGroup(highDetail, 'right', 36);
        this.lod.addLevel(highDetail, LOD_DISTANCES.HIGH);

        // Nivel medio de detalle
        const mediumDetail = new THREE.Group();
        this.createHemisphereForGroup(mediumDetail, 'left', 20);
        this.createHemisphereForGroup(mediumDetail, 'right', 20);
        this.lod.addLevel(mediumDetail, LOD_DISTANCES.MEDIUM);

        // Nivel bajo de detalle
        const lowDetail = new THREE.Group();
        this.createHemisphereForGroup(lowDetail, 'left', 12);
        this.createHemisphereForGroup(lowDetail, 'right', 12);
        this.lod.addLevel(lowDetail, LOD_DISTANCES.LOW);

        this.group.add(this.lod);

        // Elementos comunes (no afectados por LOD)
        this.createVermis();
        this.createFoliaLines();
        this.createPeduncles();
        this.createDeepNuclei();
        this.createNeuralActivity();
    }

    // ==========================================
    // HEMISFERIOS
    // ==========================================

    createHemisphere(side) {
        const segments = this.config.detail === 'high' ? 36 : 24;
        this.createHemisphereForGroup(this.group, side, segments);
    }

    createHemisphereForGroup(targetGroup, side, segments) {
        const geometry = this.createHemisphereGeometry(side, segments);
        const xOffset = side === 'left' ? -HEMISPHERE.X_OFFSET : HEMISPHERE.X_OFFSET;

        // Wireframe principal
        const mesh = new THREE.Mesh(geometry, this.materials.wireframe);
        mesh.position.set(xOffset, 0, 0);
        targetGroup.add(mesh);
        this.hemispheres.push(mesh);

        // Capa sólida para profundidad
        const solidMesh = new THREE.Mesh(geometry, this.materials.solid);
        solidMesh.position.copy(mesh.position);
        targetGroup.add(solidMesh);

        // Brillo interior
        const innerMesh = new THREE.Mesh(geometry, this.materials.innerGlow);
        innerMesh.position.copy(mesh.position);
        innerMesh.scale.setScalar(0.88);
        targetGroup.add(innerMesh);
    }

    createHemisphereGeometry(side, segments) {
        const geometry = new THREE.SphereGeometry(HEMISPHERE.RADIUS, segments, segments);
        const positions = geometry.attributes.position;
        const sideMultiplier = side === 'left' ? 1 : -1;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            let z = positions.getZ(i);

            // Transformaciones aplicadas
            const transformed = this.applyHemisphereTransforms(x, y, z, sideMultiplier);

            positions.setX(i, transformed.x);
            positions.setY(i, transformed.y);
            positions.setZ(i, transformed.z);
        }

        geometry.computeVertexNormals();
        return geometry;
    }

    applyHemisphereTransforms(x, y, z, sideMultiplier) {
        // Aplanamiento vertical
        y *= HEMISPHERE.VERTICAL_SCALE;

        // Extensión horizontal
        x *= HEMISPHERE.HORIZONTAL_SCALE;

        // Extensión posterior
        if (z < 0) {
            z *= HEMISPHERE.POSTERIOR_SCALE;
        }

        // Aplanar lado interno
        if (x * sideMultiplier < 0) {
            x *= HEMISPHERE.INTERNAL_FLATTEN;
        }

        // Curvatura superior
        if (y > 0) {
            const topCurve = Math.pow(y / 0.15, 1.5) * 0.05;
            y += topCurve;
        }

        // Curvatura inferior
        if (y < -0.05) {
            const bottomCurve = Math.abs(y + 0.05) / 0.1;
            y -= bottomCurve * 0.03;
            z -= bottomCurve * 0.02;
        }

        // Borde anterior
        if (z > 0.15) {
            z = 0.15 + (z - 0.15) * 0.5;
        }

        // Aplicar folia
        const foliaResult = this.applyFoliaDeformation(x, y, z);
        x = foliaResult.x;
        y = foliaResult.y;
        z = foliaResult.z;

        // Aplicar fisuras
        y -= this.calculateFissureDepth(y, FISSURES.PRIMARY_Y, FISSURES.PRIMARY_SHARPNESS, FISSURES.PRIMARY_DEPTH);
        y -= this.calculateFissureDepth(y, FISSURES.HORIZONTAL_Y, FISSURES.HORIZONTAL_SHARPNESS, FISSURES.HORIZONTAL_DEPTH);

        return { x, y, z };
    }

    applyFoliaDeformation(x, y, z) {
        const foliaMajor = Math.sin(y * FOLIA.MAJOR_FREQUENCY) * FOLIA.MAJOR_AMPLITUDE;
        const foliaMinor = Math.sin(y * FOLIA.MINOR_FREQUENCY + x * 5) * FOLIA.MINOR_AMPLITUDE;
        const foliaTertiary = Math.sin(y * FOLIA.TERTIARY_FREQUENCY + z * 8) * FOLIA.TERTIARY_AMPLITUDE;

        const dist = Math.sqrt(x * x + y * y + z * z);
        const surfaceFactor = Math.max(0, Math.min(1, (dist - 0.15) / 0.15));
        const radialDir = dist > 0.01 ? 1 / dist : 1;

        return {
            x: x + (foliaMajor + foliaMinor) * (x * radialDir) * surfaceFactor * 0.3,
            y: y + foliaTertiary * surfaceFactor,
            z: z + (foliaMajor * 0.5 + foliaMinor * 0.3) * surfaceFactor
        };
    }

    calculateFissureDepth(y, fissureY, sharpness, depth) {
        return Math.exp(-Math.pow((y - fissureY) * sharpness, 2)) * depth;
    }

    // ==========================================
    // VERMIS
    // ==========================================

    createVermis() {
        const segments = this.config.detail === 'high' ? 32 : 20;

        const vermisPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.08, 0.12),
            new THREE.Vector3(0, 0.1, 0),
            new THREE.Vector3(0, 0.06, -0.15),
            new THREE.Vector3(0, -0.02, -0.25),
            new THREE.Vector3(0, -0.1, -0.2)
        ]);

        const vermisGeo = new THREE.TubeGeometry(vermisPath, segments, VERMIS.RADIUS, 12, false);
        this.applyVermisDeformation(vermisGeo);
        vermisGeo.computeVertexNormals();

        const vermis = new THREE.Mesh(vermisGeo, this.materials.wireframe);
        this.group.add(vermis);

        // Línea central del vermis
        const vermisLine = new THREE.BufferGeometry().setFromPoints(vermisPath.getPoints(30));
        this.group.add(new THREE.Line(vermisLine, this.materials.vermisLine));
    }

    applyVermisDeformation(geometry) {
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            let x = positions.getX(i);
            let y = positions.getY(i);
            const z = positions.getZ(i);

            const folia = Math.sin(z * VERMIS.FOLIA_FREQUENCY_Z + y * VERMIS.FOLIA_FREQUENCY_Y) * VERMIS.FOLIA_AMPLITUDE;
            x += folia;
            y += folia * 0.5;

            positions.setX(i, x);
            positions.setY(i, y);
        }
    }

    // ==========================================
    // FOLIA (Refactorizado)
    // ==========================================

    createFoliaLines() {
        // Crear folia para ambos lados
        this.createFoliaForSide(-1); // Izquierdo
        this.createFoliaForSide(1);  // Derecho
    }

    createFoliaForSide(sideSign) {
        for (let i = 0; i < FOLIA.LINE_COUNT; i++) {
            const y = FOLIA.LINE_Y_START + i * FOLIA.LINE_Y_STEP;
            const points = this.generateFoliaPoints(y, sideSign);

            const curve = new THREE.CatmullRomCurve3(points);
            const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));

            // Clonar material para animación independiente
            const line = new THREE.Line(lineGeo, this.materials.folia.clone());
            this.folia.push(line);
            this.group.add(line);
        }
    }

    generateFoliaPoints(y, sideSign) {
        const points = [];
        const pointCount = 25;

        for (let j = 0; j <= pointCount; j++) {
            const t = j / pointCount;
            const x = sideSign * (0.05 + t * 0.35);
            const zBase = -0.2 + Math.sin(t * Math.PI) * 0.3;
            const wave = Math.sin(t * Math.PI * 3) * 0.02;
            points.push(new THREE.Vector3(x, y + wave, zBase));
        }

        return points;
    }

    // ==========================================
    // PEDÚNCULOS
    // ==========================================

    createPeduncles() {
        // Pedúnculos superiores
        this.createPedunclePair([
            new THREE.Vector3(-0.1, 0.05, 0.1),
            new THREE.Vector3(-0.08, 0.12, 0.15),
            new THREE.Vector3(-0.05, 0.2, 0.12)
        ], PEDUNCLES.SUPERIOR_RADIUS);

        // Pedúnculos medios
        this.createPedunclePair([
            new THREE.Vector3(-0.15, 0, 0.12),
            new THREE.Vector3(-0.1, 0.02, 0.18),
            new THREE.Vector3(-0.05, 0.05, 0.2)
        ], PEDUNCLES.MIDDLE_RADIUS);
    }

    createPedunclePair(leftPoints, radius) {
        // Izquierdo
        const leftCurve = new THREE.CatmullRomCurve3(leftPoints);
        const leftGeo = new THREE.TubeGeometry(leftCurve, 12, radius, 6, false);
        const leftMesh = new THREE.Mesh(leftGeo, this.materials.peduncle.clone());
        this.peduncles.push(leftMesh);
        this.group.add(leftMesh);

        // Derecho (espejo)
        const rightPoints = leftPoints.map(p => new THREE.Vector3(-p.x, p.y, p.z));
        const rightCurve = new THREE.CatmullRomCurve3(rightPoints);
        const rightGeo = new THREE.TubeGeometry(rightCurve, 12, radius, 6, false);
        const rightMesh = new THREE.Mesh(rightGeo, this.materials.peduncle.clone());
        this.peduncles.push(rightMesh);
        this.group.add(rightMesh);
    }

    // ==========================================
    // NÚCLEOS PROFUNDOS
    // ==========================================

    createDeepNuclei() {
        // Geometría compartida para núcleos dentados
        const dentateGeo = new THREE.SphereGeometry(NUCLEI.DENTATE_RADIUS, 8, 8);

        // Núcleo dentado izquierdo
        const dentateLeft = new THREE.Mesh(dentateGeo, this.materials.nuclei);
        dentateLeft.position.set(-NUCLEI.DENTATE_X_OFFSET, -0.02, -0.05);
        this.nuclei.push(dentateLeft);
        this.group.add(dentateLeft);

        // Núcleo dentado derecho
        const dentateRight = new THREE.Mesh(dentateGeo, this.materials.nuclei);
        dentateRight.position.set(NUCLEI.DENTATE_X_OFFSET, -0.02, -0.05);
        this.nuclei.push(dentateRight);
        this.group.add(dentateRight);

        // Núcleo fastigio (central)
        const fastigialGeo = new THREE.SphereGeometry(NUCLEI.FASTIGIAL_RADIUS, 6, 6);
        const fastigial = new THREE.Mesh(fastigialGeo, this.materials.nuclei);
        fastigial.position.set(0, -0.02, -0.02);
        this.nuclei.push(fastigial);
        this.group.add(fastigial);
    }

    // ==========================================
    // ACTIVIDAD NEURONAL
    // ==========================================

    createNeuralActivity() {
        // Geometría compartida para todas las neuronas
        const neuronGeo = new THREE.SphereGeometry(NEURONS.RADIUS, 6, 6);

        for (let i = 0; i < NEURONS.COUNT; i++) {
            const position = this.generateNeuronPosition();

            // Clonar material para opacidad independiente
            const neuronMat = this.materials.neuron.clone();
            const neuron = new THREE.Mesh(neuronGeo, neuronMat);
            neuron.position.copy(position);

            neuron.userData = {
                phase: Math.random() * Math.PI * 2,
                speed: NEURONS.SPEED_MIN + Math.random() * (NEURONS.SPEED_MAX - NEURONS.SPEED_MIN),
                baseOpacity: NEURONS.BASE_OPACITY_MIN + Math.random() * (NEURONS.BASE_OPACITY_MAX - NEURONS.BASE_OPACITY_MIN)
            };

            this.neurons.push(neuron);
            this.group.add(neuron);
        }
    }

    generateNeuronPosition() {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = NEURONS.MIN_DISTANCE + Math.random() * (NEURONS.MAX_DISTANCE - NEURONS.MIN_DISTANCE);

        return new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta) * HEMISPHERE.VERTICAL_SCALE,
            radius * Math.cos(phi)
        );
    }

    // ==========================================
    // MÉTODOS PÚBLICOS
    // ==========================================

    getMesh() {
        return this.group;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    // ==========================================
    // SISTEMA DE EVENTOS
    // ==========================================

    onNeuronActivated(callback) {
        if (typeof callback === 'function') {
            this.callbacks.onNeuronActivated.push(callback);
        }
        return this;
    }

    onPulse(callback) {
        if (typeof callback === 'function') {
            this.callbacks.onPulse.push(callback);
        }
        return this;
    }

    emitEvent(eventName, data) {
        const callbacks = this.callbacks[eventName];
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }

    // ==========================================
    // ANIMACIÓN OPTIMIZADA
    // ==========================================

    animate(time) {
        // Cachear valores de seno frecuentemente usados
        const cache = this.updateAnimationCache(time);

        // Pulso principal
        const pulse = 1 + cache.sinPulse * ANIMATION.PULSE_AMPLITUDE;
        this.group.scale.setScalar(this.config.scale * pulse);

        // Emitir evento de pulso
        if (Math.abs(cache.sinPulse) > 0.95) {
            this.emitEvent('onPulse', { time, intensity: cache.sinPulse });
        }

        // Animar neuronas
        this.animateNeurons(time, cache);

        // Animar folia
        this.animateFolia(time, cache);

        // Animar pedúnculos
        this.animatePeduncles(time, cache);

        // Actualizar LOD si está habilitado
        if (this.lod && this.config.camera) {
            this.lod.update(this.config.camera);
        }
    }

    updateAnimationCache(time) {
        return {
            sinPulse: Math.sin(time * ANIMATION.PULSE_SPEED),
            sinFolia: Math.sin(time * ANIMATION.FOLIA_SPEED),
            sinPeduncle: Math.sin(time * ANIMATION.PEDUNCLE_SPEED)
        };
    }

    animateNeurons(time, cache) {
        this.neurons.forEach((neuron, index) => {
            const { phase, speed, baseOpacity } = neuron.userData;
            const wave = Math.sin(time * speed + phase);
            const newOpacity = baseOpacity * (0.5 + wave * 0.5);

            neuron.material.opacity = newOpacity;
            neuron.scale.setScalar(0.8 + wave * 0.4);

            // Emitir evento cuando neurona alcanza máxima activación
            if (wave > 0.98) {
                this.emitEvent('onNeuronActivated', {
                    index,
                    position: neuron.position.clone(),
                    intensity: wave
                });
            }
        });
    }

    animateFolia(time, cache) {
        this.folia.forEach((folium, i) => {
            const foliaPulse = 0.5 + Math.sin(time * ANIMATION.FOLIA_SPEED + i * 0.3) * 0.3;
            folium.material.opacity = this.config.opacity * 0.5 * foliaPulse;
        });
    }

    animatePeduncles(time, cache) {
        this.peduncles.forEach((peduncle, i) => {
            const pedPulse = 0.6 + Math.sin(time * ANIMATION.PEDUNCLE_SPEED + i * 0.5) * 0.2;
            peduncle.material.opacity = this.config.opacity * 0.6 * pedPulse;
        });
    }

    // ==========================================
    // DISPOSE - LIBERACIÓN DE MEMORIA
    // ==========================================

    dispose() {
        // Limpiar callbacks
        this.callbacks.onNeuronActivated = [];
        this.callbacks.onPulse = [];

        // Dispose de todos los objetos en el grupo
        this.group.traverse(child => {
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });

        // Dispose de materiales base
        Object.values(this.materials).forEach(material => {
            if (material && material.dispose) {
                material.dispose();
            }
        });

        // Limpiar arrays
        this.folia = [];
        this.neurons = [];
        this.peduncles = [];
        this.nuclei = [];
        this.hemispheres = [];

        // Limpiar grupo
        while (this.group.children.length > 0) {
            this.group.remove(this.group.children[0]);
        }

        // Limpiar LOD si existe
        if (this.lod) {
            this.lod = null;
        }
    }

    // ==========================================
    // MÉTODOS DE UTILIDAD
    // ==========================================

    setOpacity(opacity) {
        this.config.opacity = opacity;

        // Actualizar materiales base
        this.materials.wireframe.opacity = opacity * 0.8;
        this.materials.solid.opacity = opacity * 0.12;
        this.materials.innerGlow.opacity = opacity * 0.1;
        this.materials.folia.opacity = opacity * 0.5;
        this.materials.peduncle.opacity = opacity * 0.6;
        this.materials.nuclei.opacity = opacity * 0.3;
    }

    setColor(color) {
        this.config.color = color;
        this.materials.wireframe.color.set(color);
        this.materials.solid.color.set(color);
        this.materials.folia.color.set(color);
        this.materials.neuron.color.set(color);
    }

    setSecondaryColor(color) {
        this.config.secondaryColor = color;
        this.materials.innerGlow.color.set(color);
        this.materials.peduncle.color.set(color);
        this.materials.nuclei.color.set(color);
        this.materials.vermisLine.color.set(color);
    }

    // Para uso con LOD
    setCamera(camera) {
        this.config.camera = camera;
    }
}