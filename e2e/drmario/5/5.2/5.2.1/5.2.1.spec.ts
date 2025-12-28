import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 5.2.1 Each new level increases starting virus count
/** @mustTestDrMarioGamestate */
test('5.2.1 Level increases virus count (L0=4 -> L1=8)', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Verify Level 0 (4 viruses)
  const state0 = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state0.level).toBe(0);
  expect(state0.virusCount).toBe(4);

  // Set Level 1 via engine
  await page.evaluate(() => {
    interface TestEngine {
      initializeLevel(level: number, speed: string): void;
    }
    const engine = window.getE2EState('DRMARIO_ENGINE') as TestEngine;
    engine.initializeLevel(1, 'LOW');
  });

  // Wait for state to be reflected in window.getE2EState loop
  await page.waitForTimeout(200);

  // Verify Level 1 (8 viruses)
  const state1 = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state1.level).toBe(1);
  expect(state1.virusCount).toBe(8); // 4 * (1 + 1)
});
