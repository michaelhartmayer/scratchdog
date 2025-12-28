import { test, expect } from '@playwright/test';
test('4.4 After the fade out, return to the main menu', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.getByTestId('trigger-game-over').click();
  // Wait for full cycle (approx 8s in my implementation)
  // t4 = 8000ms
  await expect(page.getByTestId('main-menu')).toBeVisible({ timeout: 10000 });
});
