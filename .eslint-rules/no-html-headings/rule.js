const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow HTML heading tags. Use Text component from DesignSystem instead.',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      noHtmlHeading:
        'HTML <{{ tag }}> tags are not allowed. Use Text from DesignSystem instead.',
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
        const tagName = node.name.name;
        if (headingTags.has(tagName) && !isInsideDesignSystem) {
          context.report({
            node,
            messageId: 'noHtmlHeading',
            data: {
              tag: tagName,
            },
          });
        }
      },
    };
  },
};
