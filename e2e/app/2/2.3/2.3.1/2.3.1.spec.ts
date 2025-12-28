import { test, expect } from '@playwright/test';

test('2.3.1 The menu item is greyed out if there is no saved game', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  // Should be disabled by default (no save)
  await expect(
    page.getByRole('button', { name: 'Continue Game' }),
  ).toBeDisabled();
});
