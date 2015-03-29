var path = require('path');
var KoaRouter = require('koa-router');
var koaSend = require('koa-send');
var koaCompose = require('koa-compose');
var koaStatic = require('koa-static');

module.exports = function() {
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
};
