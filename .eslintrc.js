module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'airbnb',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "import/extensions": "off",
    "import/no-unresolved": "off",
    'no-param-reassign': [
      'error',
      {
        'props': true,
        'ignorePropertyModificationsFor': [
          'e',
          'ctx',
          'req',
          'request',
          'res',
          'response',
          'state'
        ]
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
