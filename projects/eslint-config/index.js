module.exports = {
    root: true,
    globals: {},
    ignorePatterns: [
        '**/*.json',
        '**/*.md',
        '**/*.?css',
        '**/*.js',
        '**/*.conf',
        '**/*.ico',
        '**/*.svg',
        'Dockerfile',
        'dist',
        'coverage',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
    },
    overrides: [
        {
            files: ['*.ts'],
            plugins: ['unused-imports'],
            extends: [
                'eslint:recommended',
                'plugin:import/recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:import/typescript',
                'prettier',
            ],
            rules: {
                'no-console': ['error', { allow: ['warn', 'error'] }],
                '@typescript-eslint/member-ordering': [
                    'error',
                    {
                        default: [
                            'signature',

                            'public-field',
                            'protected-field',
                            'private-field',

                            'constructor',

                            'public-method',
                            'protected-method',
                            'private-method',
                        ],
                    },
                ],
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'default',
                        format: ['camelCase'],
                        leadingUnderscore: 'allow',
                    },
                    {
                        selector: 'default',
                        modifiers: ['destructured'],
                        format: null,
                    },
                    {
                        selector: 'import',
                        modifiers: ['default'],
                        format: ['UPPER_CASE', 'PascalCase', 'camelCase'],
                    },
                    {
                        selector: 'typeLike',
                        format: ['PascalCase'],
                    },
                    {
                        selector: 'variable',
                        modifiers: ['const', 'global'],
                        format: ['UPPER_CASE', 'camelCase', 'PascalCase'],
                    },
                    {
                        selector: 'variable',
                        modifiers: ['const', 'global'],
                        types: ['array', 'boolean', 'number', 'string'],
                        format: ['UPPER_CASE'],
                    },
                    {
                        selector: 'variable',
                        modifiers: ['const', 'global'],
                        types: ['function'],
                        format: ['camelCase'],
                    },
                    {
                        selector: 'enumMember',
                        format: ['PascalCase'],
                    },
                    {
                        selector: ['objectLiteralProperty', 'typeProperty'],
                        format: ['camelCase', 'snake_case', 'PascalCase'],
                        leadingUnderscore: 'allow',
                        trailingUnderscore: 'allow',
                    },
                    {
                        selector: [
                            'classProperty',
                            'objectLiteralProperty',
                            'typeProperty',
                            'classMethod',
                            'objectLiteralMethod',
                            'typeMethod',
                            'accessor',
                            'enumMember',
                        ],
                        modifiers: ['requiresQuotes'],
                        format: null,
                    },
                ],
                'import/no-unresolved': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                'unused-imports/no-unused-imports': 'error',
                'unused-imports/no-unused-vars': [
                    'error',
                    {
                        vars: 'all',
                        varsIgnorePattern: '^_',
                        args: 'after-used',
                        argsIgnorePattern: '^_',
                    },
                ],
                '@typescript-eslint/no-inferrable-types': 'off',
                'import/namespace': 'off',
                curly: 'error',
            },
        },
        ...require('./configs/import-order')().overrides,
    ],
};
