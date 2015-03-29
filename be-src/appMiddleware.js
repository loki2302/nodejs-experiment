var koa = require('koa');
var koaMount = require('koa-mount');
var staticMiddleware = require('./staticMiddleware');
var apiMiddleware = require('./apiMiddleware');

module.exports = function() {
  var app = koa();
  app.use(koaMount('/', staticMiddleware()));
  app.use(koaMount('/api', apiMiddleware()));
  return app;
};
