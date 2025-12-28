import { test, expect } from '@playwright/test';
import type { GameState } from '../../../../../src/game/DrMarioEngine';

// 3.5.1 Pills lock into place after landing
/** @mustTestDrMarioGamestate */
test('3.5.1 Pills lock into grid after hard drop', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Get initial grid state - should have 0 pill cells on bottom row
  let state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  const initialBottomRow =
    state.grid[15]?.filter((c) => c.startsWith('PILL_')).length ?? 0;
  expect(initialBottomRow).toBe(0);

  // Move to left edge and hard drop
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press(' '); // Hard drop
  await page.waitForTimeout(200);

  // Grid should now have pill cells at bottom
  state = await page.evaluate(
    () => window.getE2EState('DRMARIO_STATE') as GameState,
  );
  const hasPillsLocked = state.grid.some((row) =>
    row.some((cell) => cell.startsWith('PILL_')),
  );
  expect(hasPillsLocked).toBe(true);
});
