module.exports = function(Person) {
  return function(router) {
    router.get('/people', function* (next) {
      var people = yield Person.findAll({
        transaction: this.tx
      });

      this.okPersonCollection(people);
    });
  };
};
