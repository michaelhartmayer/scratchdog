import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.6.4 --help flag displays the help message for the edit command', () => {
  const output = execSync('node scripts/cli/index.js edit --help', {
    encoding: 'utf8',
  });
  expect(output).toContain('Usage: edit <file> <section> <content>');
  expect(output).toContain('Updates the content of the specified <section>');
});
