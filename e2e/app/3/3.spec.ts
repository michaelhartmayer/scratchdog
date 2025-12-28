import { test, expect } from '@playwright/test';
test('3 Game Screen', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await expect(page.getByTestId('game-screen')).toBeVisible();
});
