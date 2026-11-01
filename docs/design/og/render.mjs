import { chromium } from 'playwright';
import sharp from 'sharp';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = resolve(here, '../../../public/images');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const lang of ['es', 'en']) {
    await page.goto(`${pathToFileURL(resolve(here, 'og.html')).href}?lang=${lang}`);
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ type: 'png' });
    const file = resolve(out, `og-${lang}.jpg`);
    const info = await sharp(png).jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(file);
    console.log(file, info.width, info.height, Math.round(info.size / 1024) + ' KB');
  }
} finally {
  await browser.close();
}
