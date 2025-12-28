import { test, expect } from '@playwright/test';
test('3.2 The HUD is displayed', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await expect(page.locator('.hud')).toBeVisible();
});
