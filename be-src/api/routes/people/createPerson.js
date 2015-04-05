module.exports = function(Person, Team, PersonMembershipsRelation, Sequelize) {
  return function(router) {
    router.post('/people', function* (next) {
      var teamIds = (this.request.body.memberships || []).map(function(membership) {
        return membership.teamId;
      });

      var teams = yield Team.findAll({
        where: {
          id: { in: teamIds }
        }
      }, {
        transaction: this.tx
      });

      if(teams.length !== teamIds.length) {
        this.validationError({
          memberships: 'At least one team does not exist'
        });
      };

      var person;
      try {
        person = yield Person.create({
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

      teams.forEach(function(team, index) {
        team.Membership = { // this overrides the role specified below
          role: 'idiot #' + (index + 1)
        };
      });

      yield person.setMemberships(teams, {
        role: 'idiot', //
        transaction: this.tx
      });

      person = yield Person.find({
        where: { id: person.id },
        include: [{ association: PersonMembershipsRelation }]
      }, {
        transaction: this.tx
      });

      this.createdPerson(person);
    });
  };
};
