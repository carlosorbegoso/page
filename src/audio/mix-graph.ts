import { createImpulse } from './buffers';
import { PRESETS } from './chapters';

const FILTER_LFO_HZ = 0.045;
const FILTER_LFO_DEPTH_HZ = 90;

export interface MixGraph {
  master: GainNode;
  roomSend: GainNode;
  hallSend: GainNode;
  padBus: GainNode;
  padFilter: BiquadFilterNode;
  swell: GainNode;
  lfo: OscillatorNode;
  connectWithSends(node: AudioNode, dry: number, room: number, hall: number): void;
}

function createMaster(context: AudioContext): GainNode {
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -18;
  limiter.knee.value = 12;
  limiter.ratio.value = 6;
  limiter.attack.value = 0.01;
  limiter.release.value = 0.4;
  limiter.connect(context.destination);
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(limiter);
  return master;
}

function createSend(context: AudioContext, master: GainNode, seconds: number, decay: number, brightness: number): GainNode {
  const verb = context.createConvolver();
  verb.buffer = createImpulse(context, seconds, decay, brightness);
  const send = context.createGain();
  send.connect(verb).connect(master);
  return send;
}

function createPadFilter(context: AudioContext): { filter: BiquadFilterNode; lfo: OscillatorNode } {
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 0.6;
  filter.frequency.value = PRESETS.hero.cutoff;
  const lfo = context.createOscillator();
  lfo.frequency.value = FILTER_LFO_HZ;
  const lfoDepth = context.createGain();
  lfoDepth.gain.value = FILTER_LFO_DEPTH_HZ;
  lfo.connect(lfoDepth).connect(filter.frequency);
  lfo.start();
  return { filter, lfo };
}

export function createMixGraph(context: AudioContext, padLevel: number): MixGraph {
  const master = createMaster(context);
  const roomSend = createSend(context, master, 1.2, 2.8, 3000);
  const hallSend = createSend(context, master, 3.6, 2, 4200);
  const connectWithSends = (node: AudioNode, dry: number, room: number, hall: number) => {
    for (const [destination, level] of [
      [master, dry],
      [roomSend, room],
      [hallSend, hall]
    ] as const) {
      if (level <= 0) continue;
      const gain = context.createGain();
      gain.gain.value = level;
      node.connect(gain).connect(destination);
    }
  };
  const padBus = context.createGain();
  padBus.gain.value = padLevel;
  const swell = context.createGain();
  const { filter: padFilter, lfo } = createPadFilter(context);
  padBus.connect(padFilter).connect(swell);
  connectWithSends(swell, 1, 1, 1);
  return { master, roomSend, hallSend, padBus, padFilter, swell, lfo, connectWithSends };
}
