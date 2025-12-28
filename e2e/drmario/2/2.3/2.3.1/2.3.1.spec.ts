import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 2.3.1 Pills consist of two halves, each being Red, Yellow, or Blue
/** @mustTestDrMarioGamestate */
test('2.3.1 Pills have two color halves (color1, color2)', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Read game state
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Pill should have two colors
  expect(state.activePill).toBeDefined();
  expect(state.activePill?.color1).toMatch(/^[RYB]$/);
  expect(state.activePill?.color2).toMatch(/^[RYB]$/);
});
