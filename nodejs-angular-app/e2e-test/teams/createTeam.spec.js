var TeamEditor = require('./uiMaps/teamEditor');
var applyMembersEditorTests = require('./membersEditor.specTemplate');
var makePersonDescription = require('../makePersonDescription');
var makeTeamDescription = require('../makeTeamDescription');

var CreateTeamPage = function() {
  this.teamEditor = new TeamEditor();
  this.create = element(by.css('#submit-team-button'));
};

describeTeambuildr('CreateTeamPage', function() {
  var createTeamPage;
  beforeEach(function() {
    createTeamPage = new CreateTeamPage();
  });

  it('should have all fields empty', function() {
    browser.get('/teams/create');

    var teamEditor = createTeamPage.teamEditor;
    teamEditor.expectAllFieldsEmpty();
  });

  describe('"Members" editor', function() {
    applyMembersEditorTests(function() {
      var teamEditor = createTeamPage.teamEditor;
      return {
        url: '/teams/create',
        client: client,
        newMemberEditor: teamEditor.newMemberEditor,
        memberListEditor: teamEditor.memberListEditor
      };
    });
  });

  it('should have "Create" button', function() {
    browser.get('/teams/create');
    expect(createTeamPage.create.isPresent()).toBe(true);
  });

  it('should have validation errors when submitting the empty form', function() {
    browser.get('/teams/create');
    createTeamPage.create.click();

    var teamEditor = createTeamPage.teamEditor;
    teamEditor.expectAllFieldsInError();
  });

  it('should create a team when all fields are OK', function() {
    await(function() {
      var personDescription = makePersonDescription(0);
      return client.createPerson(personDescription);
    });

    browser.get('/teams/create');

    var teamEditor = createTeamPage.teamEditor;
    var teamDescription = makeTeamDescription(0);
    teamEditor.setFromDescription(teamDescription);

    teamEditor.newMemberEditor.name.sendKeys('j');
    teamEditor.newMemberEditor.nameDropdownItem(0).click();
    teamEditor.newMemberEditor.role.sendKeys('developer');
    teamEditor.newMemberEditor.add.click();

    createTeamPage.create.click();

    expect(browser.getLocationAbsUrl()).toBe('/teams/1');

    await(function() {
      return client.getTeams().then(function(response) {
        var teams = response.body;
        expect(teams.length).toBe(1);

        var team = teams[0];
        expect(team.name).toBe(teamDescription.name);
        expect(team.slogan).toBe(teamDescription.slogan);
        expect(team.url).toBe(teamDescription.url);
        expect(team.members.length).toBe(1);
      });
    });
  });
});
