import { test, expect } from '@playwright/test';

test('1.4 Any key or mouse click will skip the splash screen', async ({
  page,
}) => {
  await page.goto('/');
  // Click to skip
  await page.click('body');
  // Should see Main Menu
  await expect(page.getByTestId('main-menu')).toBeVisible();
});
