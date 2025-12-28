import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.4.7 <section> may incude a trailing period or not.', () => {
    const outputNoPeriod = execSync('node scripts/cli/index.js diff specifications/cli.spec.md 1.1', { encoding: 'utf8' }).split('\n').slice(1).join('\n');
    const outputPeriod = execSync('node scripts/cli/index.js diff specifications/cli.spec.md 1.1.', { encoding: 'utf8' }).split('\n').slice(1).join('\n');
    expect(outputNoPeriod).toBe(outputPeriod);
});
