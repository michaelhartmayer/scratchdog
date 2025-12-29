import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.2.3.4 If both segments of a capsule are cleared (either by the same match or different matches simultaneously), the entire pill is effectively removed from the board.
/** @mustTestDrMarioGamestate */
test('3.2.3.4 Both segments cleared in simultaneous matches', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Setup: Horizontal match clears bottom, different Horizontal match clears top?
  // Or one vertical match clears both if they are the same color.
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = 'VIRUS_R';
  grid[15][1] = 'VIRUS_R';
  grid[15][2] = 'VIRUS_R';
  grid[15][3] = 'PILL_R_BOTTOM'; // Matches with 0,1,2 (Red)

  grid[14][0] = 'VIRUS_Y';
  grid[14][1] = 'VIRUS_Y';
  grid[14][2] = 'VIRUS_Y';
  grid[14][3] = 'PILL_Y_TOP'; // Matches with 0,1,2 (Yellow)

  grid[10][7] = 'VIRUS_B';

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  // Move active pill out of the way to avoid interference
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press(' '); // Trigger both matches

  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'FLASHING',
    { timeout: 5000 },
  );

  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'PLAYING',
    { timeout: 5000 },
  );

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  expect(state.grid[15][3]).toBe('EMPTY');
  expect(state.grid[14][3]).toBe('EMPTY');
});
