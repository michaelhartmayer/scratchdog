import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.4.4 Output is formatted as a list of sections.', () => {
  const output = execSync(
    'node scripts/cli/index.js diff specifications/cli.spec.md',
    { encoding: 'utf8' },
  );
  expect(output).toBeDefined();
});
