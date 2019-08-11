var ErrorModal = require('../uiMaps/errorModal');
var NotFoundPage = require('../uiMaps/notFoundPage');
var PersonEditor = require('./uiMaps/personEditor');
var makePersonDescription = require('../makePersonDescription');
var makeTeamDescription = require('../makeTeamDescription');
var applyAvatarEditorTests = require('./avatarEditor.specTemplate');
var applyMembershipsEditorTests = require('./membershipsEditor.specTemplate');

var EditPersonPage = function() {
  this.personEditor = new PersonEditor();
  this.update = element(by.css('#submit-person-button'));
};

describeTeambuildr('EditPersonPage', function() {
  var editPersonPage;
  var notFoundPage;
  beforeEach(function() {
    editPersonPage = new EditPersonPage();
    notFoundPage = new NotFoundPage();
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
      await(function() {
        personDescription = makePersonDescription(0);
        return client.createPerson(personDescription).then(function(response) {
          personId = response.body.id;
        });
      });
    });

    it('should be possible to open the "Edit" page', function() {
      browser.get('/people/' + personId + '/edit');
      expect(notFoundPage.errorContainer.isPresent()).toBe(false);

      var personEditor = editPersonPage.personEditor;
      personEditor.expectMatchDescription(personDescription);
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
      var teamADescription = makeTeamDescription(0);
      await(function() {
        return client.createTeam(teamADescription);
      });

      browser.get('/people/' + personId + '/edit');

      var updatedPersonDescription = makePersonDescription(1);

      var personEditor = editPersonPage.personEditor;
      personEditor.setFromDescription(updatedPersonDescription);

      personEditor.newMembershipEditor.name.sendKeys('a');
      personEditor.newMembershipEditor.nameDropdownItem(0).click();
      personEditor.newMembershipEditor.role.sendKeys('developer');
      personEditor.newMembershipEditor.add.click();

      editPersonPage.update.click();

      expect(browser.getLocationAbsUrl()).toBe('/people/' + personId);

      await(function() {
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
      personEditor.clearAll();

      editPersonPage.update.click();

      personEditor.expectAllFieldsInError();
    });

    describe('and this person suddenly disappears', function() {
      it('should display an error popup', function() {
        browser.get('/people/' + personId + '/edit');

        await(function() {
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
