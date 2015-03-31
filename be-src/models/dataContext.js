module.exports = function(connectionString, Sequelize,
  registerTeam,
  registerPerson,
  registerMembership) {

  var sequelize = new Sequelize(connectionString);
  var Team = registerTeam(sequelize);
  var Person = registerPerson(sequelize);
  var Membership = registerMembership(sequelize);

  Team.hasMany(Person, { as: 'Members', through: Membership });
  Person.hasMany(Team, { as: 'Memberships', through: Membership });

  return sequelize;
};
