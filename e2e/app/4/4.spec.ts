import { test, expect } from '@playwright/test';

test('4 Game Over Screen', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  // Debug trigger
  // Trigger Game Over via engine helper
  await page.waitForFunction(() => window.getE2EState('DRMARIO_ENGINE'));
  await page.evaluate(() => {
    (
      window.getE2EState('DRMARIO_ENGINE') as { setStatus: (s: string) => void }
    ).setStatus('GAME_OVER');
  });
  // Wait for the game loop to pick up the state change (1 frame ~16ms, wait 50ms)
  await page.waitForTimeout(50);
  await expect(page.getByTestId('game-over-screen')).toBeVisible();
});
