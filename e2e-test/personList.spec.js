var appRunnerFactory = require('../be-src/appRunnerFactory');

var PersonListPage = function() {
  this.addPerson = element(by.css('#addPerson'));
};

describe('PersonList', function() {
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

  var personListPage;
  beforeEach(function() {
    personListPage = new PersonListPage();
  });

  it('should have an "Add Person" link', function() {
    browser.get('/people');
    expect(personListPage.addPerson.isPresent()).toBe(true);
  });
});
