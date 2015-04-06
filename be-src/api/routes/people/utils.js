var _ = require('lodash');

module.exports = {
  extractUniqueTeamIds: function(memberships) {
    var teamIds = _.map(memberships, 'teamId');
    var uniqueTeamIds = _.uniq(teamIds);
    return uniqueTeamIds;
  },

  indexMembershipsByTeamIds: function(memberships) {
    return _.indexBy(memberships, 'teamId');
  }
};
