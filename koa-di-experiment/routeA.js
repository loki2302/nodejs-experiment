module.exports = function(something) {
  return function(router) {
    router.get('/a', function* () {
      this.body = 'hello a ' + something;
    });
  };
};
