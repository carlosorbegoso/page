import { chromium } from 'playwright';
import sharp from 'sharp';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = resolve(here, '../../../public/images');
const base = process.env.BASE_URL ?? 'http://localhost:4321/page/';
const GPU_ARGS = ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'];

async function captureScene(browser) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await page.goto(`${base}?capture=hero`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__captureReady === true, null, { timeout: 45000 });
  await page.waitForTimeout(1000);
  const dataUrl = await page.evaluate(() =>
    document.querySelector('[data-stage-canvas]').toDataURL('image/png')
  );
  await page.close();
  return dataUrl;
}

async function renderCard(browser, scene, lang) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`${pathToFileURL(resolve(here, 'og.html')).href}?lang=${lang}`);
  await page.evaluate(src => {
    const img = document.querySelector('.scene');
    img.src = src;
    return img.decode();
  }, scene);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: 'png' });
  await page.close();
  const file = resolve(out, `og-${lang}.jpg`);
  const info = await sharp(png).jpeg({ quality: 80, mozjpeg: true }).toFile(file);
  console.log(file, info.width, info.height, Math.round(info.size / 1024) + ' KB');
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: GPU_ARGS });
try {
  const scene = await captureScene(browser);
  for (const lang of ['es', 'en']) await renderCard(browser, scene, lang);
} finally {
  await browser.close();
}
