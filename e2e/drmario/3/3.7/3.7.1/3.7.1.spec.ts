import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.7.1 Trigger: Initiated immediately after the final virus is cleared and all resulting cascades have completed.
/** @mustTestDrMarioGamestate */
test('3.7.1 Victory Animation trigger after final clear', async ({ page }) => {
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
  // 4 viruses in a row - this should be ALL viruses
  grid[15][0] = 'VIRUS_R';
  grid[15][1] = 'VIRUS_R';
  grid[15][2] = 'VIRUS_R';
  grid[15][3] = 'VIRUS_R';

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  // Trigger match
  await page.keyboard.press(' ');

  // Wait for FLASHING
  await page.waitForTimeout(100);
  let state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.status).toBe('FLASHING');

  // Wait for flash to end (267ms)
  await page.waitForTimeout(400);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Spec 3.7.1: Victory animation starts after final clear
  expect(state.status).toBe('WIN_ANIMATION');
});
