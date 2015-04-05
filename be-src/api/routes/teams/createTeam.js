module.exports = function(Team, TeamMembersRelation, Sequelize) {
  return function(router) {
    router.post('/teams', function* (next) {
      var team;
      try {
        team = yield Team.create({
          name: this.request.body.name
        }, {
          transaction: this.tx
        });
      } catch(e) {
        if(e instanceof Sequelize.ValidationError) {
          this.validationErrorFromSequelizeValidationError(e);
        }

        throw e;
      }

      team = yield Team.find({
        where: { id: team.id },
        include: [{ association: TeamMembersRelation }]
      }, {
        transaction: this.tx
      });

      this.createdTeam(team);
    });
  };
};
