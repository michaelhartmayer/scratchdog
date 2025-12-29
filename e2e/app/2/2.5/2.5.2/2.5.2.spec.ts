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

test('2.5.2 Music fades in over 1 second', async ({ page }) => {
  await page.goto('/');
  await page.click('body'); // skip splash

  // Wait for main menu to be visible
  await expect(page.getByTestId('main-menu')).toBeVisible();

  // Wait for audio to start loading and playing
  await expect
    .poll(
      async () => {
        return await page.evaluate(() => {
          const win = window as unknown as {
            getE2EState: (
              k: string,
            ) => { currentMusic: { volume: number } | null } | undefined;
          };
          const state = win.getE2EState('AUDIO_MANAGER');
          return state?.currentMusic?.volume;
        });
      },
      { timeout: 10000 },
    )
    .toBeDefined();

  // Get initial volume immediately (should be near 0 if fading in)
  const initialVolume = await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (
        k: string,
      ) => { currentMusic: { volume: number } | null } | undefined;
    };
    const state = win.getE2EState('AUDIO_MANAGER');
    return state?.currentMusic?.volume ?? -1;
  });

  // It might not be exactly 0 due to execution time, but should be low
  expect(initialVolume).toBeGreaterThanOrEqual(0);
  expect(initialVolume).toBeLessThan(0.3); // Assumption: hasn't ramped up much yet

  // Wait ~500ms
  await page.waitForTimeout(500);

  const midVolume = await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (
        k: string,
      ) => { currentMusic: { volume: number } | null } | undefined;
    };
    const state = win.getE2EState('AUDIO_MANAGER');
    return state?.currentMusic?.volume ?? -1;
  });

  expect(midVolume).toBeGreaterThan(initialVolume);

  // Wait rest of the second + buffer
  await page.waitForTimeout(700);

  const finalVolume = await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (
        k: string,
      ) => { currentMusic: { volume: number } | null } | undefined;
    };
    const state = win.getE2EState('AUDIO_MANAGER');
    return state?.currentMusic?.volume ?? -1;
  });

  // Should be at target volume (master * music volume, defaults 0.5 * 0.5 = 0.25)
  // Spec doesn't say what the target volume IS, just that it fades IN.
  // Assuming default volumes:
  expect(finalVolume).toBeGreaterThanOrEqual(midVolume);
  expect(finalVolume).toBe(0.25);
});
