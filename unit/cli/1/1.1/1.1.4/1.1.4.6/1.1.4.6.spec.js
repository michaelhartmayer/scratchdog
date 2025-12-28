import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.4.6 --help flag displays the help message for the diff command.', () => {
    const output = execSync('node scripts/cli/index.js diff --help', { encoding: 'utf8' });
    expect(output).toContain('Usage: npm run specter diff <file> [section]');
});
