import { test, expect } from '@playwright/test';

test.describe('2.1.1.6 Components are not allowed to use html h1-h6 tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('body'); // Skip splash screen
  });

  test('2.1.1.6.1 Main Menu title uses DesignSystem Text', async ({ page }) => {
    const title = page.locator('.main-menu .menu-title');
    await expect(title).toHaveClass(/ds-text/);
    await expect(title).toHaveClass(/ds-text--hero/);
  });

  test('2.1.1.6.2 Options Modal headings use DesignSystem Text', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Options' }).click();
    const modal = page.getByTestId('options-modal');
    await expect(modal).toBeVisible();

    const heading = modal.locator('.modal-section .ds-text--heading');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Audio');
  });
});
