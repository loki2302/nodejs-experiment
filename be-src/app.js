module.exports = function(koa, koaMount, staticMiddleware, apiMiddleware, staticRootLocation, apiRootLocation) {
  var app = koa();
  app.use(koaMount(apiRootLocation, apiMiddleware));
  app.use(koaMount(staticRootLocation, staticMiddleware));
  return app;
};
