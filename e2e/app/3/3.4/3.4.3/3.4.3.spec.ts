import { test, expect } from '@playwright/test';

test.beforeEach(({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      throw new Error(`Console Error: "${msg.text()}"`);
    }
  });
  page.on('pageerror', (err) => {
    throw new Error(`Uncaught Exception: "${err.message}"`);
  });
});

test('3.4.3 Plays pause sound: /audio/pause.mp3', async ({ page }) => {
  await page.goto('/');
  await page.click('body'); // skip splash
  await page.click('text=New Game');

  // Wait for game screen
  await expect(page.getByTestId('game-screen')).toBeVisible();

  // Pause the game
  await page.keyboard.press('Escape');

  // Check audio state exposed by AudioManager
  await expect
    .poll(async () => {
      const audioState = await page.evaluate(() => {
        const win = window as unknown as {
          getE2EState: (k: string) =>
            | {
                activeSounds: string[];
                isMusicPaused: boolean;
                isContextPaused: boolean;
              }
            | undefined;
        };
        return win.getE2EState('AUDIO_MANAGER');
      });

      // The sound must be active AND the context must NOT be paused (silenced)
      if (
        audioState?.activeSounds.includes('pause') &&
        !audioState.isContextPaused
      ) {
        return true;
      }
      return false;
    })
    .toBeTruthy();
});
