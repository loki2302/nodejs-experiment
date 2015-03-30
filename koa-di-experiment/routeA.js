module.exports = function(something, Note) {
  return function(router) {
    router.get('/a', function* () {
      this.body = 'hello a ' + something + ' ' + Note.name;
    });
  };
};
