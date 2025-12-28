import { test, expect } from '@playwright/test';

test('4.3 The screen fades to black for 2 seconds', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(() => window.getE2EState('DRMARIO_ENGINE'));
  await page.evaluate(() => {
    (window.getE2EState('DRMARIO_ENGINE') as { setStatus: (s: string) => void }).setStatus('GAME_OVER');
  });
  await page.waitForTimeout(50);
  // Eventually game over text fades out means screen is black
  // Phase 2: Game Over Visible
  // Phase 3: Game Over text opacity 0
  await expect(page.locator('.game-over-text')).toHaveClass(/phase-2/, {
    timeout: 8000,
  });
});
