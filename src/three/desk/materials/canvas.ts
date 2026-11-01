import { CanvasTexture, Color, SRGBColorSpace } from 'three';

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createContactShadowTexture(): CanvasTexture {
  return canvasTexture(128, 128, ctx => {
    const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
    gradient.addColorStop(0.45, 'rgba(0,0,0,0.45)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  });
}

function rgb(color: Color): string {
  const srgb = color.clone().convertLinearToSRGB();
  return `${Math.round(srgb.r * 255)},${Math.round(srgb.g * 255)},${Math.round(srgb.b * 255)}`;
}

export function drawScreen(texture: CanvasTexture, aspect: number, glow: Color): void {
  const canvas = texture.image as HTMLCanvasElement;
  const width = 768;
  const height = Math.round(width / aspect);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#05080e';
  ctx.fillRect(0, 0, width, height);
  const halo = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, width * 0.7);
  halo.addColorStop(0, `rgba(${rgb(glow)},0.16)`);
  halo.addColorStop(1, `rgba(${rgb(glow)},0.02)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
  drawCode(ctx, width, height, glow, 0.38);
  texture.needsUpdate = true;
}

export function drawPhone(texture: CanvasTexture, notification: boolean, accent: Color): void {
  const canvas = texture.image as HTMLCanvasElement;
  const width = 260;
  const height = 560;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, '#0b0f16');
  background.addColorStop(1, '#141b28');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(233,238,245,0.85)';
  ctx.fillRect(width * 0.3, height * 0.12, width * 0.4, height * 0.05);
  ctx.fillStyle = 'rgba(155,168,187,0.5)';
  ctx.fillRect(width * 0.36, height * 0.19, width * 0.28, height * 0.015);
  if (notification) {
    ctx.fillStyle = 'rgba(24,32,46,0.95)';
    ctx.beginPath();
    ctx.roundRect(width * 0.06, height * 0.3, width * 0.88, height * 0.1, 14);
    ctx.fill();
    ctx.fillStyle = `rgba(${rgb(accent)},0.95)`;
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.35, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(233,238,245,0.8)';
    ctx.fillRect(width * 0.24, height * 0.325, width * 0.5, 8);
    ctx.fillStyle = 'rgba(155,168,187,0.6)';
    ctx.fillRect(width * 0.24, height * 0.355, width * 0.62, 6);
  }
  texture.needsUpdate = true;
}

export function createPhoneTexture(): CanvasTexture {
  return canvasTexture(260, 560, () => undefined);
}

function drawCode(ctx: CanvasRenderingContext2D, width: number, height: number, accent: Color, alpha: number): void {
  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const palette = [`rgba(${rgb(accent)},${alpha})`, `rgba(155,168,187,${alpha * 0.8})`, `rgba(74,222,154,${alpha * 0.7})`, `rgba(255,226,189,${alpha * 0.6})`];
  const margin = width * 0.06;
  const line = height / 26;
  ctx.save();
  ctx.filter = `blur(${(width / 512).toFixed(1)}px)`;
  ctx.fillStyle = `rgba(155,168,187,${alpha * 0.25})`;
  ctx.fillRect(0, 0, width * 0.035, height);
  ctx.fillRect(0, 0, width, line * 0.9);
  let indent = 0;
  for (let y = line * 1.8; y < height - line; y += line) {
    if (random() < 0.12) {
      indent = Math.max(0, indent - 1);
      continue;
    }
    let x = margin + indent * width * 0.03;
    const tokens = 1 + Math.floor(random() * 5);
    for (let t = 0; t < tokens && x < width * 0.9; t++) {
      const w = width * (0.02 + random() * 0.09);
      ctx.fillStyle = palette[Math.floor(random() * palette.length)]!;
      ctx.fillRect(x, y, w, line * 0.38);
      x += w + width * 0.012;
    }
    if (random() < 0.25) indent = Math.min(4, indent + 1);
  }
  ctx.restore();
}

export function createScreenTexture(): CanvasTexture {
  return canvasTexture(768, 480, () => undefined);
}
