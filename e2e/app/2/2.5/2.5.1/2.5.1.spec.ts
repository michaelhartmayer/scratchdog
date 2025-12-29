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

test('2.5.1 Plays the main menu song, which is /audio/intro.mp3', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body'); // skip splash

  // Wait for main menu to be visible
  await expect(page.getByTestId('main-menu')).toBeVisible();

  // Check audio state exposed by AudioManager
  await expect
    .poll(async () => {
      const audioState = await page.evaluate(() => {
        const win = window as unknown as {
          getE2EState: (
            k: string,
          ) => { currentMusic: { name: string } | null } | undefined;
        };
        return win.getE2EState('AUDIO_MANAGER');
      });
      return audioState?.currentMusic?.name;
    })
    .toBe('intro');
});
