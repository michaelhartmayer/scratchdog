import fs from 'fs';
import path from 'path';
import { parseSpecFile } from './parser.js';

export function editCommand(filePath, sectionNumber, newContent, options = {}) {
  if (options.help) {
    console.log('Usage: edit <file> <section> <content>');
    console.log('');
    console.log(
      'Updates the content of the specified <section> in <file> with <content>.',
    );
    console.log('<content> replaces the existing specification text.');
    console.log('<section> must be a valid existing section.');
    console.log('');
    console.log('Options:');
    console.log('  --help    Display this help message');
    return;
  }

  if (!filePath || !sectionNumber || !newContent) {
    console.error('Error: valid file, section and content are required.');
    console.log('Usage: edit <file> <section> <content>');
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File ${filePath} not found.`);
    process.exit(1);
  }

  const { lines, sections } = parseSpecFile(fullPath);

  // Find the exact section
  // Normalize sectionNumber to handle potential trailing dots if consistent with parser
  const normalize = (n) => (n.endsWith('.') ? n.slice(0, -1) : n);
  const targetNorm = normalize(sectionNumber);

  const section = sections.find((s) => normalize(s.number) === targetNorm);

  if (!section) {
    console.error(`Error: Section ${sectionNumber} not found.`);
    process.exit(1);
  }

  // Preserve indentation and number
  // The fullLine is stored in section object, but we also have lineIndex
  const originalLine = lines[section.lineIndex];

  // Regex to extract parts: indent, number, existing text
  const match = originalLine.match(/^(\s*)(\d+(?:\.\d+)*\.?)\s+(.*)$/);

  if (!match) {
    // This looks like a parsing error or inconsistency
    console.error(
      `Error: Could not parse line ${section.lineIndex + 1}: ${originalLine}`,
    );
    process.exit(1);
  }

  const indent = match[1];
  const number = match[2];

  // Construct new line
  const newLine = `${indent}${number} ${newContent}`;

  lines[section.lineIndex] = newLine;

  const newFileContent = lines.join('\n');
  fs.writeFileSync(fullPath, newFileContent, 'utf8');

  console.log(`Updated section ${sectionNumber} in ${filePath}`);
}
