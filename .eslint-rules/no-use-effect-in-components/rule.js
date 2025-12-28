export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow useEffect in components. useEffect may only be used in hooks.',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      noUseEffectInComponent:
        'useEffect is not allowed in components. Move this logic to a custom hook in /src/hooks instead.',
    },
  },
  create(context) {
    const filename = context.getFilename();
    const isHookFile = filename.includes('/src/hooks/');

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'useEffect' &&
          !isHookFile
        ) {
          context.report({
            node,
            messageId: 'noUseEffectInComponent',
          });
        }
      },
    };
  },
};
