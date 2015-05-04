var ErrorModal = require('../uiMaps/errorModal.js');
var NotFoundPage = require('../uiMaps/notFoundPage.js');

var MembershipList = function() {
  this.noMembershipsAlert = element(by.css('#no-memberships-alert'));
  this.membershipsContainer = element(by.css('#got-memberships-container'));

  var self = this;
  this.membership = function(index) {
    return self.membershipsContainer.element(by.css('.membership-' + index));
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
  this.membershipList = new MembershipList();
};

describeTeambuildr('ViewPersonPage', function() {
  var viewPersonPage;
  var notFoundPage;
  beforeEach(function() {
    viewPersonPage = new ViewPersonPage();
    notFoundPage = new NotFoundPage();
  });

  describe('when there is no person', function() {
    it('should not be possible to look at it', function() {
      browser.get('/people/123');
      expect(notFoundPage.errorContainer.isPresent()).toBe(true);
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
      expect(notFoundPage.errorContainer.isPresent()).toBe(false);
      expect(viewPersonPage.edit.isPresent()).toBe(true);
      expect(viewPersonPage.delete.isPresent()).toBe(true);
      expect(viewPersonPage.name.isPresent()).toBe(true);
      expect(viewPersonPage.avatar.isPresent()).toBe(true);
      expect(viewPersonPage.membershipList.noMembershipsAlert.isPresent()).toBe(true);
      expect(viewPersonPage.membershipList.membershipsContainer.isPresent()).toBe(false);

      expect(viewPersonPage.name.getText()).toBe('John');
    });

    describe('edit button', function() {
      it('should navigate to edit person page', function() {
        browser.get('/people/' + personId);
        expect(viewPersonPage.edit.isPresent()).toBe(true);
        viewPersonPage.edit.click();
        expect(browser.getLocationAbsUrl()).toBe('/people/' + personId + '/edit');
      });
    });

    describe('delete button', function() {
      it('should exist', function() {
        browser.get('/people/' + personId);
        expect(viewPersonPage.delete.isPresent()).toBe(true);
      });

      it('should delete the person if person still exists', function() {
        browser.get('/people/' + personId);
        viewPersonPage.delete.click();
        expect(browser.getLocationAbsUrl()).toBe('/people');
      });

      it('should display an error popup if person does not exist', function() {
        browser.get('/people/' + personId);

        protractor.promise.controlFlow().execute(function() {
          return client.deletePerson(personId);
        });

        viewPersonPage.delete.click();

        var errorModal = new ErrorModal();
        expect(errorModal.element.isPresent()).toBe(true);
        expect(errorModal.message.getText()).toContain('too long');
        errorModal.ok.click();
        expect(errorModal.element.isPresent()).toBe(false);
        expect(browser.getLocationAbsUrl()).toBe('/people');
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

        expect(viewPersonPage.membershipList.noMembershipsAlert.isPresent()).toBe(false);
        expect(viewPersonPage.membershipList.membershipsContainer.isPresent()).toBe(true);

        expect(viewPersonPage.membershipList.membership(0).isPresent()).toBe(true);
        expect(viewPersonPage.membershipList.avatar(0).getAttribute('src')).toContain('gravatar');
        expect(viewPersonPage.membershipList.role(0).getText()).toBe('developer');
        expect(viewPersonPage.membershipList.teamName(0).getText()).toBe('team A');
        expect(viewPersonPage.membershipList.teamSlogan(0).getText()).toBe('team A slogan');
      });
    });
  });
});
