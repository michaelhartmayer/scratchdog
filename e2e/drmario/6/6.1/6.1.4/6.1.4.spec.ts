import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 6.1.4 Adjacency checks prevent 3 consecutive matching colors
/** @mustTestDrMarioGamestate */
test('6.1.4 Viruses placed without 3-in-a-row (no pre-matched viruses)', async ({
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

  // Read game state via exposed helper (Spec 7.1)
  const state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  const grid = state.grid;

  // Check for no horizontal 3-in-a-row viruses
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 6; x++) {
      const cell1 = grid[y][x];
      const cell2 = grid[y][x + 1];
      const cell3 = grid[y][x + 2];
      if (cell1.startsWith('VIRUS_') && cell1 === cell2 && cell2 === cell3) {
        throw new Error(`Found 3-in-a-row at row ${String(y)}: ${cell1}`);
      }
    }
  }

  // Check for no vertical 3-in-a-row viruses
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 14; y++) {
      const cell1 = grid[y][x];
      const cell2 = grid[y + 1][x];
      const cell3 = grid[y + 2][x];
      if (cell1.startsWith('VIRUS_') && cell1 === cell2 && cell2 === cell3) {
        throw new Error(`Found 3-in-a-row at col ${String(x)}: ${cell1}`);
      }
    }
  }

  // Virus count should still be 4
  expect(state.virusCount).toBe(4);
});
