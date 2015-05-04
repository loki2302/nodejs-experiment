var ErrorModal = require('../uiMaps/errorModal.js');
var makeTeamDescription = require('./makeTeamDescription');

var TeamListPage = function() {
  this.addTeam = element(by.css('#add-team'));
  this.noTeamsAlert = element(by.css('#no-teams-alert'));
  this.teamsContainer = element(by.css('#teams-container'));
  this.teamListItem = function(index) {
    return element(by.css('.team-list-item.item-' + index));
  };
};

var TeamListItem = function(element) {
  this.name = element.element(by.css('.name'));
  this.slogan = element.element(by.css('.slogan'));
  this.edit = element.element(by.css('.edit'));
  this.delete = element.element(by.css('.delete'));
};

describeTeambuildr('TeamList', function() {
  var teamListPage;
  beforeEach(function() {
    teamListPage = new TeamListPage();
  });

  describe('when there are no teams', function() {
    it('should have an "Add Team" link', function() {
      browser.get('/teams');
      expect(teamListPage.addTeam.isPresent()).toBe(true);

      teamListPage.addTeam.click();
      expect(browser.getLocationAbsUrl()).toBe('/teams/create');
    });

    it('should have a "no teams" alert', function() {
      browser.get('/teams');
      expect(teamListPage.noTeamsAlert.isPresent()).toBe(true);
      expect(teamListPage.teamsContainer.isPresent()).toBe(false);
    });
  });

  describe('when there are teams', function() {
    var team;
    beforeEach(function() {
      await(function() {
        var teamDescription = makeTeamDescription(0);
        return client.createTeam(teamDescription).then(function(response) {
          team = response.body;
        });
      });
    });

    it('should have an "Add Team" link', function() {
      browser.get('/teams');
      expect(teamListPage.addTeam.isPresent()).toBe(true);

      teamListPage.addTeam.click();
      expect(browser.getLocationAbsUrl()).toBe('/teams/create');
    });

    describe('team list', function() {
      it('should exist', function() {
        browser.get('/teams');
        expect(teamListPage.teamsContainer.isPresent()).toBe(true);
        expect(teamListPage.noTeamsAlert.isPresent()).toBe(false);
      });

      describe('the only item', function() {
        var teamListItemElement;
        var teamListItem;
        beforeEach(function() {
          browser.get('/teams');
          teamListItemElement = teamListPage.teamListItem(0);
          teamListItem = new TeamListItem(teamListItemElement);
        });

        it('should exist', function() {
          expect(teamListItemElement.isPresent()).toBe(true);
          expect(teamListItem.slogan.getText()).toBe(team.slogan);
        });

        it('should have a "view" link', function() {
          expect(teamListItem.name.getText()).toBe(team.name);

          teamListItem.name.click();
          expect(browser.getLocationAbsUrl()).toBe('/teams/' + team.id);
        });

        it('should have an "edit" link', function() {
          expect(teamListItem.edit.isPresent()).toBe(true);

          teamListItem.edit.click();
          expect(browser.getLocationAbsUrl()).toBe('/teams/' + team.id + '/edit');
        });

        it('should have a delete button', function() {
          expect(teamListItem.delete.isPresent()).toBe(true);
        });

        describe('delete button', function() {
          it('should delete the team if team still exists', function() {
            teamListItem.delete.click();
            expect(teamListPage.noTeamsAlert.isPresent()).toBe(true);
            expect(teamListPage.teamsContainer.isPresent()).toBe(false);
          });

          it('should display an error popup if team does not exist', function() {
            await(function() {
              return client.deleteTeam(team.id);
            });

            teamListItem.delete.click();

            var errorModal = new ErrorModal();
            expect(errorModal.element.isPresent()).toBe(true);
            expect(errorModal.message.getText()).toContain('too long');
            errorModal.ok.click();
            expect(errorModal.element.isPresent()).toBe(false);

            expect(teamListPage.noTeamsAlert.isPresent()).toBe(true);
            expect(teamListPage.teamsContainer.isPresent()).toBe(false);
          });
        });
      });
    });
  });
});
