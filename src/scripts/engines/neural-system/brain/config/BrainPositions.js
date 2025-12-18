/**
 * Configuración centralizada de posiciones cerebrales
 * Todas las coordenadas están basadas en anatomía real del cerebro humano
 *
 * Sistema de coordenadas:
 * - X: lateral (negativo = izquierda, positivo = derecha)
 * - Y: vertical (negativo = inferior, positivo = superior)
 * - Z: anteroposterior (negativo = posterior, positivo = anterior)
 *
 * El cerebro está centrado en (0, 0, 0)
 * Escala base: 1 unidad ≈ 10cm del cerebro real
 */

export const BRAIN_SCALE = {
    // Escala global del cerebro
    global: 1.0,

    // Escalas por estructura
    cortex: 0.85,
    subcortical: 0.6,
    ventricles: 0.5,
    connections: 1.0
};

export const BRAIN_POSITIONS = {
    // ===== CORTEZA CEREBRAL =====
    // Posiciones COMPACTAS - todos los lóbulos juntos formando un cerebro unido
    // Las estructuras se SUPERPONEN ligeramente para dar cohesión

    frontalLobe: {
        // Lóbulos frontales: parte anterior, ligeramente superpuestos
        left: { x: -0.08, y: 0.05, z: 0.12 },
        right: { x: 0.08, y: 0.05, z: 0.12 },
        scale: 0.55  // Más grande para cubrir área frontal
    },

    parietalLobe: {
        // Lóbulos parietales: superiores, conectando con frontales
        left: { x: -0.06, y: 0.14, z: -0.02 },
        right: { x: 0.06, y: 0.14, z: -0.02 },
        scale: 0.48
    },

    temporalLobe: {
        // Lóbulos temporales: laterales, debajo y fusionados
        left: { x: -0.15, y: -0.03, z: 0.04 },
        right: { x: 0.15, y: -0.03, z: 0.04 },
        scale: 0.42
    },

    occipitalLobe: {
        // Lóbulos occipitales: posteriores, completando la forma
        left: { x: -0.05, y: 0.04, z: -0.16 },
        right: { x: 0.05, y: 0.04, z: -0.16 },
        scale: 0.40
    },

    // ===== ESTRUCTURAS SUBCORTICALES =====
    // En el CENTRO del cerebro, más pequeñas

    thalamus: {
        left: { x: -0.025, y: 0.02, z: 0 },
        right: { x: 0.025, y: 0.02, z: 0 },
        scale: 0.18
    },

    hypothalamus: {
        center: { x: 0, y: -0.02, z: 0.02 },
        scale: 0.12
    },

    amygdala: {
        left: { x: -0.08, y: -0.04, z: 0.05 },
        right: { x: 0.08, y: -0.04, z: 0.05 },
        scale: 0.10
    },

    basalGanglia: {
        left: { x: -0.05, y: 0.04, z: 0.01 },
        right: { x: 0.05, y: 0.04, z: 0.01 },
        scale: 0.18
    },

    // ===== ESTRUCTURAS DE CONEXIÓN =====

    corpusCallosum: {
        center: { x: 0, y: 0.10, z: -0.01 },
        scale: 0.45  // Grande para conectar hemisferios
    },

    fornix: {
        center: { x: 0, y: 0.05, z: 0.01 },
        scale: 0.25
    },

    // ===== CEREBELO Y TRONCO =====

    cerebellum: {
        // Cerebelo: MUY cerca del cerebro, debajo occipital
        center: { x: 0, y: -0.10, z: -0.14 },
        scale: 0.45
    },

    brainstem: {
        // Tronco: conectando cerebro y cerebelo
        center: { x: 0, y: -0.14, z: -0.04 },
        scale: 0.22
    },

    // ===== SISTEMA VENTRICULAR =====
    // Muy pequeños, DENTRO del cerebro

    lateralVentricles: {
        left: { x: -0.03, y: 0.06, z: 0.01 },
        right: { x: 0.03, y: 0.06, z: 0.01 },
        scale: 0.28
    },

    thirdVentricle: {
        center: { x: 0, y: 0.02, z: 0 },
        scale: 0.16
    },

    fourthVentricle: {
        center: { x: 0, y: -0.11, z: -0.10 },
        scale: 0.14
    }
};

