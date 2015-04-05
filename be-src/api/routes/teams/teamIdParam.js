module.exports = function(Team, TeamMembersRelation) {
  return function(router) {
    router.param('team_id', function* (teamId, next) {
      var team = yield Team.find({
        where: { id: teamId },
        include: [{ association: TeamMembersRelation }]
      }, {
        transaction: this.tx
      });

      if(!team) {
        this.teamNotFound();
      }

      this.team = team;
      yield next;
    });
  };
};
