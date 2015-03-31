module.exports = function(indexLocations, staticRootPath, indexHtmlPath, KoaRouter, koaSend, koaCompose, koaStatic) {
  var router = new KoaRouter();
  indexLocations.forEach(function(route) {
    router.all(route, function* () {
      yield koaSend(this, indexHtmlPath);
    });
  });

  return koaCompose([
    koaStatic(staticRootPath),
    router.middleware()
  ]);
};
