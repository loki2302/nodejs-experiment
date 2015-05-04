var appRunnerFactory = require('../../be-src/appRunnerFactory');
var TeambuildrClient = require('../../be-test/teambuildrClient');
var ErrorModal = require('../uiMaps/errorModal.js');
var NotFoundPage = require('../uiMaps/notFoundPage.js');
var PersonEditor = require('./uiMaps/personEditor.js');
var applyAvatarEditorTests = require('./avatarEditor.specTemplate');
var applyMembershipsEditorTests = require('./membershipsEditor.specTemplate');

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
    client = new TeambuildrClient(browser.params.apiUrl);
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
      var teamAId;
      protractor.promise.controlFlow().execute(function() {
        return client.createTeam({
          name: 'team A',
          url: 'http://example.org',
          slogan: 'team A slogan'
        }).then(function(team) {
          teamAId = team.body.id;
          return true;
        });
      });

      protractor.promise.controlFlow().execute(function() {
        personDescription = {
          name: 'John',
          avatar: 'http://example.org',
          position: 'Developer',
          city: 'New York',
          state: 'NY',
          phone: '+123456789',
          email: 'john@john.com'
        };

        return client.createPerson(personDescription).then(function(response) {
          personId = response.body.id;
        });
      });
    });

    it('should be possible to open the "Edit" page', function() {
      browser.get('/people/' + personId + '/edit');
      expect(notFoundPage.errorContainer.isPresent()).toBe(false);

      var personEditor = editPersonPage.personEditor;
      expect(personEditor.name.getAttribute('value')).toBe(personDescription.name);
      expect(personEditor.position.getAttribute('value')).toBe(personDescription.position);
      expect(personEditor.city.getAttribute('value')).toBe(personDescription.city);
      expect(personEditor.state.getAttribute('value')).toBe(personDescription.state);
      expect(personEditor.phone.getAttribute('value')).toBe(personDescription.phone);
      expect(personEditor.email.getAttribute('value')).toBe(personDescription.email);
      expect(personEditor.email.getAttribute('value')).toBe(personDescription.email);
      expect(personEditor.membershipListEditor.membershipCount()).toBe(0);

      expect(editPersonPage.update.isPresent()).toBe(true);
    });

    describe('Avatar editor', function() {
      beforeEach(function() {
        browser.get('/people/' + personId + '/edit');
      });

      applyAvatarEditorTests(function() {
        var personEditor = editPersonPage.personEditor;
        return {
          avatar: personEditor.avatar,
          randomizeAvatar: personEditor.randomizeAvatar
        };
      });
    });

    describe('"Memberships" editor', function() {
      applyMembershipsEditorTests(function() {
        var personEditor = editPersonPage.personEditor;
        return {
          url: '/people/' + personId + '/edit',
          client: client,
          newMembershipEditor: personEditor.newMembershipEditor,
          membershipListEditor: personEditor.membershipListEditor
        };
      });
    });

    it('should be possible to update the person', function() {
      protractor.promise.controlFlow().execute(function() {
        return client.createTeam({
          name: 'team A',
          url: 'http://example.org',
          slogan: 'team A slogan'
        });
      });

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

      var personEditor = editPersonPage.personEditor;
      personEditor.name.clear().sendKeys(updatedPersonDescription.name);
      personEditor.position.clear().sendKeys(updatedPersonDescription.position);
      personEditor.city.clear().sendKeys(updatedPersonDescription.city);
      personEditor.state.clear().sendKeys(updatedPersonDescription.state);
      personEditor.phone.clear().sendKeys(updatedPersonDescription.phone);
      personEditor.email.clear().sendKeys(updatedPersonDescription.email);

      personEditor.newMembershipEditor.name.sendKeys('a');
      personEditor.newMembershipEditor.nameDropdownItem(0).click();
      personEditor.newMembershipEditor.role.sendKeys('developer');
      personEditor.newMembershipEditor.add.click();

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
          expect(person.memberships.length).toBe(1);
        });
      });
    });

    it('should not be possible update the person when there are validation errors', function() {
      browser.get('/people/' + personId + '/edit');

      var personEditor = editPersonPage.personEditor;
      personEditor.name.clear();
      personEditor.position.clear();
      personEditor.city.clear();
      personEditor.state.clear();
      personEditor.phone.clear();
      personEditor.email.clear();

      editPersonPage.update.click();

      expect(personEditor.nameError.isPresent()).toBe(true);
      expect(personEditor.positionError.isPresent()).toBe(true);
      expect(personEditor.cityError.isPresent()).toBe(true);
      expect(personEditor.stateError.isPresent()).toBe(true);
      expect(personEditor.phoneError.isPresent()).toBe(true);
      expect(personEditor.emailError.isPresent()).toBe(true);
    });

    describe('and this person suddenly disappears', function() {
      it('should display an error popup', function() {
        browser.get('/people/' + personId + '/edit');

        protractor.promise.controlFlow().execute(function() {
          return client.deletePerson(personId);
        });

        editPersonPage.update.click();

        var errorModal = new ErrorModal();
        expect(errorModal.element.isPresent()).toBe(true);
        expect(errorModal.message.getText()).toContain('too long');
        errorModal.ok.click();
        expect(errorModal.element.isPresent()).toBe(false);
        expect(browser.getLocationAbsUrl()).toBe('/people');
      });
    });
  });
});
