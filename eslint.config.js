// eslint.config.js

module.exports = [
  {
    rules: {
      'indent': ['error', 2, {'SwitchCase': 1,}],
      'linebreak-style': ['error', 'unix',],
      'max-len': ['warn', { 'code': 80 }],
      'no-console': ['error', {'allow': ['log'], }],
      'prefer-const': 'error',
      'quotes': ['error', 'single', {'avoidEscape': true,}],
      'semi': ['error', 'always'],
    }
  },
];
