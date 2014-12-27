var koa = require('koa');
var Q = require('q');

module.exports = function() {
	var deferred = Q.defer();

	var app = koa();	
	app.use(function* (next) {
		this.body = 'hello there';
	});

	server = app.listen(3000, function() {
		deferred.resolve(server);
	});

	return deferred.promise;
};
