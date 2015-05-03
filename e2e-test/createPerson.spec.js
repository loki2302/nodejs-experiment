var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');
var PersonEditor = require('./personEditor.js');

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
    expect(createPersonPage.personEditor.name.getText()).toBe('');
    expect(createPersonPage.personEditor.position.getText()).toBe('');
    expect(createPersonPage.personEditor.city.getText()).toBe('');
    expect(createPersonPage.personEditor.state.getText()).toBe('');
    expect(createPersonPage.personEditor.phone.getText()).toBe('');
    expect(createPersonPage.personEditor.email.getText()).toBe('');
  });

  describe('Avatar editor', function() {
    it('should have a default avatar image and "randomize" button', function() {
      browser.get('/people/create');

      expect(createPersonPage.personEditor.avatar.isPresent()).toBe(true);
      expect(createPersonPage.personEditor.avatar.getAttribute('src')).toContain('https://');
      expect(createPersonPage.personEditor.randomizeAvatar.isPresent()).toBe(true);
    });

    describe('"Randomize" button', function() {
      it('should work', function() {
        browser.get('/people/create');

        var originalSrc;
        protractor.promise.controlFlow().execute(function() {
          return createPersonPage.personEditor.avatar.getAttribute('src').then(function(src) {
            originalSrc = src;
          });
        });

        createPersonPage.personEditor.randomizeAvatar.click();

        protractor.promise.controlFlow().execute(function() {
          return createPersonPage.personEditor.avatar.getAttribute('src').then(function(src) {
            expect(src).not.toBe(originalSrc);
          });
        });
      });
    });
  });

  describe('"Memberships" editor', function() {
    it('should "Add new membership" fields empty', function() {
      browser.get('/people/create');
      expect(createPersonPage.personEditor.newMembershipEditor.name.getText()).toBe('');
      expect(createPersonPage.personEditor.newMembershipEditor.role.getText()).toBe('');
    });

    it('should not allow adding a new membership if the role is not set', function() {
      protractor.promise.controlFlow().execute(function() {
        return client.createTeam({
          name: 'team A',
          url: 'http://example.org',
          slogan: 'team A slogan'
        });
      });

      browser.get('/people/create');
      createPersonPage.personEditor.newMembershipEditor.name.sendKeys('a');
      createPersonPage.personEditor.newMembershipEditor.nameDropdownItem(0).click();
      expect(createPersonPage.personEditor.newMembershipEditor.add.getAttribute('disabled')).not.toBeNull();
    });

    it('should not allow adding a new membership if the team is not set', function() {
      browser.get('/people/create');
      createPersonPage.personEditor.newMembershipEditor.role.sendKeys('developer');
      expect(createPersonPage.personEditor.newMembershipEditor.add.getAttribute('disabled')).not.toBeNull();
    });

    it('should allow adding a new membership if both team and role are set', function() {
      protractor.promise.controlFlow().execute(function() {
        return client.createTeam({
          name: 'team A',
          url: 'http://example.org',
          slogan: 'team A slogan'
        });
      });

      browser.get('/people/create');
      createPersonPage.personEditor.newMembershipEditor.name.sendKeys('a');
      createPersonPage.personEditor.newMembershipEditor.nameDropdownItem(0).click();
      createPersonPage.personEditor.newMembershipEditor.role.sendKeys('developer');
      expect(createPersonPage.personEditor.newMembershipEditor.add.getAttribute('disabled')).toBeNull();

      createPersonPage.personEditor.newMembershipEditor.add.click();

      expect(createPersonPage.personEditor.membershipListEditor.membershipCount()).toBe(1);
      expect(createPersonPage.personEditor.membershipListEditor.membership(0)).toBeDefined();
      expect(createPersonPage.personEditor.membershipListEditor.name(0).getText()).toBeDefined();
      expect(createPersonPage.personEditor.membershipListEditor.role(0).getText()).toBeDefined();
      expect(createPersonPage.personEditor.membershipListEditor.remove(0)).toBeDefined();
    });

    it('should allow removing an existing membership', function() {
      protractor.promise.controlFlow().execute(function() {
        return client.createTeam({
          name: 'team A',
          url: 'http://example.org',
          slogan: 'team A slogan'
        });
      });

      browser.get('/people/create');
      createPersonPage.personEditor.newMembershipEditor.name.sendKeys('a');
      createPersonPage.personEditor.newMembershipEditor.nameDropdownItem(0).click();
      createPersonPage.personEditor.newMembershipEditor.role.sendKeys('developer');
      createPersonPage.personEditor.newMembershipEditor.add.click();
      createPersonPage.personEditor.membershipListEditor.remove(0).click();
      expect(createPersonPage.personEditor.membershipListEditor.membershipCount()).toBe(0);
    });
  });

  it('should have "Create" button', function() {
    browser.get('/people/create');
    expect(createPersonPage.create.isPresent()).toBe(true);
  });

  it('should have validation errors when submitting the empty form', function() {
    browser.get('/people/create');
    createPersonPage.create.click();
    expect(createPersonPage.personEditor.nameError.isPresent()).toBe(true);
    expect(createPersonPage.personEditor.positionError.isPresent()).toBe(true);
    expect(createPersonPage.personEditor.cityError.isPresent()).toBe(true);
    expect(createPersonPage.personEditor.stateError.isPresent()).toBe(true);
    expect(createPersonPage.personEditor.phoneError.isPresent()).toBe(true);
    expect(createPersonPage.personEditor.emailError.isPresent()).toBe(true);
  });

  it('should create a person when all fields are OK', function() {
    protractor.promise.controlFlow().execute(function() {
      return client.createTeam({
        name: 'team A',
        url: 'http://example.org',
        slogan: 'team A slogan'
      });
    });

    protractor.promise.controlFlow().execute(function() {
      return client.createTeam({
        name: 'team B',
        url: 'http://example.org',
        slogan: 'team B slogan'
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
    createPersonPage.personEditor.name.sendKeys(personDescription.name);
    createPersonPage.personEditor.position.sendKeys(personDescription.position);
    createPersonPage.personEditor.city.sendKeys(personDescription.city);
    createPersonPage.personEditor.state.sendKeys(personDescription.state);
    createPersonPage.personEditor.phone.sendKeys(personDescription.phone);
    createPersonPage.personEditor.email.sendKeys(personDescription.email);

    createPersonPage.personEditor.newMembershipEditor.name.sendKeys('a');
    createPersonPage.personEditor.newMembershipEditor.nameDropdownItem(0).click();
    createPersonPage.personEditor.newMembershipEditor.role.sendKeys('developer');
    createPersonPage.personEditor.newMembershipEditor.add.click();

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
