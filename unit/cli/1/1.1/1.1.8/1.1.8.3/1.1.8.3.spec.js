import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_create_test_3');

it('1.1.8.3 The file is initialized with the <title> as the main H1 header', () => {
  if (fs.existsSync(tempDir))
    fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir);

  const folder = path.join(tempDir, 'specifications');
  const filename = 'titled_spec.spec.md';
  const title = 'My Awesome Specification';

  try {
    execSync(
      `node scripts/cli/index.js create ${folder} ${filename} "${title}"`,
      { encoding: 'utf8' },
    );

    const filePath = path.join(folder, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    // Should contain "# My Awesome Specification"
    expect(content).toContain(`# ${title}`);
    // Should ideally be at the start
    expect(content.trim().startsWith(`# ${title}`)).toBe(true);
  } finally {
    if (fs.existsSync(tempDir))
      fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
