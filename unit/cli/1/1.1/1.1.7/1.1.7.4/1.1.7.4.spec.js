import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.7.4 --help flag displays the help message for the add command', () => {
    const output = execSync('node scripts/cli/index.js add --help', { encoding: 'utf8' });
    expect(output).toContain('Usage: npm run specter add <file> <section> <content>');
    expect(output).toContain('Appends a new specification item');
});
