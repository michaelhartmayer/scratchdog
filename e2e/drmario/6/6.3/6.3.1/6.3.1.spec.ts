import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 6.3.1 Virus Count = 4 * (Level + 1)
/** @mustTestDrMarioGamestate */
test('6.3.1 Level 0 virus count = 4 * (0 + 1) = 4', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Wait for game to initialize

  // Verify via exposed game state (Spec 7.1)
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Level 0: 4 * (0 + 1) = 4 viruses
  expect(state.level).toBe(0);
  expect(state.virusCount).toBe(4);

  // Also verify via HUD
  const hud = await page.locator('.hud').textContent();
  const virusMatch = hud?.match(/VIRUSES:\s*(\d+)/);
  expect(virusMatch).not.toBeNull();
  if (virusMatch) {
    expect(parseInt(virusMatch[1], 10)).toBe(4);
  }
});
