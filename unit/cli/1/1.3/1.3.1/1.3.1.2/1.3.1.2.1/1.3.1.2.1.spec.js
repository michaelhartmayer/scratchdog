import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.3.1.2.1 Command names and arguments column must be padded to a fixed width of 35 characters', () => {
    const output = execSync('node scripts/cli/index.js help', {
        encoding: 'utf8',
    });

    const lines = output.split('\n');
    const commandLines = lines.filter(line => line.trim().startsWith('list') || line.trim().startsWith('toc') || line.trim().startsWith('spec') || line.trim().startsWith('diff') || line.trim().startsWith('edit'));

    commandLines.forEach(line => {
        // The command part starts at index 2 (2 spaces indent) and should end before index 37 (2 + 35)
        // Actually, checking if the description starts at a specific index is easier or checking the padding.
        // The spec says "Command names and arguments column must be padded to a fixed width of 35 characters."
        // Assuming indentation of 2 spaces:
        // "  <command+args...padded to 35> <description>"

        // Let's just check that there is a long whitespace gap or rigid structure.
        // Better: extract the part before the description and measure it.

        // Regex to split: spaces at the start, command+args, multiple spaces, description
        const match = line.match(/^  (.+?)( {2,})(.*)$/);
        if (match) {
            const commandPart = match[1];
            // expected length is 35? or padding implies the column width is 35.
            // If column width is 35, and we have 2 spaces indent, then description starts at 37.
            // So commandPart.length should be < 35, and match[1] + spaces should probably align.
            // Let's verify standard: "padded to a fixed width of 35 characters" usually means the string is padEnd(35).

            expect(commandPart.length).toBeLessThanOrEqual(35);

            // Check if the total length before description is consistent or specifically 35.
            // If the implementation uses padEnd(35), then the text + spaces = 35.
            // However, we trim the line for the match.
            // Let's check the absolute index of description start.
            const descIndex = line.indexOf(match[3]);
            // 2 spaces indent + 35 chars padding = 37
            expect(descIndex).toBe(37);
        }
    });
});
