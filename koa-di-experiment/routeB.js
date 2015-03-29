module.exports = function(something) {
  return function(router) {
    router.get('/b', function* () {
      this.body = 'hello b ' + something;
    });
  };
};
