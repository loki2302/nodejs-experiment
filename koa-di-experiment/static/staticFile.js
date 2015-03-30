module.exports = function(url, filePath) {
  return function(koaSend) {
    return function(router) {
      router.get(url, function* () {
        yield koaSend(this, filePath);
      });
    };
  };
};
