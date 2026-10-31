import { isStationId, type StationId } from '../three/sections';
import { createImpulse, createNoise } from './buffers';
import { midiToHz, PRESETS, type StationPreset } from './presets';

/** Master level at full volume. Keep it low: this is a background bed, not music. */
export const MASTER_LEVEL = 0.11;

const LEVELS = {
  pad: 0.5,
  shimmer: 0.09,
  hum: 0.05,
  air: 0.012,
  ping: 0.05,
  hoverPing: 0.025
} as const;

const CROSSFADE_SECONDS = 3;
const FADE_IN_SECONDS = 2.5;
const FADE_OUT_SECONDS = 1.2;
const HIDDEN_FADE_SECONDS = 0.6;
const STATION_PING_GAP_MS = 1200;
const HOVER_PING_GAP_MS = 450;
const DETUNE_CENTS = 7;
const FILTER_LFO_HZ = 0.045;
const FILTER_LFO_DEPTH_HZ = 140;
const SHIMMER_LFO_HZ = 0.21;

interface StationDetail {
  id?: string | null;
  progress?: number;
}

/** Time constant for setTargetAtTime so a ramp settles (~95 %) in `seconds`. */
function settle(seconds: number): number {
  return seconds / 3;
}

class ChordLayer {
  private readonly pad: GainNode;
  private readonly shimmer: GainNode;
  private readonly oscillators: OscillatorNode[] = [];

  constructor(
    context: AudioContext,
    preset: StationPreset,
    padBus: AudioNode,
    shimmerBus: AudioNode
  ) {
    this.pad = context.createGain();
    this.pad.gain.value = 0;
    this.pad.connect(padBus);
    this.shimmer = context.createGain();
    this.shimmer.gain.value = 0;
    this.shimmer.connect(shimmerBus);

    const voiceGain = 1 / preset.chord.length;
    const shimmerFrom = preset.chord.length - 2;
    preset.chord.forEach((note, index) => {
      const frequency = midiToHz(note);
      const drift = index % 2 === 0 ? 1.5 : -1.5;
      const voice = context.createGain();
      voice.gain.value = voiceGain;
      voice.connect(this.pad);
      for (const [type, detune] of [
        ['triangle', -DETUNE_CENTS],
        ['sine', DETUNE_CENTS]
      ] as const) {
        this.addOscillator(context, type, frequency, detune + drift, voice);
      }
      if (index >= shimmerFrom) {
        this.addOscillator(context, 'sine', frequency * 2, drift * 2.5, this.shimmer);
      }
    });

    for (const oscillator of this.oscillators) oscillator.start();
  }

  fadeIn(at: number, seconds: number): void {
    for (const gain of [this.pad.gain, this.shimmer.gain]) rampTo(gain, 1, at, seconds);
  }

  fadeOutAndStop(at: number, seconds: number): void {
    for (const gain of [this.pad.gain, this.shimmer.gain]) rampTo(gain, 0, at, seconds);
    for (const oscillator of this.oscillators) oscillator.stop(at + seconds + 0.05);
    this.oscillators[0]?.addEventListener('ended', () => {
      this.pad.disconnect();
      this.shimmer.disconnect();
    });
  }

  private addOscillator(
    context: AudioContext,
    type: OscillatorType,
    frequency: number,
    detune: number,
    destination: AudioNode
  ): void {
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    oscillator.connect(destination);
    this.oscillators.push(oscillator);
  }
}

function rampTo(param: AudioParam, target: number, at: number, seconds: number): void {
  param.cancelScheduledValues(at);
  param.setValueAtTime(param.value, at);
  param.linearRampToValueAtTime(target, at + seconds);
}

