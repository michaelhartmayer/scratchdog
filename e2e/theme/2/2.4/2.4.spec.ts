import { test, expect } from '@playwright/test';

test.describe('2.4 Text Hierarchy', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('2.4.1 --text-primary is #ffffff', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
        );
        expect(value).toBe('#ffffff');
    });

    test('2.4.2 --text-secondary is #a1a1aa', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
        );
        expect(value).toBe('#a1a1aa');
    });

    test('2.4.3 --text-muted is #52525b', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim()
        );
        expect(value).toBe('#52525b');
    });

    test('2.4.4 --text-inverse is #09090b', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--text-inverse').trim()
        );
        expect(value).toBe('#09090b');
    });
});
