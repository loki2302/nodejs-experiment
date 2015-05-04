var ErrorModal = require('../uiMaps/errorModal');
var makePersonDescription = require('../makePersonDescription');

var PersonListPage = function() {
  this.addPerson = element(by.css('#add-person'));
  this.noPeopleAlert = element(by.css('#no-people-alert'));
  this.peopleContainer = element(by.css('#people-container'));
  this.personListItem = function(index) {
    return element(by.css('.person-list-item.item-' + index));
  };
};

var PersonListItem = function(element) {
  this.name = element.element(by.css('.name'));
  this.position = element.element(by.css('.position'));
  this.edit = element.element(by.css('.edit'));
  this.delete = element.element(by.css('.delete'));
};

describeTeambuildr('PersonList', function() {
  var personListPage;
  beforeEach(function() {
    personListPage = new PersonListPage();
  });

  describe('when there are no people', function() {
    it('should have an "Add Person" link', function() {
      browser.get('/people');
      expect(personListPage.addPerson.isPresent()).toBe(true);

      personListPage.addPerson.click();
      expect(browser.getLocationAbsUrl()).toBe('/people/create');
    });

    it('should have a "no people" alert', function() {
      browser.get('/people');
      expect(personListPage.noPeopleAlert.isPresent()).toBe(true);
      expect(personListPage.peopleContainer.isPresent()).toBe(false);
    });
  });

  describe('when there are people', function() {
    var person;
    beforeEach(function() {
      await(function() {
        var personDescription = makePersonDescription(0);
        return client.createPerson(personDescription).then(function(response) {
          person = response.body;
        });
      });
    });

    it('should have an "Add Person" link', function() {
      browser.get('/people');
      expect(personListPage.addPerson.isPresent()).toBe(true);

      personListPage.addPerson.click();
      expect(browser.getLocationAbsUrl()).toBe('/people/create');
    });

    describe('person list', function() {
      it('should exist', function() {
        browser.get('/people');
        expect(personListPage.peopleContainer.isPresent()).toBe(true);
        expect(personListPage.noPeopleAlert.isPresent()).toBe(false);
      });

      describe('the only item', function() {
        var personListItemElement;
        var personListItem;
        beforeEach(function() {
          browser.get('/people');
          personListItemElement = personListPage.personListItem(0);
          personListItem = new PersonListItem(personListItemElement);
        });

        it('should exist', function() {
          expect(personListItemElement.isPresent()).toBe(true);
          expect(personListItem.position.getText()).toBe(person.position);
        });

        it('should have a "view" link', function() {
          expect(personListItem.name.getText()).toBe(person.name);

          personListItem.name.click();
          expect(browser.getLocationAbsUrl()).toBe('/people/' + person.id);
        });

        it('should have an "edit" link', function() {
          expect(personListItem.edit.isPresent()).toBe(true);

          personListItem.edit.click();
          expect(browser.getLocationAbsUrl()).toBe('/people/' + person.id + '/edit');
        });

        it('should have a delete button', function() {
          expect(personListItem.delete.isPresent()).toBe(true);
        });

        describe('delete button', function() {
          it('should delete the person if person still exists', function() {
            personListItem.delete.click();
            expect(personListPage.noPeopleAlert.isPresent()).toBe(true);
            expect(personListPage.peopleContainer.isPresent()).toBe(false);
          });

          it('should display an error popup if person does not exist', function() {
            await(function() {
              return client.deletePerson(person.id);
            });

            personListItem.delete.click();

            var errorModal = new ErrorModal();
            expect(errorModal.element.isPresent()).toBe(true);
            expect(errorModal.message.getText()).toContain('too long');
            errorModal.ok.click();
            expect(errorModal.element.isPresent()).toBe(false);

            expect(personListPage.noPeopleAlert.isPresent()).toBe(true);
            expect(personListPage.peopleContainer.isPresent()).toBe(false);
          });
        });
      });
    });
  });
});
