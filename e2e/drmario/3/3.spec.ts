import { test, expect } from '@playwright/test';
import type { GameState } from '../../../src/game/DrMarioEngine';

/** @mustTestDrMarioGamestate */
test('3 Game Mechanics', async ({ page }) => {
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
  expect(state.status).toBe('PLAYING');
});
