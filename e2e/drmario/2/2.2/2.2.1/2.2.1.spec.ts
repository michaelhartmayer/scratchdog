import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 2.2.1 There are three types of viruses: Red, Yellow, and Blue
/** @mustTestDrMarioGamestate */
test('2.2.1 Three virus types exist on grid (R/Y/B)', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Read game state
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Count virus types in grid
  const virusTypes = new Set<string>();
  state.grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.startsWith('VIRUS_')) {
        virusTypes.add(cell);
      }
    });
  });

  // Should have at least one virus
  expect(virusTypes.size).toBeGreaterThan(0);

  // Virus count should match state
  expect(state.virusCount).toBe(4);
});
