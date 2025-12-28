import { test, expect } from '@playwright/test';
test('2.2 Menu Item: "New Game"', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
});
