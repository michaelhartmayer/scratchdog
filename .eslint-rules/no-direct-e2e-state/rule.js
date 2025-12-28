/**
 * ESLint Rule: no-direct-e2e-state
 *
 * Spec 2.1.1.9: Direct access to `window.__*__` pattern is not allowed
 * outside of /src/utils/env-utils
 */

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow direct access to window.__*__ pattern outside env-utils',
      category: 'Best Practices',
    },
    messages: {
      noDirectE2EState:
        'Direct access to window.__*__ is not allowed. Use helpers from /src/utils/env-utils instead.',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Allow in env-utils directory
    if (
      filename.includes('/src/utils/env-utils/') ||
      filename.includes('\\src\\utils\\env-utils\\')
    ) {
      return {};
    }

    return {
      MemberExpression(node) {
        // Check for window.__ pattern
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'window' &&
          node.property.type === 'Identifier' &&
          node.property.name.startsWith('__') &&
          node.property.name.endsWith('__')
        ) {
          context.report({
            node,
            messageId: 'noDirectE2EState',
          });
        }

        // Also check for (window as any).__*__
        if (
          node.object.type === 'TSAsExpression' &&
          node.object.expression &&
          node.object.expression.type === 'Identifier' &&
          node.object.expression.name === 'window' &&
          node.property.type === 'Identifier' &&
          node.property.name.startsWith('__') &&
          node.property.name.endsWith('__')
        ) {
          context.report({
            node,
            messageId: 'noDirectE2EState',
          });
        }
      },

      // Check for computed property access: window['__GAME_STATE__']
      'MemberExpression[computed=true]'(node) {
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'window' &&
          node.property.type === 'Literal' &&
          typeof node.property.value === 'string' &&
          node.property.value.startsWith('__') &&
          node.property.value.endsWith('__')
        ) {
          // Allow in env-utils
          if (
            filename.includes('/src/utils/env-utils/') ||
            filename.includes('\\src\\utils\\env-utils\\')
          ) {
            return;
          }
          context.report({
            node,
            messageId: 'noDirectE2EState',
          });
        }
      },
    };
  },
};

export default rule;
