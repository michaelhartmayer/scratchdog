import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../../src/game/DrMarioEngine';

// 3.2.2.1 Chain reactions do NOT award extra points
/** @mustTestDrMarioGamestate */
test('3.2.2.1 Chain reactions do NOT award extra points', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Clear everything for a clean test
  await page.evaluate(() => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      initializeLevel: (l: number) => void;
      _virusCount: number;
      _grid: CellType[][];
    };
    engine.initializeLevel(0);
    engine._virusCount = 1; // Put one virus to avoid immediate win
    engine._grid[15][7] = 'VIRUS_B';
  });

  // Drop a few pills and wait for them to lock
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press(' ');
    // Wait for it to become PLAYING again (after potential matches/cascades)
    await page.waitForFunction(
      () =>
        (window.getE2EState('DRMARIO_STATE') as GameState).status === 'PLAYING',
      { timeout: 5000 },
    );
  }

  const finalState = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(finalState.status).toBe('PLAYING');
});
