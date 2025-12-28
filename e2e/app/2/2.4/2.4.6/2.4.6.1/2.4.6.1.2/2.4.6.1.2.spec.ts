import { test, expect } from '@playwright/test';
test('2.4.6.1.2 Has a checkbox for "Music"', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.getByLabel('Music')).toBeVisible();
});
