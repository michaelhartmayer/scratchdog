export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow HTML button tags. Use DesignSystem components instead.',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      noHtmlButton:
        'HTML <button> tags are not allowed. Use Button from DesignSystem instead.',
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
        if (node.name.name === 'button' && !isInsideDesignSystem) {
          context.report({
            node,
            messageId: 'noHtmlButton',
          });
        }
      },
    };
  },
};
