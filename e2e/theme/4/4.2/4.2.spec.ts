import { test, expect } from '@playwright/test';

test.describe('4.2 GlassPanel Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system');
  });

  test('4.2.1 GlassPanel has backdrop blur', async ({ page }) => {
    const panel = page.getByTestId('glass-panel');
    await expect(panel).toBeVisible();
    const backdropFilter = await panel.evaluate(
      (el) => getComputedStyle(el).backdropFilter,
    );
    expect(backdropFilter).toContain('blur');
  });

  test('4.2.2 GlassPanel has subtle border', async ({ page }) => {
    const panel = page.getByTestId('glass-panel');
    const border = await panel.evaluate((el) => getComputedStyle(el).border);
    expect(border).not.toBe('none');
  });

  test('4.2.3 GlassPanel has configurable padding', async ({ page }) => {
    const panel = page.getByTestId('glass-panel');
    const padding = await panel.evaluate((el) => getComputedStyle(el).padding);
    expect(padding).not.toBe('0px');
  });
});
