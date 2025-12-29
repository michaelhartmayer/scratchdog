import { test, expect } from '@playwright/test';

interface E2EAudioState {
  playMusic: (name: string, loop: boolean) => Promise<void>;
  crossfadeTo: (name: string, duration: number) => Promise<void>;
  currentMusic: {
    name: string;
    isPlaying: boolean;
  } | null;
}

test('6.3.3 Seamless transitions between different music tracks (Crossfading)', async ({
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

  // Start Track A
  await page.evaluate(async () => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    await audio.playMusic('track_a', true);
  });

  // Crossfade to Track B
  await page.evaluate(async () => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    await audio.crossfadeTo('track_b', 500);
  });

  // Wait for crossfade duration + buffer
  await page.waitForTimeout(600);

  // Verify Track B is playing
  const currentMusic = await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    return audio.currentMusic;
  });

  expect(currentMusic?.name).toBe('track_b');
  expect(currentMusic?.isPlaying).toBe(true);
});
