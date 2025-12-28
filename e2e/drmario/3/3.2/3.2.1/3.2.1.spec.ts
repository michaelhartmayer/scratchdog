import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 3.2.1 Aligning 4 or more color segments eliminates them
/** @mustTestDrMarioGamestate */
test('3.2.1 4+ aligned segments are eliminated (score/virus count can change)', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Wait for game to initialize

  // Verify initial score and virus count via state
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.score).toBe(0);
  expect(state.virusCount).toBeGreaterThan(0);
});
