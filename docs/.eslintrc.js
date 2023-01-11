module.exports = {
  root: true,
  ignorePatterns: ['/dist'],
  env: {
    browser: true,
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-console': ['error', { allow: ['debug'] }],
    'no-underscore-dangle': 0,
  },
};
