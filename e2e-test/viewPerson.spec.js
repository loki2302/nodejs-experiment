var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');

var MembershipList = function(root) {
  var self = this;
  this.membership = function(index) {
    return root.element(by.css('.membership-' + index));
  };

  this.avatar = function(index) {
    return self.membership(index).element(by.css('img'));
  };

  this.role = function(index) {
    return self.membership(index).element(by.css('.role'));
  };

  this.teamName = function(index) {
    return self.membership(index).element(by.css('.team-name'));
  };

  this.teamSlogan = function(index) {
    return self.membership(index).element(by.css('.team-slogan'));
  };
};

var ViewPersonPage = function() {
  this.edit = element(by.css('.edit'));
  this.delete = element(by.css('.delete'));
  this.name = element(by.css('.name'));
  this.avatar = element(by.css('.avatar img'));

  this.noMemberships = element(by.css('#no-memberships-alert'));
  this.memberships = element(by.css('#got-memberships-container'));

  this.membershipList = new MembershipList(this.memberships);
};

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

  var viewPersonPage;
  var client;
  beforeEach(function() {
    viewPersonPage = new ViewPersonPage();
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
    var personDescription;
    var personId;
    beforeEach(function() {
      personDescription = {
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
      // expect(element(by.css('.container h1')).isPresent()).toBe(false);
      expect(viewPersonPage.edit.isPresent()).toBe(true);
      expect(viewPersonPage.delete.isPresent()).toBe(true);
      expect(viewPersonPage.name.isPresent()).toBe(true);
      expect(viewPersonPage.avatar.isPresent()).toBe(true);
      expect(viewPersonPage.noMemberships.isPresent()).toBe(true);
      expect(viewPersonPage.memberships.isPresent()).toBe(false);

      expect(viewPersonPage.name.getText()).toBe('John');
    });

    describe('edit button', function() {
      it('should work', function() {
        browser.get('/people/' + personId);
        expect(viewPersonPage.edit.isPresent()).toBe(true);
        viewPersonPage.edit.click();
        expect(browser.getLocationAbsUrl()).toBe('/people/' + personId + '/edit');
      });
    });

    describe('delete button', function() {
      // TODO: click and make sure person disappears
      // TODO: click and make sure there is an error

      it('should work', function() {
        browser.get('/people/' + personId);
        expect(viewPersonPage.delete.isPresent()).toBe(true);
      });
    });

    describe('when it has memberships', function() {
      beforeEach(function() {
        var teamAId;
        protractor.promise.controlFlow().execute(function() {
          return client.createTeam({
            name: 'team A',
            url: 'http://example.org',
            slogan: 'team A slogan'
          }).then(function(team) {
            teamAId = team.body.id;
            return true;
          });
        });

        protractor.promise.controlFlow().execute(function() {
          personDescription.id = personId;
          personDescription.memberships = [
            { team: { id: teamAId }, role: 'developer' }
          ];
          return client.updatePerson(personDescription);
        });
      });

      it('should work', function() {
        browser.get('/people/' + personId);

        expect(viewPersonPage.noMemberships.isPresent()).toBe(false);
        expect(viewPersonPage.memberships.isPresent()).toBe(true);

        expect(viewPersonPage.membershipList.membership(0).isPresent()).toBe(true);
        expect(viewPersonPage.membershipList.avatar(0).getAttribute('src')).toContain('gravatar');
        expect(viewPersonPage.membershipList.role(0).getText()).toBe('developer');
        expect(viewPersonPage.membershipList.teamName(0).getText()).toBe('team A');
        expect(viewPersonPage.membershipList.teamSlogan(0).getText()).toBe('team A slogan');
      });
    });
  });
});
