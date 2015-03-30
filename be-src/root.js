module.exports = function(settings) {
  var container = {
    values: {
      path: require('path'),
      Sequelize: require('sequelize'),
      koa: require('koa'),
      KoaRouter: require('koa-router'),
      koaBodyParser: require('koa-body-parser'),
      koaCompose: require('koa-compose'),
      koaSend: require('koa-send'),
      koaMount: require('koa-mount'),
      connectionString: (settings && settings.connectionString) || 'sqlite://my.db',
      dummyMessage: (settings && settings.dummyMessage) || 'hello there'
    },
    factories: {
      // DATA ACESS LAYER STUFF
      sequelize: function(connectionString, Sequelize, registerTeam, registerPerson, registerMembership) {
        var sequelize = new Sequelize(connectionString);
        var Team = registerTeam(sequelize);
        var Person = registerPerson(sequelize);
        var Membership = registerMembership(sequelize);

        Team.hasMany(Person, { as: 'Members', through: Membership });
        Person.hasMany(Team, { as: 'Memberships', through: Membership });

        return sequelize;
      },
      registerTeam: function() {
        return function(sequelize) {
          return sequelize.define('Team', {
            name: Sequelize.STRING
          });
        };
      },
      registerPerson: function() {
        return function(sequelize) {
          return sequelize.define('Person', {
            name: Sequelize.STRING
          });
        };
      },
      registerMembership: function() {
        return function(sequelize) {
          return sequelize.define('Membership', {
            role: Sequelize.STRING
          });
        };
      },
      Team: function(sequelize) {
        return sequelize.models.Team;
      },
      Person: function(sequelize) {
        return sequelize.models.Person;
      },
      Membership: function(sequelize) {
        return sequelize.models.Membership;
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
          apiRouter.get('/hello', function* () {
            this.status = 200;
            this.body = {
              message: dummyMessage
            };
          });
        };
      },

      // APP STUFF
      // this should also expose sequelize.[sync, drop] somehow
      app: function(koa, koaMount, staticMiddleware, apiMiddleware) {
        var app = koa();
        app.use(koaMount('/', staticMiddleware()));
        app.use(koaMount('/api', apiMiddleware()));
        return app;
      },

      appRunner: function(app, sequelize) {
        return {
          start: function() {}, // sync, listen
          stop: function() {}, // destroy
          reset: function() {} // drop, sync
        };
      }
    }
  };

  return require('hinoki').get(container, 'appRunner');
};
