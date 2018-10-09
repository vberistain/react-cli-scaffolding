module.exports = {
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    env: {
        node: true,
        mocha: true
    },
    extends: 'eslint:recommended',
    plugins: ['prettier', 'mocha'],
    rules: {
        'prettier/prettier': 'error',
        indent: ['error', 4],
        'no-console': ['off'],
        'no-empty': ['off']
    }
};
