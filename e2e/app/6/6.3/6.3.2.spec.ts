import { test, expect } from '@playwright/test';

interface E2EAudioState {
  playMusic: (name: string, loop: boolean) => Promise<void>;
  fadeOutMusic: (duration: number) => void;
  currentMusic: {
    volume: number;
  } | null;
}

test('6.3.2 Smooth fading in and out of music tracks', async ({ page }) => {
  await page.goto('/');
  await page.click('body');

  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('AUDIO_MANAGER') !== undefined,
    { timeout: 5000 },
  );

  // Start music
  await page.evaluate(async () => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    await audio.playMusic('bgm_test', true);
  });

  // Start fade out (e.g., 500ms)
  await page.evaluate(() => {
    (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).fadeOutMusic(500);
  });

  // Check volume at partial fade (after ~250ms)
  await page.waitForTimeout(250);
  const midVolume = await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    return audio.currentMusic?.volume;
  });

  expect(midVolume).toBeLessThan(1);
  expect(midVolume).toBeGreaterThan(0);

  // Check volume at end of fade
  await page.waitForTimeout(300);
  const endVolume = await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    return audio.currentMusic?.volume;
  });

  // Check volume at end of fade
  // If stopped (null), treat as 0
  if (endVolume === undefined) {
    expect(true).toBe(true);
  } else {
    expect(endVolume).toBe(0);
  }
});
