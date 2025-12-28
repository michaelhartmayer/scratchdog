import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../../src/game/DrMarioEngine';

// 3.1.2.1 Button A (X) rotates the pill 90 degrees clockwise
/** @mustTestDrMarioGamestate */
test('3.1.2.1 X key rotates pill 90° clockwise (H→V orientation)', async ({
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

  // Get initial orientation
  let state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  const initialOrientation = state.activePill?.orientation;
  expect(initialOrientation).toBe('HORIZONTAL');

  // Rotate clockwise with X
  await page.keyboard.press('x');
  await page.waitForTimeout(50);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.activePill?.orientation).toBe('VERTICAL');

  // Rotate again - should go back to horizontal
  await page.keyboard.press('x');
  await page.waitForTimeout(50);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.activePill?.orientation).toBe('HORIZONTAL');
});
