import { test, expect } from '@playwright/test';
test('3.4.2 The pause menu is displayed', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.keyboard.press('Escape');
  await expect(page.locator('.pause-menu-container')).toBeVisible();
});
