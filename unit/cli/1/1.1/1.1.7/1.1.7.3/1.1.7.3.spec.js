import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_add_test_3');
const tempFile = path.join(tempDir, 'add_3.spec.md');

it('1.1.7.3 <content> is the text of the new item', () => {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  const initialContent = `
# Test Spec

1. Section One
`;
  fs.writeFileSync(tempFile, initialContent);

  try {
    const myContent = 'This is specific content text';
    execSync(`node scripts/cli/index.js add ${tempFile} 1 "${myContent}"`, {
      encoding: 'utf8',
    });

    const content = fs.readFileSync(tempFile, 'utf8');
    expect(content).toContain(`    1.1. ${myContent}`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
