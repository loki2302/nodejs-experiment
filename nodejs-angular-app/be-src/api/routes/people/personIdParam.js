module.exports = function(personUtils) {
  return function(router) {
    router.param('person_id', function* (personId, next) {
      var person = yield personUtils.findPerson(this, personId);
      if(!person) {
        this.personNotFound();
      }

      this.person = person;
      yield next;
    });
  };
};
