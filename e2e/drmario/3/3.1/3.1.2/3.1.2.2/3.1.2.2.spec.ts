import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../../src/game/DrMarioEngine';

// 3.1.2.2 Button B (Z) rotates the pill 90 degrees counter-clockwise
/** @mustTestDrMarioGamestate */
test('3.1.2.2 Z key rotates pill 90° counter-clockwise (H→V orientation)', async ({
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
  expect(state.activePill?.orientation).toBe('HORIZONTAL');

  // Rotate counter-clockwise with Z
  await page.keyboard.press('z');
  await page.waitForTimeout(50);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.activePill?.orientation).toBe('VERTICAL');
});
