import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../../src/game/DrMarioEngine';

// 3.3.2.2 Pills drop naturally (gravity)
/** @mustTestDrMarioGamestate */
test('3.3.2.2 Pills drop naturally due to gravity', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  const initialState = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  const initialY = initialState.activePill?.y ?? 0;

  // Wait for the pill to fall at least one row
  await page.waitForFunction(
    (y) => {
      const state = window.getE2EState('DRMARIO_STATE') as {
        activePill: { y: number } | null;
      } | null;
      return !!state?.activePill && state.activePill.y > y;
    },
    initialY,
    { timeout: 5000 },
  );

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.activePill?.y).toBeGreaterThan(initialY);
});
