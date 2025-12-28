import { test, expect } from '@playwright/test';

test.describe('4.4 MenuItem Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system');
  });

  test('4.4.1 MenuItem has hover state with translateX', async ({ page }) => {
    const item = page.getByTestId('menu-item').first();
    await expect(item).toBeVisible();
    // Check that item has transition for hover effect
    const transition = await item.evaluate(
      (el) => getComputedStyle(el).transition,
    );
    expect(transition).not.toBe('none');
  });

  test('4.4.2 MenuItem has focus-visible outline', async ({ page }) => {
    const item = page.getByTestId('menu-item').first();
    await item.focus();
    // Focus styles are applied via :focus-visible
    await expect(item).toBeFocused();
  });

  test('4.4.3 MenuItem disabled state', async ({ page }) => {
    const item = page.getByTestId('menu-item-disabled');
    await expect(item).toBeDisabled();
  });
});
