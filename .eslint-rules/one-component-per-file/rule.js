export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce one React component per file',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
  },
  create(context) {
    const components = [];

    function isComponent(node) {
      // Simple check: FunctionDeclaration or VariableDeclarator with Capitalized name returning JSX (implied)
      // For this simplified version, we'll look for Capitalized functions/arrow functions.
      // A more robust version would check return statements for JSX.
      let name = '';
      if (node.type === 'FunctionDeclaration') {
        name = node.id ? node.id.name : '';
      } else if (node.type === 'VariableDeclarator') {
        name = node.id.name;
        if (
          !node.init ||
          (node.init.type !== 'ArrowFunctionExpression' &&
            node.init.type !== 'FunctionExpression')
        ) {
          return false;
        }
      }

      if (!name || !/^[A-Z]/.test(name)) return false;

      // We assume it's a component if it starts with Uppercase.
      // This might catch non-components, but for this spec it's a safe starting point.
      return true;
    }

    return {
      FunctionDeclaration(node) {
        if (isComponent(node)) {
          components.push(node);
        }
      },
      VariableDeclarator(node) {
        if (isComponent(node)) {
          components.push(node);
        }
      },
      'Program:exit'() {
        if (components.length > 1) {
          context.report({
            node: components[1],
            message: 'Only one React component per file is allowed.',
          });
        }
      },
    };
  },
};
