module.exports = function(Team, teamUtils, Sequelize) {
  return function(router) {
    router.post('/teams', function* (next) {
      var body = this.request.body;
      var team;
      try {
        team = yield Team.create({
          name: body.name,
          url: body.url,
          slogan: body.slogan
        }, {
          transaction: this.tx
        });
      } catch(e) {
        if(e instanceof Sequelize.ValidationError) {
          this.validationErrorFromSequelizeValidationError(e);
        }

        throw e;
      }

      var members = this.request.body.members || [];
      yield teamUtils.setTeamMembersOrThrow(this, team, members);

      team = yield teamUtils.findTeam(this, team.id);
      this.createdTeam(team);
    });
  };
};
