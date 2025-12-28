
export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow disabling eslint rules',
            category: 'Best Practices',
            recommended: false,
        },
        schema: [],
        messages: {
            noDisable: 'ESLint rules may not be disabled.',
        },
    },
    create(context) {
        return {
            Program() {
                const sourceCode = context.sourceCode;
                const comments = sourceCode.getAllComments();

                comments.forEach((comment) => {
                    if (comment.value.includes('eslint-disable')) {
                        context.report({
                            loc: comment.loc,
                            messageId: 'noDisable',
                        });
                    }
                });
            },
        };
    },
};
