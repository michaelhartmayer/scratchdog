import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.2.3.2 When an elimination match (4+ in a row) is detected, only the specific segments (pill halves or viruses) directly participating in that match are cleared.

/** @mustTestDrMarioGamestate */
test('3.2.3.2 Only participating segments are cleared (Horizontal)', async ({
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

  // Setup: Horizontal match clears LEFT half of a pill. RIGHT half should remain.
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = 'VIRUS_R';
  grid[15][1] = 'VIRUS_R';
  grid[15][2] = 'VIRUS_R';
  grid[15][3] = 'PILL_R_LEFT';
  grid[15][4] = 'PILL_Y_RIGHT'; // Different color, same pill. Match is 0,1,2,3. 4 should stay.
  grid[10][7] = 'VIRUS_B'; // Prevent VICTORY

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  // Move active pill out of the way to avoid interference at row 0, center
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press(' '); // Match

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

  // Match: (15,0), (15,1), (15,2), (15,3)
  expect(state.grid[15][0]).toBe('EMPTY');
  expect(state.grid[15][1]).toBe('EMPTY');
  expect(state.grid[15][2]).toBe('EMPTY');
  expect(state.grid[15][3]).toBe('EMPTY');

  // (15,4) was PILL_Y_RIGHT. It should now be PILL_Y (independent) and still at (15,4)
  expect(state.grid[15][4]).toBe('PILL_Y');
});

/** @mustTestDrMarioGamestate */
test('3.2.3.2 Only participating segments are cleared (Vertical)', async ({
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

  // Setup: Vertical match clears BOTTOM half of a pill. TOP half should remain.
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = 'VIRUS_R';
  grid[14][0] = 'VIRUS_R';
  grid[13][0] = 'VIRUS_R';
  grid[12][0] = 'PILL_R_BOTTOM';
  grid[11][0] = 'PILL_Y_TOP';
  grid[10][7] = 'VIRUS_B';

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press(' '); // Match

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

  // Match: (15,0), (14,0), (13,0), (12,0)
  // (11,0) was PILL_Y_TOP. It falls to (15,0).
  expect(state.grid[15][0]).toBe('PILL_Y');
  expect(state.grid[14][0]).toBe('EMPTY');
  expect(state.grid[13][0]).toBe('EMPTY');
  expect(state.grid[12][0]).toBe('EMPTY');
  expect(state.grid[11][0]).toBe('EMPTY');
});
