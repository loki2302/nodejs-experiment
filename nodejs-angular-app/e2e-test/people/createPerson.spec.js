var PersonEditor = require('./uiMaps/personEditor');
var applyAvatarEditorTests = require('./avatarEditor.specTemplate');
var applyMembershipsEditorTests = require('./membershipsEditor.specTemplate');
var makePersonDescription = require('../makePersonDescription');
var makeTeamDescription = require('../makeTeamDescription');

var CreatePersonPage = function() {
  this.personEditor = new PersonEditor();
  this.create = element(by.css('#submit-person-button'));
};

describeTeambuildr('CreatePersonPage', function() {
  var createPersonPage;
  beforeEach(function() {
    createPersonPage = new CreatePersonPage();
  });

  it('should have all fields empty', function() {
    browser.get('/people/create');

    var personEditor = createPersonPage.personEditor;
    personEditor.expectAllFieldsEmpty();
  });

  describe('Avatar editor', function() {
    beforeEach(function() {
      browser.get('/people/create');
    });

    applyAvatarEditorTests(function() {
      var personEditor = createPersonPage.personEditor;
      return {
        avatar: personEditor.avatar,
        randomizeAvatar: personEditor.randomizeAvatar
      };
    });
  });

  describe('"Memberships" editor', function() {
    applyMembershipsEditorTests(function() {
      var personEditor = createPersonPage.personEditor;
      return {
        url: '/people/create',
        client: client,
        newMembershipEditor: personEditor.newMembershipEditor,
        membershipListEditor: personEditor.membershipListEditor
      };
    });
  });

  it('should have "Create" button', function() {
    browser.get('/people/create');
    expect(createPersonPage.create.isPresent()).toBe(true);
  });

  it('should have validation errors when submitting the empty form', function() {
    browser.get('/people/create');
    createPersonPage.create.click();

    var personEditor = createPersonPage.personEditor;
    personEditor.expectAllFieldsInError();
  });

  it('should create a person when all fields are OK', function() {
    await(function() {
      var teamDescription = makeTeamDescription(0);
      return client.createTeam(teamDescription);
    });

    browser.get('/people/create');

    var personEditor = createPersonPage.personEditor;
    var personDescription = makePersonDescription(0);
    personEditor.setFromDescription(personDescription);

    personEditor.newMembershipEditor.name.sendKeys('a');
    personEditor.newMembershipEditor.nameDropdownItem(0).click();
    personEditor.newMembershipEditor.role.sendKeys('developer');
    personEditor.newMembershipEditor.add.click();

    createPersonPage.create.click();

    expect(browser.getLocationAbsUrl()).toBe('/people/1');

    await(function() {
      return client.getPeople().then(function(response) {
        var people = response.body;
        expect(people.length).toBe(1);

        var person = people[0];
        expect(person.name).toBe(personDescription.name);
        expect(person.position).toBe(personDescription.position);
        expect(person.city).toBe(personDescription.city);
        expect(person.state).toBe(personDescription.state);
        expect(person.phone).toBe(personDescription.phone);
        expect(person.email).toBe(personDescription.email);
        expect(person.memberships.length).toBe(1);
      });
    });
  });
});
