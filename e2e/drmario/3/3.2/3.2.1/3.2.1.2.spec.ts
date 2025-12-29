import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.2.1.2 Multidirectional Matches: If a segment participates in both a horizontal and a vertical match simultaneously (e.g., an L-shape or T-shape clear), all participating segments in both directions are cleared.

/** @mustTestDrMarioGamestate */
test('3.2.1.2 Multidirectional match (L-Shape)', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Setup: L-shape match at (15,0)
  // Horizontal: (15,0), (15,1), (15,2), (15,3) - all Red
  // Vertical: (15,0), (14,0), (13,0), (12,0) - all Red
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = 'VIRUS_R';
  grid[15][1] = 'VIRUS_R';
  grid[15][2] = 'VIRUS_R';
  grid[15][3] = 'VIRUS_R';

  grid[14][0] = 'VIRUS_R';
  grid[13][0] = 'VIRUS_R';
  grid[12][0] = 'VIRUS_R';

  grid[10][7] = 'VIRUS_B'; // Prevent VICTORY

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

  // Horizontal segments should be cleared
  expect(state.grid[15][0]).toBe('EMPTY');
  expect(state.grid[15][1]).toBe('EMPTY');
  expect(state.grid[15][2]).toBe('EMPTY');
  expect(state.grid[15][3]).toBe('EMPTY');

  // Vertical segments should be cleared
  expect(state.grid[14][0]).toBe('EMPTY');
  expect(state.grid[13][0]).toBe('EMPTY');
  expect(state.grid[12][0]).toBe('EMPTY');
});
