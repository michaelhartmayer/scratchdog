import { test, expect } from '@playwright/test';

interface E2EAudioState {
  preload: (assets: string[]) => Promise<void>; // Assuming async
  isLoaded: (name: string) => boolean;
}

test('6.4.1 Preloading of audio assets to avoid playback delays', async ({
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

  const assets = ['sfx_explode', 'bgm_level1'];

  // Verify not loaded initially (hypothetically, if we managed this)
  // But let's verify calling preload works as expected in state
  await page.evaluate(async (assetList) => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    await audio.preload(assetList);
  }, assets);

  // Verify all marked as loaded
  const allLoaded = await page.evaluate((assetList) => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    return assetList.every((name) => audio.isLoaded(name));
  }, assets);

  expect(allLoaded).toBe(true);
});
