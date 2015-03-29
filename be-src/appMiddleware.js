var koa = require('koa');
var koaMount = require('koa-mount');
var apiMiddleware = require('./apiMiddleware');

module.exports = function() {
  var app = koa();
  app.use(koaMount('/api', apiMiddleware()));
  return app;
};
