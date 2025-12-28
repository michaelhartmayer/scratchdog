export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce component organization rules',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();

        // Skip if filename is not available (e.g. some test environments) could be absolute
        if (filename === '<text>') return;

        // Normalize separators to forward slashes for cross-platform
        const normalizedPath = filename.replace(/\\/g, '/');

        // Only check files in src
        if (!normalizedPath.includes('/src/')) return;

        // Extract part after src
        const pathAfterSrc = normalizedPath.split('/src/')[1];

        // 4.1. Check specific folders: components, providers
        // "UI components must be in /components" -> checks if likely component is in right place?
        // The spec says: "All components must be in a folder of the same name and exported by an index.ts file"

        // We can check strictly directory structure.

        const parts = pathAfterSrc.split('/');
        const folder = parts[0];
        // e.g. 'components', 'providers'

        if (['components', 'providers'].includes(folder)) {
          // Rule: "All components must be in a folder of the same name and exported by an index.ts file"
          // This implies structure: /src/components/MyComponent/MyComponent.tsx AND /src/components/MyComponent/index.ts

          // Check if it is a TS/TSX file and not an index.ts
          const fileNameWithExt = parts[parts.length - 1];

          // If it is an index file, we are good (it exists)
          if (fileNameWithExt === 'index.ts' || fileNameWithExt === 'index.tsx')
            return;

          // We only care about .tsx or .ts files that are likely the component implementation
          if (!fileNameWithExt.match(/\.tsx?$/)) return;

          const componentName = fileNameWithExt.replace(/\.tsx?$/, '');
          const parentFolders = parts.slice(0, -1);
          const directParent = parentFolders[parentFolders.length - 1];

          // Check 1: File must be in a folder of the same name
          if (directParent !== componentName) {
            context.report({
              node: node,
              message: `File ${fileNameWithExt} must be inside a folder named ${componentName}`,
            });
            return; // Stop here if this fails
          }

          // Check 2: There must be an index.ts or index.tsx in the same folder
          // We can't easily "look around" the file system in a robust, purely static analysis way
          // without using 'fs', but ESLint rule context is usually per-file.
          // However, we can use `fs` in ESLint rules if running in Node environment.
          // Standard ESLint rules often avoid fs, but for project-specific repo rules it is acceptable.

          try {
            const fs = require('fs');
            const path = require('path');
            const dir = path.dirname(filename);
            const filesInDir = fs.readdirSync(dir);

            const hasIndex =
              filesInDir.includes('index.ts') ||
              filesInDir.includes('index.tsx');

            if (!hasIndex) {
              context.report({
                node: node,
                message: `Component ${componentName} must have an index.ts or index.tsx file in its directory`,
              });
            }
          } catch (e) {
            // If we can't access fs (e.g. browser or specific test env), we skip this check
            // or logging it? For now, silent fail or maybe console.warn
          }
        }
      },
    };
  },
};
