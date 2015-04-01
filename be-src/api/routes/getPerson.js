module.exports = function(Person, Team, Sequelize) {
  return function(router) {
    router.get('/people/:person_id', function* (next) {
      var personId = this.params.person_id;

      var person = yield Person.find({
        where: { id: personId },
        include: [{ model: Team, as: 'Memberships' }]
      }, {
        transaction: this.tx
      });

      if(!person) {
        this.personNotFound();
      }

      this.okPerson(person);
    });
  };
};
