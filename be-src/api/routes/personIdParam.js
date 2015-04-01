module.exports = function(Person, PersonMembershipsRelation) {
  return function(router) {
    router.param('person_id', function* (personId, next) {
      var person = yield Person.find({
        where: { id: personId },
        include: [{ association: PersonMembershipsRelation }]
      }, {
        transaction: this.tx
      });

      if(!person) {
        this.personNotFound();
      }

      this.person = person;
      yield next;
    });
  };
};
