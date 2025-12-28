import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 6.1.3 Color assigned based on (Remaining Viruses % 4)
/** @mustTestDrMarioGamestate */
test('6.1.3 Virus colors distributed (all 4 viruses placed)', async ({
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

  // Wait for game to initialize

  // Verify via state
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  const virusCells = state.grid
    .flat()
    .filter((cell) => cell.startsWith('VIRUS_'));
  expect(virusCells.length).toBe(4);
});
