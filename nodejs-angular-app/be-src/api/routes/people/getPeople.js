module.exports = function(Person, PersonMembershipsRelation) {
  return function(router) {
    router.get('/people', function* (next) {
      var options = {
        include: [{ association: PersonMembershipsRelation }],
        transaction: this.tx
      };

      var nameContains = this.request.query.nameContains;
      if(nameContains) {
        var lowerCaseNameContains = nameContains.toLowerCase();
        options.where = ['lower(Person.name) like ?', '%' + lowerCaseNameContains + '%'];
      }

      var max = this.request.query.max;
      if(max) {
        max = parseInt(max, 10);
        options.limit = max;
      }

      var people = yield Person.findAll(options);

      this.okPersonCollection(people);
    });
  };
};
