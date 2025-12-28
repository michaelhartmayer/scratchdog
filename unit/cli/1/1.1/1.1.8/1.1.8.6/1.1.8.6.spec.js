import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_create_test_6');

it('1.1.8.3 (Extension) If multiple arguments provided after filename, they are joined to form the title', () => {
  if (fs.existsSync(tempDir))
    fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir);

  const folder = path.join(tempDir, 'specifications');
  const filename = 'multi_word.spec.md';

  // Arguments: folder filename word1 word2 word3
  const args = `node scripts/cli/index.js create ${folder} ${filename} This is a multi word title`;

  try {
    execSync(args, { encoding: 'utf8' });

    const filePath = path.join(folder, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    // Should contain "# This is a multi word title"
    expect(content.trim().startsWith('# This is a multi word title')).toBe(
      true,
    );
    expect(content).toContain('# This is a multi word title');
  } finally {
    if (fs.existsSync(tempDir))
      fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
