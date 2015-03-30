module.exports = function(koaCompose, KoaRouter, koaBodyParser, allRoutes) {
  var router = new KoaRouter();
  allRoutes.forEach(function(route) {
    route(router);
  });

  return koaCompose([
    koaBodyParser(),
    router.middleware()
  ]);
};
