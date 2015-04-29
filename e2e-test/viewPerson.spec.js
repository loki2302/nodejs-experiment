var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');

describe('ViewPersonPage', function() {
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

  //var createPersonPage;
  var client;
  beforeEach(function() {
    //createPersonPage = new CreatePersonPage();
    client = new TeambuildrClient('http://localhost:3000/api/');
  });

  describe('when there is no person', function() {
    it('should not be possible to look at it', function() {
      browser.get('/people/123');

      // TODO: refactor - some sort of "404 recognizer"?
      expect(element(by.css('.container h1')).isPresent()).toBe(true);
      expect(element(by.css('.container h1')).getText()).toContain('404');
    });
  });

  describe('when there is a person', function() {
    var personId;
    beforeEach(function() {
      var personDescription = {
        name: 'John',
        avatar: 'http://example.org',
        position: 'Developer',
        city: 'New York',
        state: 'NY',
        phone: '+123456789',
        email: 'john@john.com'
      };

      protractor.promise.controlFlow().execute(function() {
        return client.createPerson(personDescription).then(function(response) {
          personId = response.body.id;
        });
      });
    });

    it('should be possible to look at it', function() {
      browser.get('/people/' + personId);

      // TODO: refactor - some sort of "404 recognizer"?
      expect(element(by.css('.container h1')).isPresent()).toBe(false);
    });
  });
});
