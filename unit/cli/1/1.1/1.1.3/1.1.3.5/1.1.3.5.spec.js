import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.3.5 --help flag displays the help message for the spec command.', () => {
    const output = execSync('node scripts/cli/index.js spec --help', { encoding: 'utf8' });
    expect(output).toContain('Usage: npm run specter spec <file> [section]');
});
