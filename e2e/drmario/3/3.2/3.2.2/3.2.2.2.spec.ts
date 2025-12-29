import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.2.2.2 Scoring: Chain reactions do NOT award bonus points or multipliers beyond the base score for the viruses cleared in that step.

/** @mustTestDrMarioGamestate */
test('3.2.2.2 Chain reaction scoring (no bonus)', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Setup: Vertical match at Col 0 (Rows 15-12).
  // Column 1 has a gap at Row 12. Match 2 only forms when Row 11 Col 1 falls to Row 12.
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );

  // Col 0: Match 1 waiting (3 viruses + 1 pill segment)
  grid[15][0] = 'VIRUS_R';
  grid[14][0] = 'VIRUS_R';
  grid[13][0] = 'VIRUS_R';
  grid[12][0] = 'VIRUS_R';
  grid[11][0] = 'PILL_R_LEFT';

  // Col 1: Match 2 waiting for fall
  grid[15][1] = 'VIRUS_Y';
  grid[14][1] = 'VIRUS_Y';
  grid[13][1] = 'VIRUS_Y';
  grid[12][1] = 'EMPTY'; // GAP! Match 2 is not complete.
  grid[11][1] = 'PILL_Y_RIGHT'; // Supported by PILL_R_LEFT at (12,0)? NO.
  // Wait, if 11,1 is supported by 11,0.
  // Actually, PILL_Y_RIGHT at 11,1 is supported by PILL_R_LEFT at 11,0.
  // Match 1: 15,14,13,12, 11 at Col 0. (4 viruses + 1 pill). Score: 3200.
  // Match 2: 15,14,13 at Col 1 + 11 falls to 12. (3 viruses + 1 pill). Score: 1200.
  // Total: 4400.

  grid[10][7] = 'VIRUS_B'; // Prevent WIN

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      initializeLevel: (l: number) => void;
      _speed: string;
      setGrid: (g: CellType[][]) => void;
      _score: number;
      _virusCount: number;
    };
    engine.initializeLevel(0);
    engine._speed = 'LOW';
    engine.setGrid(g);
    engine._score = 0;
    engine._virusCount = 8;
  }, grid);

  // Trigger Match 1
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press(' ');

  // Wait for score to change
  await page.waitForFunction(
    () => (window.getE2EState('DRMARIO_STATE') as GameState).score > 0,
    { timeout: 5000 },
  );

  // Wait for it to settle back to PLAYING
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'PLAYING',
    { timeout: 15000 },
  );

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Match 1: 4 viruses -> 3200
  // Match 2: 3 viruses -> 1200
  // Total: 4400
  expect(state.score).toBe(4400);
});
