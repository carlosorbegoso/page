import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/smoke',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  outputDir: 'test-results',
  use: {
    baseURL: 'http://localhost:4321/page/',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'off',
    launchOptions: { args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }]
});
