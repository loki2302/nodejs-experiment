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

  describe('Given that there is one project and one employee', function() {
    var aProject;
    var anEmployee;
    beforeEach(function* () {
      aProject = yield Project.create({ name: 'project 1' });
      anEmployee = yield Employee.create({ name: 'employee 1' });
    });

    describe('and they are not connected', function() {
      it('should let me add an employee to project as a participant', function* () {
        yield aProject.addParticipant(anEmployee, { role: 'developer' });
      });

      it('should let me add a project to employee as a participation', function* () {
        yield anEmployee.addParticipation(aProject, { role: 'developer' });
      });

      afterEach(function* () {
        var projectParticipants = yield aProject.getParticipants();
        expect(projectParticipants.length).to.equal(1);
        expect(projectParticipants[0].name).to.equal('employee 1');
        expect(projectParticipants[0].Participation.role).to.equal('developer');

        var employeeParticipations = yield anEmployee.getParticipations();
        expect(employeeParticipations.length).to.equal(1);
        expect(employeeParticipations[0].name).to.equal('project 1');
        expect(employeeParticipations[0].Participation.role).to.equal('developer');
      });
    });

    describe('and they are connected', function() {
      beforeEach(function* () {
        yield aProject.addParticipant(anEmployee, { role: 'developer' });
      });

      it('should let me disconnect them', function* () {
        yield aProject.removeParticipant(anEmployee);

        var projectParticipants = yield aProject.getParticipants();
        expect(projectParticipants.length).to.equal(0);

        var employeeParticipations = yield anEmployee.getParticipations();
        expect(employeeParticipations.length).to.equal(0);

        expect(yield Participation.count()).to.equal(0);
        expect(yield Project.count()).to.equal(1);
        expect(yield Employee.count()).to.equal(1);
      });

      it('should let me delete project and keep an employee', function* () {
        yield aProject.destroy();
        
        var employeeParticipations = yield anEmployee.getParticipations();
        expect(employeeParticipations.length).to.equal(0);

        expect(yield Participation.count()).to.equal(0);
        expect(yield Project.count()).to.equal(0);
        expect(yield Employee.count()).to.equal(1);
      });

      it('should let me delete an employee and keep a project', function* () {
        yield anEmployee.destroy();
        
        var projectParticipants = yield aProject.getParticipants();
        expect(projectParticipants.length).to.equal(0);

        expect(yield Participation.count()).to.equal(0);
        expect(yield Project.count()).to.equal(1);
        expect(yield Employee.count()).to.equal(0);
      });
    });
  });
});
