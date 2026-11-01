export function createImpulse(
  context: BaseAudioContext,
  seconds: number,
  decay: number,
  dampHz: number
): AudioBuffer {
  const length = Math.round(context.sampleRate * seconds);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  const damping = Math.exp((-2 * Math.PI * dampHz) / context.sampleRate);
  for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
    const data = impulse.getChannelData(channel);
    let smoothed = 0;
    for (let i = 0; i < length; i++) {
      const t = i / length;
      const pole = damping + (1 - damping) * t * 0.6;
      smoothed = smoothed * pole + (Math.random() * 2 - 1) * (1 - pole);
      const fadeIn = Math.min(1, i / (context.sampleRate * 0.012));
      data[i] = smoothed * (1 - t) ** decay * fadeIn;
    }
  }
  return impulse;
}

export function createNoise(context: BaseAudioContext, seconds: number): AudioBuffer {
  const length = Math.round(context.sampleRate * seconds);
  const noise = context.createBuffer(1, length, context.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return noise;
}

export function createDrop(context: BaseAudioContext, ringHz: number): AudioBuffer {
  const length = Math.round(context.sampleRate * 0.03);
  const drop = context.createBuffer(1, length, context.sampleRate);
  const data = drop.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const t = i / context.sampleRate;
    const ring = Math.sin(2 * Math.PI * ringHz * t * (1 - t * 6)) * Math.exp(-t / 0.004);
    const tick = (Math.random() * 2 - 1) * Math.exp(-t / 0.0012);
    data[i] = ring * 0.7 + tick * 0.4;
  }
  return drop;
}
