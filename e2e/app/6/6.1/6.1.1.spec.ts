import { test, expect } from '@playwright/test';

interface E2EAudioState {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  setMasterVolume: (v: number) => void;
  setMusicVolume: (v: number) => void;
  setSFXVolume: (v: number) => void;
}

test('6.1.1 Independent volume sliders for Master, Music, and SFX', async ({
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

  // Setup initial volumes
  await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    audio.setMasterVolume(0.5);
    audio.setMusicVolume(0.5);
    audio.setSFXVolume(0.5);
  });

  // Change master volume and verify others remain unchanged
  await page.evaluate(() => {
    (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).setMasterVolume(0.8);
  });

  let state = await page.evaluate(
    () => window.getE2EState('AUDIO_MANAGER') as E2EAudioState,
  );
  expect(state.masterVolume).toBe(0.8);
  expect(state.musicVolume).toBe(0.5);
  expect(state.sfxVolume).toBe(0.5);

  // Change music volume and verify others remain unchanged
  await page.evaluate(() => {
    (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).setMusicVolume(0.2);
  });

  state = await page.evaluate(
    () => window.getE2EState('AUDIO_MANAGER') as E2EAudioState,
  );
  expect(state.masterVolume).toBe(0.8);
  expect(state.musicVolume).toBe(0.2);
  expect(state.sfxVolume).toBe(0.5);
});
