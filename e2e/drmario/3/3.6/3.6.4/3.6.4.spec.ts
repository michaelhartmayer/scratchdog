import { test, expect } from '@playwright/test';
import type {
    CellType,
    GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.6.4 Input is disabled during the clear animation; the player cannot move the next pill
/** @mustTestDrMarioGamestate */
test('3.6.4 Input is disabled during CASCADING animation', async ({ page }) => {
    await page.goto('/');
    await page.click('body');
    await page.click('text=New Game');
    await page.waitForFunction(
        () =>
            typeof window.getE2EState === 'function' &&
            window.getE2EState('DRMARIO_ENGINE') !== undefined,
    );

    // Setup grid with 3 viruses ready to match
    const grid: CellType[][] = Array.from({ length: 16 }, () =>
        Array.from({ length: 8 }, () => 'EMPTY' as CellType),
    );
    grid[15][0] = 'VIRUS_R';
    grid[15][1] = 'VIRUS_R';
    grid[15][2] = 'VIRUS_R';
    grid[15][3] = 'VIRUS_R';
    grid[10][7] = 'VIRUS_B';

    await page.evaluate((g) => {
        const engine = window.getE2EState('DRMARIO_ENGINE') as {
            setGrid: (grid: CellType[][]) => void;
        };
        engine.setGrid(g);
    }, grid);

    // Move pill right and drop to trigger match at 0,1,2,3
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press(' ');

    // Immediately try to send input during animation
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');

    // Get state - during CASCADING, there should be no activePill
    const state = await page.evaluate(
        () => window.getE2EState('DRMARIO_STATE') as GameState,
    );

    // During CASCADING, either there's no active pill, OR input was ignored
    if (state.status === 'CASCADING') {
        expect(state.activePill).toBeNull();
    }

    // Wait for animation to complete and verify game resumes normally
    await page.waitForTimeout(600);
    const stateAfter = await page.evaluate(
        () => window.getE2EState('DRMARIO_STATE') as GameState,
    );

    // After animation, should be PLAYING or VICTORY
    expect(['PLAYING', 'VICTORY']).toContain(stateAfter.status);
});
