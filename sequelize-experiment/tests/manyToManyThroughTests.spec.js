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

    ProjectEmployeeMembership = sequelize.define('ProjectEmployeeMembership', {
      role: Sequelize.STRING
    });

    Project.hasMany(Employee, { through: ProjectEmployeeMembership });
    Employee.hasMany(Project, { through: ProjectEmployeeMembership });

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
      yield aProject.addEmployee(anEmployee, { role: 'developer' });
    });

    it('should let me add a project to employee', function* () {
      yield anEmployee.addProject(aProject, { role: 'developer' });
    });

    afterEach(function* () {
      var projectEmployees = yield aProject.getEmployees();
      expect(projectEmployees.length).to.equal(1);
      expect(projectEmployees[0].ProjectEmployeeMembership.role).to.equal('developer');

      var employeeProjects = yield anEmployee.getProjects();
      expect(employeeProjects.length).to.equal(1);
      expect(employeeProjects[0].ProjectEmployeeMembership.role).to.equal('developer');
    });
  });
});
