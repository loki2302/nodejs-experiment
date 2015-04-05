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

  describe('A random route', function() {
    it('should result in 404', function() {
      browser.get('/a-random-route');
      expect(browser.getLocationAbsUrl()).toBe('/a-random-route');
      expect(element(by.css('body')).getText()).toContain('404');
    });
  });

  describe('/people', function() {
    beforeEach(function() {
      browser.get('/people');
    });

    it('should highlight the "people" navbar', function() {
      expect(element(by.css('.nav-people')).getAttribute('class')).toContain('active');
      expect(element(by.css('.nav-teams')).getAttribute('class')).not.toContain('active');
    });

    it('should have a no-people-alert', function() {
      expect(element(by.css('#no-people-alert')).isPresent()).toBe(true);
    });
  });

  describe('/teams', function() {
    beforeEach(function() {
      browser.get('/teams');
    });

    it('should highlight the "teams" navbar', function() {
      expect(element(by.css('.nav-people')).getAttribute('class')).not.toContain('active');
      expect(element(by.css('.nav-teams')).getAttribute('class')).toContain('active');
    });

    it('should display a dummy message', function() {
      var pElement = element(by.css('p'));
      expect(pElement.isPresent()).toBe(true);
      expect(pElement.getText()).toBe('teamListControllerMessage: hello there resolved data');
    });
  });
});
