import { test, expect } from '@playwright/test';

interface E2EAudioState {
  preload: (assets: string[]) => Promise<void>;
  unload: (assets: string[]) => void;
  isLoaded: (name: string) => boolean;
}

test('6.4.2 Proper disposal of audio instances to prevent memory leaks', async ({
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

  const asset = 'temp_sfx';

  // Load asset
  await page.evaluate(async (name) => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    await audio.preload([name]);
  }, asset);

  // Verify loaded
  let isLoaded = await page.evaluate((name) => {
    return (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).isLoaded(
      name,
    );
  }, asset);
  expect(isLoaded).toBe(true);

  // Unload/Dispose
  await page.evaluate((name) => {
    (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).unload([name]);
  }, asset);

  // Verify unloaded
  isLoaded = await page.evaluate((name) => {
    return (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).isLoaded(
      name,
    );
  }, asset);
  expect(isLoaded).toBe(false);
});
