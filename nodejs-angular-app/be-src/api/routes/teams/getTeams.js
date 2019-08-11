module.exports = function(Team, TeamMembersRelation) {
  return function(router) {
    router.get('/teams', function* (next) {
      var options = {
        include: [{ association: TeamMembersRelation }],
        transaction: this.tx
      };

      var nameContains = this.request.query.nameContains;
      if(nameContains) {
        var lowerCaseNameContains = nameContains.toLowerCase();
        options.where = ['lower(Team.name) like ?', '%' + lowerCaseNameContains + '%'];
      }

      var max = this.request.query.max;
      if(max) {
        max = parseInt(max, 10);
        options.limit = max;
      }

      var teams = yield Team.findAll(options);

      this.okTeamCollection(teams);
    });
  };
};
