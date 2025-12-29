import { test, expect } from '@playwright/test';

interface E2EAudioState {
  playMusic: (name: string, loop: boolean) => Promise<void>;
  currentMusic: {
    name: string;
    loop: boolean;
    isPlaying: boolean;
  } | null;
}

test('6.3.1 Background music playback with looping support', async ({
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

  // Start music with looping
  await page.evaluate(async () => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    await audio.playMusic('bgm_chill', true);
  });

  // Verify internal state reflects looping
  const musicState = await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    return audio.currentMusic;
  });

  expect(musicState).not.toBeNull();
  expect(musicState?.name).toBe('bgm_chill');
  expect(musicState?.loop).toBe(true);
  expect(musicState?.isPlaying).toBe(true);
});
