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
});
