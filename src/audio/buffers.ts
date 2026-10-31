/** Stereo exponentially decaying noise: a cheap, smooth reverb tail with no asset to download. */
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
      const white = Math.random() * 2 - 1;
      // One-pole lowpass that darkens as the tail goes on, like air absorbing the highs.
      const pole = damping + (1 - damping) * t * 0.6;
      smoothed = smoothed * pole + white * (1 - pole);
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
