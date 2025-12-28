import { test, expect } from '@playwright/test';
test('2.4.6.1.1 Has a checkbox for "Mute"', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.getByLabel('Mute')).toBeVisible();
});
