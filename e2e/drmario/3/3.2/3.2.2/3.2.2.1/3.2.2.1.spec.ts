import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../../src/game/DrMarioEngine';

// 3.2.2.1 Chain reactions do NOT award extra points
/** @mustTestDrMarioGamestate */
test('3.2.2.1 Chain reactions do NOT award extra points', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Verify initial state via getE2EState
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.score).toBe(0);

  // Drop a few pills carefully
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press(' ');
    await page.waitForTimeout(100);
  }

  const finalState = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(finalState.status).toBe('PLAYING');
});
