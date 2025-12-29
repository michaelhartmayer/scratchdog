import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.2.3.3 If only one segment of a capsule is cleared, the link between the two segments is broken. The remaining segment stays on the board as a single, independent unit.
/** @mustTestDrMarioGamestate */
test('3.2.3.3 Link breaks when one segment cleared', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Setup: Horizontal match clears bottom of vertical pill
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = 'VIRUS_R';
  grid[15][1] = 'VIRUS_R';
  grid[15][2] = 'VIRUS_R';
  grid[15][3] = 'PILL_R_BOTTOM'; // Matches with 0,1,2
  grid[14][3] = 'PILL_Y_TOP'; // Should stay and then fall
  grid[10][7] = 'VIRUS_B';

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  // Move active pill out of the way
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press(' '); // Match

  // Wait for FLASHING
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'FLASHING',
    { timeout: 5000 },
  );

  // After cascade completes (FLASHING -> CASCADING -> PLAYING):
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'PLAYING',
    { timeout: 5000 },
  );

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  expect(state.grid[15][3]).toBe('PILL_Y'); // Found its way to the bottom as independent unit!
  expect(state.grid[14][3]).toBe('EMPTY');
});
