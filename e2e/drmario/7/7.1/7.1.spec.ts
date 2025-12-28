import { test, expect } from '@playwright/test';

test.describe('7.1. Single Canvas', () => {
    test('should only render one canvas element', async ({ page }) => {
        await page.goto('/');

        // Start the game
        await page.click('text=New Game');

        // Wait for the game container to be visible
        await page.waitForSelector('.game-center');

        // Wait a bit to ensure potential second canvas would have mounted (React Strict Mode double mount)
        // The second mount happens almost immediately, but let's give it a stable moment.
        await page.waitForTimeout(1000);

        const canvases = page.locator('.game-center canvas');

        // Check that we have exactly 1 canvas
        // If strict mode double-invokation issue is present, this might detect 2
        await expect(canvases).toHaveCount(1);
    });
});
