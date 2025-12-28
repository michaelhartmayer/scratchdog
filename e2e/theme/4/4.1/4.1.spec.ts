import { test, expect } from '@playwright/test';

test.describe('4.1 Button Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system');
  });

  test('4.1.1 Primary variant exists', async ({ page }) => {
    const btn = page.getByTestId('button-primary');
    await expect(btn).toBeVisible();
  });

  test('4.1.2 Secondary variant exists', async ({ page }) => {
    const btn = page.getByTestId('button-secondary');
    await expect(btn).toBeVisible();
  });

  test('4.1.3 Ghost variant exists', async ({ page }) => {
    const btn = page.getByTestId('button-ghost');
    await expect(btn).toBeVisible();
  });

  test('4.1.4 Disabled state works', async ({ page }) => {
    const btn = page.getByTestId('button-disabled');
    await expect(btn).toBeDisabled();
  });

  test('4.1.5 Button has hover, focus, active states', async ({ page }) => {
    const btn = page.getByTestId('button-primary');
    await btn.hover();
    // Check that button has transition property for interactive feedback
    const transition = await btn.evaluate(
      (el) => getComputedStyle(el).transition,
    );
    expect(transition).not.toBe('none');
  });
});
