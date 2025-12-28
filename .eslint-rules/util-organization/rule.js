export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce utility organization rules',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();

        if (filename === '<text>') return;

        const normalizedPath = filename.replace(/\\/g, '/');

        if (!normalizedPath.includes('/src/utils/')) return;

        const pathAfterSrc = normalizedPath.split('/src/')[1];
        const parts = pathAfterSrc.split('/');

        const fileNameWithExt = parts[parts.length - 1];

        if (fileNameWithExt === 'index.ts') return;

        if (!fileNameWithExt.match(/\.ts$/)) return; // Utils are usually just .ts

        const utilName = fileNameWithExt.replace(/\.ts$/, '');
        const parentFolders = parts.slice(0, -1);
        const directParent = parentFolders[parentFolders.length - 1];

        // Check 1: File must be in a folder of the same name
        if (directParent !== utilName) {
          context.report({
            node: node,
            message: `File ${fileNameWithExt} must be inside a folder named ${utilName}`,
          });
          return;
        }

        // Check 2: There must be an index.ts
        try {
          const fs = require('fs');
          const path = require('path');
          const dir = path.dirname(filename);
          const filesInDir = fs.readdirSync(dir);

          const hasIndex = filesInDir.includes('index.ts');

          if (!hasIndex) {
            context.report({
              node: node,
              message: `Utility ${utilName} must have an index.ts file in its directory`,
            });
          }
        } catch (e) {
          // Ignore
        }
      },
    };
  },
};
