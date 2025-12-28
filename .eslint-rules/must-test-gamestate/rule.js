/**
 * ESLint Rule: must-test-gamestate
 *
 * Spec 2.1.1.11: When the /** @mustTestDrMarioGamestate * / tag is present,
 * the test must evaluate the Dr. Mario game state using getE2EState().
 */

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce game state evaluation via getE2EState in tests tagged with @mustTestDrMarioGamestate',
      category: 'Possible Errors',
    },
    messages: {
      mustTestGameState:
        'Test tagged with @mustTestDrMarioGamestate must use getE2EState() to verify state. Direct access to __DRMARIO_STATE__ is not allowed.',
    },
    schema: [],
  },

  create(context) {
    return {
      ExpressionStatement(node) {
        if (
          node.expression.type === 'CallExpression' &&
          node.expression.callee.type === 'Identifier' &&
          node.expression.callee.name === 'test'
        ) {
          const sourceCode = context.sourceCode || context.getSourceCode();
          const comments = sourceCode.getCommentsBefore(node);
          const hasTag = comments.some((comment) =>
            comment.value.includes('@mustTestDrMarioGamestate'),
          );

          if (hasTag) {
            const testBody = node.expression.arguments[1];
            if (
              !testBody ||
              (testBody.type !== 'ArrowFunctionExpression' &&
                testBody.type !== 'FunctionExpression')
            ) {
              return;
            }

            let evaluatesStateCorrectly = false;
            let usesDirectAccess = false;

            // Robust traversal to find state access
            function checkNode(n) {
              if (!n) return;

              if (n.type === 'Identifier' && n.name === 'getE2EState') {
                evaluatesStateCorrectly = true;
              }

              if (n.type === 'Identifier' && n.name === '__DRMARIO_STATE__') {
                usesDirectAccess = true;
              }

              if (
                n.type === 'Literal' &&
                typeof n.value === 'string' &&
                n.value.includes('__DRMARIO_STATE__')
              ) {
                usesDirectAccess = true;
              }

              // Recursively check relevant children
              const keys = Object.keys(n).filter(
                (k) =>
                  !['parent', 'loc', 'range', 'tokens', 'comments'].includes(k),
              );
              for (const key of keys) {
                const val = n[key];
                if (val && typeof val === 'object') {
                  if (Array.isArray(val)) {
                    for (const item of val) {
                      if (item && item.type) checkNode(item);
                    }
                  } else if (val.type) {
                    checkNode(val);
                  }
                }
              }
            }

            checkNode(testBody);

            if (!evaluatesStateCorrectly || usesDirectAccess) {
              context.report({
                node,
                messageId: 'mustTestGameState',
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
