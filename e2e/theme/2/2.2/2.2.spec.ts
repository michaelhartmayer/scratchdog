import { test, expect } from '@playwright/test';

test.describe('2.2 Glass & Transparency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('2.2.1 --glass-fill is defined', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--glass-fill')
        .trim(),
    );
    expect(value).toContain('rgba(255, 255, 255');
  });

  test('2.2.2 --glass-fill-hover is defined', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--glass-fill-hover')
        .trim(),
    );
    expect(value).toContain('rgba(255, 255, 255');
  });

  test('2.2.3 --glass-border is defined', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--glass-border')
        .trim(),
    );
    expect(value).toContain('rgba(255, 255, 255');
  });

  test('2.2.4 --glass-blur is 12px', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--glass-blur')
        .trim(),
    );
    expect(value).toBe('12px');
  });
});
