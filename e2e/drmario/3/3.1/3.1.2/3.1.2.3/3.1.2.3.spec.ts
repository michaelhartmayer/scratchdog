import { test, expect } from '@playwright/test';

test('3.1.2.3 Rotation triggers the sound', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  // Wait for game to be ready
  await page.waitForFunction(
    () => window.getE2EState('DRMARIO_STATE'),
  );

  // Rotate pill (X = CW)
  await page.keyboard.press('x');

  // Check audio manager for 'rotation' sound
  await expect
    .poll(async () => {
      return await page.evaluate(() => {
        const win = window as unknown as {
          getE2EState: (key: string) => { activeSounds: string[] } | undefined;
        };
        const am = win.getE2EState('AUDIO_MANAGER');
        return am?.activeSounds ?? [];
      });
    })
    .toContain('rotation');
});
