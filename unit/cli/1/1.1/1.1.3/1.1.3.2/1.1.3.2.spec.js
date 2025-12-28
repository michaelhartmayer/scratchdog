import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.3.2 <section> is optional and defaults to the entire file.', () => {
    const output = execSync('node scripts/cli/index.js spec specifications/cli.spec.md', { encoding: 'utf8' });
    expect(output).toContain('1. CLI');
    expect(output).toContain('1.1. Commands');
});
