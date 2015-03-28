require('co-mocha');

var expect = require('chai').expect;

var Sequelize = require('sequelize');

describe('Sequelize many-to-many-through', function() {
  var sequelize;
  var Project;
  var Employee;
  var Membership;
  beforeEach(function* () {
    sequelize = new Sequelize('sqlite://my.db');

    Project = sequelize.define('Project', {
      name: Sequelize.STRING
    });

    Employee = sequelize.define('Employee', {
      name: Sequelize.STRING
    });

    Participation = sequelize.define('Participation', {
      role: Sequelize.STRING
    });

    Project.hasMany(Employee, { as: 'Participants', through: Participation });
    Employee.hasMany(Project, { as: 'Participations', through: Participation });

    yield sequelize.sync();
  });

  afterEach(function* () {
    yield sequelize.drop();
  });

  describe('Connecting entities from both ends', function() {
    var aProject;
    var anEmployee;
    beforeEach(function* () {
      aProject = yield Project.create({ name: 'project 1' });
      anEmployee = yield Employee.create({ name: 'employee 1' });
    });

    it('should let me add employee to project', function* () {
      yield aProject.addParticipant(anEmployee, { role: 'developer' });
    });

    it('should let me add a project to employee', function* () {
      yield anEmployee.addParticipation(aProject, { role: 'developer' });
    });

    afterEach(function* () {
      var projectEmployees = yield aProject.getParticipants();
      expect(projectEmployees.length).to.equal(1);
      expect(projectEmployees[0].name).to.equal('employee 1');
      expect(projectEmployees[0].Participation.role).to.equal('developer');

      var employeeProjects = yield anEmployee.getParticipations();
      expect(employeeProjects.length).to.equal(1);
      expect(employeeProjects[0].name).to.equal('project 1');
      expect(employeeProjects[0].Participation.role).to.equal('developer');
    });
  });
});
