import { expect, type Page } from '@playwright/test';

export const BOOT_TIMEOUT_MS = 25_000;

export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(`uncaught: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

export async function waitForStage(page: Page): Promise<void> {
  await expect(page.locator('html')).toHaveClass(/\bis-3d\b/, { timeout: BOOT_TIMEOUT_MS });
  await expect(page.locator('.boot')).toHaveAttribute('data-phase', 'done', { timeout: BOOT_TIMEOUT_MS });
}
