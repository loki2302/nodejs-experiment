module.exports = function(Team, TeamMembersRelation, Sequelize) {
  return function(router) {
    router.get('/teams/:team_id', function* (next) {
      this.okTeam(this.team);
    });
  };
};