export class Ambience {
  private readonly master: GainNode;
  private readonly padFilter: BiquadFilterNode;
  private readonly padBus: GainNode;
  private readonly shimmerBus: GainNode;
  private readonly shimmerTremolo: GainNode;
  private readonly shimmerLfoDepth: GainNode;
  private readonly humGain: GainNode;
  private readonly airGain: GainNode;
  private readonly roomSend: GainNode;
  private readonly spaceSend: GainNode;
  private readonly pingBus: GainNode;
  private readonly sources: AudioScheduledSourceNode[] = [];
  private layer: ChordLayer | null = null;
  private station: StationId | null = null;
  private engineDrivesStations = false;
  private paused: boolean;
  private enabled = false;
  private lastStationPing = 0;
  private lastHoverPing = 0;
  private lastHoverLabel: string | null = null;
  private readonly abort = new AbortController();

  constructor(private readonly context: AudioContext) {
    const now = context.currentTime;

    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -18;
    limiter.knee.value = 12;
    limiter.ratio.value = 6;
    limiter.attack.value = 0.01;
    limiter.release.value = 0.4;
    limiter.connect(context.destination);

    this.master = context.createGain();
    this.master.gain.value = 0;
    this.master.connect(limiter);

    const roomVerb = context.createConvolver();
    roomVerb.buffer = createImpulse(context, 1.4, 2.6, 3200);
    const spaceVerb = context.createConvolver();
    spaceVerb.buffer = createImpulse(context, 5.5, 1.8, 5200);
    this.roomSend = context.createGain();
    this.spaceSend = context.createGain();
    this.roomSend.connect(roomVerb).connect(this.master);
    this.spaceSend.connect(spaceVerb).connect(this.master);

    this.padFilter = context.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.Q.value = 0.6;
    this.padFilter.frequency.value = PRESETS.hero.cutoff;
    this.padBus = context.createGain();
    this.padBus.gain.value = LEVELS.pad;
    this.padBus.connect(this.padFilter);
    this.connectWithSends(this.padFilter, 1);

    const filterLfo = context.createOscillator();
    filterLfo.frequency.value = FILTER_LFO_HZ;
    const filterLfoDepth = context.createGain();
    filterLfoDepth.gain.value = FILTER_LFO_DEPTH_HZ;
    filterLfo.connect(filterLfoDepth).connect(this.padFilter.frequency);
    this.sources.push(filterLfo);

    this.shimmerBus = context.createGain();
    this.shimmerBus.gain.value = 0;
    this.shimmerTremolo = context.createGain();
    this.shimmerTremolo.gain.value = 1;
    this.shimmerBus.connect(this.shimmerTremolo);
    this.connectWithSends(this.shimmerTremolo, 0.6, 1.4);
    const shimmerLfo = context.createOscillator();
    shimmerLfo.frequency.value = SHIMMER_LFO_HZ;
    this.shimmerLfoDepth = context.createGain();
    this.shimmerLfoDepth.gain.value = 0;
    shimmerLfo.connect(this.shimmerLfoDepth).connect(this.shimmerTremolo.gain);
    this.sources.push(shimmerLfo);

    const noise = createNoise(context, 4);

    this.humGain = context.createGain();
    this.humGain.gain.value = 0;
    const humRumble = context.createBufferSource();
    humRumble.buffer = noise;
    humRumble.loop = true;
    const humLowpass = context.createBiquadFilter();
    humLowpass.type = 'lowpass';
    humLowpass.frequency.value = 170;
    const humRumbleGain = context.createGain();
    humRumbleGain.gain.value = 0.7;
    humRumble.connect(humLowpass).connect(humRumbleGain).connect(this.humGain);
    const mainsHum = context.createOscillator();
    mainsHum.frequency.value = 60;
    const mainsHarmonic = context.createOscillator();
    mainsHarmonic.frequency.value = 120;
    const mainsGain = context.createGain();
    mainsGain.gain.value = 0.18;
    const harmonicGain = context.createGain();
    harmonicGain.gain.value = 0.05;
    mainsHum.connect(mainsGain).connect(this.humGain);
    mainsHarmonic.connect(harmonicGain).connect(this.humGain);
    this.humGain.connect(this.master);
    this.humGain.connect(this.roomSend);
    this.sources.push(humRumble, mainsHum, mainsHarmonic);

    this.airGain = context.createGain();
    this.airGain.gain.value = 0;
    const air = context.createBufferSource();
    air.buffer = noise;
    air.loop = true;
    air.playbackRate.value = 0.93;
    const airBand = context.createBiquadFilter();
    airBand.type = 'bandpass';
    airBand.frequency.value = 5200;
    airBand.Q.value = 0.5;
    air.connect(airBand).connect(this.airGain);
    this.connectWithSends(this.airGain, 0.5, 1.2);
    this.sources.push(air);

    this.pingBus = context.createGain();
    this.pingBus.gain.value = 1;
    this.connectWithSends(this.pingBus, 0.35, 1.6, 0.4);

    for (const source of this.sources) source.start(now);

    this.paused =
      document.documentElement.dataset.motion === 'paused' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.applyPause();
    this.listen();
  }

