import { test, expect } from '@playwright/test';

// 8.2. Colors
// 8.2.1. Red: A vibrant cherry red (#FF0000 or similar).
// 8.2.2. Yellow: A bright golden yellow (#FFFF00 or similar).
// 8.2.3. Blue: A deep royal blue (#0000FF or similar).
test('8.2.1-8.2.3 Color verification', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  // Verify CSS variables or specific styles for Red, Yellow, Blue
  // These should be defined in a theme or component
  const colors = await page.evaluate(() => {
    const style = window.getComputedStyle(document.documentElement);
    return {
      red: style.getPropertyValue('--color-dr-red').trim(),
      yellow: style.getPropertyValue('--color-dr-yellow').trim(),
      blue: style.getPropertyValue('--color-dr-blue').trim(),
    };
  });

  // Basic check for presence of color definitions
  expect(colors.red).toBeTruthy();
  expect(colors.yellow).toBeTruthy();
  expect(colors.blue).toBeTruthy();

  // More specific hex checks if applicable
  // expect(colors.red).toBe('#FF0000');
});
