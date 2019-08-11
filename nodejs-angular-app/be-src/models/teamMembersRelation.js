module.exports = function(Team, Person, Membership) {
  return Team.hasMany(Person, { as: 'Members', through: Membership });
};
