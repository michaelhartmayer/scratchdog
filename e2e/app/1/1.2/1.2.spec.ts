import { test, expect } from '@playwright/test';

test('1.2 Center screen displays the words "Scratch Dog"', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Scratch Dog')).toBeVisible();
});
