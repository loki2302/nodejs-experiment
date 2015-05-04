var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');
var PersonEditor = require('./uiMaps/personEditor.js');
var applyAvatarEditorTests = require('./avatarEditor.specTemplate');
var applyMembershipsEditorTests = require('./membershipsEditor.specTemplate');

var CreatePersonPage = function() {
  this.personEditor = new PersonEditor();
  this.create = element(by.css('#submit-person-button'));
};

describe('CreatePersonPage', function() {
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

  var createPersonPage;
  var client;
  beforeEach(function() {
    createPersonPage = new CreatePersonPage();
    client = new TeambuildrClient('http://localhost:3000/api/');
  });

  it('should have all fields empty', function() {
    browser.get('/people/create');

    var personEditor = createPersonPage.personEditor;
    expect(personEditor.name.getText()).toBe('');
    expect(personEditor.position.getText()).toBe('');
    expect(personEditor.city.getText()).toBe('');
    expect(personEditor.state.getText()).toBe('');
    expect(personEditor.phone.getText()).toBe('');
    expect(personEditor.email.getText()).toBe('');
  });

  describe('Avatar editor', function() {
    beforeEach(function() {
      browser.get('/people/create');
    });

    applyAvatarEditorTests(function() {
      return {
        avatar: createPersonPage.personEditor.avatar,
        randomizeAvatar: createPersonPage.personEditor.randomizeAvatar
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
    expect(personEditor.nameError.isPresent()).toBe(true);
    expect(personEditor.positionError.isPresent()).toBe(true);
    expect(personEditor.cityError.isPresent()).toBe(true);
    expect(personEditor.stateError.isPresent()).toBe(true);
    expect(personEditor.phoneError.isPresent()).toBe(true);
    expect(personEditor.emailError.isPresent()).toBe(true);
  });

  it('should create a person when all fields are OK', function() {
    protractor.promise.controlFlow().execute(function() {
      return client.createTeam({
        name: 'team A',
        url: 'http://example.org',
        slogan: 'team A slogan'
      });
    });

    var personDescription = {
      name: 'John',
      position: 'Developer',
      city: 'New York',
      state: 'NY',
      phone: '+123456789',
      email: 'john@john.com'
    };

    browser.get('/people/create');

    var personEditor = createPersonPage.personEditor;
    personEditor.name.sendKeys(personDescription.name);
    personEditor.position.sendKeys(personDescription.position);
    personEditor.city.sendKeys(personDescription.city);
    personEditor.state.sendKeys(personDescription.state);
    personEditor.phone.sendKeys(personDescription.phone);
    personEditor.email.sendKeys(personDescription.email);

    personEditor.newMembershipEditor.name.sendKeys('a');
    personEditor.newMembershipEditor.nameDropdownItem(0).click();
    personEditor.newMembershipEditor.role.sendKeys('developer');
    personEditor.newMembershipEditor.add.click();

    createPersonPage.create.click();

    expect(browser.getLocationAbsUrl()).toBe('/people/1');

    protractor.promise.controlFlow().execute(function() {
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
