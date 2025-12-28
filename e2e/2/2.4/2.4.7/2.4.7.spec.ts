import { test, expect } from '@playwright/test';
test('2.4.7 Has a footer', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.locator('.modal-footer')).toBeVisible();
});
