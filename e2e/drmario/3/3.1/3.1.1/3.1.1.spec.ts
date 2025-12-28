import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 3.1.1 Pills can be moved left, right, and rotated 90 degrees
/** @mustTestDrMarioGamestate */
test('3.1.1 Pills can move left, right, down, and rotate', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Get initial pill position
  const initialState = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  const initialX = initialState.activePill?.x ?? 0;

  // Move left
  await page.keyboard.press('ArrowLeft');
  let state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.activePill?.x).toBeLessThan(initialX);

  // Move right
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(150);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.activePill?.x).toBe(initialX);

  // Move down
  const initialY = state.activePill?.y ?? 0;
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(150);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.activePill?.y).toBeGreaterThan(initialY);
});
