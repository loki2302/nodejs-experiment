var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');

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

describe('PersonList', function() {
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

  var personListPage;
  var client;
  beforeEach(function() {
    personListPage = new PersonListPage();
    client = new TeambuildrClient('http://localhost:3000/api/');
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
    beforeEach(function(done) {
      client.createPerson({
        name: 'john',
        position: 'web hacker',
        city: 'New York',
        state: 'NY',
        phone: '+123456789',
        avatar: 'http://example.org',
        email: 'someone@example.org'
      }).finally(done);
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
        it('should exist', function() {
          var personListItemElement = personListPage.personListItem(0);
          expect(personListItemElement.isPresent()).toBe(true);

          var personListItem = new PersonListItem(personListItemElement);
          expect(personListItem.name.getText()).toBe('john');
          expect(personListItem.position.getText()).toBe('web hacker');
          expect(personListItem.edit.isPresent()).toBe(true);
          expect(personListItem.delete.isPresent()).toBe(true);
        });

        it('should have an edit link', function() {
          // TODO
        });

        describe('delete button', function() {
          it('should exist', function() {
            // TODO
          });

          it('should delete the person if person still exists', function() {
            // TODO
          });

          it('should display an error popup if person does not exist', function() {
            // TODO
          });
        });
      });
    });
  });
});
