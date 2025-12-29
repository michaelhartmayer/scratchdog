import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.7.3 Duration: Total sweep time is 1.6 seconds (16 rows * 100ms), with a final 200ms pause for the bottom row's cleanup.
/** @mustTestDrMarioGamestate */
test('3.7.3 Victory Animation duration', async ({ page }) => {
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

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  await page.keyboard.press(' ');
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status ===
      'WIN_ANIMATION',
    { timeout: 2000 },
  );

  const startTime = Date.now();
  await page.waitForFunction(
    () =>
      (window.getE2EState('DRMARIO_STATE') as GameState).status === 'VICTORY',
    { timeout: 5000 },
  );
  const endTime = Date.now();

  const duration = endTime - startTime;
  // 1.6s sweep + 0.2s cleanup = 1.8s
  expect(duration).toBeGreaterThan(1600);
  expect(duration).toBeLessThan(2500);
});
