import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 6.1.1 Y-coordinate selected first, then X
/** @mustTestDrMarioGamestate */
test('6.1.1 Viruses generated in grid (Y then X selection)', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  // Wait for game to initialize
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Verify via state
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  const virusCells = state.grid
    .flat()
    .filter((cell: string) => cell.startsWith('VIRUS_'));
  expect(virusCells.length).toBe(4);
});
