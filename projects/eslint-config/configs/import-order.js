module.exports = (internalPatterns = ['@app/**']) => ({
    overrides: [
        {
            files: ['*.ts'],
            rules: {
                'import/order': [
                    'error',
                    {
                        groups: [
                            ['builtin', 'external'],
                            'internal',
                            ['parent', 'sibling', 'index'],
                            'object',
                        ],
                        pathGroups: internalPatterns.map((pattern) => ({
                            pattern,
                            group: 'internal',
                        })),
                        pathGroupsExcludedImportTypes: ['builtin'],
                        'newlines-between': 'always',
                        alphabetize: {
                            order: 'asc',
                            caseInsensitive: true,
                        },
                    },
                ],
            },
        },
    ],
});
