/**
 * ESLint Rule: no-commonjs-in-eslint-rules
 *
 * Spec 2.1.1.10: CommonJS syntax and extensions are not allowed in `.eslint-rules/`
 * - 2.1.1.10.1: require() and module.exports are not allowed
 * - 2.1.1.10.2: .cjs and .mjs file extensions are not allowed
 */

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow CommonJS require/module.exports and .cjs/.mjs extensions in .eslint-rules/',
      category: 'Best Practices',
    },
    messages: {
      noRequire:
        'require() is not allowed in .eslint-rules/. Use ESM import instead.',
      noModuleExports:
        'module.exports is not allowed in .eslint-rules/. Use ESM export instead.',
      noCjsExtension:
        '.cjs file extension is not allowed in .eslint-rules/. Use .js instead.',
      noMjsExtension:
        '.mjs file extension is not allowed in .eslint-rules/. Use .js instead.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Only apply to .eslint-rules/ directory
    if (
      !filename.includes('/.eslint-rules/') &&
      !filename.includes('\\.eslint-rules\\')
    ) {
      return {};
    }

    // Check for forbidden file extensions on first node
    let extensionChecked = false;

    function checkExtensions() {
      if (extensionChecked) return;
      extensionChecked = true;

      if (filename.endsWith('.cjs')) {
        context.report({
          loc: { line: 1, column: 0 },
          messageId: 'noCjsExtension',
        });
      }
      if (filename.endsWith('.mjs')) {
        context.report({
          loc: { line: 1, column: 0 },
          messageId: 'noMjsExtension',
        });
      }
    }

    return {
      Program() {
        checkExtensions();
      },

      // Check for require() calls
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require'
        ) {
          context.report({
            node,
            messageId: 'noRequire',
          });
        }
      },

      // Check for module.exports
      MemberExpression(node) {
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'module' &&
          node.property.type === 'Identifier' &&
          node.property.name === 'exports'
        ) {
          context.report({
            node,
            messageId: 'noModuleExports',
          });
        }
      },

      // Check for exports.* = ...
      AssignmentExpression(node) {
        if (
          node.left.type === 'MemberExpression' &&
          node.left.object.type === 'Identifier' &&
          node.left.object.name === 'exports'
        ) {
          context.report({
            node: node.left,
            messageId: 'noModuleExports',
          });
        }
      },
    };
  },
};

export default rule;
