import { CanvasTexture, SRGBColorSpace } from 'three';
import { DEG } from './constants';

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

export function paperTexture(label: string): CanvasTexture {
  const w = 860;
  const h = 1160;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext('2d')!;
  const ink = '#1c2331';
  const mono = '"Geist Mono", "Geist Mono Fallback", monospace';
  const sans = 'Geist, "Geist Fallback", sans-serif';

  g.fillStyle = css('--color-desk-paper', '#d8d2c4');
  g.fillRect(0, 0, w, h);
  const grain = g.createRadialGradient(w * 0.55, h * 0.4, 50, w * 0.5, h * 0.5, h * 0.75);
  grain.addColorStop(0, 'rgba(255,250,240,0.35)');
  grain.addColorStop(1, 'rgba(90,70,40,0.18)');
  g.fillStyle = grain;
  g.fillRect(0, 0, w, h);

  g.strokeStyle = 'rgba(60,80,110,0.16)';
  g.lineWidth = 2;
  for (let y = 560; y < h - 60; y += 46) {
    g.beginPath();
    g.moveTo(70, y);
    g.lineTo(w - 70, y);
    g.stroke();
  }

  g.fillStyle = ink;
  g.globalAlpha = 0.7;
  g.font = `500 26px ${mono}`;
  g.fillText('EXP. 404', 70, 96);
  g.textAlign = 'right';
  g.fillText(`LIMA · ${limaTime()}`, w - 70, 96);
  g.textAlign = 'left';
  g.globalAlpha = 1;

  g.font = `700 300px ${sans}`;
  g.fillText('404', 58, 400);

  g.font = `500 30px ${mono}`;
  g.fillText(label.toUpperCase(), 70, 478);

  const path = decodeURIComponent(location.pathname).slice(0, 34);
  g.globalAlpha = 0.55;
  g.font = `400 26px ${mono}`;
  g.fillText(path, 70, 640);
  g.fillRect(70, 631, Math.min(g.measureText(path).width, w - 140), 3);
  g.globalAlpha = 1;

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
  g.font = `600 64px ${mono}`;
  g.fillText('?', 0, 22);
  g.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function ghostTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 344;
  const g = canvas.getContext('2d')!;
  g.strokeStyle = 'rgba(255,236,210,0.5)';
  g.lineWidth = 3;
  g.setLineDash([14, 10]);
  g.strokeRect(6, 6, 244, 332);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
