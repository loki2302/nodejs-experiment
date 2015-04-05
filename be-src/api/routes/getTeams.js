module.exports = function(Team) {
  return function(router) {
    router.get('/teams', function* (next) {
      var teams = yield Team.findAll({
        transaction: this.tx
      });

      this.okTeamCollection(teams);
    });
  };
};
