import { test, expect } from '@playwright/test';

interface E2EAudioState {
  setMasterVolume: (v: number) => void;
  masterVolume: number;
}

test('6.1.3 Real-time volume adjustments during playback', async ({ page }) => {
  await page.goto('/');
  await page.click('body');

  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('AUDIO_MANAGER') !== undefined,
    { timeout: 5000 },
  );

  // Set initial volume
  await page.evaluate(() => {
    (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).setMasterVolume(0.5);
  });

  // Verify
  let vol = await page.evaluate(
    () => (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).masterVolume,
  );
  expect(vol).toBe(0.5);

  // Adjust volume "real-time" (immediately checking reflection)
  await page.evaluate(() => {
    (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).setMasterVolume(0.9);
  });

  vol = await page.evaluate(
    () => (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).masterVolume,
  );
  expect(vol).toBe(0.9);
});
