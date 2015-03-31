var appRunnerFactory = require('../be-src/appRunnerFactory');

describe('Dummy', function() {
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

  it('should work', function() {
    browser.get('/');
    var h1Element = element(by.css('h1'));
    expect(h1Element.isPresent()).toBe(true);
    expect(h1Element.getText()).toBe('hello AppController');
  });
});
