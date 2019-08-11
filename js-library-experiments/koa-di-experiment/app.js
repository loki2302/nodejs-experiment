module.exports = function(koa, koaMount, staticMiddleware, apiMiddleware) {
  var app = koa();
  app.use(koaMount('/', staticMiddleware));
  app.use(koaMount('/api', apiMiddleware));
  return app;
};
