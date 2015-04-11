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
      faker: require('faker'),
      RESTError: require('./api/restError'),

      staticRootPath: path.resolve(__dirname, '../fe-build/'),
      indexHtmlPath: path.resolve(__dirname, '../fe-build/index.html'),
      indexLocations: [
        '/',
        '/people',
        '/people/:id',
        '/people/:id/edit',
        '/people/create',
        '/teams',
        '/teams/:id',
        '/teams/:id/edit',
        '/teams/create'
      ],
      notFoundLocations: [
        /^\/(?!api\/).*$/i
      ],
      staticRootLocation: '/',
      apiRootLocation: '/api',

      serverPort: (settings && settings.serverPort) || process.env.PORT || 3000,
      connectionString: (settings && settings.connectionString) || 'sqlite://my.db',
      dummyMessage: (settings && settings.dummyMessage) || 'hello there'
    },
    factories: {
      // FAKE DATA
      generateFakeData: require('./generateFakeData'),

      // DATA CONTEXT
      sequelize: require('./models/sequelize'),
      dataContext: require('./models/dataContext'),
      Team: require('./models/team'),
      Person: require('./models/person'),
      Membership: require('./models/membership'),
      TeamMembersRelation: require('./models/teamMembersRelation'),
      PersonMembershipsRelation: require('./models/personMembershipsRelation'),

      // STATIC RESOURCES
      staticMiddleware: require('./static/middleware.js'),

      // API RESOURCES
      responseMethodsMiddleware: require('./api/responseMethodsMiddleware'),
      transactionalMiddleware: require('./api/transactionalMiddleware'),
      apiMiddleware: require('./api/middleware'),
      personUtils: require('./api/routes/people/utils'),
      personIdParam: require('./api/routes/people/personIdParam'),
      createPersonRoute: require('./api/routes/people/createPerson'),
      getPersonRoute: require('./api/routes/people/getPerson'),
      getPeopleRoute: require('./api/routes/people/getPeople'),
      updatePersonRoute: require('./api/routes/people/updatePerson'),
      deletePersonRoute: require('./api/routes/people/deletePerson'),
      teamUtils: require('./api/routes/teams/utils'),
      teamIdParam: require('./api/routes/teams/teamIdParam'),
      createTeamRoute: require('./api/routes/teams/createTeam'),
      getTeamRoute: require('./api/routes/teams/getTeam'),
      getTeamsRoute: require('./api/routes/teams/getTeams'),
      updateTeamRoute: require('./api/routes/teams/updateTeam'),
      deleteTeamRoute: require('./api/routes/teams/deleteTeam'),

      // KOA APPLICATION
      app: require('./app'),
      appRunner: require('./appRunner')
    }
  };

  return require('hinoki')(container, 'appRunner');
};
