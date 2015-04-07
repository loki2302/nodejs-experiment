module.exports = function(Person, PersonMembershipsRelation) {
  return function(router) {
    router.get('/people', function* (next) {
      var people = yield Person.findAll({
        include: [{ association: PersonMembershipsRelation }]
      }, {
        transaction: this.tx
      });

      this.okPersonCollection(people);
    });
  };
};
