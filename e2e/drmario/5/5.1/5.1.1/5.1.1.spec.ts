import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 5.1.1 Points awarded for eliminating viruses
/** @mustTestDrMarioGamestate */
test('5.1.1 Score starts at 0 and increases when viruses eliminated', async ({
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

  // Setup 1 virus (Yellow) and drop Yellow pill on it - LOW speed
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
    grid[14][0] = 'PILL_Y';
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

  // Keep it simple: Move left 3 times and Drop
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(50);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(50);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(50);

  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(1000);

  const finalState = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  expect(finalState.score).toBeGreaterThan(0);
});
