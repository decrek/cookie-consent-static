const isProduction = process.env.NODE_ENV !== 'development'

module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'parser': 'babel-eslint',
  'extends': 'eslint:recommended',
  'rules': {
    'no-console': isProduction ? ['error', {allow: ['info', 'warn', 'error']}] : ['off'],
    'no-debugger': isProduction ? ['error'] : ['off'],
    'no-unused-vars': isProduction ? ['error'] : ['off'],
    'no-undef': isProduction ? ['error'] : ['off'],
    'quotes': isProduction ? ['error', 'single'] : ['warn', 'single'],
    'semi': isProduction ? ['error', 'never'] : ['warn', 'never'],
    'no-extra-semi': isProduction ? 'error' : 'warn',
  }
}
