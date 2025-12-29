import { test, expect } from '@playwright/test';
import type {
  CellType,
  GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.6.7 Chained clears from cascading use the same flash animation (16 frames/267ms) before removal
/** @mustTestDrMarioGamestate */
test('3.6.7 Chained clears use same flash animation as initial clears', async ({
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

  // Setup: viruses to match, plus extra virus to prevent VICTORY and allow cascade
  const grid: CellType[][] = Array.from({ length: 16 }, () =>
    Array.from({ length: 8 }, () => 'EMPTY' as CellType),
  );
  grid[15][0] = virusType;
  grid[15][1] = virusType;
  grid[15][2] = virusType;
  grid[10][7] = 'VIRUS_B'; // Extra to prevent VICTORY

  await page.evaluate((g) => {
    const engine = window.getE2EState('DRMARIO_ENGINE') as {
      setGrid: (grid: CellType[][]) => void;
    };
    engine.setGrid(g);
  }, grid);

  // Hard drop to trigger match
  await page.keyboard.press(' ');

  // Should enter FLASHING state for initial match
  await page.waitForTimeout(50);
  let state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  expect(state.status).toBe('FLASHING');

  // Cells should show explosion sprites during flash
  const hasExplosion =
    state.grid[15][0].startsWith('EXPLODE') ||
    state.grid[15][1].startsWith('EXPLODE') ||
    state.grid[15][2].startsWith('EXPLODE');
  expect(hasExplosion).toBe(true);

  // Wait for flash + cascade to complete
  await page.waitForTimeout(1000);

  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );

  // Verify cascade completed - original match should be cleared
  expect(state.grid[15][0]).toBe('EMPTY');
  expect(state.grid[15][1]).toBe('EMPTY');
  expect(state.grid[15][2]).toBe('EMPTY');

  // Game should be back to PLAYING
  expect(state.status).toBe('PLAYING');
});
