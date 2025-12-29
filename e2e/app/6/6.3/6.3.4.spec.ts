import { test, expect } from '@playwright/test';

interface E2EAudioState {
  playMusic: (name: string, loop: boolean) => Promise<void>;
  currentMusic: {
    isPlaying: boolean;
  } | null;
}

test('6.3.4 Automatic pausing and resuming of music when the game is paused or resumed', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');

  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('AUDIO_MANAGER') !== undefined,
    { timeout: 5000 },
  );

  // Navigate to Game
  await page.waitForSelector('text=New Game', { timeout: 10000 });
  await page.click('text=New Game');
  await page.waitForSelector('[data-testid="game-screen"]');

  // Start music
  await page.evaluate(async () => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    await audio.playMusic('bgm_gameplay', true);
  });

  // Ensure game has focus and is running
  await page.waitForTimeout(500);

  // Pause Game using UI (Escape key)
  await page.keyboard.press('Escape');

  // Wait for pause menu to confirm pause state
  await page.waitForSelector('[data-testid="pause-menu"]');

  // Verify Music Paused
  let isPlaying = await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    return audio.currentMusic?.isPlaying;
  });
  expect(isPlaying).toBe(false);

  // Resume Game using UI (Resume button)
  await page.click('text=Resume');

  // Verify Music Resumed
  isPlaying = await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    return audio.currentMusic?.isPlaying;
  });
  expect(isPlaying).toBe(true);
});
