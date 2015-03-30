var ContainerBuilder = require('./containerBuilder.js');
var hinoki = require('hinoki');

module.exports = function(settings) {
  var container = makeContainer(settings);
  return hinoki.get(container, 'appRunner');

  function makeContainer(settings) {
    var containerBuilder = new ContainerBuilder();
    containerBuilder.addValues({
      Q: require('q'),
      serverDestroy: require('server-destroy'),
      Sequelize: require('sequelize'),
      koa: require('koa'),
      koaCompose: require('koa-compose'),
      koaBodyParser: require('koa-body-parser'),
      koaMount: require('koa-mount'),
      koaSend: require('koa-send'),
      KoaRouter: require('koa-router'),
      path: require('path'),
      pathToIndexHtml: __dirname + '/index.html',
      connectionString: 'sqlite://my.db',
      port: (settings && settings.port) || 3000,
      something: (settings && settings.something) || 'hello there'
    });
    containerBuilder.addRoutes([
      require('./api/routes/routeA.js'),
      require('./api/routes/routeB.js')
    ]);
    containerBuilder.addFactories({
      // DAL STUFF
      sequelize: require('./dao.js'),
      Note: function(sequelize) {
        return sequelize.models.Note;
      },
      Category: function(sequelize) {
        return sequelize.models.Category;
      },

      // STATIC STUFF
      staticMiddleware: require('./static/staticMiddleware.js'),
      indexHtmlRoute: require('./static/indexHtmlRoute.js'),

      // API STUFF
      apiMiddleware: require('./api/apiMiddleware.js'),

      // THE WHOLE WEBAPP
      app: require('./app.js'),
      appRunner: require('./appRunner.js')
    });

    var container = containerBuilder.build();

    return container;
  };
};
