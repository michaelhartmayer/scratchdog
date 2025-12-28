import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../src/game/DrMarioEngine';

// 1.1 The objective is to eliminate all viruses in the bottle by matching them with colored vitamin capsules
/** @mustTestDrMarioGamestate */
test('1.1 Objective: eliminate viruses by matching with capsules', async ({
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

  // Verify via state
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.virusCount).toBe(4);
  expect(state.grid.length).toBe(16);
});
