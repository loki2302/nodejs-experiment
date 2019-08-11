var _ = require('lodash');

module.exports = function(Team, Person, TeamMembersRelation, PersonMembershipsRelation) {
  function extractUniquePersonIds(members) {
    var personIds = _.map(members, function(member) {
      return member.person.id;
    });

    var uniquePersonIds = _.uniq(personIds);
    return uniquePersonIds;
  }

  function indexMembersByPersonIds(members) {
    return _.indexBy(members, function(member) {
      return member.person.id;
    });
  }

  return {
    findTeam: function* (context, id) {
      var team = yield Team.find({
        where: { id: id },
        include: [{ association: TeamMembersRelation }]
      }, {
        transaction: context.tx
      });
      return team;
    },

    setTeamMembersOrThrow: function* (context, team, members) {
      var personIds = extractUniquePersonIds(members);

      if(personIds.length !== members.length) {
        context.validationError({
          members: 'People should be unique'
        });
      }

      var people = yield Person.findAll({
        where: {
          id: { in: personIds }
        }
      }, {
        transaction: context.tx
      });

      if(people.length !== personIds.length) {
        // TODO: should I make it describe what exactly does not exist?
        context.validationError({
          members: 'At least one person does not exist'
        });
      };

      var membersByPersonIdsIndex = indexMembersByPersonIds(members);
      people.forEach(function(person, index) {
        person.Membership = {
          role: membersByPersonIdsIndex[person.id].role
        };
      });

      yield team.setMembers(people, {
        transaction: context.tx
      });
    }
  };
};
