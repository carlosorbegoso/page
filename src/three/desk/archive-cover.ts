import { en } from '../../i18n/ui.en';
import { es } from '../../i18n/ui.es';
import { wrap } from './folder-detail/wrap';

const MARGIN = 48;
const PAPER = '#e4ddcc';
const INK = '#1c2230';
const MUTED = '#4a5060';
const FIRST_YEAR = '2020';

function coverText(): { span: string; title: string; subtitle: string } {
  const ui = document.documentElement.lang.startsWith('en') ? en : es;
  return {
    span: `${FIRST_YEAR} – ${ui['experience.present']}`,
    title: ui['experience.title'],
    subtitle: ui['experience.subtitle']
  };
}

function fonts(): { display: string; mono: string } {
  const root = getComputedStyle(document.documentElement);
  return {
    display: root.getPropertyValue('--font-display').trim() || 'system-ui, sans-serif',
    mono: root.getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace'
  };
}

export function drawArchiveCover(canvas: HTMLCanvasElement, rows: readonly (readonly [string, string])[]): void {
  const context = canvas.getContext('2d')!;
  const { display, mono } = fonts();
  const text = coverText();
  const { width, height } = canvas;
  const measure = width - MARGIN * 2;
  context.fillStyle = PAPER;
  context.fillRect(0, 0, width, height);
  context.textAlign = 'left';
  context.fillStyle = INK;
  context.font = `500 30px ${mono}`;
  context.fillText(text.span.toUpperCase(), MARGIN, 80, measure);
  context.fillRect(MARGIN, 102, measure, 3);
  context.font = `600 84px ${display}`;
  context.fillText(text.title, MARGIN, 196, measure);
  context.fillStyle = MUTED;
  context.font = `400 34px ${display}`;
  let y = 196;
  for (const line of wrap(context, text.subtitle, measure).slice(0, 3)) context.fillText(line, MARGIN, (y += 46));
  context.fillStyle = INK;
  context.fillRect(MARGIN, y + 30, measure, 2);
  context.font = `500 32px ${mono}`;
  rows.forEach(([name, years], row) => {
    const rowY = y + 86 + row * 54;
    context.textAlign = 'left';
    context.fillText(name, MARGIN, rowY);
    context.textAlign = 'right';
    context.fillText(years, width - MARGIN, rowY);
  });
  context.textAlign = 'left';
  context.font = `500 26px ${mono}`;
  context.fillStyle = MUTED;
  context.fillText('Carlos Orbegoso', MARGIN, height - 40);
}
