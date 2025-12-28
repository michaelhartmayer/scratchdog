import { test, expect } from '@playwright/test';
test('3.3.1 In the center in white text it should say "Game TBD"', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await expect(page.getByText('Game TBD')).toBeVisible();
});
