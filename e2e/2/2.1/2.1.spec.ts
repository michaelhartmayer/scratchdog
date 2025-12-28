import { test, expect } from '@playwright/test';

test('2.1 Center screen displays the words "Main Menu"', async ({ page }) => {
  await page.goto('/');
  await page.click('body'); // skip splash
  await expect(page.getByRole('heading', { name: 'Main Menu' })).toBeVisible();
});
