import { test, expect } from '@playwright/test';

test('2.4 Menu Item: "Options"', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await expect(page.getByRole('button', { name: 'Options' })).toBeVisible();
});
