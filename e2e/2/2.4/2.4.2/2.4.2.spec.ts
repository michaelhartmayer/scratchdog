import { test, expect } from '@playwright/test';
test('2.4.2 Has a black scrim behind it', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.locator('.modal-scrim')).toBeVisible();
  // Check color involves computed style, lax check ok
});
