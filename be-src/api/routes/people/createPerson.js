module.exports = function(Person, personUtils, Sequelize) {
  return function(router) {
    router.post('/people', function* (next) {
      var person;
      try {
        person = yield Person.create({
          name: this.request.body.name
        }, {
          transaction: this.tx
        });
      } catch(e) {
        if(e instanceof Sequelize.ValidationError) {
          this.validationErrorFromSequelizeValidationError(e);
        }

        throw e;
      }

      var memberships = this.request.body.memberships || [];
      yield personUtils.setPersonMembershipsOrThrow(this, person, memberships);

      person = yield personUtils.findPerson(this, person.id);
      this.createdPerson(person);
    });
  };
};
