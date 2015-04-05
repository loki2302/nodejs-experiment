module.exports = function(Sequelize, Person, PersonMembershipsRelation) {
  return function(router) {
    router.put('/people/:person_id', function* (next) {
      this.person.name = this.request.body.name;
      try {
        yield this.person.save({
          transaction: this.tx
        });
      } catch(e) {
        if(e instanceof Sequelize.ValidationError) {
          this.validationErrorFromSequelizeValidationError(e);
        }

        throw e;
      }

      var person = yield Person.find({
        where: { id: this.person.id },
        include: [{ association: PersonMembershipsRelation }]
      }, {
        transaction: this.tx
      });

      this.okPerson(person);
    });
  };
};
