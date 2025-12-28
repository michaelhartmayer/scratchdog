import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_add_test_6');
const tempFile = path.join(tempDir, 'add_6.spec.md');

it('1.1.7.6 --json flag displays the added item as a JSON object, following the standard format', () => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const initialContent = `
# Test Spec

1. Section One
`;
    fs.writeFileSync(tempFile, initialContent);

    try {
        const output = execSync(`node scripts/cli/index.js add ${tempFile} 1 "New Item" --json`, { encoding: 'utf8' });
        const json = JSON.parse(output);

        // Should match standard format: { sections: [...] }
        expect(json).toHaveProperty('sections');
        expect(json.sections).toHaveLength(1);

        const addedItem = json.sections[0];
        expect(addedItem).toHaveProperty('number', '1.1');
        expect(addedItem).toHaveProperty('name', 'New Item');
        expect(addedItem).toHaveProperty('subsections');
        expect(addedItem.subsections).toEqual([]);

    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
