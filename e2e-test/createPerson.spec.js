var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');

// TODO: make it require a root element
var NewMembershipEditor = function() {
  this.name = element(by.css('#new-membership-name'));
  this.nameDropdown = element(by.css('ul.dropdown-menu'));
  this.role = element(by.css('#new-membership-role'));
  this.add = element(by.css('#add-membership-button'));

  var self = this;
  this.nameDropdownItem = function(index) {
    return self.nameDropdown.all(by.css('li')).get(index);
  };
};

// TODO: make it require a root element
var MembershipListEditor = function() {
  this.membershipCount = function() {
    return element.all(by.css('.membership')).then(function(elements) {
      return elements.length;
    });
  };

  this.membership = function(index) {
    return element(by.css('.membership-' + index));
  };

  var self = this;
  this.name = function(index) {
    return self.membership(index).element(by.css('h4'));
  };

  this.role = function(index) {
    return self.membership(index).element(by.css('.membership-role'));
  };

  this.remove = function(index) {
    return self.membership(index).element(by.css('.remove-membership-button'));
  };
};

var CreatePersonPage = function() {
  this.name = element(by.css('.name input'));
  this.nameError = element(by.css('.name p'));

  this.avatar = element(by.css('.avatar img'));
  this.randomizeAvatar = element(by.css('.avatar button'));

  this.position = element(by.css('.position input'));
  this.positionError = element(by.css('.position p'));

  this.city = element(by.css('.city input'));
  this.cityError = element(by.css('.city p'));

  this.state = element(by.css('.state input'));
  this.stateError = element(by.css('.state p'));

  this.phone = element(by.css('.phone input'));
  this.phoneError = element(by.css('.phone p'));

  this.email = element(by.css('.email input'));
  this.emailError = element(by.css('.email p'));

  this.newMembershipEditor = new NewMembershipEditor();
  this.membershipListEditor = new MembershipListEditor();

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
    expect(createPersonPage.name.getText()).toBe('');
    expect(createPersonPage.position.getText()).toBe('');
    expect(createPersonPage.city.getText()).toBe('');
    expect(createPersonPage.state.getText()).toBe('');
    expect(createPersonPage.phone.getText()).toBe('');
    expect(createPersonPage.email.getText()).toBe('');
  });

  describe('Avatar editor', function() {
    it('should have a default avatar image and "randomize" button', function() {
      browser.get('/people/create');

      expect(createPersonPage.avatar.isPresent()).toBe(true);
      expect(createPersonPage.avatar.getAttribute('src')).toContain('https://');

      expect(createPersonPage.randomizeAvatar.isPresent()).toBe(true);
    });

    describe('"Randomize" button', function() {
      it('should work', function() {
        browser.get('/people/create');

        var originalSrc;
        protractor.promise.controlFlow().execute(function() {
          return createPersonPage.avatar.getAttribute('src').then(function(src) {
            originalSrc = src;
          });
        });

        createPersonPage.randomizeAvatar.click();

        protractor.promise.controlFlow().execute(function() {
          return createPersonPage.avatar.getAttribute('src').then(function(src) {
            expect(src).not.toBe(originalSrc);
          });
        });
      });
    });
  });

  describe('"Memberships" editor', function() {
    it('should "Add new membership" fields empty', function() {
      browser.get('/people/create');
      expect(createPersonPage.newMembershipEditor.name.getText()).toBe('');
      expect(createPersonPage.newMembershipEditor.role.getText()).toBe('');
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
      createPersonPage.newMembershipEditor.name.sendKeys('a');
      createPersonPage.newMembershipEditor.nameDropdownItem(0).click();
      expect(createPersonPage.newMembershipEditor.add.getAttribute('disabled')).not.toBeNull();
    });

    it('should not allow adding a new membership if the team is not set', function() {
      browser.get('/people/create');
      createPersonPage.newMembershipEditor.role.sendKeys('developer');
      expect(createPersonPage.newMembershipEditor.add.getAttribute('disabled')).not.toBeNull();
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
      createPersonPage.newMembershipEditor.name.sendKeys('a');
      createPersonPage.newMembershipEditor.nameDropdownItem(0).click();
      createPersonPage.newMembershipEditor.role.sendKeys('developer');
      expect(createPersonPage.newMembershipEditor.add.getAttribute('disabled')).toBeNull();

      createPersonPage.newMembershipEditor.add.click();
      expect(createPersonPage.membershipListEditor.membershipCount()).toBe(1);
      expect(createPersonPage.membershipListEditor.membership(0)).toBeDefined();
      expect(createPersonPage.membershipListEditor.name(0).getText()).toBeDefined();
      expect(createPersonPage.membershipListEditor.role(0).getText()).toBeDefined();
      expect(createPersonPage.membershipListEditor.remove(0)).toBeDefined();
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
      createPersonPage.newMembershipEditor.name.sendKeys('a');
      createPersonPage.newMembershipEditor.nameDropdownItem(0).click();
      createPersonPage.newMembershipEditor.role.sendKeys('developer');
      createPersonPage.newMembershipEditor.add.click();
      createPersonPage.membershipListEditor.remove(0).click();
      expect(createPersonPage.membershipListEditor.membershipCount()).toBe(0);
    });
  });

  it('should have "Create" button', function() {
    browser.get('/people/create');
    expect(createPersonPage.create.isPresent()).toBe(true);
  });

  it('should have validation errors when submitting the empty form', function() {
    browser.get('/people/create');
    createPersonPage.create.click();
    expect(createPersonPage.nameError.isPresent()).toBe(true);
    expect(createPersonPage.positionError.isPresent()).toBe(true);
    expect(createPersonPage.cityError.isPresent()).toBe(true);
    expect(createPersonPage.stateError.isPresent()).toBe(true);
    expect(createPersonPage.phoneError.isPresent()).toBe(true);
    expect(createPersonPage.emailError.isPresent()).toBe(true);
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
    createPersonPage.name.sendKeys(personDescription.name);
    createPersonPage.position.sendKeys(personDescription.position);
    createPersonPage.city.sendKeys(personDescription.city);
    createPersonPage.state.sendKeys(personDescription.state);
    createPersonPage.phone.sendKeys(personDescription.phone);
    createPersonPage.email.sendKeys(personDescription.email);

    createPersonPage.newMembershipEditor.name.sendKeys('a');
    createPersonPage.newMembershipEditor.nameDropdownItem(0).click();
    createPersonPage.newMembershipEditor.role.sendKeys('developer');
    createPersonPage.newMembershipEditor.add.click();

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
