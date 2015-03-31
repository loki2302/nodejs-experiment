module.exports = function(koaBodyParser, koaCompose, KoaRouter, transactionalMiddleware, helloRoute) {
  var apiRouter = new KoaRouter();
  helloRoute(apiRouter);

  return koaCompose([
    koaBodyParser(),
    // TODO: responseMethodsMiddleware
    transactionalMiddleware,
    // TODO: koaSleep()
    apiRouter.middleware()
  ]);
};
