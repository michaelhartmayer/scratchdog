export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that all hooks must be named with the prefix "use"',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [],
    messages: {
      hookNaming:
        'All hooks must be named with the prefix "use". "{{ name }}" is invalid.',
    },
  },
  create(context) {
    const filename = context.getFilename();
    const isHookFile = filename.includes('/src/hooks/');

    if (!isHookFile) {
      return {};
    }

    return {
      ExportNamedDeclaration(node) {
        if (
          node.declaration &&
          node.declaration.type === 'VariableDeclaration'
        ) {
          node.declaration.declarations.forEach((decl) => {
            if (decl.id.type === 'Identifier') {
              const name = decl.id.name;
              if (!name.startsWith('use')) {
                context.report({
                  node: decl.id,
                  messageId: 'hookNaming',
                  data: { name },
                });
              }
            }
          });
        }
        if (
          node.declaration &&
          node.declaration.type === 'FunctionDeclaration'
        ) {
          const name = node.declaration.id.name;
          if (!name.startsWith('use')) {
            context.report({
              node: node.declaration.id,
              messageId: 'hookNaming',
              data: { name },
            });
          }
        }
      },
      ExportDefaultDeclaration(node) {
        if (
          node.declaration.type === 'FunctionDeclaration' &&
          node.declaration.id
        ) {
          const name = node.declaration.id.name;
          if (!name.startsWith('use')) {
            context.report({
              node: node.declaration.id,
              messageId: 'hookNaming',
              data: { name },
            });
          }
        }
        // Handling anonymous default exports is tricky in terms of naming,
        // but typically hooks are named.
      },
    };
  },
};
