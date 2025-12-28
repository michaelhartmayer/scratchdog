import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.1.5 --help flag displays the help message for the list command.', () => {
    const output = execSync('node scripts/cli/index.js list --help', { encoding: 'utf8' });
    expect(output).toContain('Usage: npm run specter list <folder>');
    expect(output).toContain('Lists all specification files');
});
