import { expect, test } from '@playwright/test';
import { collectErrors, waitForStage } from './support';
import { overlappingPairs, readPlates } from './plates';

const CHAPTERS = ['hero', 'about', 'experience', 'company', 'products', 'contact', 'outro'];
const PRINTED_MAX_PX = 2;

test.use({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

for (const chapter of CHAPTERS) {
  test(`chapter ${chapter} shows one plate in portrait 390×740`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`./?chapter=${chapter}`, { waitUntil: 'load' });
    await waitForStage(page);
    await expect(page.locator('[data-plate][data-active]').first()).toBeAttached();
    await page.waitForTimeout(1_000);
    const plates = await readPlates(page);
    const shownActive = plates.filter(plate => plate.active && (plate.printed || plate.standIn || plate.visible));
    expect.soft(shownActive.map(plate => plate.chapter)).toEqual([chapter]);
    const oversizedPrinted = plates.filter(plate => plate.printed && (plate.width > PRINTED_MAX_PX || plate.height > PRINTED_MAX_PX));
    expect.soft(oversizedPrinted.map(plate => `${plate.id} ${plate.width}×${plate.height}`)).toEqual([]);
    expect.soft(overlappingPairs(plates)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
