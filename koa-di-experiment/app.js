var container = {
  values: {
    koa: require('koa'),
    KoaRouter: require('koa-router'),
    something: 'hello there',
  },

  factories: {
    routerMiddleware: function(KoaRouter, routeA, routeB) {
      var router = new KoaRouter();
      routeA(router);
      routeB(router);
      return router.middleware();
    },

    routeA: require('./routeA.js'),
    routeB: require('./routeB.js'),

    app: function(koa, routerMiddleware) {
      var app = koa();
      app.use(routerMiddleware);
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
