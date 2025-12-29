import { test, expect } from '@playwright/test';

test('2.5.1 Plays the main menu song, which is /audio/falling-falling-falling.mp3', async ({
    page,
}) => {
    await page.goto('/');
    await page.click('body'); // skip splash

    // Wait for main menu to be visible
    await expect(page.getByTestId('main-menu')).toBeVisible();

    // Check audio state exposed by AudioManager
    await expect
        .poll(async () => {
            const audioState = await page.evaluate(() => {
                const win = window as unknown as { getE2EState: (k: string) => { currentMusic: { name: string } } | undefined };
                return win.getE2EState('AUDIO_MANAGER');
            });
            return audioState?.currentMusic.name;
        })
        .toBe('falling-falling-falling');
});
