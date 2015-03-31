module.exports = function(koaBodyParser, koaCompose, KoaRouter, responseMethodsMiddleware, transactionalMiddleware,
  helloSuccessRoute,
  helloBadRequestRoute,
  helloInternalErrorRoute,
  createPersonRoute) {

  var apiRouter = new KoaRouter();
  helloSuccessRoute(apiRouter);
  helloBadRequestRoute(apiRouter);
  helloInternalErrorRoute(apiRouter);
  createPersonRoute(apiRouter);

  return koaCompose([
    koaBodyParser(),
    responseMethodsMiddleware,
    transactionalMiddleware,
    // TODO: koaSleep()
    apiRouter.middleware()
  ]);
};
