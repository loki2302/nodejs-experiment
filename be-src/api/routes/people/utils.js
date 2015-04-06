var _ = require('lodash');

module.exports = function(Person, Team, PersonMembershipsRelation, TeamMembersRelation) {
  function extractUniqueTeamIds(memberships) {
    var teamIds = _.map(memberships, 'teamId');
    var uniqueTeamIds = _.uniq(teamIds);
    return uniqueTeamIds;
  }

  function indexMembershipsByTeamIds(memberships) {
    return _.indexBy(memberships, 'teamId');
  }

  return {
    findPerson: function* (context, id) {
      var person = yield Person.find({
        where: { id: id },
        include: [{ association: PersonMembershipsRelation }]
      }, {
        transaction: context.tx
      });
      return person;
    },

    setPersonMembershipsOrThrow: function* (context, person, memberships) {
      var teamIds = extractUniqueTeamIds(memberships);

      if(teamIds.length !== memberships.length) {
        context.validationError({
          memberships: 'Teams should be unique'
        });
      }

      var teams = yield Team.findAll({
        where: {
          id: { in: teamIds }
        }
      }, {
        transaction: context.tx
      });

      if(teams.length !== teamIds.length) {
        // TODO: should I make it describe what exactly does not exist?
        context.validationError({
          memberships: 'At least one team does not exist'
        });
      };

      var membershipsByTeamIdsIndex = indexMembershipsByTeamIds(memberships);
      teams.forEach(function(team, index) {
        team.Membership = {
          role: membershipsByTeamIdsIndex[team.id].role
        };
      });

      yield person.setMemberships(teams, {
        transaction: context.tx
      });
    }
  };
};
