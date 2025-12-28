import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.2.5 --help flag displays the help message for the toc command.', () => {
    const output = execSync('node scripts/cli/index.js toc --help', { encoding: 'utf8' });
    expect(output).toContain('Usage: npm run specter toc <file> [section]');
});
