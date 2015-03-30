module.exports = function(something, Category) {
  return function(router) {
    router.get('/b', function* () {
      this.body = 'hello b ' + something + ' ' + Category.name;
    });
  };
};
