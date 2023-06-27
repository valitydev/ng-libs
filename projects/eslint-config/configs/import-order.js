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
                            'type',
                            'internal',
                            'parent',
                            ['index', 'sibling'],
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
