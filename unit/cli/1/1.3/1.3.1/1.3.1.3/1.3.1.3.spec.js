import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.3.1.3 Arguments must use `<>` for required and `[]` for optional parameters', () => {
  const output = execSync('node scripts/cli/index.js help', {
    encoding: 'utf8',
  });

  // Check specific commands known to have args
  expect(output).toContain('list [folder]'); // optional
  expect(output).toContain('toc <file> [section]'); // required then optional
  expect(output).toContain('edit <file> <section> <content>'); // all required
});
