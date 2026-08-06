export default [
  { ignores: ['**/.next/**', '**/node_modules/**'] },
  {
    rules: {
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]
