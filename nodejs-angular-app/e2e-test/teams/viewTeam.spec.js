var ErrorModal = require('../uiMaps/errorModal.js');
var NotFoundPage = require('../uiMaps/notFoundPage.js');
var makeTeamDescription = require('../makeTeamDescription');
var makePersonDescription = require('../makePersonDescription');

var MemberList = function() {
  this.noMembersAlert = element(by.css('#no-members-alert'));
  this.membersContainer = element(by.css('#got-members-container'));

  var self = this;
  this.member = function(index) {
    return self.membersContainer.element(by.css('.member-' + index));
  };

  this.avatar = function(index) {
    return self.member(index).element(by.css('img'));
  };

  this.role = function(index) {
    return self.member(index).element(by.css('.role'));
  };

  this.personName = function(index) {
    return self.member(index).element(by.css('.person-name'));
  };

  this.personPosition = function(index) {
    return self.member(index).element(by.css('.person-position'));
  };
};

var ViewTeamPage = function() {
  this.edit = element(by.css('.edit'));
  this.delete = element(by.css('.delete'));
  this.name = element(by.css('.name'));
  this.slogan = element(by.css('.slogan'));
  this.avatar = element(by.css('.avatar img'));
  this.url = element(by.css('.url'));
  this.memberList = new MemberList();
};

describeTeambuildr('ViewTeamPage', function() {
  var viewTeamPage;
  var notFoundPage;
  beforeEach(function() {
    viewTeamPage = new ViewTeamPage();
    notFoundPage = new NotFoundPage();
  });

  describe('when there is no team', function() {
    it('should not be possible to look at it', function() {
      browser.get('/teams/123');
      expect(notFoundPage.errorContainer.isPresent()).toBe(true);
    });
  });

  describe('when there is a team', function() {
    var teamDescription;
    var teamId;
    beforeEach(function() {
      teamDescription = makeTeamDescription(0);
      await(function() {
        return client.createTeam(teamDescription).then(function(response) {
          teamId = response.body.id;
        });
      });
    });

    it('should be possible to look at it', function() {
      browser.get('/teams/' + teamId);
      expect(notFoundPage.errorContainer.isPresent()).toBe(false);
      expect(viewTeamPage.edit.isPresent()).toBe(true);
      expect(viewTeamPage.delete.isPresent()).toBe(true);

      expect(viewTeamPage.name.isPresent()).toBe(true);
      expect(viewTeamPage.slogan.isPresent()).toBe(true);
      expect(viewTeamPage.avatar.isPresent()).toBe(true);
      expect(viewTeamPage.url.isPresent()).toBe(true);
      expect(viewTeamPage.memberList.noMembersAlert.isPresent()).toBe(true);
      expect(viewTeamPage.memberList.membersContainer.isPresent()).toBe(false);

      expect(viewTeamPage.name.getText()).toBe(teamDescription.name);
    });

    describe('edit button', function() {
      it('should navigate to edit team page', function() {
        browser.get('/teams/' + teamId);
        expect(viewTeamPage.edit.isPresent()).toBe(true);
        viewTeamPage.edit.click();
        expect(browser.getLocationAbsUrl()).toBe('/teams/' + teamId + '/edit');
      });
    });

    describe('delete button', function() {
      it('should exist', function() {
        browser.get('/teams/' + teamId);
        expect(viewTeamPage.delete.isPresent()).toBe(true);
      });

      it('should delete the team if team still exists', function() {
        browser.get('/teams/' + teamId);
        viewTeamPage.delete.click();
        expect(browser.getLocationAbsUrl()).toBe('/teams');
      });

      it('should display an error popup if team does not exist', function() {
        browser.get('/teams/' + teamId);

        await(function() {
          return client.deleteTeam(teamId);
        });

        viewTeamPage.delete.click();

        var errorModal = new ErrorModal();
        expect(errorModal.element.isPresent()).toBe(true);
        expect(errorModal.message.getText()).toContain('too long');
        errorModal.ok.click();
        expect(errorModal.element.isPresent()).toBe(false);
        expect(browser.getLocationAbsUrl()).toBe('/teams');
      });
    });

    describe('when it has members', function() {
      var personDescription;
      beforeEach(function() {
        personDescription = makePersonDescription(0);

        var personAId;
        await(function() {
          return client.createPerson(personDescription).then(function(team) {
            personAId = team.body.id;
          });
        });

        await(function() {
          teamDescription.id = teamId;
          teamDescription.members = [
            { person: { id: personAId }, role: 'developer' }
          ];
          return client.updateTeam(teamDescription);
        });
      });

      it('should work', function() {
        browser.get('/teams/' + teamId);

        expect(viewTeamPage.memberList.noMembersAlert.isPresent()).toBe(false);
        expect(viewTeamPage.memberList.membersContainer.isPresent()).toBe(true);

        expect(viewTeamPage.memberList.member(0).isPresent()).toBe(true);
        expect(viewTeamPage.memberList.avatar(0).getAttribute('src')).toBe(personDescription.avatar + '/');
        expect(viewTeamPage.memberList.role(0).getText()).toBe('developer');
        expect(viewTeamPage.memberList.personName(0).getText()).toBe(personDescription.name);
        expect(viewTeamPage.memberList.personPosition(0).getText()).toBe(personDescription.position);
      });
    });
  });
});
