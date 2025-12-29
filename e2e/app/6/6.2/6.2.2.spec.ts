import { test, expect } from '@playwright/test';

interface E2EAudioState {
  playSFX: (name: string) => void;
  getActiveInstances: (name: string) => number;
}

test('6.2.2 Support for many instances of the same sound at once', async ({
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

  // Trigger same sound multiple times
  await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    audio.playSFX('rapid_fire');
    audio.playSFX('rapid_fire');
    audio.playSFX('rapid_fire');
  });

  // Verify multiple instances are active
  const instanceCount = await page.evaluate(() => {
    return (
      window.getE2EState('AUDIO_MANAGER') as E2EAudioState
    ).getActiveInstances('rapid_fire');
  });

  expect(instanceCount).toBeGreaterThanOrEqual(3);
});
