module.exports = function(Person, PersonMembershipsRelation, Sequelize) {
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

      //
      // http://stackoverflow.com/questions/26324142/rest-api-what-should-my-post-return
      // this.set({
      //   'Location': '/api/people/123'
      // })
      // ????
      //

      person = yield Person.find({
        where: { id: person.id },
        include: [{ association: PersonMembershipsRelation }]
      }, {
        transaction: this.tx
      });

      this.createdPerson(person);
    });
  };
};
