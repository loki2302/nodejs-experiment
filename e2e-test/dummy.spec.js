var AppRunner = require('../be-src/appRunner');

describe('Dummy', function() {
  var appRunner;
  beforeEach(function(done) {
    appRunner = new AppRunner();
    appRunner.start().finally(done);
  });

  afterEach(function(done) {
    appRunner.stop().finally(done);
    appRunner = undefined;
  });

  it('should work', function() {
    browser.get('/');
    var h1Element = element(by.css('h1'));
    expect(h1Element.isPresent()).toBe(true);
    expect(h1Element.getText()).toBe('hello AppController');
  });
});
