import { expect, test } from '@playwright/test';
import { collectErrors, waitForStage } from './support';

test('the 3D office boots on the home page', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('./', { waitUntil: 'load' });
  await waitForStage(page);
  await expect(page.locator('[data-stage-canvas]')).toBeVisible();
  expect(errors).toEqual([]);
});
