import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../../src/game/DrMarioEngine';

// 5.1.2.4 Multi-virus clears multiply the score
/** @mustTestDrMarioGamestate */
test('5.1.2.4 Multi-virus multipliers (2x for 2 viruses)', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Setup 2 viruses in a single match - LOW speed
  // (0,15) VIRUS_Y
  // (0,14) VIRUS_Y
  // (0,13) PILL_Y
  // Drop Y at (0,12) -> Match 4 vertical.
  // 2 Viruses cleared.
  // 5.1.2.4: Multi-virus clears multiply (2x for 2)
  // Formula: Base * Count * 2^(Count-1)
  // 100 * 2 * 2^1 = 100 * 2 * 2 = 400 points.

  await page.evaluate(() => {
    interface TestEngine {
      setGrid(grid: string[][]): void;
      setSpeed(speed: string): void;
      _activePill: {
        x: number;
        y: number;
        color1: string;
        color2: string;
        orientation: string;
      };
      _dropTimer: number;
    }
    const engine = window.getE2EState('DRMARIO_ENGINE') as TestEngine;
    const grid = Array.from({ length: 16 }, () =>
      Array.from({ length: 8 }, () => 'EMPTY'),
    );
    grid[15][0] = 'VIRUS_Y';
    grid[14][0] = 'VIRUS_Y';
    grid[13][0] = 'PILL_Y';
    engine.setGrid(grid);
    engine.setSpeed('LOW');

    engine._activePill = {
      x: 3,
      y: 0,
      color1: 'Y',
      color2: 'Y',
      orientation: 'HORIZONTAL',
    };
    engine._dropTimer = 0;
  });

  // Move left 3 times
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(50);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(50);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(50);
  // Hard Drop
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(1000);

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // 2 viruses cleared = 400 points
  expect(state.score).toBe(400);
});
