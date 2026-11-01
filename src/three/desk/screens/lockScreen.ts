const CLOCK_FONT = '600 92px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const NAME_FONT = '500 15px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

export function drawLockScreen(ctx: CanvasRenderingContext2D, width: number, height: number, clock: string): void {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#1b2440');
  sky.addColorStop(0.55, '#4a3a5e');
  sky.addColorStop(1, '#b5786a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  const font = ctx.font;
  const align = ctx.textAlign;
  ctx.textAlign = 'center';
  ctx.font = CLOCK_FONT;
  ctx.fillStyle = 'rgba(245,240,235,0.92)';
  ctx.fillText(clock, width / 2, height * 0.36);
  ctx.fillStyle = 'rgba(245,240,235,0.85)';
  ctx.beginPath();
  ctx.arc(width / 2, height * 0.7, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4a3a5e';
  ctx.font = NAME_FONT;
  ctx.fillText('C', width / 2, height * 0.7 + 5);
  ctx.fillStyle = 'rgba(245,240,235,0.9)';
  ctx.fillText('Carlos', width / 2, height * 0.7 + 50);
  ctx.fillStyle = 'rgba(245,240,235,0.22)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 70, height * 0.7 + 62, 140, 22, 11);
  ctx.fill();
  ctx.font = font;
  ctx.textAlign = align;
}
