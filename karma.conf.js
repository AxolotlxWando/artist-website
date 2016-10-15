var webpackConfig = require('./webpack-test.config.js')
webpackConfig.entry = {}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatchBatchDelay: 300,

    files: [
      './src/tests/index.js',
      './src/tests/*.test.js'
    ],

    preprocessors: {
      './src/tests/index.js': ['webpack', 'sourcemap'],
      './src/tests/*.test.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    }
  })
}
