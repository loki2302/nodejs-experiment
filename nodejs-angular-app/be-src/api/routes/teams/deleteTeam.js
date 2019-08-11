module.exports = function() {
  return function(router) {
    router.delete('/teams/:team_id', function* (next) {
      yield this.team.destroy({
        transaction: this.tx
      });

      this.ok('Deleted');
    });
  };
};
