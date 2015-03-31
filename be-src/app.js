module.exports = function(koa, koaMount, staticMiddleware, apiMiddleware, staticRootLocation, apiRootLocation) {
  var app = koa();
  app.use(koaMount(staticRootLocation, staticMiddleware));
  app.use(koaMount(apiRootLocation, apiMiddleware));
  return app;
};
