import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.2.7 --json flag displays the toc as a JSON object.', () => {
  const output = execSync(
    'node scripts/cli/index.js toc specifications/cli.spec.md --json',
    { encoding: 'utf8' },
  );
  const json = JSON.parse(output);
  expect(json).toHaveProperty('sections');
  expect(Array.isArray(json.sections)).toBe(true);
});
