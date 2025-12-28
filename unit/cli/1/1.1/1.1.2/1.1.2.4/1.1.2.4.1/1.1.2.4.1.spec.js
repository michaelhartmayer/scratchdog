import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.2.4.1 Each section is displayed with its name and number of total specification lines.', () => {
  const output = execSync(
    'node scripts/cli/index.js toc specifications/cli.spec.md',
    { encoding: 'utf8' },
  );
  expect(output).toMatch(/1\. .* \(\d+ spec lines\)/);
});
