import { test, expect } from '@playwright/test';

test('6.5.1 Errors are detected and logged so they can be picked up in e2e testing', async ({
  page,
}) => {
  // 1. Monitor console for errors
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 2. Go to the app
  await page.goto('/');
  await page.click('body'); // skip splash

  // 3. Inject a failure into AudioManager to simulate a crash (since we can't easily force pixi-sound to fail deterministically from outside)
  // We will try to call playMusic with a file that definitely doesn't exist, which SHOULD trigger an error if we aren't swallowing it.
  // OR we can try to corrupt the state if possible.

  // Strategy: Try to play a missing file.
  // If AudioManager swallows the error, consoleErrors will be empty.
  // If AudioManager logs it, consoleErrors will have content.

  await page.evaluate(async () => {
    const win = window as unknown as {
      getE2EState: (
        k: string,
      ) => { playMusic: (name: string) => Promise<void> } | undefined;
    };
    const audioManager = win.getE2EState('AUDIO_MANAGER');
    if (audioManager) {
      // We know this file doesn't exist.
      // Current implementation: catches error, ignores it.
      // Desired implementation: logs error or throws.
      await audioManager.playMusic('non-existent-track.mp3');
    }
  });

  // 4. Assert that we caught an error
  // This will FAIL currently because AudioManager swallows the error.
  expect(consoleErrors.length).toBeGreaterThan(0);
  expect(consoleErrors[0]).toContain('not found');
});
