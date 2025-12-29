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

test('2.6.2 Plays menu-switch.mp3 when a menu button is moused over', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body'); // skip splash

  // Wait for main menu to be visible
  await expect(page.getByTestId('main-menu')).toBeVisible();

  const button = page.getByRole('button', { name: /New Game/i });

  // Hover over the button
  await button.hover();

  // Check audio state exposed by AudioManager
  await expect
    .poll(async () => {
      const audioState = await page.evaluate(() => {
        const win = window as unknown as {
          getE2EState: (k: string) => { activeSounds: string[] } | undefined;
        };
        return win.getE2EState('AUDIO_MANAGER');
      });
      return audioState?.activeSounds;
    })
    .toContain('menu-switch');
});
