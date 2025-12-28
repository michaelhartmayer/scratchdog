import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 3.4.1 Pills spawn at the top center of the bottle
/** @mustTestDrMarioGamestate */
test('3.4.1 Pills spawn at top center (x=3)', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Wait for game to fully initialize

  // Read game state
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Pill should spawn at center x position (x=3 for 8-wide grid)
  // y may have moved due to gravity, but x should still be 3
  expect(state.activePill).toBeDefined();
  expect(state.activePill?.x).toBe(3); // Center for 8-wide grid
  expect(state.activePill?.orientation).toBe('HORIZONTAL');
  // y starts at 0 but gravity may have moved it, so just check it's at top half
  expect(state.activePill?.y ?? 0).toBeLessThan(8);
});
