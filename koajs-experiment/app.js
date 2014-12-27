var koa = require('koa');
var json = require('koa-json');
var Q = require('q');

module.exports = function() {
	var deferred = Q.defer();

	var app = koa();	
	app.use(json());
	app.use(function* (next) {
		this.body = { 
			message: 'hello there' 
		};
	});

	server = app.listen(3000, function() {
		deferred.resolve(server);
	});

	return deferred.promise;
};
