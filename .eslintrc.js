module.exports = {
  ignorePatterns: ['/dist'],
  env: {
    browser: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-underscore-dangle': 0,
    'no-return-assign': ['error', "except-parens"]
  },
};
