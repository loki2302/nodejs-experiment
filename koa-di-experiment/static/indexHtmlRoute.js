module.exports = function(path, koaSend, pathToIndexHtml) {
  return function(router) {
    router.get('/', function* () {
      var indexHtmlPath = path.resolve(pathToIndexHtml);
      yield koaSend(this, indexHtmlPath);
    });
  };
};
