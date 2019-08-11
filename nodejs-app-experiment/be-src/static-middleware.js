var koaStatic = require('koa-static');
var koaSend = require('koa-send');
var Router = require('koa-router');
var koaCompose = require('koa-compose');
var path = require('path');

module.exports = function() {
  var pathToStaticRoot = path.resolve(__dirname + '/../fe-build/');

  var pathToIndex = path.resolve(pathToStaticRoot, 'index.html');
  var html5UrlRouter = new Router();
  ['/', '/notes', '/categories'].forEach(function(route) {
    html5UrlRouter.all(route, function* () {
      yield koaSend(this, pathToIndex);
    });
  });

  return koaCompose([
    koaStatic(pathToStaticRoot),
    html5UrlRouter.middleware()
  ]);
};
