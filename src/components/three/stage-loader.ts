/**
 * Pre-three loader: a canvas 2D overlay on the hero poster while the 3D chunk downloads. At night the
 * lamp filament warms up with the progress and dust drifts in its cone while the room dims towards the
 * dark first frame of the `intro` power-on; by day a morning haze and a sunbeam take its place. A thin
 * boot line runs along the bottom of the monitor. On `stage:reveal` the overlay fades with the canvas
 * fade-in and the filament glides onto the projected 3D lamp, fading as the real lamp ramps up.
 */

interface Point {
  x: number;
  y: number;
}

interface PosterFrame {
  media: string;
  width: number;
  height: number;
  lamp: Point;
  cone: Point;
  monitor: [left: number, right: number, bottom: number];
}

export interface RevealDetail {
  intro: boolean;
  lamp: Point | null;
}

/** Poster-space marks (0…1 of each capture). In portrait the lamp sits beyond the right edge of the frame. */
const POSTERS: PosterFrame[] = [
  { media: '(min-width: 1024px)', width: 1440, height: 900, lamp: { x: 0.925, y: 0.385 }, cone: { x: -0.12, y: 1 }, monitor: [0.17, 0.665, 0.69] },
  { media: '(min-width: 768px)', width: 768, height: 1024, lamp: { x: 1.04, y: 0.6 }, cone: { x: -0.6, y: 1 }, monitor: [0.195, 0.805, 0.547] },
  { media: 'all', width: 375, height: 667, lamp: { x: 1.12, y: 0.55 }, cone: { x: -0.6, y: 1 }, monitor: [0.165, 0.835, 0.742] }
];
const CHECKPOINTS = [0.04, 0.12, 0.3, 0.55, 0.7, 0.78, 0.88, 0.96, 1];
const SKIP_AFTER_VISIBLE_MS = 20000;
/** Matches `--duration-slow`, the canvas fade-in in StageCanvas. */
const CANVAS_FADE_S = 0.4;
/** introLevels in DeskSet: the 3D lamp ramps from 0.45 s to 0.95 s after the first frame. */
const LAMP_RAMP: [number, number] = [0.45, 0.95];
const MOTES = 34;
const LAMP_RGB = '255,181,102';
const MONITOR_RGB = '127,184,255';
const SUN_RGB = '255,241,220';

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function startStageLoader(container: HTMLElement): void {
  const canvas = container.querySelector<HTMLCanvasElement>('[data-stage-loader]');
  const status = document.querySelector<HTMLElement>('[data-stage-status]');
  const context = canvas?.getContext('2d');
  if (!canvas || !status || !context || location.search.includes('capture') || container.dataset.ready === 'true') return;
  const ctx = context;
  const root = document.documentElement;
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const label = status.querySelector<HTMLElement>('[role="status"]')!;
  const clock = status.querySelector<HTMLElement>('[data-stage-clock]')!;
  const percent = status.querySelector<HTMLElement>('[data-stage-percent]')!;
  const motes = Array.from({ length: MOTES }, (_, i) => ({ u: Math.random(), v: Math.random() * 2 - 1, phase: i * 2.399, speed: 0.4 + Math.random() * 0.8 }));

  let width = 0;
  let height = 0;
  let scale = 1;
  let poster = POSTERS[2]!;
  let lamp: Point = { x: 0, y: 0 };
  let lampGoal: Point | null = null;
  let checkpoint = 0;
  let checkpointAt = performance.now();
  let shown = 0;
  let visibleMs = 0;
  let last = performance.now();
  let handoff: { at: number; intro: boolean } | null = null;
  let frame = 0;
  let finished = false;
  let veil = -1;
  /* Kept from scroll events: reading scrollY in every tick, after the status text was written, forces a style recalc. */
  let atTop = scrollY < 4;

  const still = () => reducedQuery.matches || root.dataset.motion === 'paused';
  const day = () => root.dataset.time === 'day';

  function toScreen(p: Point): Point {
    const cover = Math.max(width / poster.width, height / poster.height);
    return { x: (width - poster.width * cover) / 2 + p.x * poster.width * cover, y: (height - poster.height * cover) / 2 + p.y * poster.height * cover };
  }

  function measure(): void {
    scale = Math.min(window.devicePixelRatio || 1, 1.5);
    width = container.clientWidth || innerWidth;
    height = container.clientHeight || innerHeight;
    canvas!.width = Math.round(width * scale);
    canvas!.height = Math.round(height * scale);
    poster = POSTERS.find(p => matchMedia(p.media).matches) ?? poster;
    if (!lampGoal) lamp = toScreen(poster.lamp);
  }

  function setProgress(value: number): void {
    if (value <= checkpoint) return;
    checkpoint = value;
    checkpointAt = performance.now();
  }

  function goal(now: number): number {
    const next = CHECKPOINTS.find(c => c > checkpoint + 1e-3) ?? 1;
    return checkpoint + (next - checkpoint) * 0.85 * (1 - Math.exp(-(now - checkpointAt) / 3000));
  }

  function writeStatus(): void {
    const minutes = 48 + Math.round(12 * shown);
    clock.textContent = minutes >= 60 ? (day() ? '10:00' : '23:00') : `${day() ? '09' : '22'}:${minutes}`;
    percent.textContent = `${Math.round(shown * 100)}%`;
  }

  function drawMotes(origin: Point, direction: Point, length: number, spread: number, rgb: string, strength: number, time: number): void {
    const norm = Math.hypot(direction.x, direction.y);
    const dx = direction.x / norm;
    const dy = direction.y / norm;
    ctx.fillStyle = `rgb(${rgb})`;
    for (const mote of motes) {
      const u = (mote.u + Math.sin(time * 0.05 * mote.speed + mote.phase) * 0.04 + 1) % 1;
      const v = mote.v + Math.sin(time * 0.3 * mote.speed + mote.phase) * 0.15;
      const along = 0.08 + u * 0.92;
      const x = origin.x + dx * along * length - dy * v * along * spread;
      const y = origin.y + dy * along * length + dx * v * along * spread;
      const twinkle = 0.55 + 0.45 * Math.sin(time * 1.7 * mote.speed + mote.phase);
      ctx.globalAlpha = clamp01(strength * twinkle * (1 - u * 0.7) * (1 - Math.abs(v) * 0.6));
      const size = (0.8 + mote.speed) * scale;
      ctx.fillRect(x * scale, y * scale, size, size);
    }
    ctx.globalAlpha = 1;
  }

  function cone(origin: Point, direction: Point, length: number, spread: number, rgb: string, alpha: number): void {
    const norm = Math.hypot(direction.x, direction.y);
    const dx = (direction.x / norm) * length;
    const dy = (direction.y / norm) * length;
    const px = (-dy / length) * spread;
    const py = (dx / length) * spread;
    const gradient = ctx.createRadialGradient(origin.x * scale, origin.y * scale, 0, origin.x * scale, origin.y * scale, length * scale);
    gradient.addColorStop(0, `rgba(${rgb},${alpha})`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(origin.x * scale, origin.y * scale);
    ctx.lineTo((origin.x + dx + px) * scale, (origin.y + dy + py) * scale);
    ctx.lineTo((origin.x + dx - px) * scale, (origin.y + dy - py) * scale);
    ctx.closePath();
    ctx.fill();
  }

  function glow(at: Point, radius: number, rgb: string, alpha: number): void {
    const gradient = ctx.createRadialGradient(at.x * scale, at.y * scale, 0, at.x * scale, at.y * scale, radius * scale);
    gradient.addColorStop(0, `rgba(${rgb},${alpha})`);
    gradient.addColorStop(0.35, `rgba(${rgb},${alpha * 0.35})`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect((at.x - radius) * scale, (at.y - radius) * scale, radius * 2 * scale, radius * 2 * scale);
  }

  function draw(time: number, since: number, dt: number): void {
    const moving = !still();
    const intro = handoff ? handoff.intro : atTop && moving;
    const warm = smooth(0, 1, shown);
    const scene = handoff ? 1 - clamp01(since / CANVAS_FADE_S) : 1;
    const light = handoff ? (handoff.intro && !day() ? 1 - smooth(LAMP_RAMP[0], LAMP_RAMP[1], since) : scene) : 1;
    const minSide = Math.min(width, height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);

    if (day()) {
      ctx.fillStyle = `rgba(223,232,242,${(0.06 + (moving ? 0.3 : 0.12) * warm) * scene})`;
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx.globalCompositeOperation = 'lighter';
      const sun = { x: width * 0.9, y: -height * 0.08 };
      const beam = { x: -0.55, y: 1 };
      cone(sun, beam, height * 1.15, minSide * 0.32, SUN_RGB, 0.12 * (0.4 + 0.6 * warm) * light);
      drawMotes(sun, beam, height * 1.1, minSide * 0.3, SUN_RGB, 0.55 * light, moving ? time : 0);
    } else {
      const veilGoal = intro ? 0.22 + 0.64 * warm : moving ? 0.16 + 0.1 * warm : 0.12;
      veil = veil < 0 || !moving ? veilGoal : veil + (veilGoal - veil) * (1 - Math.exp(-3 * dt));
      ctx.fillStyle = `rgba(4,6,11,${veil * scene})`;
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx.globalCompositeOperation = 'lighter';
      const flicker = moving ? 0.9 + 0.1 * Math.sin(time * 23) * Math.sin(time * 3.1) : 1;
      const filament = (0.18 + 0.72 * warm) * flicker * light;
      cone(lamp, poster.cone, minSide * 0.62, minSide * 0.2, LAMP_RGB, 0.07 * filament);
      glow(lamp, minSide * 0.17, LAMP_RGB, 0.16 * filament);
      glow(lamp, minSide * (0.025 + 0.02 * warm), '255,214,160', 0.9 * filament);
      drawMotes(lamp, poster.cone, minSide * 0.6, minSide * 0.18, LAMP_RGB, 0.8 * filament, moving ? time : 0);
    }

    const [left, right, bottom] = poster.monitor;
    const start = toScreen({ x: left, y: bottom });
    const end = toScreen({ x: right, y: bottom });
    const y = (start.y - 5) * scale;
    const head = start.x + (end.x - start.x) * shown;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `rgba(${MONITOR_RGB},${0.12 * scene})`;
    ctx.fillRect(start.x * scale, y, (end.x - start.x) * scale, scale);
    ctx.fillStyle = `rgba(${MONITOR_RGB},${0.6 * scene})`;
    ctx.fillRect(start.x * scale, y - scale * 0.5, (head - start.x) * scale, scale * 2);
    glow({ x: head, y: start.y - 5 }, 10, MONITOR_RGB, 0.7 * scene);
    ctx.globalCompositeOperation = 'source-over';
  }

  function tick(now: number): void {
    frame = 0;
    if (finished) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const target = handoff ? 1 : goal(now);
    shown = still() ? target : shown + (target - shown) * (1 - Math.exp(-4 * dt));
    if (lampGoal) {
      const k = still() ? 1 : 1 - Math.exp(-10 * dt);
      lamp = { x: lamp.x + (lampGoal.x - lamp.x) * k, y: lamp.y + (lampGoal.y - lamp.y) * k };
    }
    const since = handoff ? (now - handoff.at) / 1000 : 0;
    draw(now / 1000, since, dt);
    writeStatus();
    const done = handoff && (still() || since > (handoff.intro && !day() ? LAMP_RAMP[1] : CANVAS_FADE_S));
    if (done) finish(true);
    else if (!still() || handoff) schedule();
  }

  function schedule(): void {
    if (!frame && !finished && document.visibilityState === 'visible') frame = requestAnimationFrame(tick);
  }

  const interval = window.setInterval(() => {
    const now = performance.now();
    if (document.visibilityState === 'visible') visibleMs += 250;
    if (visibleMs > SKIP_AFTER_VISIBLE_MS && !handoff) finish(false);
    else if (still()) tick(now);
  }, 250);

  const onProgress = (event: Event) => {
    setProgress((event as CustomEvent<{ value: number }>).detail.value);
    schedule();
  };
  const onReveal = (event: Event) => {
    const detail = (event as CustomEvent<RevealDetail>).detail;
    handoff = { at: performance.now(), intro: detail.intro };
    if (detail.lamp) lampGoal = detail.lamp;
    setProgress(1);
    schedule();
  };
  const onVisibility = () => {
    last = performance.now();
    schedule();
  };
  const onLoad = () => setProgress(0.12);
  const onScroll = () => {
    atTop = scrollY < 4;
  };
  const onResize = () => {
    measure();
    schedule();
  };
  const observer = new MutationObserver(() => {
    const tier = container.dataset.tier;
    if (container.dataset.degraded || tier === 'none' || tier === 'low') finish(false);
  });

  function finish(loaded: boolean): void {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    clearInterval(interval);
    observer.disconnect();
    window.removeEventListener('stage:progress', onProgress);
    window.removeEventListener('stage:reveal', onReveal);
    window.removeEventListener('load', onLoad);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas!.dataset.leaving = '';
    status!.dataset.leaving = '';
    if (loaded) label.textContent = status!.dataset.done ?? '';
    window.setTimeout(() => {
      canvas!.remove();
      status!.hidden = true;
    }, loaded ? 2500 : 600);
  }

  window.addEventListener('stage:progress', onProgress);
  window.addEventListener('stage:reveal', onReveal);
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  observer.observe(container, { attributes: true, attributeFilter: ['data-tier', 'data-degraded'] });
  if (document.readyState === 'complete') setProgress(0.12);
  else {
    setProgress(CHECKPOINTS[0]!);
    window.addEventListener('load', onLoad, { once: true });
  }
  measure();
  canvas.hidden = false;
  status.hidden = false;
  tick(performance.now());
  if (!still()) schedule();
}
