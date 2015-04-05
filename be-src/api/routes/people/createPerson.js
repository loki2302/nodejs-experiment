module.exports = function(Person, Team, PersonMembershipsRelation, Sequelize) {
  return function(router) {
    router.post('/people', function* (next) {
      // pairs of {teamId: , role:}
      var memberships = this.request.body.memberships || [];

      // team IDs
      var teamIds = memberships.map(function(membership) {
        return membership.teamId;
      });

      // teams
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

      // map of x[teamId] = role
      var rolesByTeamIds = memberships.reduce(function(acc, membership) {
        acc[membership.teamId] = membership.role;
        return acc;
      }, {});

      // for each team, set the Membership/role based on team.id
      teams.forEach(function(team, index) {
        team.Membership = {
          role: rolesByTeamIds[team.id]
        };
      });

      yield person.setMemberships(teams, {
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
