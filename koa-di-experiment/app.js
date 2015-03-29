var container = {
  values: {
    koa: require('koa'),
    koaMount: require('koa-mount'),
    koaSend: require('koa-send'),
    KoaRouter: require('koa-router'),
    path: require('path'),
    something: 'hello there',
  },
  factories: {
    // STATIC STUFF
    staticMiddleware: function(KoaRouter, indexHtmlRoute) {
      var router = new KoaRouter();
      indexHtmlRoute(router);
      return router.middleware();
    },
    indexHtmlRoute: require('./indexHtmlRoute.js'),

    // API STUFF
    apiMiddleware: function(KoaRouter, routeA, routeB) {
      var router = new KoaRouter();
      routeA(router);
      routeB(router);
      return router.middleware();
    },
    routeA: require('./routeA.js'),
    routeB: require('./routeB.js'),

    // THE WHOLE WEBAPP
    app: function(koa, koaMount, staticMiddleware, apiMiddleware) {
      var app = koa();
      app.use(koaMount('/', staticMiddleware));
      app.use(koaMount('/api', apiMiddleware));
      return app;
    }
  }
};

var hinoki = require('hinoki');
hinoki.get(container, 'app').then(function(app) {
  app.listen(3000);
}, function(error) {
  console.log(error);
});
