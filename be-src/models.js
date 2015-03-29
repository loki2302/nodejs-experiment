var Sequelize = require('sequelize');

module.exports = function() {
  var sequelize = new Sequelize('sqlite://my.db');

  var Team = sequelize.define('Team', {
    name: Sequelize.STRING
  });

  var Person = sequelize.define('Person', {
    name: Sequelize.STRING
  });

  var Membership = sequelize.define('Membership', {
    role: Sequelize.STRING
  });

  Team.hasMany(Person, { as: 'Members', through: Membership });
  Person.hasMany(Team, { as: 'Memberships', through: Membership });

  return {
    sequelize: sequelize,
    initialize: function() {
      return sequelize.sync();
    },
    reset: function() {
      return sequelize.drop().then(function() {
        return sequelize.sync();
      });
    }
  };
};
