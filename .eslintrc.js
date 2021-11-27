module.exports = {
    "ignorePatterns": ["/dist"],
    "env": {
      "browser": true
    },
    "extends": [
      "airbnb-base",
      "prettier"
    ],
    "rules": {
      "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}],
      "no-underscore-dangle": 0
    }
};
