module.exports = function(koaBodyParser, koaCompose, KoaRouter, helloRoute) {
  var apiRouter = new KoaRouter();
  helloRoute(apiRouter);

  return koaCompose([
    koaBodyParser(),
    apiRouter.middleware()
  ]);
};
