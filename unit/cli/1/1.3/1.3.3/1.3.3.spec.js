import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_json_test');
const tempFile = path.join(tempDir, 'json_format.spec.md');

it('1.3.3 JSON Output Schema', () => {
    // Setup
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const content = `
# Test Spec

1. Parent Section
    1.1. Child Section
        1.1.1. Grandchild Section
`;
    fs.writeFileSync(tempFile, content);

    try {
        const output = execSync(`node scripts/cli/index.js spec ${tempFile} --json`, {
            encoding: 'utf8',
        });
        const json = JSON.parse(output);

        // Check root structure
        expect(json).toHaveProperty('sections');
        expect(Array.isArray(json.sections)).toBe(true);
        expect(json.sections.length).toBeGreaterThan(0);

        const parent = json.sections[0];

        // 1.3.3.1. number: The section number without a trailing period.
        expect(parent).toHaveProperty('number', '1');
        expect(parent.number).not.toMatch(/\.$/);

        // 1.3.3.2. name: The name of the section.
        expect(parent).toHaveProperty('name', 'Parent Section');

        // 1.3.3.3. content: The text content of the section, stripped of indentation and numbering.
        // The parser usually puts the full line in 'content' currently. 
        // We expect it to be just "Parent Section" effectively? 
        // Wait, spec says: "content: The text content of the section, stripped of indentation and numbering."
        // Usually "name" is the title. "content" implies the body? 
        // But in this markdown format, the line IS the content. 
        // If the line is "1. Parent Section", then name is "Parent Section".
        // What is "content" then? 
        // If we look at existing `display.js`:
        // content: s.fullLine
        // So "Parent Section" is the text. 
        // If the spec means "text content of the section header line" then name == content.
        // If it means "body of the section", well, sections don't really have body text separate from subsections in this parser logic usually, unless it captures text blocks.
        // Let's assume for now "content" is the cleaned text, which might be same as name, OR it's the raw text without numbers.
        // Let's check what the user asked: 
        // "content": current would say "     1.2.2. stuff" but we just want it to say stuff
        // So content should be "stuff". Name is also "stuff". 
        // Redundant? Maybe. Or maybe "name" is a short slug? 
        // The user said: 
        // name: "the name"
        // content: ... just want it to say stuff
        // It seems they are identical in this context.
        expect(parent).toHaveProperty('content', 'Parent Section');

        // 1.3.3.4. Level is not included in the output.
        expect(parent).not.toHaveProperty('level');

        // 1.3.3.5. subsections: An array of nested sections defined recursively.
        expect(parent).toHaveProperty('subsections');
        expect(Array.isArray(parent.subsections)).toBe(true);
        expect(parent.subsections.length).toBe(1);

        const child = parent.subsections[0];
        expect(child).toHaveProperty('number', '1.1');
        expect(child).toHaveProperty('name', 'Child Section');
        expect(child).toHaveProperty('subsections');

        const grandchild = child.subsections[0];
        expect(grandchild).toHaveProperty('number', '1.1.1');
        expect(grandchild).toHaveProperty('name', 'Grandchild Section');

    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
