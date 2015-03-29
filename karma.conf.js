module.exports = function(config) {
  config.set({
    basePath: './',
    files: [
      'bower_components/uri.js/src/URI.min.js',
      'bower_components/uri.js/src/URITemplate.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'fe-src/**/*.js',
      'fe-src/**/*.html',
      'fe-test/**/*.spec.js'
    ],
    preprocessors: {
      'fe-src/**/*.html': ['ng-html2js']
    },
    autowatch: true,
    frameworks: ['mocha', 'chai'],
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-ng-html2js-preprocessor'
    ],
    ngHtml2JsPreprocessor: {
      // TODO: do I need to put anything here?
    },
    browsers: ['Chrome', 'Firefox']
  });
};
