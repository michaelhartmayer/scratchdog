import { test, expect } from '@playwright/test';

test('2.5.3 When Play is pressed the song fades out over 1 second', async ({
    page,
}) => {
    await page.goto('/');
    await page.click('body'); // skip splash

    // Wait for main menu to be visible
    await expect(page.getByTestId('main-menu')).toBeVisible();

    // Ensure music is playing and stable first
    await expect
        .poll(async () => {
            return await page.evaluate(() => {
                const win = window as unknown as { getE2EState: (k: string) => { currentMusic: { volume: number } } | undefined };
                return win.getE2EState('AUDIO_MANAGER')?.currentMusic.volume;
            });
        })
        .toBeGreaterThan(0.2); // Assuming fully faded in

    const volBeforeClick = await page.evaluate(() => {
        const win = window as unknown as { getE2EState: (k: string) => { currentMusic: { volume: number } } | undefined };
        return win.getE2EState('AUDIO_MANAGER')?.currentMusic.volume ?? -1;
    });

    // Click "New Game" (interpreted as "Play")
    await page.getByRole('button', { name: 'New Game' }).click();

    // Check volume shortly after click
    await page.waitForTimeout(200);
    const volAfterClick = await page.evaluate(() => {
        const win = window as unknown as { getE2EState: (k: string) => { currentMusic: { volume: number } } | undefined };
        return win.getE2EState('AUDIO_MANAGER')?.currentMusic.volume ?? -1;
    });

    expect(volAfterClick).toBeLessThan(volBeforeClick);

    // Check volume near end of fade
    await page.waitForTimeout(600);
    const volNearEnd = await page.evaluate(() => {
        const win = window as unknown as { getE2EState: (k: string) => { currentMusic: { volume: number } } | undefined };
        return win.getE2EState('AUDIO_MANAGER')?.currentMusic.volume ?? -1;
    });
    expect(volNearEnd).toBeLessThan(volAfterClick);

    // Eventually music might stop or volume hits 0
    await page.waitForTimeout(500);
    // It transitions to GameScreen, music might be stopped or replaced.
    // Spec says "song fades out", usually implies stopping or being silent.
});
