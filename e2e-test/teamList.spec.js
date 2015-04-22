var appRunnerFactory = require('../be-src/appRunnerFactory');

var TeamListPage = function() {
  this.addTeam = element(by.css('#addTeam'));
};

describe('TeamList', function() {
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

  var teamListPage;
  beforeEach(function() {
    teamListPage = new TeamListPage();
  });

  it('should have an "Add Team" link', function() {
    browser.get('/teams');
    expect(teamListPage.addTeam.isPresent()).toBe(true);
  });
});
