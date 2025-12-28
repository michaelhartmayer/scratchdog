import { test, expect } from '@playwright/test';

// 2.1.1 The play area is a grid, 8 blocks wide by 16 blocks high
/** @mustTestDrMarioGamestate */
test('2.1.1 Play area is 8x16 grid', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.waitForFunction(
    () =>
      typeof window.getE2EState === 'function' &&
      window.getE2EState('DRMARIO_STATE') !== undefined,
  );

  // Wait for game to initialize

  // Verify canvas dimensions
  const canvas = page.locator('.game-center canvas').first();
  const widthAttr = await canvas.getAttribute('width');
  const heightAttr = await canvas.getAttribute('height');
  expect(widthAttr).toBe('256'); // 8 * 32
  expect(heightAttr).toBe('512'); // 16 * 32

  // Also verify via exposed game state (Spec 7.1)
  const state = await page.evaluate(() => window.getE2EState('DRMARIO_STATE'));
  if (state && typeof state === 'object' && 'grid' in state) {
    const grid = (state as { grid: unknown[][] }).grid;
    // Grid should be 16 rows x 8 columns
    expect(grid.length).toBe(16);
    expect(grid[0].length).toBe(8);
  }
});
