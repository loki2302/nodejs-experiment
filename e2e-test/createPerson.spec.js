var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');

var CreatePersonPage = function() {
  this.name = element(by.css('.name input'));
  this.nameError = element(by.css('.name p'));

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
    browser.get('/people/create');
    createPersonPage.name.sendKeys('John');
    createPersonPage.position.sendKeys('Developer');
    createPersonPage.city.sendKeys('New York');
    createPersonPage.state.sendKeys('NY');
    createPersonPage.phone.sendKeys('+123456789');
    createPersonPage.email.sendKeys('john@john.com');
    createPersonPage.create.click();

    //var person = protractor.promise.controlFlow().await(client.getPeople().then(function(x) {console.log(x);return x;}))[0];
    expect(browser.getLocationAbsUrl()).toBe('/people/1');

    // this does not work
    /*console.log('OMG Before call');
    var person;
    protractor.promise.controlFlow().wait(client.getPeople()).then(function(response) {
      person = response.body[0];
      console.log('OMG inside then');
    });
    console.log('OMG after call', person);*/
  });
});
