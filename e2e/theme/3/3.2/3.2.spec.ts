import { test, expect } from '@playwright/test';

test.describe('3.2 Type Scale', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/design-system');
    });

    test('3.2.1 Hero text variant exists', async ({ page }) => {
        const hero = page.getByTestId('text-hero').first();
        await expect(hero).toBeVisible();
        const fontWeight = await hero.evaluate((el) => getComputedStyle(el).fontWeight);
        expect(Number(fontWeight)).toBeGreaterThanOrEqual(700);
    });

    test('3.2.2 Title text variant exists', async ({ page }) => {
        const title = page.getByTestId('text-title').first();
        await expect(title).toBeVisible();
    });

    test('3.2.3 Heading text variant exists', async ({ page }) => {
        const heading = page.getByTestId('text-heading').first();
        await expect(heading).toBeVisible();
    });

    test('3.2.4 Subheading text variant exists', async ({ page }) => {
        const subheading = page.getByTestId('text-subheading').first();
        await expect(subheading).toBeVisible();
    });

    test('3.2.5 Body text variant exists', async ({ page }) => {
        const body = page.getByTestId('text-body').first();
        await expect(body).toBeVisible();
    });

    test('3.2.6 Caption text variant exists', async ({ page }) => {
        const caption = page.getByTestId('text-caption').first();
        await expect(caption).toBeVisible();
    });

    test('3.2.7 Overline text variant exists', async ({ page }) => {
        const overline = page.getByTestId('text-overline').first();
        await expect(overline).toBeVisible();
    });
});
