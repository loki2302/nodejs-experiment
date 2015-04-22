var appRunnerFactory = require('../be-src/appRunnerFactory');

var HomePage = function() {
  this.teamCount = element(by.css('#teamCount'));
  this.personCount = element(by.css('#personCount'));
};

describe('Home', function() {
  var appRunner;
  beforeEach(function(done) {
    appRunnerFactory().then(function(runner) {
      appRunner = runner;
      return runner.start().then(function() {
        return runner.reset();
      });
    }).finally(done);
  });

  afterEach(function(done) {
    appRunner.stop().finally(done);
    appRunner = null;
  });

  var homePage;
  beforeEach(function() {
    homePage = new HomePage();
  });

  it('should have stats', function() {
    browser.get('/');
    expect(homePage.teamCount.isPresent()).toBe(true);
    expect(homePage.personCount.isPresent()).toBe(true);
  });
});
