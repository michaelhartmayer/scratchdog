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

test('3.5.2 Music fades in over 1 second when the game starts', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body'); // skip splash
  await page.click('text=New Game');

  // Wait for game screen
  await expect(page.getByTestId('game-screen')).toBeVisible();

  // Volume should be low initially and grow
  const vol1 = await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (
        k: string,
      ) => { currentMusic: { volume: number } | null } | undefined;
    };
    return win.getE2EState('AUDIO_MANAGER')?.currentMusic?.volume ?? 0;
  });

  // Wait a bit
  await page.waitForTimeout(500);

  const vol2 = await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (
        k: string,
      ) => { currentMusic: { volume: number } | null } | undefined;
    };
    return win.getE2EState('AUDIO_MANAGER')?.currentMusic?.volume ?? 0;
  });

  expect(vol2).toBeGreaterThan(vol1);

  // Eventually reached target (approx)
  await expect
    .poll(
      async () => {
        return page.evaluate(() => {
          const win = window as unknown as {
            getE2EState: (
              k: string,
            ) => { currentMusic: { volume: number } | null } | undefined;
          };
          return win.getE2EState('AUDIO_MANAGER')?.currentMusic?.volume ?? 0;
        });
      },
      { timeout: 10000 },
    )
    .toBeGreaterThan(0.2); // Default is 0.5 * 0.5 = 0.25
});
