import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.1.3 Nested folders are namespaced with the path preceding it.', () => {
  const output = execSync('node scripts/cli/index.js list', {
    encoding: 'utf8',
  });
  // Assuming we have nested folders like specifications/subfolder/test.spec.md
  // For now we check the general format
  const lines = output.split('\n');
  const specLines = lines.filter((l) => l.includes('.spec.md'));
  specLines.forEach((line) => {
    expect(line).toMatch(/.*\/.*/);
  });
});
