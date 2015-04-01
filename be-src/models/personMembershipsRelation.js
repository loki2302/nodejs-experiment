module.exports = function(Team, Person, Membership) {
  return Person.hasMany(Team, { as: 'Memberships', through: Membership });
};
