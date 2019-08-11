module.exports = function(Team, Person) {
  return function(router) {
    router.get('/utils/stats', function* (next) {
      var teamCount = yield Team.count({ transaction: this.tx });
      var personCount = yield Person.count({ transaction: this.tx });

      this.status = 200;
      this.body = {
        teams: teamCount,
        people: personCount
      };
    });
  };
};
