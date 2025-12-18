/**
 * Neural System - Índice de exportaciones
 * Sistema modular de visualización 3D del cerebro y médula espinal
 */

// Engine principal
export { NeuralSystemEngine } from './NeuralSystemEngine.js';

// Componentes cerebrales
export { FrontalLobe } from './brain/FrontalLobe.js';
export { ParietalLobe } from './brain/ParietalLobe.js';
export { TemporalLobe } from './brain/TemporalLobe.js';
export { OccipitalLobe } from './brain/OccipitalLobe.js';
export { Cerebellum } from './brain/Cerebellum.js';
export { Brainstem } from './brain/Brainstem.js';
export { Fornix } from './brain/Fornix.js';
export { CorpusCallosum } from './brain/CorpusCallosum.js';

// Componentes de médula espinal
export { CervicalSpine } from './spine/CervicalSpine.js';
export { ThoracicSpine } from './spine/ThoracicSpine.js';
export { LumbarSpine } from './spine/LumbarSpine.js';
export { SacralSpine } from './spine/SacralSpine.js';

// Componentes neuronales
export { Neuron } from './neurons/Neuron.js';
export { NeuralNetwork } from './neurons/NeuralNetwork.js';
