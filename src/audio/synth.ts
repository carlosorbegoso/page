export function envelope(context: BaseAudioContext, destination: AudioNode, at: number): GainNode {
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, at);
  gain.connect(destination);
  return gain;
}

export function releaseAfter(source: AudioScheduledSourceNode, nodes: AudioNode[]): void {
  source.addEventListener('ended', () => {
    for (const node of nodes) node.disconnect();
  });
}

export function vary(base: number, spread: number): number {
  return base * (1 + (Math.random() * 2 - 1) * spread);
}

/** A decaying sine partial: the building block of bells, porcelain and metal. */
export function ring(
  context: BaseAudioContext,
  destination: AudioNode,
  at: number,
  hz: number,
  level: number,
  decay: number
): void {
  const oscillator = context.createOscillator();
  oscillator.frequency.value = hz;
  const amp = envelope(context, destination, at);
  amp.gain.linearRampToValueAtTime(level, at + 0.002);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  oscillator.connect(amp);
  oscillator.start(at);
  oscillator.stop(at + decay + 0.02);
  releaseAfter(oscillator, [amp]);
}

/** A short bandpassed slice of noise: clicks, crinkles, rattles and taps. */
export function grain(
  context: BaseAudioContext,
  destination: AudioNode,
  noise: AudioBuffer,
  at: number,
  options: { hz: number; q: number; level: number; attack?: number; decay: number }
): void {
  const source = context.createBufferSource();
  source.buffer = noise;
  const band = context.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = options.hz;
  band.Q.value = options.q;
  const amp = envelope(context, destination, at);
  amp.gain.linearRampToValueAtTime(options.level, at + (options.attack ?? 0.002));
  amp.gain.exponentialRampToValueAtTime(0.0001, at + options.decay);
  source.connect(band).connect(amp);
  source.start(at, Math.random() * Math.max(0, noise.duration - 1), options.decay + 0.05);
  releaseAfter(source, [band, amp]);
}

/** A pitched body with a falling tone: thumps and soft knocks. */
export function thump(
  context: BaseAudioContext,
  destination: AudioNode,
  at: number,
  options: { from: number; to: number; level: number; decay: number; type?: OscillatorType }
): void {
  const oscillator = context.createOscillator();
  oscillator.type = options.type ?? 'sine';
  oscillator.frequency.setValueAtTime(options.from, at);
  oscillator.frequency.exponentialRampToValueAtTime(options.to, at + options.decay * 0.7);
  const amp = envelope(context, destination, at);
  amp.gain.linearRampToValueAtTime(options.level, at + 0.003);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + options.decay);
  oscillator.connect(amp);
  oscillator.start(at);
  oscillator.stop(at + options.decay + 0.02);
  releaseAfter(oscillator, [amp]);
}
