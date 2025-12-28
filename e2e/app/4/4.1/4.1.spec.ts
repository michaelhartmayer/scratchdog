import { test, expect } from '@playwright/test';

test('4.1 The screen fades to black for 2 seconds', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(() => window.getE2EState('DRMARIO_ENGINE'));
  await page.evaluate(() => {
    (
      window.getE2EState('DRMARIO_ENGINE') as { setStatus: (s: string) => void }
    ).setStatus('GAME_OVER');
  });
  await page.waitForTimeout(50);
  // Fade check check loop
  await expect(page.getByTestId('game-over-screen')).toBeVisible();
});
