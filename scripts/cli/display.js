import path from 'path';
import { parseSpecFile, getSectionsByParent } from './parser.js';

export function specCommand(file, sectionNumber, options = {}) {
    if (options.help) {
        console.log('Usage: npm run specter spec <file> [section]');
        console.log('');
        console.log('Displays the specification for the specified file.');
        console.log('If [section] is provided, it shows only that section and its nested content.');
        console.log('');
        console.log('Options:');
        console.log('  --help    Display this help message');
        return;
    }

    if (!file) {
        console.error('Error: No specification file specified.');
        return;
    }

    const filePath = path.resolve(process.cwd(), file);
    const { sections } = parseSpecFile(filePath);

    if (sections.length === 0) {
        console.log('No specification items found in file.');
        return;
    }

    const targetSections = getSectionsByParent(sections, sectionNumber);

    if (targetSections.length === 0) {
        if (options.json) {
            console.log(JSON.stringify({ error: `Section ${sectionNumber} not found.` }));
        } else {
            console.log(`Section ${sectionNumber} not found.`);
        }
        return;
    }

    if (options.json) {
        const sectionsList = targetSections.map(s => ({
            number: s.number,
            name: s.text,
            level: s.level,
            content: s.fullLine
        }));
        console.log(JSON.stringify({ sections: sectionsList }, null, 2));
    } else {
        console.log(`Specification for ${file}${sectionNumber ? ` section ${sectionNumber}` : ''}:`);
        console.log('--------------------------------------------------');

        targetSections.forEach(s => {
            console.log(s.fullLine);
        });
    }
}
