import { test, expect } from '@playwright/test';

test('4.5 Any key or mouse click will return to the main menu', async ({
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
  await expect(page.getByTestId('game-over-screen')).toBeVisible();
  await page.click('body'); // Click interrupt
  await expect(page.getByTestId('main-menu')).toBeVisible();
});
