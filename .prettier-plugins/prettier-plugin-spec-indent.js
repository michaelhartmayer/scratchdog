const specIndentPlugin = {
  languages: [
    {
      name: 'spec-markdown',
      parsers: ['spec-markdown-parser'],
      extensions: ['.md'], // We'll restrict this via overrides in config
    },
  ],
  parsers: {
    'spec-markdown-parser': {
      parse: (text) => {
        return {
          type: 'root',
          content: text,
        };
      },
      astFormat: 'spec-markdown-ast',
      locStart: () => 0,
      locEnd: () => 0,
    },
  },
  printers: {
    'spec-markdown-ast': {
      print: (path) => {
        const text = path.node.content;
        const lines = text.split('\n');
        const formattedLines = lines.map((line) => {
          const trimmed = line.trimStart();

          // Match lines starting with numbers like "1.", "1.1.", "1.1.1."
          // We want to capture the numbering part.
          // Regex: Start of string, followed by digits, dots, digits... ending with a dot and space?
          // The spec examples have "1. NodeJS", "1.1. Commands"
          const match = trimmed.match(/^(\d+(\.\d+)*)(\.?)(?=\s|$)/);

          if (match) {
            // match[1] is the number part like "1" or "1.1" or "1.1.1"
            // Split by dot to count levels
            const textPart = match[1];
            // Split by '.'
            // "1" -> ["1"] -> length 1 -> indent 0
            // "1.1" -> ["1", "1"] -> length 2 -> indent 3
            // "1.1.1" -> ["1", "1", "1"] -> length 3 -> indent 6
            const level = textPart.split('.').filter(Boolean).length;

            // Indentation rule: (level - 1) * 3 spaces
            const indentSize = Math.max(0, (level - 1) * 3);
            const indent = ' '.repeat(indentSize);

            return indent + trimmed;
          }

          // For lines that don't match (empty, headers without numbers, regular text)
          // We should probably preserve existing relative indentation or just trimmed?
          // If it's a continuation of a section text, it might need indentation.
          // However, the spec seems to be single-line items mostly.
          // Let's assume we preserve the indentation of non-numbered lines relative to the previous one?
          // Or just leave them alone?
          // If I trim them, I might break nested lists or code blocks.
          // Given the specific requirement "spec.md files properly indent specifications by sub-section",
          // and the file structure is mostly a list of items.
          // Let's try to just preserve the current indentation for non-numbered lines,
          // OR, safely, just return the line as serves if it's not a numbered list item.
          // BUT, if the user indents a numbered item, we want to force it.
          // If I only touch matched lines, I satisfy the requirement.
          // But if the sub-text is indented, and I change the parent, visual alignment breaks.
          // Let's stick to ONLY modifying lines that start with the numbering pattern.

          return line;
        });

        return formattedLines.join('\n');
      },
    },
  },
};

export default specIndentPlugin;
