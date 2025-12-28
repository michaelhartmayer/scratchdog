import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';

it('1.3.2.2 Error messages must start with "Error: "', () => {
    // Trigger an error, e.g., list non-existent folder
    try {
        execSync('node scripts/cli/index.js list non-existent-folder-xyz', {
            encoding: 'utf8',
            stdio: 'pipe'
        });
    } catch (error) {
        expect(error.stderr).toMatch(/^Error: /);
    }

    // Trigger another error, e.g., unknown command
    try {
        execSync('node scripts/cli/index.js unknown-cmd', {
            encoding: 'utf8',
            stdio: 'pipe'
        });
    } catch (error) {
        // The index.js might print to stderr
        expect(error.stderr).toMatch(/^Error: /); // or check if it matches "Unknown command" prefixed with Error:
        // Current implementation prints "Unknown command: ..."
        // We will update it to "Error: Unknown command: ..."
    }
});
