import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 3.3.1 Unsupported pill segments fall downwards
/** @mustTestDrMarioGamestate */
test('3.3.1 Pills fall when DOWN is pressed', async ({ page }) => {
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

  // Press down repeatedly - pill should fall faster than gravity
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(50);
  }

  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.activePill?.y).toBeGreaterThan(initialY);
});
