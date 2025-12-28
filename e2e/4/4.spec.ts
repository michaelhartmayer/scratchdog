import { test, expect } from '@playwright/test';
test('4 Game Over Screen', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  // Debug trigger
  await page.getByTestId('trigger-game-over').click();
  await expect(page.getByTestId('game-over-screen')).toBeVisible();
});
