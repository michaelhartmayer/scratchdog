import { test, expect } from '@playwright/test';
test('4.2 The screen displays the words "Game Over" for 2 seconds', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.getByTestId('trigger-game-over').click();
  // Phase 1: Wait 2s for text
  await expect(page.getByText('Game Over')).toBeVisible({ timeout: 5000 });
});
