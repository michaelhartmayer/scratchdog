import { test, expect } from '@playwright/test';
test('2.4.5 Has a title bar', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.locator('.modal-title')).toBeVisible();
});
