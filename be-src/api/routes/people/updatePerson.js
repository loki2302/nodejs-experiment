var utils = require('./utils');

module.exports = function(Person, Team, PersonMembershipsRelation, Sequelize) {
  return function(router) {
    router.put('/people/:person_id', function* (next) {
      // REUSABLE
      var memberships = this.request.body.memberships || [];
      var teamIds = utils.extractUniqueTeamIds(memberships);

      if(teamIds.length !== memberships.length) {
        this.validationError({
          memberships: 'Teams should be unique'
        });
      }

      var teams = yield Team.findAll({
        where: {
          id: { in: teamIds }
        }
      }, {
        transaction: this.tx
      });

      if(teams.length !== teamIds.length) {
        // TODO: should I make it describe what exactly does not exist?
        this.validationError({
          memberships: 'At least one team does not exist'
        });
      };
      // /REUSABLE

      this.person.name = this.request.body.name;
      try {
        yield this.person.save({
          transaction: this.tx
        });
      } catch(e) {
        if(e instanceof Sequelize.ValidationError) {
          this.validationErrorFromSequelizeValidationError(e);
        }

        throw e;
      }

      // REUSABLE
      var membershipsByTeamIdsIndex = utils.indexMembershipsByTeamIds(memberships);
      teams.forEach(function(team, index) {
        team.Membership = {
          role: membershipsByTeamIdsIndex[team.id].role
        };
      });

      yield this.person.setMemberships(teams, {
        transaction: this.tx
      });
      // /REUSABLE

      // REUSABLE
      var person = yield Person.find({
        where: { id: this.person.id },
        include: [{ association: PersonMembershipsRelation }]
      }, {
        transaction: this.tx
      });
      // /REUSABLE

      this.okPerson(person);
    });
  };
};
