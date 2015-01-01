var koa = require('koa');
var koaStatic = require('koa-static');
var koaSend = require('koa-send');
var bodyParser = require('koa-body-parser');
var Router = require('koa-router');
var Q = require('q');
var co = require('co');
var sleep = require("sleep");
var router = require('koa-router');
var routes = require("./routes.js");
var path = require('path');

module.exports = function(models, config) {
	var app = koa();

	if(config && config.delay) {
		app.use(function* (next) {
			sleep.sleep(config.delay);
			yield next;
		});
	}
	
	var pathToStaticRoot = path.resolve(__dirname + "/../client/build/");
	app.use(koaStatic(pathToStaticRoot));

	var pathToIndex = path.resolve(pathToStaticRoot, 'index.html');
	var html5UrlRouter = new Router();
	['/', '/notes', '/categories'].forEach(function(route) {
		html5UrlRouter.all(route, function* () {
			yield koaSend(this, pathToIndex);
		});
	});
	app.use(html5UrlRouter.middleware());

	app.use(bodyParser());	

	routes.addRoutes(app, models);

	return app;
};
