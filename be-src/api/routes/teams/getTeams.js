module.exports = function(Team, TeamMembersRelation) {
  return function(router) {
    router.get('/teams', function* (next) {
      var teams = yield Team.findAll({
        include: [{ association: TeamMembersRelation }]
      }, {
        transaction: this.tx
      });

      this.okTeamCollection(teams);
    });
  };
};
