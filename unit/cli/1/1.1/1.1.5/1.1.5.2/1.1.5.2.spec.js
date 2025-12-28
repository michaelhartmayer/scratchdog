import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.5.2 Output is formatted as a list of commands.', () => {
  const output = execSync('node scripts/cli/index.js help', {
    encoding: 'utf8',
  });
  expect(output).toContain('Commands:');
});
