import { test, expect } from '@playwright/test';

test('1.5 The bottom of the splash screen displays "Press any key to Continue"', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByText('Press any key to Continue')).toBeVisible();
});
