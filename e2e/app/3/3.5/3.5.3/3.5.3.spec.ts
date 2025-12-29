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

test('3.5.3 Music fades out over 1 second when the game ends', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body'); // skip splash
  await page.click('text=New Game');

  // Wait for game screen
  await expect(page.getByTestId('game-screen')).toBeVisible();

  // Wait for fade in to finish mostly
  await page.waitForTimeout(1100);

  const startVol = await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (
        k: string,
      ) => { currentMusic: { volume: number } | null } | undefined;
    };
    return win.getE2EState('AUDIO_MANAGER')?.currentMusic?.volume ?? 0;
  });

  // Pause and click Main Menu
  await page.keyboard.press('Escape');
  await page.click('text=Main Menu');

  // Check volume decreasing
  await page.waitForTimeout(500);

  const midVol = await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (
        k: string,
      ) => { currentMusic: { volume: number } | null } | undefined;
    };
    return win.getE2EState('AUDIO_MANAGER')?.currentMusic?.volume ?? 1;
  });

  expect(midVol).toBeLessThan(startVol);

  // Eventually stopped (or switched back to intro)
  await expect
    .poll(
      async () => {
        const currentMusic = await page.evaluate(() => {
          const win = window as unknown as {
            getE2EState: (
              k: string,
            ) => { currentMusic: { name: string } | null } | undefined;
          };
          return win.getE2EState('AUDIO_MANAGER')?.currentMusic;
        });

        // Either music is gone, OR it's back to intro (meaning game music definitely stopped)
        return currentMusic?.name !== 'falling-falling-falling';
      },
      { timeout: 10000 },
    )
    .toBeTruthy();
});
