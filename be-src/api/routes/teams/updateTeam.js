module.exports = function(Sequelize, Team, TeamMembersRelation) {
  return function(router) {
    router.put('/teams/:team_id', function* (next) {
      this.team.name = this.request.body.name;
      try {
        yield this.team.save({
          transaction: this.tx
        });
      } catch(e) {
        if(e instanceof Sequelize.ValidationError) {
          this.validationErrorFromSequelizeValidationError(e);
        }

        throw e;
      }

      var team = yield Team.find({
        where: { id: this.team.id },
        include: [{ association: TeamMembersRelation }]
      }, {
        transaction: this.tx
      });

      this.okTeam(team);
    });
  };
};
