import { test, expect } from '@playwright/test';

test.describe('5.3 Keyframe Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('5.3.1 fadeIn animation is defined', async ({ page }) => {
    const exists = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (const sheet of sheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSKeyframesRule && rule.name === 'fadeIn') {
              return true;
            }
          }
        } catch {
          // Cross-origin stylesheets may throw
        }
      }
      return false;
    });
    expect(exists).toBe(true);
  });

  test('5.3.4 pulse animation is defined', async ({ page }) => {
    const exists = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (const sheet of sheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSKeyframesRule && rule.name === 'pulse') {
              return true;
            }
          }
        } catch {
          // Cross-origin stylesheets may throw
        }
      }
      return false;
    });
    expect(exists).toBe(true);
  });
});
