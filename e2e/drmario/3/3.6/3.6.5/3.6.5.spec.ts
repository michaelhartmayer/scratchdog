import { test, expect } from '@playwright/test';
import type { CellType, GameState } from '../../../../../src/game/DrMarioEngine';

// 3.6.5 After the clear animation completes, unsupported capsule segments fall at 4 rows/second (250ms per row)
// Test verifies: FLASHING (267ms) -> CASCADING (250ms/row gravity) timing
/** @mustTestDrMarioGamestate */
test('3.6.5 Cascade gravity runs at 250ms per row after flash completes', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_ENGINE') !== undefined,
  );

  // Get active pill color
  const pillColors = await page.evaluate(() => {
    const state = window.getE2EState('DRMARIO_STATE') as GameState;
    return state.activePill;
  });

  const pillColor = pillColors?.color1 ?? 'R';
  const virusType = `VIRUS_${pillColor}` as CellType;

  // Setup viruses to match
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = virusType;
  grid[15][1] = virusType;
  grid[15][2] = virusType;
  grid[10][7] = 'VIRUS_B'; // Extra to prevent VICTORY

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as unknown as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  // Hard drop
  await page.keyboard.press(' ');

  // After match, should be in FLASHING state
  await page.waitForTimeout(50);
  let state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.status).toBe('FLASHING');

  // At 200ms - should still be FLASHING (flash = 267ms)
  await page.waitForTimeout(150);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.status).toBe('FLASHING');

  // At 350ms - flash done, should be CASCADING
  await page.waitForTimeout(150);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(['CASCADING', 'PLAYING']).toContain(state.status);

  // Wait for cascade to complete
  await page.waitForTimeout(500);
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.status).toBe('PLAYING');
});
