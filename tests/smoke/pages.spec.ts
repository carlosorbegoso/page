import { expect, test } from '@playwright/test';
import { collectErrors } from './support';

const PAGES = [
  { name: 'ES home', path: './', lang: 'es' },
  { name: 'EN home', path: 'en/', lang: 'en' },
  { name: 'ES reading', path: 'lectura/', lang: 'es' },
  { name: 'EN reading', path: 'en/reading/', lang: 'en' }
];

for (const { name, path, lang } of PAGES) {
  test(`${name} loads without errors`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(path, { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', new RegExp(`^${lang}`));
    await expect(page.locator('main')).toBeVisible();
    await page.waitForTimeout(1_500);
    expect(errors).toEqual([]);
  });
}

test('unknown routes get the 404 page', async ({ page }) => {
  const errors = collectErrors(page);
  const response = await page.goto('ruta-que-no-existe/', { waitUntil: 'load' });
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
  await expect(page.locator('main a[href$="/page/"]').first()).toBeVisible();
  expect(errors.filter(error => !error.includes('404'))).toEqual([]);
});
