import { test, expect } from '@playwright/test';

test.describe('2.1.1.7 Components are not allowed to use html p tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('body'); // Skip splash screen
  });

  test('2.1.1.7.1 Verify that paragraph-like text uses DesignSystem Text component', async ({
    page,
  }) => {
    // Currently we don't have many <p> tags, but the Text component uses them for 'body' variant.
    // We can verify that any element that looks like a paragraph (e.g., in a future feature)
    // would correctly use the ds-text class if implemented via Text component.

    // For now, we can check the 'body' variant in the DesignSystem specifically if it's used anywhere,
    // or just ensure that no <p> tags exist without the ds-text class.

    const pTags = page.locator('p');
    const count = await pTags.count();
    for (let i = 0; i < count; i++) {
      await expect(pTags.nth(i)).toHaveClass(/ds-text/);
    }
  });
});
