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
            acc.push(`${indent}${numbering} ${content}`);
          } else {
            // Non-numbered lines (headers like "# Dev Spec", or unmatched text)
            // We return them as is, but trimmed?
            // If we strict trim, we might lose intentional indentation for code blocks.
            // But the user requirements are seemingly for the spec list items.
            // For safety with mixed content (headers), let's just return the line processed?
            // If I trim everything, headers "# Title" work fine.
            // Multiline descriptions might break if I trim them.
            // But valid spec lines usually follow the pattern.
            // Let's rely on the user's "strict" implication.
            // If it matches a header start "#", keep it.
            // If it's just text, maybe keep previous indent?
            // Simplest safe approach: usage of the original line's indentation for non-matches?
            // BUT, "no tabs", "no extra spaces" applies globally?
            // Let's assume non-matching lines should just be trimmed or kept as is but likely the user wants clean file.
            // Let's keep unmatched lines essentially as-is but rtrim?
            // Or better: Indent them relative to previous? Too complex.
            // Fallback: Just return the original line (but maybe replace tabs?).
            // Wait, I trimmed `line` at the start of loop.
            // If I use `trimmed` here, I lose indentation for non-spec lines.
            // Let's recover the original indentation for non-spec lines if possible, or just accept that spec.md is highly structured.
            // The file seems to be pure headers + list.
            // If I blindly trim non-list lines, standard headers work (# Header).
            // Let's stick with `trimmed` for everything to enforce "no extra spaces".
            acc.push(trimmed);
          }

          return acc;
        }, []);

        return formattedLines.join('\n') + '\n'; // Ensure final newline
      },
    },
  },
};

export default specIndentPlugin;
