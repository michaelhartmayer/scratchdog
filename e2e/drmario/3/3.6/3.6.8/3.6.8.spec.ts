import { test, expect } from '@playwright/test';
import type { DrMarioEngine } from '../../../../../src/game/DrMarioEngine';

// Define a test interface that exposes private properties we need to mock
interface TestDrMarioEngine {
  _activePill: {
    x: number;
    y: number;
    color1: 'R' | 'Y' | 'B';
    color2: 'R' | 'Y' | 'B';
    orientation: 'HORIZONTAL' | 'VERTICAL';
  };
  _isLocking: boolean;
} // Do not extend DrMarioEngine to avoid private property conflict

test('3.6.8 Pop sound plays on match clear', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  await page.waitForFunction(() => window.getE2EState('DRMARIO_STATE'));

  // Manually setup a board where a match will happen immediately upon pill drop
  await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (key: string) => DrMarioEngine | undefined;
    };
    const engine = win.getE2EState('DRMARIO_ENGINE');
    if (!engine) return;

    // Set 3 red viruses in a vertical column at x=0, y=13,14,15 (bottom)
    const grid = engine.state.grid;
    // Clear grid first to be safe
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 8; x++) grid[y][x] = 'EMPTY';

    grid[13][0] = 'VIRUS_R';
    grid[14][0] = 'VIRUS_R';
    grid[15][0] = 'VIRUS_R';

    engine.setGrid(grid);
  });

  // Now we need to drop a Red pill on top of them.
  await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (key: string) => TestDrMarioEngine | undefined;
    };
    const engine = win.getE2EState('DRMARIO_ENGINE');
    if (!engine) return;

    // Use test interface to access private properties safely in test context
    engine._activePill = {
      x: 0,
      y: 12,
      color1: 'R',
      color2: 'R',
      orientation: 'VERTICAL',
    };
    engine._isLocking = false;
  });

  // Drop it (move down or hard drop)
  await page.keyboard.press('ArrowDown');

  // Re-adjust placement
  await page.evaluate(() => {
    const win = window as unknown as {
      getE2EState: (key: string) => TestDrMarioEngine | undefined;
    };
    const engine = win.getE2EState('DRMARIO_ENGINE');
    if (!engine) return;

    engine._activePill = {
      x: 0,
      y: 11, // Top at 11, Bottom at 12
      color1: 'R',
      color2: 'R',
      orientation: 'VERTICAL',
    };
  });

  // Hard drop to lock it
  await page.keyboard.press('ArrowUp');

  // Verify 'pop' sound
  // Note: Pop happens after FLASHING state (267ms).
  // So we need to wait a bit.

  await expect
    .poll(
      async () => {
        return await page.evaluate(() => {
          const win = window as unknown as {
            getE2EState: (
              key: string,
            ) => { activeSounds: string[] } | undefined;
          };
          const am = win.getE2EState('AUDIO_MANAGER');
          return am?.activeSounds ?? [];
        });
      },
      { timeout: 5000 },
    )
    .toContain('pop');
});
