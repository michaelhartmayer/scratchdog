import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 3.2.3.1 A pill (megavitamin) is composed of two color segments.
/** @mustTestDrMarioGamestate */
test('3.2.3.1 Pill is composed of two color segments', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Active pill must exist and have two colors
  expect(state.activePill).not.toBeNull();
  if (state.activePill) {
    expect(state.activePill.color1).toBeDefined();
    expect(state.activePill.color2).toBeDefined();
  }

  // Next pill preview must also have two colors
  expect(state.nextPill).not.toBeNull();
  if (state.nextPill) {
    expect(state.nextPill.color1).toBeDefined();
    expect(state.nextPill.color2).toBeDefined();
  }
});
