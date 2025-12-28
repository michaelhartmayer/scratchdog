import { test, expect } from '@playwright/test';
test('2.4.6.1.3 Has a checkbox for "Sound Effects"', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.getByLabel('Sound Effects')).toBeVisible();
});
