import { test, expect } from '@playwright/test';
test('2.4.7.2 Has an "Apply" button', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
});
