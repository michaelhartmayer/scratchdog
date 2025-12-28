import { test, expect } from '@playwright/test';

test('4.2 The screen displays the words "Game Over" for 2 seconds', async ({
  page,
}) => {
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
  // Phase 1: Wait 2s for text
  await expect(page.getByText('Game Over')).toBeVisible({ timeout: 5000 });
});