  /** Fades the bed in. Safe to call repeatedly. */
  async start(): Promise<void> {
    this.enabled = true;
    if (this.context.state !== 'running') await this.context.resume();
    if (!this.layer) this.setStation(this.station ?? this.currentStationFromDom(), false);
    if (document.visibilityState === 'hidden') return;
    this.rampMaster(MASTER_LEVEL, FADE_IN_SECONDS);
  }

  /** Fades out, then suspends the context so it costs no CPU while muted. */
  async stop(): Promise<void> {
    this.enabled = false;
    this.rampMaster(0, FADE_OUT_SECONDS);
    await this.wait(FADE_OUT_SECONDS);
    if (!this.enabled && this.context.state === 'running') await this.context.suspend();
  }

  dispose(): void {
    this.abort.abort();
    for (const source of this.sources) source.stop();
    void this.context.close();
  }

  private listen(): void {
    const options = { signal: this.abort.signal };

    window.addEventListener(
      'station:enter',
      event => {
        this.engineDrivesStations = true;
        this.onStation((event as CustomEvent<StationDetail>).detail?.id);
      },
      options
    );
    window.addEventListener(
      'section:active',
      event => {
        if (!this.engineDrivesStations)
          this.onStation((event as CustomEvent<StationDetail>).detail?.id);
      },
      options
    );
    window.addEventListener(
      'station:progress',
      event => this.onProgress((event as CustomEvent<StationDetail>).detail),
      options
    );
    window.addEventListener(
      'scene:hover',
      event =>
        this.onHover((event as CustomEvent<{ label?: string | null }>).detail?.label ?? null),
      options
    );
    window.addEventListener(
      'motion:toggle',
      event => {
        this.paused = Boolean((event as CustomEvent<{ paused?: boolean }>).detail?.paused);
        this.applyPause();
      },
      options
    );
    document.addEventListener('visibilitychange', () => void this.onVisibility(), options);
  }

  private onStation(id: string | null | undefined): void {
    if (!isStationId(id) || id === this.station) return;
    const isFirst = this.station === null;
    this.setStation(id, !isFirst);
  }

  private setStation(id: StationId, withPing: boolean): void {
    this.station = id;
    const preset = PRESETS[id];
    const now = this.context.currentTime;
    const tau = settle(CROSSFADE_SECONDS);

    const next = new ChordLayer(this.context, preset, this.padBus, this.shimmerBus);
    this.layer?.fadeOutAndStop(now, CROSSFADE_SECONDS);
    next.fadeIn(now, CROSSFADE_SECONDS);
    this.layer = next;

    this.padFilter.frequency.setTargetAtTime(preset.cutoff, now, tau);
    this.humGain.gain.setTargetAtTime(preset.hum * LEVELS.hum, now, tau);
    this.airGain.gain.setTargetAtTime(preset.air * LEVELS.air, now, tau);
    this.shimmerBus.gain.setTargetAtTime(preset.air * LEVELS.shimmer, now, tau);
    this.roomSend.gain.setTargetAtTime(preset.room, now, tau);
    this.spaceSend.gain.setTargetAtTime(preset.space, now, tau);

    if (withPing && this.enabled && !this.paused) {
      const elapsed = performance.now() - this.lastStationPing;
      if (elapsed >= STATION_PING_GAP_MS) {
        this.lastStationPing = performance.now();
        this.ping(preset.bells, LEVELS.ping);
      }
    }
  }

