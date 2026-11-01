import { CanvasTexture, SRGBColorSpace } from 'three';
import { DEG } from './constants';

const PAPER_PX = { width: 860, height: 1160 };
const INK = '#1c2331';
const MONO = '"Geist Mono", "Geist Mono Fallback", monospace';
const SANS = 'Geist, "Geist Fallback", sans-serif';

function css(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function limaTime(): string {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Lima'
    }).format(new Date());
  } catch {
    return '02:14';
  }
}

function canvas2d(width: number, height: number): { canvas: HTMLCanvasElement; g: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return { canvas, g: canvas.getContext('2d')! };
}

function drawPaperGround(g: CanvasRenderingContext2D, w: number, h: number): void {
  g.fillStyle = css('--color-desk-paper', '#d8d2c4');
  g.fillRect(0, 0, w, h);
  const grain = g.createRadialGradient(w * 0.55, h * 0.4, 50, w * 0.5, h * 0.5, h * 0.75);
  grain.addColorStop(0, 'rgba(255,250,240,0.35)');
  grain.addColorStop(1, 'rgba(90,70,40,0.18)');
  g.fillStyle = grain;
  g.fillRect(0, 0, w, h);
}

function drawRuledLines(g: CanvasRenderingContext2D, w: number, h: number): void {
  g.strokeStyle = 'rgba(60,80,110,0.16)';
  g.lineWidth = 2;
  for (let y = 560; y < h - 60; y += 46) {
    g.beginPath();
    g.moveTo(70, y);
    g.lineTo(w - 70, y);
    g.stroke();
  }
}

function drawHeading(g: CanvasRenderingContext2D, w: number, label: string): void {
  g.fillStyle = INK;
  g.globalAlpha = 0.7;
  g.font = `500 26px ${MONO}`;
  g.fillText('EXP. 404', 70, 96);
  g.textAlign = 'right';
  g.fillText(`LIMA · ${limaTime()}`, w - 70, 96);
  g.textAlign = 'left';
  g.globalAlpha = 1;

  g.font = `700 300px ${SANS}`;
  g.fillText('404', 58, 400);

  g.font = `500 30px ${MONO}`;
  g.fillText(label.toUpperCase(), 70, 478);
}

function drawMissingPath(g: CanvasRenderingContext2D, w: number): void {
  const path = decodeURIComponent(location.pathname).slice(0, 34);
  g.globalAlpha = 0.55;
  g.font = `400 26px ${MONO}`;
  g.fillText(path, 70, 640);
  g.fillRect(70, 631, Math.min(g.measureText(path).width, w - 140), 3);
  g.globalAlpha = 1;
}

function drawQuestionStamp(g: CanvasRenderingContext2D, w: number, h: number): void {
  g.save();
  g.translate(w - 200, h - 210);
  g.rotate(-14 * DEG);
  g.strokeStyle = css('--color-accent', '#5aa9ff');
  g.fillStyle = g.strokeStyle;
  g.globalAlpha = 0.6;
  g.lineWidth = 6;
  g.beginPath();
  g.arc(0, 0, 112, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 2;
  g.beginPath();
  g.arc(0, 0, 96, 0, Math.PI * 2);
  g.stroke();
  g.textAlign = 'center';
  g.font = `600 64px ${MONO}`;
  g.fillText('?', 0, 22);
  g.restore();
}

function srgbTexture(canvas: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function paperTexture(label: string): CanvasTexture {
  const { width: w, height: h } = PAPER_PX;
  const { canvas, g } = canvas2d(w, h);
  drawPaperGround(g, w, h);
  drawRuledLines(g, w, h);
  drawHeading(g, w, label);
  drawMissingPath(g, w);
  drawQuestionStamp(g, w, h);
  const texture = srgbTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

export function ghostTexture(): CanvasTexture {
  const { canvas, g } = canvas2d(256, 344);
  g.strokeStyle = 'rgba(255,236,210,0.5)';
  g.lineWidth = 3;
  g.setLineDash([14, 10]);
  g.strokeRect(6, 6, 244, 332);
  return srgbTexture(canvas);
}
