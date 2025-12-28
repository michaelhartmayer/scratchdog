import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.3.1 Displays the specification for the <file> file.', () => {
  const output = execSync(
    'node scripts/cli/index.js spec specifications/cli.spec.md',
    { encoding: 'utf8' },
  );
  expect(output).toContain('Specification for specifications/cli.spec.md:');
});
