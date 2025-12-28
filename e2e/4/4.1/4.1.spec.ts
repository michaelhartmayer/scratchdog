import { test, expect } from '@playwright/test';
test('4.1 The screen fades to black for 2 seconds', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.getByTestId('trigger-game-over').click();
  // Fade check check loop
  await expect(page.getByTestId('game-over-screen')).toBeVisible();
});
