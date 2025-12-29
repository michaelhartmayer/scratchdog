import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.7.4 State: The game status remains in a specialized WIN_ANIMATION state until the sequence completes.
/** @mustTestDrMarioGamestate */
test('3.7.4 Game stays in WIN_ANIMATION until complete', async ({ page }) => {
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
  // NO EXTRA VIRUS - we want WIN_ANIMATION to trigger

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  await page.keyboard.press(' ');

  // Wait specifically for WIN_ANIMATION
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status ===
      'WIN_ANIMATION',
    { timeout: 5000 },
  );

  let state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.status).toBe('WIN_ANIMATION');

  // Continues to be WIN_ANIMATION while sweep is active
  await page.waitForTimeout(500);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // At 500ms since WIN_ANIMATION started, it should still be running
  expect(state.status).toBe('WIN_ANIMATION');

  // Finally transitions to VICTORY
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'VICTORY',
    { timeout: 5000 },
  );
});
