var path = require('path');

module.exports = function(settings) {
  var container = {
    values: {
      Q: require('q'),
      enableDestroy: require('server-destroy'),
      Sequelize: require('sequelize'),
      koa: require('koa'),
      koaStatic: require('koa-static'),
      KoaRouter: require('koa-router'),
      koaBodyParser: require('koa-body-parser'),
      koaCompose: require('koa-compose'),
      koaSend: require('koa-send'),
      koaMount: require('koa-mount'),
      RESTError: require('./api/restError'),

      staticRootPath: path.resolve(__dirname, '../fe-build/'),
      indexHtmlPath: path.resolve(__dirname, '../fe-build/index.html'),
      indexLocations: ['/', '/teams', '/people'],
      staticRootLocation: '/',
      apiRootLocation: '/api',

      serverPort: (settings && settings.serverPort) || 3000,
      connectionString: (settings && settings.connectionString) || 'sqlite://my.db',
      dummyMessage: (settings && settings.dummyMessage) || 'hello there'
    },
    factories: {
      // DATA CONTEXT
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

      // STATIC RESOURCES
      staticMiddleware: require('./static/middleware.js'),

      // API RESOURCES
      responseMethodsMiddleware: require('./api/responseMethodsMiddleware'),
      transactionalMiddleware: require('./api/transactionalMiddleware'),
      apiMiddleware: require('./api/middleware'),
      helloSuccessRoute: require('./api/routes/helloSuccess'),
      helloBadRequestRoute: require('./api/routes/helloBadRequest'),
      helloInternalErrorRoute: require('./api/routes/helloInternalError'),

      // KOA APPLICATION
      app: require('./app'),
      appRunner: require('./appRunner')
    }
  };

  return require('hinoki').get(container, 'appRunner');
};
