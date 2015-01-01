var koa = require('koa');
var koaMount = require('koa-mount');
var staticMiddleware = require('./static-middleware');
var apiMiddleware = require('./api-middleware');

module.exports = function(models, config) {
	var app = koa();
	app.use(koaMount('/', staticMiddleware()));
	app.use(koaMount('/api', apiMiddleware(
		config, 
		models.sequelize)));

	return app;
};
