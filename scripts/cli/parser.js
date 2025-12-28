import fs from 'fs';
import path from 'path';

export function parseSpecFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const sections = [];
  let currentPath = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\s*)(\d+(?:\.\d+)*\.?)\s+(.*)$/);

    if (match) {
      const indent = match[1];
      const number = match[2];
      const text = match[3].trim();
      const level = number.split('.').filter(Boolean).length;

      const section = {
        number,
        text,
        level,
        lineIndex: i,
        fullLine: line,
        children: [],
      };

      sections.push(section);
    }
  }

  return {
    lines,
    sections,
  };
}

export function countSpecLines(sections) {
  return sections.length;
}

const normalize = (n) => (n.endsWith('.') ? n.slice(0, -1) : n);

export function getSectionsByParent(sections, parentNumber) {
  if (!parentNumber) return sections;

  const normParent = normalize(parentNumber);
  const prefix = normParent + '.';
  return sections.filter((s) => {
    const normS = normalize(s.number);
    return normS === normParent || normS.startsWith(prefix);
  });
}

export function getTopLevelSections(sections, parentNumber) {
  if (!parentNumber) return sections.filter((s) => s.level === 1);

  const normParent = normalize(parentNumber);
  const parent = sections.find((s) => normalize(s.number) === normParent);
  if (!parent) return [];

  const targetLevel = parent.level + 1;
  const prefix = normParent + '.';

  return sections.filter(
    (s) => s.level === targetLevel && normalize(s.number).startsWith(prefix),
  );
}

export function buildSectionTree(sections) {
  const root = [];
  const stack = []; // Stores { section, level }

  sections.forEach(section => {
    // Create the formatted node per 1.3.3 spec
    const node = {
      number: normalize(section.number),
      name: section.text,
      content: section.text, // Assuming content matches name for now based on spec/test
      subsections: []
    };

    const level = section.level;

    // Manage stack to find parent
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].node.subsections.push(node);
    }

    stack.push({ node, level });
  });

  return root;
}
