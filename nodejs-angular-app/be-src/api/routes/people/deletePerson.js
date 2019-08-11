module.exports = function() {
  return function(router) {
    router.delete('/people/:person_id', function* (next) {
      yield this.person.destroy({
        transaction: this.tx
      });

      this.ok('Deleted');
    });
  };
};
