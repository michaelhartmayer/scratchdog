import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.3.7 --json flag displays the spec as a JSON object.', () => {
    const output = execSync('node scripts/cli/index.js spec specifications/cli.spec.md 1.1.1 --json', { encoding: 'utf8' });
    const json = JSON.parse(output);
    expect(json).toHaveProperty('sections');
    expect(json.sections[0]).toHaveProperty('content');
});
