require('co-mocha');

var expect = require('chai').expect;

var Sequelize = require('sequelize');

describe('https://github.com/sequelize/sequelize/issues/3569', function() {
  var sequelize;
  var Project;
  var Employee;
  var Participation;
  beforeEach(function* () {
    sequelize = new Sequelize('sqlite://my.db');

    Project = sequelize.define('Project', {
      name: Sequelize.STRING
    });

    Employee = sequelize.define('Employee', {
      name: Sequelize.STRING
    });

    Participation = sequelize.define('Participation', {
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 50],
            msg: 'too bad'
          }
        }
      }
    });

    Project.belongsToMany(Employee, { as: 'Participants', through: Participation });
    Employee.belongsToMany(Project, { as: 'Participations', through: Participation });

    yield sequelize.sync();
  });

  afterEach(function* () {
    yield sequelize.drop();
  });

  it('Sequelize should apply validation when using set[AS]()', function* () {
    var project = yield Project.create({ name: 'project 1' });
    var employee = yield Employee.create({ name: 'employee 1' });
    employee.Participation = { role: '' };

    try {
      yield project.setParticipants([employee]);
      expect(true).to.equal(false);
    } catch(e) {
      console.log(e);
      expect(e.name).to.equal('SequelizeValidationError');
    }
  });

  it('Sequelize should apply validation when using add[AS]()', function* () {
    var project = yield Project.create({ name: 'project 1' });
    var employee = yield Employee.create({ name: 'employee 1' });
    try {
      yield project.addParticipant(employee, { role: 'x' });
      expect(true).to.equal(false);
    }catch(e) {
      console.log(e);
      expect(e.name).to.equal('SequelizeValidationError');
    }
  });
});
