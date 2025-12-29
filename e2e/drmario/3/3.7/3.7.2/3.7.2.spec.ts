import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.7.2 Mechanics: Sweep, Timing, Transformation, Trailing Cleanup, Overlap
/** @mustTestDrMarioGamestate */
test('3.7.2 Victory Animation mechanics (sweep and cleanup)', async ({
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

  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = 'VIRUS_R';
  grid[15][1] = 'VIRUS_R';
  grid[15][2] = 'VIRUS_R';
  grid[15][3] = 'VIRUS_R';
  grid[0][5] = 'PILL_B'; // Test pill at row 0
  grid[8][5] = 'PILL_Y'; // Test pill at row 8

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  await page.keyboard.press(' ');

  // Wait for WIN_ANIMATION specifically
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status ===
      'WIN_ANIMATION',
    { timeout: 5000 },
  );

  // Wait specifically for row 0 to be cleared (after sweep passes it)
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).grid[0][5] === 'EMPTY',
    { timeout: 5000 },
  );

  // Now wait specifically for row 8 to be processed (either EXPLODE or EMPTY)
  await page.waitForFunction(
    () => {
      const state = window.getE2EState('DRMARIO_STATE') as GameState;
      const cell = state.grid[8][5];
      return cell === 'EMPTY' || cell.startsWith('EXPLODE');
    },
    { timeout: 5000 },
  );

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.status).toBe('WIN_ANIMATION');
});
