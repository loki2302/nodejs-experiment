var koa = require('koa');
var json = require('koa-json');
var router = require('koa-router');
var Q = require('q');

module.exports = function() {
	var deferred = Q.defer();

	var app = koa();	
	app.use(json());
	app.use(router(app));

	app.get('/', function* (next) {
		this.body = {
			message: 'root'
		};
	});

	app.get('/hello', function* (next) {
		this.body = {
			message: 'hi there'
		};
	});

	server = app.listen(3000, function() {
		deferred.resolve(server);
	});

	return deferred.promise;
};
