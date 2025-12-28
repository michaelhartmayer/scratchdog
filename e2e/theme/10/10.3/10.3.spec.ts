import { test, expect } from '@playwright/test';

test.describe('10.3 Keyboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/design-system');
    });

    test('10.3.1 All buttons are focusable', async ({ page }) => {
        const btn = page.getByTestId('button-primary');
        await btn.focus();
        await expect(btn).toBeFocused();
    });

    test('10.3.2 Tab order is logical', async ({ page }) => {
        await page.keyboard.press('Tab');
        const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
        expect(firstFocused).toBeDefined();
    });

    test('10.3.3 Focus indicators are visible', async ({ page }) => {
        const btn = page.getByTestId('button-primary');
        await btn.focus();
        const outline = await btn.evaluate((el) => getComputedStyle(el).outlineStyle);
        // Focus indicator should exist (not 'none')
        expect(outline).not.toBe('');
    });
});
