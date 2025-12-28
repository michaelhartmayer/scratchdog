import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 3.4.2 The next upcoming pill is visible to the player
/** @mustTestDrMarioGamestate */
test('3.4.2 Next pill preview exists in game state', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Check state for next pill
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.nextPill).toBeDefined();
  expect(state.nextPill?.color1).toMatch(/^[RYB]$/);
  expect(state.nextPill?.color2).toMatch(/^[RYB]$/);
});
