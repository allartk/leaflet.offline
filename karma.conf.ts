const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const istanbul = require('rollup-plugin-istanbul');

const extensions = ['.js', '.ts'];

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = (config) => {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: ['test/*.ts'],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/*.ts': ['rollup'],
    },
    rollupPreprocessor: {
      output: {
        format: 'iife',
        name: 'LeafletOffline',
        sourcemap: 'inline',
      },
      plugins: [
        commonjs(),
        nodeResolve({ extensions }),
        typescript({ declaration: false, declarationDir: undefined }),
        istanbul({ exclude: ['test/*.ts', 'node_modules/**/*'] }),
      ],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless','ChromeHeadlessWithoutSandbox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // damn ubuntu snap https://github.com/karma-runner/karma-firefox-launcher/issues/183#issuecomment-1283875784
    customLaunchers: {
      ChromeHeadlessWithoutSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox','--headless'],
        displayName: 'Chrome w/o sandbox'
      }
    },
    coverageReporter: {
      reporters: [
        {
          type: 'html',
          dir: 'coverage/',
        },
        { type: 'lcov' },
      ],
    },
  });
};
