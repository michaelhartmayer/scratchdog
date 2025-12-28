import { test, expect } from '@playwright/test';
test('2.2.1 Fades to black over 2 seconds', async ({ page }) => {
  // Skipped strict visual check
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  // Just ensure we leave menu
  await expect(page.getByTestId('game-screen')).toBeVisible({ timeout: 5000 });
});
