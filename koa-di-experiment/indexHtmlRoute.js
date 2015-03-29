module.exports = function(path, koaSend) {
  return function(router) {
    router.get('/', function* () {
      var indexHtmlPath = path.resolve(__dirname, 'index.html');
      yield koaSend(this, indexHtmlPath);
    });
  };
};
