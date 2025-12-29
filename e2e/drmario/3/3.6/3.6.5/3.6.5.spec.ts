import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.6.5 Gravity is applied to unsupported segments after 250ms/row
/** @mustTestDrMarioGamestate */
test('3.6.5 Cells fall one row after flash completes', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  // Match 4 viruses at bottom
  grid[15][0] = 'VIRUS_R';
  grid[15][1] = 'VIRUS_R';
  grid[15][2] = 'VIRUS_R';
  grid[15][3] = 'VIRUS_R';
  grid[10][7] = 'VIRUS_B'; // Prevent VICTORY

  // Floating pill segment at row 5
  // Floating pill segment at row 5
  grid[5][0] = 'PILL_B';

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  await page.keyboard.press(' '); // Match

  // Wait for FLASHING
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'FLASHING',
    { timeout: 5000 },
  );

  // Wait for CASCADING
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'CASCADING',
    { timeout: 5000 },
  );

  // Wait until it transitions back to PLAYING (gravity done)
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'PLAYING',
    { timeout: 5000 },
  );

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Pill should have fallen to row 15 (it was at row 5, matched viruses are now EMPTY)
  expect(state.grid[15][0]).toBe('PILL_B');
});
