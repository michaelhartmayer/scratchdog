import { test, expect } from '@playwright/test';

test.describe('5.1 Timing Functions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('5.1.1 --ease-out-expo is defined', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--ease-out-expo').trim()
        );
        expect(value).toContain('cubic-bezier');
    });

    test('5.1.2 --ease-in-out-quart is defined', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--ease-in-out-quart').trim()
        );
        expect(value).toContain('cubic-bezier');
    });

    test('5.1.3 --spring is defined', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--spring').trim()
        );
        expect(value).toContain('cubic-bezier');
    });
});
