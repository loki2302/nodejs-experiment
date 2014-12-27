var koa = require('koa');
var json = require('koa-json');
var router = require('koa-router');
var Q = require('q');
var Sequelize = require('sequelize');
var co = require('co');

module.exports = function() {
	var sequelize = new Sequelize('database', 'username', 'password', {
		dialect: 'sqlite',
		storage: 'my.db'
	});

	var Note = sequelize.define('Note', {
		content: Sequelize.STRING
	});

	var app = koa();	
	app.use(json());
	app.use(function* (next) {
		this.Note = Note;
		yield* next;
	});
	
	app.use(router(app));	

	app.get('/notes/count', function* (next) {
		console.log(this);
		this.body = {
			count: yield this.Note.count()
		};
	});

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

	return co(function* () {
		yield sequelize.drop();
		yield sequelize.sync();
		return Q.Promise(function(resolve) {
			server = app.listen(3000, function() {
				resolve(server);
			});
		});
	});
};
