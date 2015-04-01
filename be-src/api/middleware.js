module.exports = function(koaBodyParser, koaCompose, KoaRouter, responseMethodsMiddleware, transactionalMiddleware,
  personIdParam,
  createPersonRoute,
  getPersonRoute) {

  var apiRouter = new KoaRouter();
  personIdParam(apiRouter);
  createPersonRoute(apiRouter);
  getPersonRoute(apiRouter);

  return koaCompose([
    koaBodyParser(),
    responseMethodsMiddleware,
    transactionalMiddleware,
    // TODO: koaSleep()
    apiRouter.middleware()
  ]);
};
