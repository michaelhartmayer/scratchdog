import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_create_test_5');

it('1.1.8.5 --json flag displays the created file info as a JSON object', () => {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir);

    const folder = path.join(tempDir, 'specifications');
    const filename = 'json_spec.spec.md';
    const filePath = path.join(folder, filename);
    const title = 'JSON Spec';

    try {
        const output = execSync(`node scripts/cli/index.js create ${folder} ${filename} "${title}" --json`, { encoding: 'utf8' });
        const json = JSON.parse(output);

        expect(json).toHaveProperty('created', true);
        expect(json).toHaveProperty('file');
        expect(json.file).toContain(filename);
        expect(json).toHaveProperty('title', title);

    } finally {
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
