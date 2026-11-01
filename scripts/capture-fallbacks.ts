/**
 * Captures the static fallbacks of the 3D world (PLAN §3.4) from a running dev server:
 *   bun run capture [-- --base http://localhost:4321/page/ --station hero]
 * Uses the real GPU through new-headless Chromium (ANGLE/Metal on macOS) and falls back to
 * SwiftShader only with --swiftshader. Writes AVIF + WebP at 375/768/1440 into public/fallback/.
 */
import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Browser, chromium } from 'playwright';
import sharp from 'sharp';

const VIEWPORTS = [
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
] as const;
const SCALE = 2;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'fallback');
const BUDGET_KB = { 375: 60, 768: 100, 1440: 150 } as Record<number, number>;
const TOTAL_BUDGET_KB = 600;

function arg(name: string, fallback: string): string {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? (process.argv[index + 1] ?? fallback) : fallback;
}

function executablePath(): string | undefined {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const shell = join(
    homedir(),
    'Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell'
  );
  return process.platform === 'darwin' ? shell : undefined;
}

type Viewport = (typeof VIEWPORTS)[number];

function launchArgs(swiftshader: boolean): string[] {
  return swiftshader
    ? ['--enable-unsafe-swiftshader', '--use-angle=swiftshader']
    : ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'];
}

async function grabCanvasPng(browser: Browser, base: string, station: string, viewport: Viewport): Promise<Buffer> {
  const page = await browser.newPage({ viewport, deviceScaleFactor: SCALE });
  page.on('console', message => {
    if (message.text().startsWith('[stage]')) console.log(`  ${viewport.width}: ${message.text()}`);
  });
  const url = `${base}?capture=${station}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__captureReady === true, null, { timeout: 30000 });
  const dataUrl = await page.evaluate(() =>
    document.querySelector<HTMLCanvasElement>('[data-stage-canvas]')!.toDataURL('image/png')
  );
  await page.close();
  return Buffer.from(dataUrl.split(',')[1]!, 'base64');
}

async function writeFallback(png: Buffer, name: string, viewport: Viewport): Promise<number> {
  const image = sharp(png).resize(viewport.width * SCALE, viewport.height * SCALE);
  await image.clone().avif({ quality: 50, effort: 6 }).toFile(join(OUT_DIR, `${name}.avif`));
  await image.clone().webp({ quality: 72, effort: 6 }).toFile(join(OUT_DIR, `${name}.webp`));
  let total = 0;
  for (const format of ['avif', 'webp']) {
    const size = (await stat(join(OUT_DIR, `${name}.${format}`))).size / 1024;
    total += size;
    const budget = format === 'avif' ? BUDGET_KB[viewport.width] : undefined;
    const flag = budget && size > budget ? `  OVER BUDGET (${budget} KB)` : '';
    console.log(`${name}.${format}: ${size.toFixed(1)} KB${flag}`);
  }
  return total;
}

async function main(): Promise<void> {
  const base = arg('base', 'http://localhost:4321/page/');
  const station = arg('station', 'hero');
  const args = launchArgs(process.argv.includes('--swiftshader'));
  const browser = await chromium.launch({ executablePath: executablePath(), args });
  await mkdir(OUT_DIR, { recursive: true });
  let total = 0;
  try {
    for (const viewport of VIEWPORTS) {
      const png = await grabCanvasPng(browser, base, station, viewport);
      total += await writeFallback(png, `${station}-${viewport.width}`, viewport);
    }
  } finally {
    await browser.close();
  }
  for (const file of await readdir(OUT_DIR)) {
    if (file === 'hero-placeholder.svg') await rm(join(OUT_DIR, file));
  }
  console.log(`total: ${total.toFixed(1)} KB${total > TOTAL_BUDGET_KB ? `  OVER BUDGET (${TOTAL_BUDGET_KB} KB)` : ''}`);
}

await main();
