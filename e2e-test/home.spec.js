var TeambuildrClient = require('../be-test/teambuildrClient');

var HomePage = function() {
  this.teamCount = element(by.css('#teamCount'));
  this.personCount = element(by.css('#personCount'));
};

describeTeambuildr('Home', function() {
  var homePage;
  var client;
  beforeEach(function() {
    homePage = new HomePage();
    client = new TeambuildrClient(browser.params.apiUrl);
  });

  it('should have stats', function() {
    browser.get('/');
    expect(homePage.teamCount.isPresent()).toBe(true);
    expect(homePage.personCount.isPresent()).toBe(true);
  });

  describe('stats', function() {
    describe('when there are no teams', function() {
      it('should say "no teams"', function() {
        browser.get('/');
        expect(homePage.teamCount.getText()).toBe('no teams');
      });
    });

    describe('when there is 1 team', function() {
      beforeEach(function(done) {
        // TODO: use protractor execution flow instead of chaining/done
        client.createTeam({
          name: 'team 1',
          url: 'http://example.org',
          slogan: 'team 1 slogan'
        }).finally(done);
      });

      it('should say "one team"', function() {
        browser.get('/');
        expect(homePage.teamCount.getText()).toBe('one team');
      });
    });

    describe('when there are 2 teams', function() {
      beforeEach(function(done) {
        // TODO: use protractor execution flow instead of chaining/done
        client.createTeam({
          name: 'team 1',
          url: 'http://example1.org',
          slogan: 'team 1 slogan'
        }).then(function() {
          return client.createTeam({
            name: 'team 2',
            url: 'http://example2.org',
            slogan: 'team 2 slogan'
          });
        }).finally(done);
      });

      it('should say "2 teams"', function() {
        browser.get('/');
        expect(homePage.teamCount.getText()).toBe('2 teams');
      });
    });
  });
});