// Puntos de conexión entre estructuras (para la red sináptica)
export const CONNECTION_POINTS = {
    // Conexiones corticales principales
    cortical: [
        // Frontal-Parietal
        { from: 'frontalLobe.left', to: 'parietalLobe.left', strength: 1.0 },
        { from: 'frontalLobe.right', to: 'parietalLobe.right', strength: 1.0 },

        // Parietal-Occipital
        { from: 'parietalLobe.left', to: 'occipitalLobe.left', strength: 0.9 },
        { from: 'parietalLobe.right', to: 'occipitalLobe.right', strength: 0.9 },

        // Temporal-Frontal
        { from: 'temporalLobe.left', to: 'frontalLobe.left', strength: 0.8 },
        { from: 'temporalLobe.right', to: 'frontalLobe.right', strength: 0.8 },

        // Temporal-Parietal
        { from: 'temporalLobe.left', to: 'parietalLobe.left', strength: 0.7 },
        { from: 'temporalLobe.right', to: 'parietalLobe.right', strength: 0.7 }
    ],

    // Conexiones interhemisféricas (a través del cuerpo calloso)
    callosal: [
        { from: 'frontalLobe.left', to: 'frontalLobe.right', strength: 1.0 },
        { from: 'parietalLobe.left', to: 'parietalLobe.right', strength: 1.0 },
        { from: 'temporalLobe.left', to: 'temporalLobe.right', strength: 0.8 },
        { from: 'occipitalLobe.left', to: 'occipitalLobe.right', strength: 0.9 }
    ],

    // Conexiones tálamo-corticales
    thalamic: [
        { from: 'thalamus.left', to: 'frontalLobe.left', strength: 0.9 },
        { from: 'thalamus.right', to: 'frontalLobe.right', strength: 0.9 },
        { from: 'thalamus.left', to: 'parietalLobe.left', strength: 0.85 },
        { from: 'thalamus.right', to: 'parietalLobe.right', strength: 0.85 },
        { from: 'thalamus.left', to: 'occipitalLobe.left', strength: 0.8 },
        { from: 'thalamus.right', to: 'occipitalLobe.right', strength: 0.8 }
    ],

    // Conexiones límbicas
    limbic: [
        { from: 'amygdala.left', to: 'hypothalamus.center', strength: 0.8 },
        { from: 'amygdala.right', to: 'hypothalamus.center', strength: 0.8 },
        { from: 'amygdala.left', to: 'frontalLobe.left', strength: 0.7 },
        { from: 'amygdala.right', to: 'frontalLobe.right', strength: 0.7 }
    ],

    // Conexiones cerebelosas
    cerebellar: [
        { from: 'cerebellum.center', to: 'brainstem.center', strength: 1.0 },
        { from: 'cerebellum.center', to: 'thalamus.left', strength: 0.6 },
        { from: 'cerebellum.center', to: 'thalamus.right', strength: 0.6 }
    ]
};

// Función helper para obtener posición como Vector3
export function getPosition(structurePath) {
    const parts = structurePath.split('.');
    let current = BRAIN_POSITIONS;

    for (const part of parts) {
        current = current[part];
        if (!current) return null;
    }

    return current;
}

// Función para obtener posición con escala aplicada
export function getScaledPosition(structurePath, globalScale = 1) {
    const pos = getPosition(structurePath);
    if (!pos) return null;

    return {
        x: pos.x * globalScale,
        y: pos.y * globalScale,
        z: pos.z * globalScale
    };
}
