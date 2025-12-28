import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.4.8 --json flag displays the diff as a JSON object.', () => {
  const output = execSync(
    'node scripts/cli/index.js diff specifications/cli.spec.md --json',
    { encoding: 'utf8' },
  );
  const json = JSON.parse(output);
  expect(json).toHaveProperty('sections');
});
