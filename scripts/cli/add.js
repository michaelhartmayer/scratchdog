import fs from 'fs';
import path from 'path';
import {
  parseSpecFile,
  getTopLevelSections,
  getSectionsByParent,
  normalize,
} from './parser.js';
import { specCommand } from './display.js';

export async function addCommand(
  filePath,
  sectionNumber,
  newContent,
  options = {},
) {
  if (options.help) {
    console.log('Usage: npm run specter add <file> <section> <content>');
    console.log('');
    console.log('Appends a new specification item to the <section> in <file>.');
    console.log(
      'The new item is numbered sequentially after the last existing child of <section>.',
    );
    console.log(
      "Use '.' (dot) as <section> to explicitly add the item to the root level.",
    );
    console.log('<content> is the text of the new item.');
    console.log('');
    console.log('Options:');
    console.log('  --help    Display this help message');
    console.log('  --json    Display output as JSON');
    return;
  }

  if (!filePath || !sectionNumber || !newContent) {
    console.error('Error: valid file, section and content are required.');
    console.log('Usage: npm run specter add <file> <section> <content>');
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File ${filePath} not found.`);
    process.exit(1);
  }

  const { lines, sections } = parseSpecFile(fullPath);
  const isRoot = sectionNumber === '.';

  let targetParentNorm;
  let parentSection;

  if (isRoot) {
    targetParentNorm = null; // Root has no parent number
  } else {
    targetParentNorm = normalize(sectionNumber);
    parentSection = sections.find(
      (s) => normalize(s.number) === targetParentNorm,
    );

    if (!parentSection) {
      console.error(`Error: Section ${sectionNumber} not found.`);
      process.exit(1);
    }
  }

  const children = getTopLevelSections(sections, targetParentNorm);
  let nextNumber;

  if (children.length > 0) {
    const lastChild = children[children.length - 1];
    const parts = normalize(lastChild.number).split('.');
    const lastPart = parseInt(parts[parts.length - 1], 10);
    parts[parts.length - 1] = (lastPart + 1).toString();
    nextNumber = parts.join('.');
  } else {
    // No children (or no top-level items if root)
    if (isRoot) {
      nextNumber = '1';
    } else {
      nextNumber = `${targetParentNorm}.1`;
    }
  }

  // Determine insertion point
  let insertIndex;

  if (isRoot) {
    // If root, we insert after the last section in the file generally?
    // Or after the last top level item and its descendants.
    // getSectionsByParent(sections, null) returns ALL sections?
    // Let's check parser.js: if (!parentNumber) return sections;
    // So if root, allDescendants is everything.
    const allDescendants = sections; // effectively

    if (allDescendants.length > 0) {
      const lastDescendant = allDescendants[allDescendants.length - 1];
      insertIndex = lastDescendant.lineIndex + 1;
    } else {
      // Empty file or just header
      insertIndex = lines.length;
    }
  } else {
    // Find all descendants to calculate where the block ends
    const allDescendants = getSectionsByParent(sections, targetParentNorm);

    // Filter out the parent itself to check if there are REAL descendants.
    const realDescendants = allDescendants.filter(
      (s) => normalize(s.number) !== targetParentNorm,
    );

    if (realDescendants.length > 0) {
      const lastDescendant = realDescendants[realDescendants.length - 1];
      insertIndex = lastDescendant.lineIndex + 1;
    } else {
      insertIndex = parentSection.lineIndex + 1;
    }
  }

  // Determine indentation
  let newIndent = '';
  if (!isRoot && parentSection) {
    const indentMatch = parentSection.fullLine.match(/^(\s*)/);
    const parentIndent = indentMatch ? indentMatch[1] : '';
    newIndent = parentIndent + '    ';
  }
  // If root, indent is '' (empty).

  const newLine = `${newIndent}${nextNumber}. ${newContent}`;

  lines.splice(insertIndex, 0, newLine);

  const newFileContent = lines.join('\n');
  fs.writeFileSync(fullPath, newFileContent, 'utf8');

  // Output using specCommand
  await specCommand(filePath, nextNumber, { json: options.json });
}
