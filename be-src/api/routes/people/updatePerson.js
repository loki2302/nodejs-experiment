var utils = require('./utils');

module.exports = function(Person, personUtils, Sequelize) {
  return function(router) {
    router.put('/people/:person_id', function* (next) {
      var person = this.person;
      person.name = this.request.body.name;
      try {
        yield person.save({
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
      this.okPerson(person);
    });
  };
};
