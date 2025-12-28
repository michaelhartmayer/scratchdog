import { test, expect } from '@playwright/test';

test.describe('3.1 Font Stack', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('3.1.1 --font-display contains Outfit and Inter', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim()
        );
        expect(value).toContain('Outfit');
        expect(value).toContain('Inter');
    });

    test('3.1.2 --font-body contains Inter', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim()
        );
        expect(value).toContain('Inter');
    });

    test('3.1.3 --font-mono contains JetBrains Mono', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim()
        );
        expect(value).toContain('JetBrains Mono');
    });
});
