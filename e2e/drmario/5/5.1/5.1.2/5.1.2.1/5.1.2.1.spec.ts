import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../../src/game/DrMarioEngine';

// 5.1.2.1 Low Speed: 1 virus = 100 pts
/** @mustTestDrMarioGamestate */
test('5.1.2.1 LOW speed scoring (100pts/virus) - score at 0 initially', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');


  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Setup 1 virus (Yellow) and drop Yellow pill on it
  await page.evaluate(() => {
    interface TestEngine {
      setGrid(grid: string[][]): void;
      setSpeed(speed: string): void;
      _activePill: { x: number; y: number; color1: string; color2: string; orientation: string };
      _dropTimer: number;
    }
    const engine = window.getE2EState('DRMARIO_ENGINE') as TestEngine;
    const grid = Array.from({ length: 16 }, () =>
      Array.from({ length: 8 }, () => 'EMPTY'),
    );
    // Vertical match setup
    grid[15][0] = 'VIRUS_Y'; // 1 virus
    grid[14][0] = 'PILL_Y';
    grid[13][0] = 'PILL_Y';

    engine.setGrid(grid);
    engine.setSpeed('LOW');

    // Force active pill top center
    engine._activePill = { x: 3, y: 0, color1: 'Y', color2: 'Y', orientation: 'HORIZONTAL' };
    engine._dropTimer = 0;
  });

  // Wait for clear (we don't even need to drop the pill from top if we set the grid up to cascade?)
  // No, matching happens after lock. 
  // We set up a grid that is "stable" except we didn't lock the last piece.
  // But wait, setGrid just sets the array.
  // The engine checks matches when a pill locks.
  // So we MUST drop a pill to trigger the check.

  // Alternative setup:
  // (0,15) VIRUS_Y
  // (0,14) VIRUS_Y
  // (0,13) VIRUS_Y
  // Drop Y at (0,12) -> Match 4 vertical.
  // 3 viruses cleared. 
  // Spec 5.1.2.1 says "1 virus = 100 pts".
  // This likely means base value per virus.
  // If we clear 1 virus (and 3 pill segments), we get 100 pts?
  // Let's test clearing EXACTLY 1 virus.

  // Setup:
  // (0,15) VIRUS_Y
  // (0,14) PILL_Y
  // (0,13) PILL_Y
  // Drop Y at (0,12).
  // Total 4 matches. 1 is virus.
  // Viruses Cleared = 1.
  // Score = 100 * 1 * (2^0) = 100.

  await page.evaluate(() => {
    interface TestEngine {
      setGrid(grid: string[][]): void;
      setSpeed(speed: string): void;
      _activePill: { x: number; y: number; color1: string; color2: string; orientation: string };
      _dropTimer: number;
    }
    const engine = window.getE2EState('DRMARIO_ENGINE') as TestEngine;
    const grid = Array.from({ length: 16 }, () =>
      Array.from({ length: 8 }, () => 'EMPTY'),
    );
    grid[15][0] = 'VIRUS_Y';
    grid[14][0] = 'PILL_Y';
    grid[13][0] = 'PILL_Y';
    engine.setGrid(grid);
    // Already LOW by default or forced.
    engine.setSpeed('LOW');

    // Position active pill above col 0
    engine._activePill = { x: 3, y: 0, color1: 'Y', color2: 'Y', orientation: 'HORIZONTAL' };
    engine._dropTimer = 0;
  });

  // Move left 3 times
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(50);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(50);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(50);
  // Hard Drop
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(1000);

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // 1 virus cleared at Low speed = 100 points.
  expect(state.score).toBe(100);
});
