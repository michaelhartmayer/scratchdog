import { test, expect } from '@playwright/test';

interface E2EAudioState {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  setMute: (muted: boolean) => void;
  setMasterVolume: (v: number) => void;
}

test('6.1.2 Global mute toggle preserves individual volume levels', async ({
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

  // Setup: Set specific volumes
  await page.evaluate(() => {
    const audio = window.getE2EState('AUDIO_MANAGER') as E2EAudioState;
    audio.setMasterVolume(0.7);
    audio.setMute(false);
  });

  // Verify initial state
  let state = await page.evaluate(
    () => window.getE2EState('AUDIO_MANAGER') as E2EAudioState,
  );
  expect(state.masterVolume).toBe(0.7);
  expect(state.isMuted).toBe(false);

  // Mute
  await page.evaluate(() => {
    (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).setMute(true);
  });

  state = await page.evaluate(
    () => window.getE2EState('AUDIO_MANAGER') as E2EAudioState,
  );
  expect(state.isMuted).toBe(true);
  // Volume property should ideally still reflect the "set" volume,
  // or effective volume should be 0. The spec says "preserves... when unmuted".
  // So we assume the internal volume state remains 0.7.
  expect(state.masterVolume).toBe(0.7);

  // Unmute
  await page.evaluate(() => {
    (window.getE2EState('AUDIO_MANAGER') as E2EAudioState).setMute(false);
  });

  state = await page.evaluate(
    () => window.getE2EState('AUDIO_MANAGER') as E2EAudioState,
  );
  expect(state.isMuted).toBe(false);
  expect(state.masterVolume).toBe(0.7);
});
