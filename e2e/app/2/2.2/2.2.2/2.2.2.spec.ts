import { test, expect } from '@playwright/test';
test('2.2.2 Then fades to the Game Screen over 2 seconds', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await expect(page.getByTestId('game-screen')).toBeVisible();
});
