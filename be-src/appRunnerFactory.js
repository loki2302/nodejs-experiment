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
      sequelize: function(connectionString, Sequelize, registerTeam, registerPerson, registerMembership) {
        var sequelize = new Sequelize(connectionString);
        var Team = registerTeam(sequelize);
        var Person = registerPerson(sequelize);
        var Membership = registerMembership(sequelize);

        Team.hasMany(Person, { as: 'Members', through: Membership });
        Person.hasMany(Team, { as: 'Memberships', through: Membership });

        return sequelize;
      },
      registerTeam: function(Sequelize) {
        return function(sequelize) {
          return sequelize.define('Team', {
            name: Sequelize.STRING
          });
        };
      },
      registerPerson: function(Sequelize) {
        return function(sequelize) {
          return sequelize.define('Person', {
            name: Sequelize.STRING
          });
        };
      },
      registerMembership: function(Sequelize) {
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

      appRunner: function(Q, enableDestroy, app, sequelize) {
        var isRunning = false;
        var server;

        return {
          start: function() {
            if(isRunning) {
              return Q.reject(new Error('The application is already running'));
            }

            return sequelize.sync().then(function() {
              return Q.Promise(function(resolve, reject) {
                server = app.listen(3000, function() {
                  enableDestroy(server);
                  console.log('The application is listening at %j', server.address());
                  isRunning = true;

                  resolve();
                });
              });
            }, function(error) {
              return Q.reject(new Error('Failed to initialize models'));
            });
          },
          stop: function() {
            if(!isRunning) {
              return Q.reject(new Error('The application is not running'));
            }

            return Q.Promise(function(resolve, reject) {
              server.destroy(function() {
                server = undefined;
                isRunning = false;
                resolve();
              });
            });
          },
          reset: function() {
            if(!isRunning) {
              return Q.reject(new Error('The application is not running'));
            }

            return sequelize.drop().then(function() {
              return sequelize.sync();
            });
          }
        }
      }
    }
  };

  return require('hinoki').get(container, 'appRunner');
};
