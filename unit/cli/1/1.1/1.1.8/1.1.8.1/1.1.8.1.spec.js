import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_create_test_1');

it('1.1.8.1 Creates a new specification file at <folder>/<filename>', () => {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir);

    const folder = path.join(tempDir, 'specifications');
    const filename = 'new_spec.spec.md';
    const filePath = path.join(folder, filename);
    const title = 'New Specification';

    try {
        execSync(`node scripts/cli/index.js create ${folder} ${filename} "${title}"`, { encoding: 'utf8' });

        expect(fs.existsSync(filePath)).toBe(true);
    } finally {
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