  private onProgress(detail: StationDetail | undefined): void {
    if (this.paused || !detail || !this.station || detail.id !== this.station) return;
    const progress = Math.max(-1, Math.min(1, Number(detail.progress) || 0));
    const preset = PRESETS[this.station];
    const travel = Math.abs(progress);
    const cutoff = preset.cutoff * (1 + travel * 0.18);
    this.padFilter.frequency.setTargetAtTime(cutoff, this.context.currentTime, 0.4);
  }

  private onHover(label: string | null): void {
    const changed = label !== this.lastHoverLabel;
    this.lastHoverLabel = label;
    if (!label || !changed || this.paused || !this.enabled || !this.station) return;
    const now = performance.now();
    if (now - this.lastHoverPing < HOVER_PING_GAP_MS) return;
    this.lastHoverPing = now;
    this.ping(PRESETS[this.station].bells, LEVELS.hoverPing);
  }

  private async onVisibility(): Promise<void> {
    if (document.visibilityState === 'hidden') {
      this.rampMaster(0, HIDDEN_FADE_SECONDS);
      await this.wait(HIDDEN_FADE_SECONDS);
      if (document.visibilityState === 'hidden' && this.context.state === 'running') {
        await this.context.suspend();
      }
      return;
    }
    if (!this.enabled) return;
    await this.context.resume();
    this.rampMaster(MASTER_LEVEL, FADE_IN_SECONDS);
  }

  /** A soft glassy bell: a sine plus an inharmonic partial, mostly sent to the long reverb. */
  private ping(bells: readonly number[], level: number): void {
    const note = bells[Math.floor(Math.random() * bells.length)] ?? 88;
    const frequency = midiToHz(note);
    const at = this.context.currentTime + 0.02;
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(level, at + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + 2.4);
    envelope.connect(this.pingBus);

    const partials: [ratio: number, gain: number][] = [
      [1, 1],
      [2.756, 0.22],
      [5.404, 0.06]
    ];
    for (const [ratio, gain] of partials) {
      const oscillator = this.context.createOscillator();
      oscillator.frequency.value = frequency * ratio;
      const partialGain = this.context.createGain();
      partialGain.gain.value = gain;
      oscillator.connect(partialGain).connect(envelope);
      oscillator.start(at);
      oscillator.stop(at + 2.5);
      oscillator.addEventListener('ended', () => partialGain.disconnect());
    }
  }

  private applyPause(): void {
    const now = this.context.currentTime;
    this.shimmerLfoDepth.gain.setTargetAtTime(this.paused ? 0 : 0.35, now, 0.8);
  }

  private connectWithSends(node: AudioNode, dry: number, space = 1, room = 1): void {
    const dryGain = this.context.createGain();
    dryGain.gain.value = dry;
    node.connect(dryGain).connect(this.master);
    const roomGain = this.context.createGain();
    roomGain.gain.value = room;
    node.connect(roomGain).connect(this.roomSend);
    const spaceGain = this.context.createGain();
    spaceGain.gain.value = space;
    node.connect(spaceGain).connect(this.spaceSend);
  }

  private rampMaster(target: number, seconds: number): void {
    rampTo(this.master.gain, target, this.context.currentTime, seconds);
  }

  private currentStationFromDom(): StationId {
    const centre = innerHeight / 2;
    for (const section of document.querySelectorAll<HTMLElement>('[data-station]')) {
      const box = section.getBoundingClientRect();
      const id = section.dataset.station;
      if (box.top <= centre && box.bottom >= centre && isStationId(id)) return id;
    }
    return 'hero';
  }

  private wait(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
}

export function createAmbience(context: AudioContext): Ambience {
  return new Ambience(context);
}
