var utils = require('./utils');

module.exports = function(Team, teamUtils, Sequelize) {
  return function(router) {
    router.put('/teams/:team_id', function* (next) {
      var team = this.team;
      team.name = this.request.body.name;
      try {
        yield team.save({
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
      this.okTeam(team);
    });
  };
};
