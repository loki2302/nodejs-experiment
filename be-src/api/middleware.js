module.exports = function(koaBodyParser, koaCompose, KoaRouter, responseMethodsMiddleware, transactionalMiddleware,
  createPersonRoute,
  getPersonRoute) {

  var apiRouter = new KoaRouter();
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
