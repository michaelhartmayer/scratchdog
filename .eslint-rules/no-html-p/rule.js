export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow HTML p tags. Use Text component from DesignSystem instead.',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      noHtmlP:
        'HTML <p> tags are not allowed. Use Text from DesignSystem instead.',
    },
  },
  create(context) {
    const filename = context.getFilename();
    const normalizedPath = filename.replace(/\\/g, '/');
    const isInsideDesignSystem =
      normalizedPath.includes('/src/components/DesignSystem/') ||
      normalizedPath.endsWith('/src/components/DesignSystem');

    return {
      JSXOpeningElement(node) {
        if (node.name.name === 'p' && !isInsideDesignSystem) {
          context.report({
            node,
            messageId: 'noHtmlP',
          });
        }
      },
    };
  },
};
