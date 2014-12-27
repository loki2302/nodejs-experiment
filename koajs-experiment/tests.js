var app = require('./app');
var rp = require('request-promise');
var co = require('co');
var assert = require('assert');

describe('app', function() {
	var server;

	beforeEach(function(done) {
		co(function* () {
			server = yield app();
			done();
		});
	});

	afterEach(function(done) {
		server.close(function() {
			server = null;
			done();
		});
	});

	it('should let me access it', function(done) {
		co(function* () {
			var body = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/',
				json: true
			});
			
			assert.equal(body.message, 'root');

			body = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/hello',
				json: true
			});
			
			assert.equal(body.message, 'hi there');
		}).then(done, done);
	});

	it('should let me count the notes', function(done) {
		co(function* () {
			var body = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/notes/count',
				json: true
			});
			
			assert.equal(body.count, 0);

		}).then(done, done);
	});
});
