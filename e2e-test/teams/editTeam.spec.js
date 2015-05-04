var ErrorModal = require('../uiMaps/errorModal');
var NotFoundPage = require('../uiMaps/notFoundPage');
var TeamEditor = require('./uiMaps/teamEditor');
var makePersonDescription = require('../makePersonDescription');
var makeTeamDescription = require('../makeTeamDescription');
var applyMembersEditorTests = require('./membersEditor.specTemplate');

var EditTeamPage = function() {
  this.teamEditor = new TeamEditor();
  this.update = element(by.css('#submit-team-button'));
};

describeTeambuildr('EditTeamPage', function() {
  var editTeamPage;
  var notFoundPage;
  beforeEach(function() {
    editTeamPage = new EditTeamPage();
    notFoundPage = new NotFoundPage();
  });

  describe('when there is no team', function() {
    it('should not be possible to open it for editing', function() {
      browser.get('/teams/123/edit');
      expect(notFoundPage.errorContainer.isPresent()).toBe(true);
    });
  });

  describe('when there is a team', function() {
    var teamDescription;
    var teamId;
    beforeEach(function() {
      var personADescription = makePersonDescription(0);

      var personAId;
      await(function() {
        return client.createPerson(personADescription).then(function(person) {
          personAId = person.body.id;
        });
      });

      await(function() {
        teamDescription = makeTeamDescription(0);

        return client.createTeam(teamDescription).then(function(response) {
          teamId = response.body.id;
        });
      });
    });

    it('should be possible to open the "Edit" page', function() {
      browser.get('/teams/' + teamId + '/edit');
      expect(notFoundPage.errorContainer.isPresent()).toBe(false);

      var teamEditor = editTeamPage.teamEditor;
      teamEditor.expectMatchDescription(teamDescription);
      expect(teamEditor.memberListEditor.memberCount()).toBe(0);

      expect(editTeamPage.update.isPresent()).toBe(true);
    });

    describe('"Memberships" editor', function() {
      applyMembersEditorTests(function() {
        var teamEditor = editTeamPage.teamEditor;
        return {
          url: '/teams/' + teamId + '/edit',
          client: client,
          newMemberEditor: teamEditor.newMemberEditor,
          memberListEditor: teamEditor.memberListEditor
        };
      });
    });

    it('should be possible to update the team', function() {
      var personADescription = makePersonDescription(0);
      await(function() {
        return client.createPerson(personADescription);
      });

      browser.get('/teams/' + teamId + '/edit');

      var updatedTeamDescription = makeTeamDescription(1);

      var teamEditor = editTeamPage.teamEditor;
      teamEditor.setFromDescription(updatedTeamDescription);

      teamEditor.newMemberEditor.name.sendKeys('j');
      teamEditor.newMemberEditor.nameDropdownItem(0).click();
      teamEditor.newMemberEditor.role.sendKeys('developer');
      teamEditor.newMemberEditor.add.click();

      editTeamPage.update.click();

      expect(browser.getLocationAbsUrl()).toBe('/teams/' + teamId);

      await(function() {
        return client.getTeam(teamId).then(function(response) {
          var team = response.body;
          expect(team.name).toBe(updatedTeamDescription.name);
          expect(team.slogan).toBe(updatedTeamDescription.slogan);
          expect(team.url).toBe(updatedTeamDescription.url);
          expect(team.members.length).toBe(1);
        });
      });
    });

    it('should not be possible update the team when there are validation errors', function() {
      browser.get('/teams/' + teamId + '/edit');

      var teamEditor = editTeamPage.teamEditor;
      teamEditor.clearAll();

      editTeamPage.update.click();

      teamEditor.expectAllFieldsInError();
    });

    describe('and this team suddenly disappears', function() {
      it('should display an error popup', function() {
        browser.get('/teams/' + teamId + '/edit');

        await(function() {
          return client.deleteTeam(teamId);
        });

        editTeamPage.update.click();

        var errorModal = new ErrorModal();
        expect(errorModal.element.isPresent()).toBe(true);
        expect(errorModal.message.getText()).toContain('too long');
        errorModal.ok.click();
        expect(errorModal.element.isPresent()).toBe(false);
        expect(browser.getLocationAbsUrl()).toBe('/teams');
      });
    });
  });
});
