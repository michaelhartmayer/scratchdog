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

        let previousLineWasEmpty = false;

        const formattedLines = lines.reduce((acc, line) => {
          const trimmed = line.trim(); // Trim both ends

          if (!trimmed) {
            // Empty line handling for "no extra newlines"
            if (previousLineWasEmpty) {
              // Skip if previous was also empty (collapse)
              return acc;
            }
            // Keep one empty line
            previousLineWasEmpty = true;
            acc.push('');
            return acc;
          }

          previousLineWasEmpty = false;

          // Match lines starting with numbers like "1.", "1.1.", "1.1.1."
          // Capture #1: The numbering (e.g., "1.1.")
          // Capture #2: The text content
          // Regex:
          // ^          Start
          // (\d+(?:\.\d+)*\.?)  Capture 1: Digits, optional (dot digits)*, optional dot
          // \s+        One or more whitespace
          // (.*)       Capture 2: Rest of text
          //
          // Note: The previous logic relied on "trimmed match".
          const match = trimmed.match(/^(\d+(?:\.\d+)*\.?)\s+(.*)$/);

          if (match) {
            const numbering = match[1];
            const content = match[2];

            // Calculate level
            // "1." -> 1
            // "1.1." -> 2
            // "1.1.1." -> 3
            // Split by '.' and filter.
            // "1." -> ["1", ""] -> len 1
            // "1.1." -> ["1", "1", ""] -> len 2
            const level = numbering.split('.').filter(Boolean).length;

            // Indentation rule: (level - 1) * 4 spaces
            const indentSize = Math.max(0, (level - 1) * 4);
            const indent = ' '.repeat(indentSize);

            // Reconstruct with EXACTLY one space between numbering and content
            // Add two spaces at the end for GitHub soft breaks
            acc.push(`${indent}${numbering} ${content}  `);
          } else {
            // Non-numbered lines (headers like "# Dev Spec", or unmatched text)
            // Add two spaces at the end of non-numbered lines as well, unless it's a header
            const suffix = trimmed.startsWith('#') ? '' : '  ';
            acc.push(trimmed + suffix);
          }

          return acc;
        }, []);

        return formattedLines.join('\n') + '\n'; // Ensure final newline
      },
    },
  },
};

export default specIndentPlugin;
