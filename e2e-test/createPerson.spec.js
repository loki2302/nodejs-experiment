var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');

var CreatePersonPage = function() {
  this.name = element(by.css('.name input'));
  this.position = element(by.css('.position input'));
  this.city = element(by.css('.city input'));
  this.state = element(by.css('.state input'));
  this.phone = element(by.css('.phone input'));
  this.email = element(by.css('.email input'));
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

  // TODO: there should be a default avatar image
  // TODO: there should be a randomize avatar button
  // TODO: the randomize avatar button should work
  // TODO: submitting an empty form should result in validation errors
  // TODO: submitting a non-empty form should result in a new person
  // TODO: describe "team memberships" editor

  it('should have all fields empty', function() {
    browser.get('/people/create');
    expect(createPersonPage.name.getText()).toBe('');
    expect(createPersonPage.position.getText()).toBe('');
    expect(createPersonPage.city.getText()).toBe('');
    expect(createPersonPage.state.getText()).toBe('');
    expect(createPersonPage.phone.getText()).toBe('');
    expect(createPersonPage.email.getText()).toBe('');
  });

  it('should have "Create" button', function() {
    browser.get('/people/create');
    expect(createPersonPage.create.isPresent()).toBe(true);
  });
});
