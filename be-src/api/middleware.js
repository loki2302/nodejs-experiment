module.exports = function(koaBodyParser, koaCompose, KoaRouter, responseMethodsMiddleware, transactionalMiddleware,
  personIdParam,
  createPersonRoute,
  getPersonRoute,
  getPeopleRoute,
  updatePersonRoute,
  deletePersonRoute,
  createTeamRoute) {

  var apiRouter = new KoaRouter();
  personIdParam(apiRouter);
  createPersonRoute(apiRouter);
  getPersonRoute(apiRouter);
  getPeopleRoute(apiRouter);
  updatePersonRoute(apiRouter);
  deletePersonRoute(apiRouter);
  createTeamRoute(apiRouter);

  return koaCompose([
    koaBodyParser(),
    responseMethodsMiddleware,
    transactionalMiddleware,
    // TODO: koaSleep()
    apiRouter.middleware()
  ]);
};
