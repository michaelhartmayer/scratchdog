import { test, expect } from '@playwright/test';

test('2.3 Menu Item: "Continue Game"', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await expect(
    page.getByRole('button', { name: 'Continue Game' }),
  ).toBeVisible();
});
