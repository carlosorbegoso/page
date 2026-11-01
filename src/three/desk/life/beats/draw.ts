import { printFonts, wrap } from '../../notes/paper';
import { BEAT_MM, type BeatCanvas } from './plane';

const INK = '#1c2230';
const MUTED = '#5b6172';

function roundedRect(
  canvas: BeatCanvas,
  inset: number,
  radius: number,
  fill: string,
  stroke?: string
): void {
  const { context, width, height } = canvas;
  context.beginPath();
  context.roundRect(inset, inset, width - inset * 2, height - inset * 2, radius);
  context.fillStyle = fill;
  context.fill();
  if (!stroke) return;
  context.lineWidth = canvas.mm * 0.5;
  context.strokeStyle = stroke;
  context.stroke();
}

function line(
  canvas: BeatCanvas,
  text: string,
  y: number,
  size: number,
  weight: number,
  color: string,
  align: CanvasTextAlign = 'center',
  family = printFonts().body
): void {
  const { context, width, mm } = canvas;
  context.font = `${weight} ${size * mm}px ${family}`;
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = 'alphabetic';
  const x = align === 'center' ? width / 2 : align === 'left' ? mm * 4 : width - mm * 4;
  context.fillText(text, x, y * mm, width - mm * 8);
}

export interface Invitation {
  eyebrow: string;
  title: string;
  when: string;
}

export function drawInvitation(canvas: BeatCanvas, invite: Invitation): void {
  const { mm } = canvas;
  roundedRect(canvas, mm * 0.6, mm * 3, '#fffaf4', '#d9b46a');
  roundedRect(canvas, mm * 2.4, mm * 2, 'rgba(0,0,0,0)', '#ecd6a6');
  line(canvas, invite.eyebrow, 13, 4.6, 600, '#c45c78');
  line(canvas, invite.title, 25, 7, 600, INK, 'center', printFonts().display);
  line(canvas, invite.when, 34, 4.2, 400, MUTED);
}

export function drawYape(canvas: BeatCanvas, amount: string, by: string): void {
  const { context, mm, height } = canvas;
  roundedRect(canvas, mm * 0.5, height / 2, '#742284');
  context.beginPath();
  context.arc(height / 2, height / 2, height * 0.32, 0, Math.PI * 2);
  context.fillStyle = '#20c4b4';
  context.fill();
  context.font = `700 ${6 * mm}px ${printFonts().body}`;
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('✓', height / 2, height / 2 + mm * 0.3);
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  context.font = `700 ${6.4 * mm}px ${printFonts().body}`;
  context.fillStyle = '#ffffff';
  context.fillText(amount, height * 0.95, height / 2 + 2.3 * mm);
  const after = height * 0.95 + context.measureText(amount).width + mm * 2.2;
  context.font = `400 ${4.6 * mm}px ${printFonts().body}`;
  context.fillStyle = '#f1dcf7';
  context.fillText(by, after, height / 2 + 1.7 * mm);
}

export interface WorkOrder {
  brand: string;
  number: string;
  job: string;
  done: string;
}

export function drawTicket(canvas: BeatCanvas, order: WorkOrder): void {
  const { context, width, height, mm } = canvas;
  context.fillStyle = '#f7f5ef';
  context.beginPath();
  context.moveTo(0, 0);
  for (let x = 0; x <= width; x += mm * 2) context.lineTo(x, (x / (mm * 2)) % 2 ? mm * 1.2 : 0);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.fill();
  const mono = printFonts().mono;
  line(canvas, order.brand, 9, 4.2, 700, INK, 'center', mono);
  line(canvas, order.number, 17, 5.2, 700, INK, 'center', mono);
  context.setLineDash([mm * 1.2, mm * 0.9]);
  context.strokeStyle = `${MUTED}88`;
  context.lineWidth = mm * 0.35;
  for (const y of [20.5, 38]) {
    context.beginPath();
    context.moveTo(mm * 3, y * mm);
    context.lineTo(width - mm * 3, y * mm);
    context.stroke();
  }
  context.setLineDash([]);
  context.font = `400 ${4.2 * mm}px ${mono}`;
  context.textAlign = 'center';
  context.fillStyle = INK;
  wrap(context, order.job, width - mm * 6).forEach((text, index) =>
    context.fillText(text, width / 2, (27 + index * 5.2) * mm)
  );
  line(canvas, order.done, 45, 5, 700, '#1f8a4c', 'center', mono);
}

export type BubbleSide = 'in' | 'out';

export function bubbleHeight(text: string, width: number): number {
  const probe = document.createElement('canvas').getContext('2d')!;
  probe.font = `400 ${4.8 * BEAT_MM}px ${printFonts().body}`;
  const lines = wrap(probe, text, (width * 1000 - 12) * BEAT_MM).length;
  return (lines * 6.4 + 7.5) / 1000;
}

export function drawBubble(canvas: BeatCanvas, text: string, side: BubbleSide, time: string): void {
  const { context, width, mm } = canvas;
  roundedRect(canvas, mm * 0.4, mm * 3.2, side === 'out' ? '#d9fdd3' : '#ffffff');
  context.font = `400 ${4.8 * mm}px ${printFonts().body}`;
  context.fillStyle = INK;
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  wrap(context, text, width - mm * 12).forEach((row, index) =>
    context.fillText(row, mm * 3.6, (6.6 + index * 6.4) * mm)
  );
  context.font = `400 ${3 * mm}px ${printFonts().body}`;
  context.fillStyle = MUTED;
  context.textAlign = 'right';
  context.fillText(
    side === 'out' ? `${time} ✓✓` : time,
    width - mm * 2.4,
    canvas.height - mm * 1.8
  );
}

export function drawSpeech(canvas: BeatCanvas, text: string): void {
  const { context, width, height, mm } = canvas;
  const body = height - mm * 3.5;
  context.beginPath();
  context.roundRect(mm * 0.4, mm * 0.4, width - mm * 0.8, body, mm * 4);
  context.moveTo(width * 0.3, body);
  context.lineTo(width * 0.24, height - mm * 0.4);
  context.lineTo(width * 0.4, body);
  context.fillStyle = '#ffffff';
  context.fill();
  context.font = `500 ${4.8 * mm}px ${printFonts().body}`;
  context.fillStyle = INK;
  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  const rows = wrap(context, text, width - mm * 8);
  const top = (body / mm - rows.length * 6.2) / 2 + 4.8;
  rows.forEach((row, index) => context.fillText(row, width / 2, (top + index * 6.2) * mm));
}
