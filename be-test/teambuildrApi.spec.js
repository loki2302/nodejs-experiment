require('co-mocha');

var expect = require('chai').expect;
var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('./teambuildrClient');

describe('Teambuildr API', function() {
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

  describe('Simple CRUD without relations', function() {
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
          name: 'john',
          memberships: []
        }]);
      });

      describe('when there are many people', function() {
        beforeEach(function* () {
          // how do I forEach loop here?
          yield client.createPerson({ name: 'john' });
          yield client.createPerson({ name: 'joe' });
          yield client.createPerson({ name: 'jonathan' });
          yield client.createPerson({ name: 'bill' });
        });

        it('should filter them by "nameContains"', function* () {
          var people = (yield client.getPeople({
            nameContains: 'jo'
          })).body;
          expect(people.length).to.equal(3);
        });

        it('should limit them by "max"', function* () {
          var people = (yield client.getPeople({
            max: 3
          })).body;
          expect(people.length).to.equal(3);
        });

        it('should both filter them by "nameContains" and limit them by "max"', function* () {
          var people = (yield client.getPeople({
            nameContains: 'jo',
            max: 2
          })).body;
          expect(people.length).to.equal(2);
        });
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
          name: 'the team',
          members: []
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

  describe('CRUD with relations', function() {
    describe('POST /people', function() {
      var teamAId;
      var teamBId;
      beforeEach(function* () {
        teamAId = (yield client.createTeam({
          name: 'team A'
        })).body.id;

        teamBId = (yield client.createTeam({
          name: 'team B'
        })).body.id;
      });

      it('should create a person with memberships', function* () {
        var response = yield client.createPerson({
          name: 'john',
          memberships: [
            {
              team: { id: teamAId },
              role: 'developer'
            },
            {
              team: { id: teamBId },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(201);
        expect(response.body.memberships.length).to.equal(2);
        expect(response.body).to.deep.equal({
          id: 1,
          name: 'john',
          memberships: [
            {
              team: { id: teamAId, name: 'team A' },
              role: 'developer'
            },
            {
              team: { id: teamBId, name: 'team B' },
              role: 'manager'
            }
          ]
        });
      });

      it('should return a validation error if at least one team does not exist', function* () {
        var response = yield client.createPerson({
          name: 'john',
          memberships: [
            {
              team: { id: teamAId },
              role: 'developer'
            },
            {
              team: { id: 123 },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.memberships).to.exist;
      });

      it('should return a validation error if teams are not unique', function* () {
        var response = yield client.createPerson({
          name: 'john',
          memberships: [
            {
              team: { id: teamAId },
              role: 'developer'
            },
            {
              team: { id: teamAId },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.memberships).to.exist;
      });
    });

    describe('PUT /people', function() {
      var teamAId;
      var teamBId;
      var personId;
      beforeEach(function* () {
        teamAId = (yield client.createTeam({
          name: 'team A'
        })).body.id;

        teamBId = (yield client.createTeam({
          name: 'team B'
        })).body.id;

        personId = (yield client.createPerson({
          name: 'john'
        })).body.id;
      });

      it('should update person memberships', function* () {
        var response = yield client.updatePerson({
          id: personId,
          name: 'john',
          memberships: [
            {
              team: { id: teamAId },
              role: 'developer'
            },
            {
              team: { id: teamBId },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(200);
        expect(response.body.memberships.length).to.equal(2);
        expect(response.body).to.deep.equal({
          id: 1,
          name: 'john',
          memberships: [
            {
              team: { id: teamAId, name: 'team A' },
              role: 'developer'
            },
            {
              team: { id: teamBId, name: 'team B' },
              role: 'manager'
            }
          ]
        });
      });

      it('should return a validation error if at least one team does not exist', function* () {
        var response = yield client.updatePerson({
          id: personId,
          name: 'john',
          memberships: [
            {
              team: { id: teamAId },
              role: 'developer'
            },
            {
              team: { id: 123 },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.memberships).to.exist;
      });

      it('should return a validation error if teams are not unique', function* () {
        var response = yield client.updatePerson({
          id: personId,
          name: 'john',
          memberships: [
            {
              team: { id: teamAId },
              role: 'developer'
            },
            {
              team: { id: teamAId },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.memberships).to.exist;
      });
    });

    describe('GET /people', function() {
      // TODO: convert to GET /people
      var teamAId;
      var teamBId;
      var personId;
      beforeEach(function* () {
        teamAId = (yield client.createTeam({
          name: 'team A'
        })).body.id;

        teamBId = (yield client.createTeam({
          name: 'team B'
        })).body.id;

        personId = (yield client.createPerson({
          name: 'john',
          memberships: [
            {
              team: { id: teamAId },
              role: 'developer'
            },
            {
              team: { id: teamBId },
              role: 'manager'
            }
          ]
        })).body.id;
      });

      it('should return a collection of people with memberships', function* () {
        var response = yield client.getPeople();
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.deep.equal([{
          id: personId,
          name: 'john',
          memberships: [
            {
              team: { id: teamAId, name: 'team A' },
              role: 'developer'
            },
            {
              team: { id: teamBId, name: 'team B' },
              role: 'manager'
            }
          ]
        }]);
      });
    });

    describe('POST /teams', function() {
      var personAId;
      var personBId;
      beforeEach(function* () {
        personAId = (yield client.createPerson({
          name: 'person A'
        })).body.id;

        personBId = (yield client.createPerson({
          name: 'person B'
        })).body.id;
      });

      it('should create a team with members', function* () {
        var response = yield client.createTeam({
          name: 'the team',
          members: [
            {
              person: { id: personAId },
              role: 'developer'
            },
            {
              person: { id: personBId },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(201);
        expect(response.body.members.length).to.equal(2);
        expect(response.body).to.deep.equal({
          id: 1,
          name: 'the team',
          members: [
            {
              person: { id: personAId, name: 'person A' },
              role: 'developer'
            },
            {
              person: { id: personBId, name: 'person B' },
              role: 'manager'
            }
          ]
        });
      });

      it('should return a validation error if at least one person does not exist', function* () {
        var response = yield client.createTeam({
          name: 'the team',
          members: [
            {
              person: { id: personAId },
              role: 'developer'
            },
            {
              person: 123,
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.members).to.exist;
      });

      it('should return a validation error if people are not unique', function* () {
        var response = yield client.createTeam({
          name: 'the team',
          members: [
            {
              person: { id: personAId },
              role: 'developer'
            },
            {
              person: { id: personAId },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.members).to.exist;
      });
    });

    describe('PUT /teams', function() {
      var personAId;
      var personBId;
      var teamId;
      beforeEach(function* () {
        personAId = (yield client.createPerson({
          name: 'person A'
        })).body.id;

        personBId = (yield client.createPerson({
          name: 'person B'
        })).body.id;

        teamId = (yield client.createTeam({
          name: 'the team'
        })).body.id;
      });

      it('should update team members', function* () {
        var response = yield client.updateTeam({
          id: teamId,
          name: 'the team',
          members: [
            {
              person: { id: personAId },
              role: 'developer'
            },
            {
              person: { id: personBId },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(200);
        expect(response.body.members.length).to.equal(2);
        expect(response.body).to.deep.equal({
          id: teamId,
          name: 'the team',
          members: [
            {
              person: { id: personAId, name: 'person A' },
              role: 'developer'
            },
            {
              person: { id: personBId, name: 'person B' },
              role: 'manager'
            }
          ]
        });
      });

      it('should return a validation error if at least one person does not exist', function* () {
        var response = yield client.updateTeam({
          id: teamId,
          name: 'the team',
          members: [
            {
              person: { id: personAId },
              role: 'developer'
            },
            {
              person: { id: 123 },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.members).to.exist;
      });

      it('should return a validation error if people are not unique', function* () {
        var response = yield client.updateTeam({
          id: teamId,
          name: 'the team',
          members: [
            {
              person: { id: personAId },
              role: 'developer'
            },
            {
              person: { id: personAId },
              role: 'manager'
            }
          ]
        });

        expect(response.statusCode).to.equal(400);
        expect(response.body.members).to.exist;
      });
    });

    describe('GET /teams', function() {
      var personAId;
      var personBId;
      var teamId;
      beforeEach(function* () {
        personAId = (yield client.createPerson({
          name: 'person A'
        })).body.id;

        personBId = (yield client.createPerson({
          name: 'person B'
        })).body.id;

        teamId = (yield client.createTeam({
          name: 'the team',
          members: [
            {
              person: { id: personAId },
              role: 'developer'
            },
            {
              person: { id: personBId },
              role: 'manager'
            }
          ]
        })).body.id;
      });

      it('should return a collection of teams with members', function* () {
        var response = yield client.getTeams();
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.deep.equal([{
          id: teamId,
          name: 'the team',
          members: [
            {
              person: { id: personAId, name: 'person A' },
              role: 'developer'
            },
            {
              person: { id: personBId, name: 'person B' },
              role: 'manager'
            }
          ]
        }]);
      });
    });
  });
});
