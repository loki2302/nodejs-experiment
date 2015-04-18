var utils = require('./utils');

module.exports = function(Person, personUtils, Sequelize) {
  return function(router) {
    router.put('/people/:person_id', function* (next) {
      var body = this.request.body;

      var person = this.person;
      person.name = body.name;
      person.position = body.position;
      person.city = body.city;
      person.state = body.state;
      person.phone = body.phone;
      person.avatar = body.avatar;
      person.email = body.email;

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
