require('co-mocha');

var expect = require('chai').expect;
var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('./teambuildrClient');

describe('Teambuild API', function() {
  var appRunner;
  var client;
  beforeEach(function* () {
    appRunner = yield appRunnerFactory();
    yield appRunner.start();
    yield appRunner.reset();

    client = new TeambuildrClient('http://localhost:3000/api/');
  });

  afterEach(function* () {
    yield appRunner.stop();
    appRunner = null;
  });

  describe('POST /people', function() {
    it('should create a person', function* () {
      var response = yield client.createPerson({
        name: 'john'
      });
      expect(response.statusCode).to.equal(201);
      expect(response.body).to.deep.equal({
        id: 1,
        name: 'john',
        memberships: []
      });
    });

    it('should not create a person when name is null', function* () {
      try {
        yield client.createPerson({});
        expect(true).to.equal(false);
      } catch(e) {
        expect(e.response.statusCode).to.equal(400);
        expect(e.response.body).to.include.keys('name');
      }
    });

    it('should not create a person when name is empty', function* () {
      try {
        yield client.createPerson({name: ''});
        expect(true).to.equal(false);
      } catch(e) {
        expect(e.response.statusCode).to.equal(400);
        expect(e.response.body).to.include.keys('name');
      }
    });
  });

  describe('GET /people/{id}', function() {
    it('should respond with person details if person exists', function* () {
      var createdPerson = (yield client.createPerson({
        name: 'john'
      })).body;

      var response = yield client.getPerson(createdPerson.id);
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.deep.equal(createdPerson);
    });

    it('should respond with 404 if person does not exist', function* () {
      try {
        yield client.getPerson(123);
        expect(true).to.equal(false);
      } catch(e) {
        expect(e.response.statusCode).to.equal(404);
      }
    });
  });

  describe('GET /people', function() {
    it('should have no people by default', function* () {
      var response = yield client.getPeople();
      expect(response.statusCode).to.equal(200);
      expect(response.body.length).to.equal(0);
    });

    it('should respond with a list of people when at least one person exists', function* () {
      yield client.createPerson({
        name: 'john'
      });

      var people = (yield client.getPeople()).body;
      expect(people).to.deep.equal([{
        id: 1,
        name: 'john'
      }]);
    });
  });

  describe('PUT /people/{id}', function() {
    it('should respond with 404 if person does not exist', function* () {
      try {
        yield client.updatePerson({
          id: 123,
          name: 'updated john'
        });
        expect(true).to.equal(false);
      } catch(e) {
        expect(e.response.statusCode).to.equal(404);
      }
    });

    it('should respond with 400 when new field values are not valid', function* () {
      var personId = (yield client.createPerson({
        name: 'john'
      })).body.id;

      try {
        yield client.updatePerson({
          id: personId,
          name: ''
        });
        expect(true).to.equal(false);
      } catch(e) {
        expect(e.response.statusCode).to.equal(400);
        expect(e.response.body).to.include.keys('name');
      }
    });

    it('should update the person if everything is OK', function* () {
      var personId = (yield client.createPerson({
        name: 'john'
      })).body.id;

      var response = yield client.updatePerson({
        id: personId,
        name: 'updated john'
      });
      expect(response.statusCode).to.equal(200);
      expect(response.body.id).to.equal(personId);
      expect(response.body.name).to.equal('updated john');
    });
  });

  describe('DELETE /people/{id}', function() {
    it('should respond with 404 if person does not exist', function* () {
      try {
        yield client.deletePerson(123);
        expect(true).to.equal(false);
      } catch(e) {
        expect(e.response.statusCode).to.equal(404);
      }
    });

    it('should delete the person if person exists', function* () {
      var personId = (yield client.createPerson({
        name: 'john'
      })).body.id;

      yield client.deletePerson(personId);

      var people = (yield client.getPeople()).body;
      expect(people.length).to.equal(0);
    });
  });
});
