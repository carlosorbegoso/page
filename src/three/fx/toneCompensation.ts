import {
  ACESFilmicToneMapping,
  Color,
  DataTexture,
  DataUtils,
  HalfFloatType,
  LinearFilter,
  RGBAFormat,
  SRGBTransfer,
  ColorManagement,
  type Scene,
  type Texture,
  type WebGLRenderer
} from 'three';

type Rgb = [number, number, number];

function rrtOdt(v: number): number {
  return (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.432951) + 0.238081);
}

/** three's `ACESFilmicToneMapping` (tonemapping_pars_fragment), before sRGB encoding. */
export function acesFilmic([r, g, b]: Rgb, exposure: number): Rgb {
  const k = exposure / 0.6;
  const x = r * k;
  const y = g * k;
  const z = b * k;
  const ir = rrtOdt(0.59719 * x + 0.35458 * y + 0.04823 * z);
  const ig = rrtOdt(0.076 * x + 0.90834 * y + 0.01566 * z);
  const ib = rrtOdt(0.0284 * x + 0.13383 * y + 0.83777 * z);
  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
  return [
    clamp(1.60475 * ir - 0.53108 * ig - 0.07367 * ib),
    clamp(-0.10208 * ir + 1.10813 * ig - 0.00605 * ib),
    clamp(-0.00327 * ir - 0.07276 * ig + 1.07602 * ib)
  ];
}

/** Linear input whose ACES output equals `target` (linear display values up to 0.95). */
export function inverseAcesFilmic(target: Rgb, exposure: number): Rgb {
  const goal = target.map(v => Math.min(Math.max(v, 0), 0.95)) as Rgb;
  const x: Rgb = [...goal];
  // ACES is monotonic per channel and the colour matrices are diagonally dominant: a few rounds of
  // per-channel bisection converge where Newton overshoots on the clamped toe.
  for (let round = 0; round < 4; round++) {
    for (let c = 0; c < 3; c++) {
      let low = 0;
      let high = 64;
      for (let step = 0; step < 32; step++) {
        x[c] = (low + high) / 2;
        if (acesFilmic(x, exposure)[c]! < goal[c]!) low = x[c]!;
        else high = x[c]!;
      }
    }
  }
  return x;
}

function readPixels(texture: Texture): ImageData | null {
  const image = texture.image as CanvasImageSource & { width?: number; height?: number } | null;
  if (!image || !image.width || !image.height) return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
}

/**
 * The direct render leaves the clear colour and sRGB background textures untouched by tone mapping,
 * but through the pipeline they pass ACES in the composite and the night sky collapses to black.
 * During the scene pass this swaps them for inverse-ACES equivalents so they land on their tokens.
 */
export class ToneCompensation {
  private readonly savedClear = new Color();
  private readonly compensatedClear = new Color();
  private clearKey = '';
  private savedAlpha = 1;
  private savedBackground: Scene['background'] = null;
  private swappedBackground = false;
  private active = false;
  private cache: { source: Texture; version: number; exposure: number; texture: DataTexture | null } | null = null;
  private readonly colorCache = new Map<string, Color>();

  begin(renderer: WebGLRenderer, scene: Scene): void {
    this.active = renderer.toneMapping === ACESFilmicToneMapping;
    if (!this.active) return;
    const exposure = renderer.toneMappingExposure;
    renderer.getClearColor(this.savedClear);
    this.savedAlpha = renderer.getClearAlpha();
    const key = `${this.savedClear.getHexString()}|${exposure}`;
    if (key !== this.clearKey) {
      this.clearKey = key;
      this.compensatedClear.setRGB(...inverseAcesFilmic([this.savedClear.r, this.savedClear.g, this.savedClear.b], exposure));
    }
    renderer.setClearColor(this.compensatedClear, this.savedAlpha);

    const background = scene.background;
    this.savedBackground = background;
    this.swappedBackground = false;
    const replacement = this.replacementFor(background, exposure);
    if (replacement) {
      scene.background = replacement;
      this.swappedBackground = true;
    }
  }

  end(renderer: WebGLRenderer, scene: Scene): void {
    if (!this.active) return;
    renderer.setClearColor(this.savedClear, this.savedAlpha);
    if (this.swappedBackground) scene.background = this.savedBackground;
    this.swappedBackground = false;
  }

  private replacementFor(background: Scene['background'], exposure: number): Scene['background'] {
    if (!background) return null;
    if ((background as Color).isColor) {
      const color = background as Color;
      const key = `${color.getHexString()}|${exposure}`;
      let compensated = this.colorCache.get(key);
      if (!compensated) {
        compensated = new Color().setRGB(...inverseAcesFilmic([color.r, color.g, color.b], exposure));
        this.colorCache.set(key, compensated);
      }
      return compensated;
    }
    const texture = background as Texture;
    if (!texture.isTexture || (texture as Texture & { isCubeTexture?: boolean }).isCubeTexture) return null;
    if (ColorManagement.getTransfer(texture.colorSpace) !== SRGBTransfer) return null;
    const cached = this.cache;
    if (cached && cached.source === texture && cached.version === texture.version && cached.exposure === exposure) {
      return cached.texture;
    }
    cached?.texture?.dispose();
    const compensated = this.compensateTexture(texture, exposure);
    this.cache = { source: texture, version: texture.version, exposure, texture: compensated };
    return compensated;
  }

  private compensateTexture(texture: Texture, exposure: number): DataTexture | null {
    const pixels = readPixels(texture);
    if (!pixels) return null;
    const { width, height, data } = pixels;
    const out = new Uint16Array(width * height * 4);
    const color = new Color();
    for (let row = 0; row < height; row++) {
      const targetRow = texture.flipY ? height - 1 - row : row;
      for (let column = 0; column < width; column++) {
        const i = (row * width + column) * 4;
        const o = (targetRow * width + column) * 4;
        color.setRGB(data[i]! / 255, data[i + 1]! / 255, data[i + 2]! / 255).convertSRGBToLinear();
        const [r, g, b] = inverseAcesFilmic([color.r, color.g, color.b], exposure);
        out[o] = DataUtils.toHalfFloat(r);
        out[o + 1] = DataUtils.toHalfFloat(g);
        out[o + 2] = DataUtils.toHalfFloat(b);
        out[o + 3] = DataUtils.toHalfFloat(1);
      }
    }
    const result = new DataTexture(out, width, height, RGBAFormat, HalfFloatType);
    result.minFilter = LinearFilter;
    result.magFilter = LinearFilter;
    result.wrapS = texture.wrapS;
    result.wrapT = texture.wrapT;
    result.needsUpdate = true;
    return result;
  }

  dispose(): void {
    this.cache?.texture?.dispose();
    this.cache = null;
    this.colorCache.clear();
  }
}
