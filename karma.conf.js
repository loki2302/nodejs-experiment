module.exports = function(config) {
  config.set({
    basePath: './',
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/uri.js/src/URI.min.js',
      'bower_components/uri.js/src/URITemplate.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
      'bower_components/angular-deckgrid/angular-deckgrid.js',
      'fe-src/**/*.js',
      'fe-src/**/*.html',
      'fe-test/**/*.spec.js'
    ],
    preprocessors: {
      'fe-src/**/*.html': ['ng-html2js']
    },
    autowatch: true,
    frameworks: ['jasmine'], // TODO: should I use Mocha/Chai here?
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],
    ngHtml2JsPreprocessor: {
      // TODO: do I need to put anything here?
      stripPrefix: 'fe-src/',
      moduleName: 'tbTemplates' // TODO
    },
    browsers: ['Chrome', 'Firefox']
  });
};
