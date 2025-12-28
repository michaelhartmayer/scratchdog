import { test, expect } from '@playwright/test';

test('2 Main Menu', async ({ page }) => {
  await page.goto('/');
  await page.click('body'); // skip splash
  await expect(page.getByTestId('main-menu')).toBeVisible();
});
