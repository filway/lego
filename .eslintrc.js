module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'airbnb',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2020,
  },

  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'no-shadow': 'off',
    'max-len': [1, 120],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['off', { extensions: ['.tsx', '.ts'] }],
    'react/jsx-props-no-spreading': ['off', {
      html: 'enforce',
      custom: 'enforce',
      explicitSpread: 'ignore',
      exceptions: [],
    }],
    'react/no-unknown-property': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'e',
          'ctx',
          'req',
          'request',
          'res',
          'response',
          'state',
          'result',
          'readyFile',
          'element',
          'component'
        ],
      },
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
