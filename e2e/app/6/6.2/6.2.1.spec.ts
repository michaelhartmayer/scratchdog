import { test, expect } from '@playwright/test';

interface E2EAudioState {
  playSFX: (name: string) => Promise<void>;
  activeSounds: string[]; // List of currently playing sound IDs or names
}

test('6.2.1 Ability to play multiple SFX simultaneously', async ({ page }) => {
  await page.goto('/');
  await page.click('body');

  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('AUDIO_MANAGER') !== undefined,
    { timeout: 5000 },
  );

  // Trigger multiple sounds quickly
  await page.evaluate(async () => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    // Assuming 'pop' is a valid sound name from previous context
    await audio.playSFX('pop');
    await audio.playSFX('pop');
    await audio.playSFX('active_chill'); // Just a hypothetical name or reuse pop
  });

  // Verify that multiple sounds are tracked as active
  const activeCount = await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    return audio.activeSounds.length;
  });

  expect(activeCount).toBeGreaterThan(1);
});
