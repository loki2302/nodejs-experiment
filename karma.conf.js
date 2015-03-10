module.exports = function(config) {
  config.set({
    basePath: './',

    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/ng-tags-input/ng-tags-input.js',
      'fe-src/**/*.js',
      'fe-test/**/*.spec.js'
    ],

    autoWatch: true,
    frameworks: ['jasmine'],
    // browsers: ['Chrome', 'Firefox'],
    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ]
  });

  if(process.env.TRAVIS) {
    config.browsers = ['Firefox'];
  } else {
    config.browsers = ['Chrome'];
  }
};
