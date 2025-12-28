export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce hook organization rules',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();

        // Skip if filename is not available or is <text>
        if (filename === '<text>') return;

        // Normalize separators
        const normalizedPath = filename.replace(/\\/g, '/');

        // Only check files in src/hooks
        if (!normalizedPath.includes('/src/hooks/')) return;

        const pathAfterSrc = normalizedPath.split('/src/')[1];
        const parts = pathAfterSrc.split('/');

        // parts[0] is 'hooks'

        const fileNameWithExt = parts[parts.length - 1];

        // If it's an index file, it's allowed
        if (fileNameWithExt === 'index.ts') return;

        // We only care about .ts/.tsx files, usually hooks are .ts or .tsx
        if (!fileNameWithExt.match(/\.tsx?$/)) return;

        const hookName = fileNameWithExt.replace(/\.tsx?$/, '');
        const parentFolders = parts.slice(0, -1);
        const directParent = parentFolders[parentFolders.length - 1];

        // Check 1: File must be in a folder of the same name
        // e.g. /src/hooks/useMyHook/useMyHook.ts
        if (directParent !== hookName) {
          context.report({
            node: node,
            message: `File ${fileNameWithExt} must be inside a folder named ${hookName}`,
          });
          return;
        }

        // Check 2: There must be an index.ts in the same folder
        try {
          const fs = require('fs');
          const path = require('path');
          const dir = path.dirname(filename);
          const filesInDir = fs.readdirSync(dir);

          const hasIndex = filesInDir.includes('index.ts');

          if (!hasIndex) {
            context.report({
              node: node,
              message: `Hook ${hookName} must have an index.ts file in its directory`,
            });
          }
        } catch (e) {
          // Ignore fs errors
        }
      },
    };
  },
};
