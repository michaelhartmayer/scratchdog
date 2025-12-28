import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1 Commands', () => {
  const output = execSync('node scripts/cli/index.js help', {
    encoding: 'utf8',
  });
  expect(output).toContain('Commands:');
  expect(output).toContain('list');
  expect(output).toContain('toc');
  expect(output).toContain('spec');
  expect(output).toContain('diff');
  expect(output).toContain('help');
});
