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

      // TODO: check if there is update button
      // TODO: check if there membership editor
    });

    // TODO: check avatar editor
    // TODO: check memberships editor

    it('should be possible to update the person', function() {
      // TODO: modify field values and click update
    });

    // TODO: check validation errors when all fields are empty

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
