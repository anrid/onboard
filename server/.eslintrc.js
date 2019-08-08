module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false },
    ],
    camelcase: 'off',
    '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
  },
}
