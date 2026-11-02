import { expect, test } from '@playwright/test';
import { collectErrors, waitForStage } from './support';

test('the 360° explore mode opens, locks the story scroll and closes with Escape', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('./?chapter=hero', { waitUntil: 'load' });
  await waitForStage(page);
  const toggle = page.locator('[data-explore-toggle]');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-exploring', '');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-explore-hint]')).toBeVisible();
  const scrollBefore = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 800);
  await page.keyboard.press('ArrowRight');
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveAttribute('data-exploring', '');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect(errors).toEqual([]);
});
