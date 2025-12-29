import { test, expect } from '@playwright/test';

test('3.5.2 Landing triggers the sound', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  await page.waitForFunction(() => window.getE2EState('DRMARIO_STATE'));

  // Hard drop pill to force landing immediately
  await page.keyboard.press('ArrowUp');

  // Check audio manager for 'thud' sound
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
    .toContain('thud');
});
