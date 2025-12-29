import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.2.1.3 Simultaneous Matches: Multiple independent matches (e.g., two parallel rows) occurring in the same tick are all cleared simultaneously.

/** @mustTestDrMarioGamestate */
test('3.2.1.3 Simultaneous independent matches', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Setup: Two independent horizontal matches
  // Row 15: Red viruses (0-3)
  // Row 14: Yellow viruses (4-7)
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = 'VIRUS_R';
  grid[15][1] = 'VIRUS_R';
  grid[15][2] = 'VIRUS_R';
  grid[15][3] = 'VIRUS_R';

  grid[14][4] = 'VIRUS_Y';
  grid[14][5] = 'VIRUS_Y';
  grid[14][6] = 'VIRUS_Y';
  grid[14][7] = 'VIRUS_Y';

  grid[10][0] = 'VIRUS_B'; // Prevent VICTORY

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  // Trigger match
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press(' ');

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

  // Both matches should be cleared
  expect(state.grid[15][0]).toBe('EMPTY');
  expect(state.grid[15][1]).toBe('EMPTY');
  expect(state.grid[15][2]).toBe('EMPTY');
  expect(state.grid[15][3]).toBe('EMPTY');

  expect(state.grid[14][4]).toBe('EMPTY');
  expect(state.grid[14][5]).toBe('EMPTY');
  expect(state.grid[14][6]).toBe('EMPTY');
  expect(state.grid[14][7]).toBe('EMPTY');
});
