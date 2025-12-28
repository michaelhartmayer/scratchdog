import { test, expect } from '@playwright/test';
test('2.4.6 Has a content area', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.locator('.modal-body')).toBeVisible();
});
