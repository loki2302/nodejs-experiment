module.exports = function(settings) {
  var container = {
    values: {
      Q: require('q'),
      enableDestroy: require('server-destroy'),
      path: require('path'),
      Sequelize: require('sequelize'),
      koa: require('koa'),
      koaStatic: require('koa-static'),
      KoaRouter: require('koa-router'),
      koaBodyParser: require('koa-body-parser'),
      koaCompose: require('koa-compose'),
      koaSend: require('koa-send'),
      koaMount: require('koa-mount'),
      connectionString: (settings && settings.connectionString) || 'sqlite://my.db',
      dummyMessage: (settings && settings.dummyMessage) || 'hello there'
    },
    factories: {
      // DATA ACCESS LAYER STUFF
      dataContext: require('./models/dataContext'),
      registerTeam: require('./models/team'),
      registerPerson: require('./models/person'),
      registerMembership: require('./models/membership'),
      Team: function(dataContext) {
        return dataContext.models.Team;
      },
      Person: function(dataContext) {
        return dataContext.models.Person;
      },
      Membership: function(dataContext) {
        return dataContext.models.Membership;
      },

      // STATIC STUFF
      staticMiddleware: function(path, KoaRouter, koaSend, koaCompose, koaStatic) {
        var pathToStaticRoot = path.resolve(__dirname + '/../fe-build/');
        var pathToIndexHtml = path.resolve(pathToStaticRoot, 'index.html');

        var html5Router = new KoaRouter();
        ['/'].forEach(function(route) {
          html5Router.all(route, function* () {
            yield koaSend(this, pathToIndexHtml);
          });
        });

        return koaCompose([
          koaStatic(pathToStaticRoot),
          html5Router.middleware()
        ]);
      },

      // API STUFF
      apiMiddleware: function(koaBodyParser, koaCompose, KoaRouter, helloRoute) {
        var apiRouter = new KoaRouter();
        helloRoute(apiRouter);

        return koaCompose([
          koaBodyParser(),
          apiRouter.middleware()
        ]);
      },
      helloRoute: function(dummyMessage, Team, Person, Membership) {
        return function(router) {
          router.get('/hello', function* () {
            this.status = 200;
            this.body = {
              message: dummyMessage
            };
          });
        };
      },

      // APP STUFF
      app: function(koa, koaMount, staticMiddleware, apiMiddleware) {
        var app = koa();
        app.use(koaMount('/', staticMiddleware));
        app.use(koaMount('/api', apiMiddleware));
        return app;
      },

      appRunner: require('./appRunner')
    }
  };

  return require('hinoki').get(container, 'appRunner');
};
