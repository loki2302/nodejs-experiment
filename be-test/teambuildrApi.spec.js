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
      var response = yield client.createPerson({});
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.include.keys('name');
    });

    it('should not create a person when name is empty', function* () {
      var response = yield client.createPerson({name: ''});
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.include.keys('name');
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
      var response = yield client.getPerson(123);
      expect(response.statusCode).to.equal(404);
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
      var response = yield client.updatePerson({
        id: 123,
        name: 'updated john'
      });
      expect(response.statusCode).to.equal(404);
    });

    it('should respond with 400 when new field values are not valid', function* () {
      var personId = (yield client.createPerson({
        name: 'john'
      })).body.id;

      var response = yield client.updatePerson({
        id: personId,
        name: ''
      });
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.include.keys('name');
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
      var response = yield client.deletePerson(123);
      expect(response.statusCode).to.equal(404);
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

  describe('POST /teams', function() {
    it('should create a team', function* () {
      var response = yield client.createTeam({
        name: 'the team'
      });
      expect(response.statusCode).to.equal(201);
      expect(response.body).to.deep.equal({
        id: 1,
        name: 'the team',
        members: []
      });
    });

    it('should not create a team when name is null', function* () {
      var response = yield client.createTeam({});
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.include.keys('name');
    });

    it('should not create a team when name is empty', function* () {
      var response = yield client.createTeam({name: ''});
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.include.keys('name');
    });
  });

  describe('GET /teams/{id}', function() {
    it('should respond with team details if team exists', function* () {
      var createdTeam = (yield client.createTeam({
        name: 'the team'
      })).body;

      var response = yield client.getTeam(createdTeam.id);
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.deep.equal(createdTeam);
    });

    it('should respond with 404 if team does not exist', function* () {
      var response = yield client.getTeam(123);
      expect(response.statusCode).to.equal(404);
    });
  });

  describe('GET /teams', function() {
    it('should have no teams by default', function* () {
      var response = yield client.getTeams();
      expect(response.statusCode).to.equal(200);
      expect(response.body.length).to.equal(0);
    });

    it('should respond with a list of teams when at least one team exists', function* () {
      yield client.createTeam({
        name: 'the team'
      });

      var teams = (yield client.getTeams()).body;
      expect(teams).to.deep.equal([{
        id: 1,
        name: 'the team'
      }]);
    });
  });

  describe('PUT /teams/{id}', function() {
    it('should respond with 404 if team does not exist', function* () {
      var response = yield client.updateTeam({
        id: 123,
        name: 'updated team'
      });
      expect(response.statusCode).to.equal(404);
    });

    it('should respond with 400 when new field values are not valid', function* () {
      var teamId = (yield client.createTeam({
        name: 'the team'
      })).body.id;

      var response = yield client.updateTeam({
        id: teamId,
        name: ''
      });
      expect(response.statusCode).to.equal(400);
      expect(response.body).to.include.keys('name');
    });

    it('should update the team if everything is OK', function* () {
      var teamId = (yield client.createTeam({
        name: 'the team'
      })).body.id;

      var response = yield client.updateTeam({
        id: teamId,
        name: 'updated team'
      });
      expect(response.statusCode).to.equal(200);
      expect(response.body.id).to.equal(teamId);
      expect(response.body.name).to.equal('updated team');
    });
  });

  describe('DELETE /teams/{id}', function() {
    it('should respond with 404 if team does not exist', function* () {
      var response = yield client.deleteTeam(123);
      expect(response.statusCode).to.equal(404);
    });

    it('should delete the team if team exists', function* () {
      var teamId = (yield client.createTeam({
        name: 'the team'
      })).body.id;

      yield client.deleteTeam(teamId);

      var teams = (yield client.getTeams()).body;
      expect(teams.length).to.equal(0);
    });
  });
});
