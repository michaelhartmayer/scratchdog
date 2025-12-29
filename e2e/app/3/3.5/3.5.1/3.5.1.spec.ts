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

test('3.5.1 Plays the game music: /audio/falling-falling-falling.mp3', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body'); // skip splash
  await page.click('text=New Game');

  // Wait for game screen
  await expect(page.getByTestId('game-screen')).toBeVisible();

  // Check audio state exposed by AudioManager
  await expect
    .poll(async () => {
      return await page.evaluate(() => {
        const win = window as unknown as {
          getE2EState: (
            k: string,
          ) =>
            | { currentMusic: { name: string; isPlaying: boolean } | null }
            | undefined;
        };
        const manager = win.getE2EState('AUDIO_MANAGER');
        return manager?.currentMusic;
      });
    })
    .toMatchObject({
      name: 'falling-falling-falling',
      isPlaying: true,
    });
});
