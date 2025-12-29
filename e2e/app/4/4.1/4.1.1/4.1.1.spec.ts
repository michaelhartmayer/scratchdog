import { test, expect } from '@playwright/test';

test.beforeEach(({ page }) => {
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            throw new Error(`Console Error: "${msg.text()}"`);
        }
    });
    page.on('pageerror', (err) => {
        throw new Error(`Uncaught Exception: "${err.message}"`);
    });
});

test('4.1.1 Plays the game over sound: /audio/gameover.mp3', async ({
    page,
}) => {
    await page.goto('/');
    await page.click('body'); // skip splash
    await page.click('text=New Game');

    // Wait for game screen
    await expect(page.getByTestId('game-screen')).toBeVisible();

    // Trigger Game Over (assuming we can do this via exposed engine or navigation)
    // Looking at Conversation summaries, it seems we use win.getE2EState('DRMARIO_ENGINE').setStatus('GAME_OVER')
    await page.evaluate(() => {
        const win = window as unknown as {
            getE2EState: (k: string) => { setStatus: (s: string) => void } | undefined;
        };
        const engine = win.getE2EState('DRMARIO_ENGINE');
        if (engine) engine.setStatus('GAME_OVER');
    });

    // Wait for game over screen to mount (after 1s fade out)
    await expect(page.getByTestId('game-over-screen')).toBeVisible({ timeout: 5000 });

    // Check audio state exposed by AudioManager
    await expect
        .poll(async () => {
            const audioState = await page.evaluate(() => {
                const win = window as unknown as {
                    getE2EState: (
                        k: string,
                    ) => { activeSounds: string[] } | undefined;
                };
                return win.getE2EState('AUDIO_MANAGER');
            });
            return audioState?.activeSounds;
        })
        .toContain('gameover');
});
