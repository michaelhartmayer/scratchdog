import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../../src/game/DrMarioEngine';

// 3.3.2.1 Drop speed based on Speed setting (Low/Med/High)
/** @mustTestDrMarioGamestate */
test('3.3.2.1 Game runs on LOW speed by default', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Verify state speed
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.speed).toBe('LOW');
  expect(state.activePill).toBeDefined();
});
