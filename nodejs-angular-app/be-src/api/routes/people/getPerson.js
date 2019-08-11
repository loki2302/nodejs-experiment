module.exports = function(Person, PersonMembershipsRelation, Sequelize) {
  return function(router) {
    router.get('/people/:person_id', function* (next) {
      this.okPerson(this.person);
    });
  };
};
