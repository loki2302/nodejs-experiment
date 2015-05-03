var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');
var ErrorModal = require('./uiMaps/errorModal.js');
var NotFoundPage = require('./uiMaps/notFoundPage.js');
var PersonEditor = require('./uiMaps/personEditor.js');

var EditPersonPage = function() {
  this.personEditor = new PersonEditor();
  this.update = element(by.css('#submit-person-button'));
};

describe('EditPersonPage', function() {
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

  var editPersonPage;
  var notFoundPage;
  var client;
  beforeEach(function() {
    editPersonPage = new EditPersonPage();
    notFoundPage = new NotFoundPage();
    client = new TeambuildrClient('http://localhost:3000/api/');
  });

  describe('when there is no person', function() {
    it('should not be possible to open it for editing', function() {
      browser.get('/people/123/edit');
      expect(notFoundPage.errorContainer.isPresent()).toBe(true);
    });
  });

  describe('when there is a person', function() {
    var personDescription;
    var personId;
    beforeEach(function() {
      personDescription = {
        name: 'John',
        avatar: 'http://example.org',
        position: 'Developer',
        city: 'New York',
        state: 'NY',
        phone: '+123456789',
        email: 'john@john.com'
      };

      protractor.promise.controlFlow().execute(function() {
        return client.createPerson(personDescription).then(function(response) {
          personId = response.body.id;
        });
      });
    });

    it('should be possible to open the "Edit" page', function() {
      browser.get('/people/' + personId + '/edit');
      expect(notFoundPage.errorContainer.isPresent()).toBe(false);

      expect(editPersonPage.personEditor.name.getAttribute('value')).toBe(personDescription.name);
      expect(editPersonPage.personEditor.position.getAttribute('value')).toBe(personDescription.position);
      expect(editPersonPage.personEditor.city.getAttribute('value')).toBe(personDescription.city);
      expect(editPersonPage.personEditor.state.getAttribute('value')).toBe(personDescription.state);
      expect(editPersonPage.personEditor.phone.getAttribute('value')).toBe(personDescription.phone);
      expect(editPersonPage.personEditor.email.getAttribute('value')).toBe(personDescription.email);

      expect(editPersonPage.update.isPresent()).toBe(true);

      // TODO: check if there membership editor
    });

    // TODO: check avatar editor
    // TODO: check memberships editor

    it('should be possible to update the person', function() {
      browser.get('/people/' + personId + '/edit');

      var updatedPersonDescription = {
        name: personDescription.name + '1',
        avatar: 'http://example2.org',
        position: personDescription.position + '1',
        city: personDescription.city + '1',
        state: personDescription.state + '1',
        phone: personDescription.phone + '1',
        email: 'john2@john.com'
      };

      editPersonPage.personEditor.name.clear().sendKeys(updatedPersonDescription.name);
      editPersonPage.personEditor.position.clear().sendKeys(updatedPersonDescription.position);
      editPersonPage.personEditor.city.clear().sendKeys(updatedPersonDescription.city);
      editPersonPage.personEditor.state.clear().sendKeys(updatedPersonDescription.state);
      editPersonPage.personEditor.phone.clear().sendKeys(updatedPersonDescription.phone);
      editPersonPage.personEditor.email.clear().sendKeys(updatedPersonDescription.email);
      // TODO: add membership

      editPersonPage.update.click();

      expect(browser.getLocationAbsUrl()).toBe('/people/' + personId);

      protractor.promise.controlFlow().execute(function() {
        return client.getPerson(personId).then(function(response) {
          var person = response.body;
          expect(person.name).toBe(updatedPersonDescription.name);
          expect(person.position).toBe(updatedPersonDescription.position);
          expect(person.city).toBe(updatedPersonDescription.city);
          expect(person.state).toBe(updatedPersonDescription.state);
          expect(person.phone).toBe(updatedPersonDescription.phone);
          expect(person.email).toBe(updatedPersonDescription.email);
          expect(person.memberships.length).toBe(0); // TODO
        });
      });
    });

    it('should not be possible update the person when there are validation errors', function() {
      // TODO
    });

    describe('and this person suddenly disappears', function() {
      beforeEach(function() {
        // TODO: delete person by personId
      });

      it('should display an error popup', function() {
        // TODO: click update
        // TODO: make sure there is an error
        // TODO: make sure it navigates to /people
      });
    });
  });
});
