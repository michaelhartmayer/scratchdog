import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 6.2.1 Gravity speed determined by lookup table
/** @mustTestDrMarioGamestate */
test('6.2.1 Gravity causes pills to fall over time', async ({ page }) => {
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

  // Wait for the pill to fall at least one row
  // Logic: 6.2.1 implies gravity speed table.
  // At Speed LOW, it drops ~1/sec (1000ms).
  // We wait 1100ms and expect it to have moved 1 row.

  const startY = initialState.activePill?.y ?? 0;

  await page.waitForTimeout(1100);

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  const currentY = state.activePill?.y ?? 0;

  // It should have dropped at least 1 row (initialY + 1)
  expect(currentY).toBeGreaterThan(startY);
});
