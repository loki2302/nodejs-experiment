module.exports = function(indexLocations, notFoundLocations, staticRootPath, indexHtmlPath, KoaRouter, koaSend, koaCompose, koaStatic) {
  var router = new KoaRouter();

  indexLocations.forEach(function(route) {
    router.all(route, function* () {
      yield koaSend(this, indexHtmlPath);
    });
  });

  notFoundLocations.forEach(function(route) {
    router.all(route, function* () {
      yield koaSend(this, indexHtmlPath);
      this.status = 404;
    });
  });

  return koaCompose([
    koaStatic(staticRootPath),
    router.middleware()
  ]);
};
