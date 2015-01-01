var koa = require('koa');
var koaStatic = require('koa-static');
var koaSend = require('koa-send');
var Router = require('koa-router');
var koaMount = require('koa-mount');
var path = require('path');
var apiMiddleware = require('./apiMiddleware');

module.exports = function(models, config) {
	var app = koa();
	
	var pathToStaticRoot = path.resolve(__dirname + '/../client/build/');
	app.use(koaStatic(pathToStaticRoot));

	var pathToIndex = path.resolve(pathToStaticRoot, 'index.html');
	var html5UrlRouter = new Router();
	['/', '/notes', '/categories'].forEach(function(route) {
		html5UrlRouter.all(route, function* () {
			yield koaSend(this, pathToIndex);
		});
	});
	app.use(html5UrlRouter.middleware());	

	app.use(koaMount('/api', apiMiddleware(
		config, 
		models.sequelize, 
		models.Note, 
		models.Category)));

	return app;
};
