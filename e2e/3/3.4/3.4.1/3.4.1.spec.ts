import { test, expect } from '@playwright/test';
test('3.4.1 A light black scrim quickly fades in', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.keyboard.press('Escape');
  await expect(page.locator('.pause-menu-scrim')).toBeVisible();
});
